"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const gemini = require("./gemini");

const DOCS_DIR = path.join(__dirname, "..", "rag");
const CACHE_FILE = path.join(DOCS_DIR, ".index.json");
const RETRY_EMBED_MS = 60 * 1000;

let chunks = [];
let hasVectors = false;
let lastEmbedAttempt = 0;

/** Splits a markdown document into one chunk per section (#, ##, ###), keeping the heading path for context. */
function chunkDocument(id, markdown) {
  const out = [];
  let title = id, h2 = "", h3 = "", body = [];

  const flush = () => {
    const content = body.join("\n").trim();
    body = [];
    if (!content) return;
    const section = [h2, h3].filter(Boolean).join(" › ");
    out.push({
      id: `${id}#${out.length}`,
      source: id,
      title,
      section: section || title,
      text: `${title}${section ? " › " + section : ""}\n${content}`
    });
  };

  for (const line of markdown.split(/\r?\n/)) {
    let m;
    if ((m = line.match(/^#\s+(.+)/))) { flush(); title = m[1].trim(); h2 = ""; h3 = ""; }
    else if ((m = line.match(/^##\s+(.+)/))) { flush(); h2 = m[1].trim(); h3 = ""; }
    else if ((m = line.match(/^###\s+(.+)/))) { flush(); h3 = m[1].trim(); }
    else body.push(line);
  }
  flush();
  return out;
}

function loadChunks() {
  return fs.readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .flatMap((f) => chunkDocument(path.basename(f, ".md"), fs.readFileSync(path.join(DOCS_DIR, f), "utf8")));
}

function normalize(v) {
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function contentHash(list) {
  return crypto.createHash("sha256")
    .update(gemini.config().embedModel + "\n" + list.map((c) => c.text).join("\n\u0000\n"))
    .digest("hex");
}

async function embedChunks() {
  lastEmbedAttempt = Date.now();
  const vectors = await gemini.embed(chunks.map((c) => c.text), "RETRIEVAL_DOCUMENT");
  chunks.forEach((c, i) => { c.vector = normalize(vectors[i]); });
  hasVectors = true;
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ hash: contentHash(chunks), chunks }));
}

/** Loads the documents and their embeddings (from cache when the documents have not changed). */
async function init() {
  chunks = loadChunks();
  hasVectors = false;
  const hash = contentHash(chunks);

  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
    if (cache.hash === hash) {
      chunks = cache.chunks;
      hasVectors = true;
    }
  } catch (_) { /* no cache yet */ }

  if (!hasVectors && gemini.config().apiKey) {
    try { await embedChunks(); } catch (e) { console.warn(`[rag] embeddings unavailable, using keyword search: ${e.message}`); }
  }
  return { chunks: chunks.length, mode: hasVectors ? "embeddings" : "keywords" };
}

/* ---------- Keyword fallback (used when embeddings are unavailable) ---------- */
function stems(text) {
  return (text.toLowerCase().replace(/ё/g, "е").match(/[\p{L}\d]+/gu) || [])
    .filter((w) => w.length > 2 || /\d/.test(w))
    .map((w) => w.slice(0, 5));
}

const OVERVIEW_SECTIONS = /Сводная таблица|Сводка по дням|Рассрочка|Что входит|Общая информация/;

function keywordSearch(query, k) {
  const q = new Set(stems(query));
  const found = chunks
    .map((c) => {
      const words = stems(c.text);
      const hits = words.filter((w) => q.has(w)).length;
      const titleHits = stems(c.section).filter((w) => q.has(w)).length;
      return { chunk: c, score: hits / Math.sqrt(words.length + 1) + titleHits };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  // Queries in Uzbek share no words with the Russian documents; give the model the overview sections instead.
  if (found.length) return found;
  return chunks.filter((c) => OVERVIEW_SECTIONS.test(c.section)).map((c) => ({ chunk: c, score: 0 }));
}

/** Returns the k most relevant chunks for the query. */
async function search(query, k = 6) {
  if (!hasVectors && gemini.config().apiKey && Date.now() - lastEmbedAttempt > RETRY_EMBED_MS) {
    try { await embedChunks(); } catch (e) { console.warn(`[rag] embeddings retry failed: ${e.message}`); }
  }
  if (hasVectors) {
    try {
      const [qv] = await gemini.embed([query], "RETRIEVAL_QUERY");
      const qn = normalize(qv);
      return chunks
        .map((c) => ({ chunk: c, score: dot(qn, c.vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
    } catch (e) {
      console.warn(`[rag] query embedding failed, using keyword search: ${e.message}`);
    }
  }
  return keywordSearch(query, k);
}

function status() {
  return { chunks: chunks.length, mode: hasVectors ? "embeddings" : "keywords" };
}

module.exports = { init, search, status, chunkDocument };
