// ============================================================
// BACKEND — Vercel serverless function
// Runs on Vercel's servers, never in the browser.
// The API key lives in a Vercel environment variable
// named ANTHROPIC_API_KEY (set it in the Vercel dashboard).
// ============================================================

import { PROMPTS } from "../lib/prompts.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tool, input } = req.body || {};

  if (!tool || !PROMPTS[tool]) {
    return res.status(400).json({ error: "Unknown or missing tool" });
  }
  if (!input || typeof input !== "string" || input.length > 8000) {
    return res.status(400).json({ error: "Missing or oversized input" });
  }

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: PROMPTS[tool],
        messages: [{ role: "user", content: input }],
      }),
    });

    const data = await apiRes.json();

    if (data.error) {
      return res.status(502).json({ error: data.error.message });
    }

    const text = (data.content || [])
      .map((c) => (c.type === "text" ? c.text : ""))
      .join("");

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "Generation failed: " + err.message });
  }
}
