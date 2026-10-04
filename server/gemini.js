"use strict";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function config() {
  return {
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    embedModel: process.env.GEMINI_EMBED_MODEL || "gemini-embedding-001"
  };
}

class GeminiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

// 429 is not retried: on the free tier it usually means the quota is exhausted for a while.
const RETRY_STATUSES = new Set([500, 503]);
const RETRY_DELAYS_MS = [700, 1800];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function request(path, body, signal) {
  const { apiKey } = config();
  if (!apiKey) throw new GeminiError("GEMINI_API_KEY is not set", 503);

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal
    });
    if (res.ok) return res;

    let detail = "";
    try { detail = (await res.json()).error?.message || ""; } catch (_) { /* non-JSON error body */ }
    if (RETRY_STATUSES.has(res.status) && attempt < RETRY_DELAYS_MS.length) {
      console.warn(`[gemini] ${res.status}, retrying: ${detail.slice(0, 100)}`);
      await sleep(RETRY_DELAYS_MS[attempt]);
      continue;
    }
    throw new GeminiError(`Gemini API ${res.status}${detail ? ": " + detail : ""}`, res.status);
  }
}

/** Embeds texts in batches. taskType: RETRIEVAL_DOCUMENT | RETRIEVAL_QUERY. */
async function embed(texts, taskType) {
  const { embedModel } = config();
  const vectors = [];
  for (let i = 0; i < texts.length; i += 100) {
    const batch = texts.slice(i, i + 100);
    const res = await request(`models/${embedModel}:batchEmbedContents`, {
      requests: batch.map((text) => ({
        model: `models/${embedModel}`,
        content: { parts: [{ text }] },
        taskType
      }))
    });
    const data = await res.json();
    for (const e of data.embeddings) vectors.push(e.values);
  }
  return vectors;
}

/** Streams answer text deltas from Gemini (SSE). */
async function* streamGenerate({ system, contents, signal }) {
  const { model } = config();
  // Thinking tokens count against maxOutputTokens, so the limit is generous and thinking is kept minimal.
  const generationConfig = { temperature: 0.2, maxOutputTokens: 8192 };
  if (/2\.5-flash/.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };
  else if (/gemini-3/.test(model)) generationConfig.thinkingConfig = { thinkingLevel: "minimal" };

  const payload = { systemInstruction: { parts: [{ text: system }] }, contents, generationConfig };
  let res;
  try {
    res = await request(`models/${model}:streamGenerateContent?alt=sse`, payload, signal);
  } catch (e) {
    if (e.status !== 400 || !generationConfig.thinkingConfig) throw e;
    // The model may not support this thinking setting; fall back to its defaults.
    delete generationConfig.thinkingConfig;
    res = await request(`models/${model}:streamGenerateContent?alt=sse`, payload, signal);
  }

  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of res.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      let event;
      try { event = JSON.parse(line.slice(5)); } catch (_) { continue; }
      const candidate = event.candidates?.[0];
      for (const part of candidate?.content?.parts || []) {
        if (part.text && !part.thought) yield part.text;
      }
      if (candidate?.finishReason && candidate.finishReason !== "STOP") {
        console.warn(`[gemini] finishReason: ${candidate.finishReason}`);
      }
    }
  }
}

module.exports = { config, embed, streamGenerate, GeminiError };
