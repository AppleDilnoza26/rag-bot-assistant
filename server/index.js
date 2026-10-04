"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
loadEnv(path.join(ROOT, ".env"));

const rag = require("./rag");
const assistant = require("./assistant");
const gemini = require("./gemini");

const PORT = Number(process.env.PORT) || 5510;
const MAX_BODY = 32 * 1024;
const MAX_MESSAGE = 1000;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};
const PUBLIC_DIRS = new Set(["", "css", "js", "assets"]);

function loadEnv(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); } catch (_) { return; }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
    if (!m || line.trim().startsWith("#")) continue;
    if (process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

/* ---------- Rate limiting ---------- */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > RATE_LIMIT;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) if (!list.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(ip);
}, RATE_WINDOW_MS).unref();

/* ---------- Helpers ---------- */
function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": MIME[".json"], "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const parts = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(Object.assign(new Error("Body too large"), { status: 413 })); req.destroy(); return; }
      parts.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(parts).toString("utf8")));
    req.on("error", reject);
  });
}

function parseChatRequest(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (_) { return null; }
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE) return null;
  const history = (Array.isArray(data.history) ? data.history : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.text === "string" && m.text.trim())
    .slice(-8)
    .map((m) => ({ role: m.role, text: m.text.slice(0, 2000) }));
  const lang = data.lang === "uz" ? "uz" : "ru";
  return { message, history, lang };
}

/* ---------- API ---------- */
async function handleChat(req, res) {
  const ip = req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) return sendJson(res, 429, { error: "rate_limited" });
  if (!gemini.config().apiKey) return sendJson(res, 503, { error: "not_configured" });

  let body;
  try { body = await readBody(req); } catch (e) { return sendJson(res, e.status || 400, { error: "bad_request" }); }
  const input = parseChatRequest(body);
  if (!input) return sendJson(res, 400, { error: "bad_request" });

  const controller = new AbortController();
  res.on("close", () => { if (!res.writableEnded) controller.abort(); });

  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const sources = await assistant.answer({ ...input, signal: controller.signal, onDelta: (t) => send({ t }) });
    send({ done: true, sources });
  } catch (e) {
    if (controller.signal.aborted) return;
    console.error(`[chat] ${e.message}`);
    send({ error: "upstream" });
  }
  res.end();
}

/* ---------- Static files ---------- */
function serveStatic(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname); } catch (_) { urlPath = "/"; }
  if (urlPath.endsWith("/")) urlPath += "index.html";

  const file = path.normalize(path.join(ROOT, urlPath));
  const rel = path.relative(ROOT, file);
  const topDir = rel.includes(path.sep) ? rel.split(path.sep)[0] : "";
  const ext = path.extname(file).toLowerCase();
  const allowed = !rel.startsWith("..") && !path.isAbsolute(rel) &&
    PUBLIC_DIRS.has(topDir) && !rel.split(path.sep).some((p) => p.startsWith(".")) &&
    (MIME[ext] && ext !== ".json");

  if (!allowed) return notFound(res);
  fs.readFile(file, (err, data) => {
    if (err) return notFound(res);
    res.writeHead(200, { "Content-Type": MIME[ext], "Cache-Control": "no-cache" });
    res.end(req.method === "HEAD" ? undefined : data);
  });
}

function notFound(res) {
  res.writeHead(404, { "Content-Type": MIME[".txt"] });
  res.end("404 Not Found");
}

const server = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (url === "/api/chat") {
    if (req.method !== "POST") return sendJson(res, 405, { error: "method_not_allowed" });
    return handleChat(req, res).catch((e) => {
      console.error(e);
      if (!res.headersSent) sendJson(res, 500, { error: "server_error" });
      else res.end();
    });
  }
  if (url === "/api/health") {
    const { model, embedModel, apiKey } = gemini.config();
    return sendJson(res, 200, { ok: true, configured: Boolean(apiKey), model, embedModel, rag: rag.status() });
  }
  if (req.method !== "GET" && req.method !== "HEAD") return sendJson(res, 405, { error: "method_not_allowed" });
  serveStatic(req, res);
});

rag.init().then((info) => {
  server.listen(PORT, () => {
    const { apiKey, model } = gemini.config();
    console.log(`Culinary House: http://localhost:${PORT}`);
    console.log(`RAG: ${info.chunks} chunks, search mode: ${info.mode}`);
    console.log(apiKey ? `Gemini model: ${model}` : "GEMINI_API_KEY is not set: the assistant will reply with a 'not configured' error.");
  });
});
