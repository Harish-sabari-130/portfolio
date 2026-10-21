import type { IncomingMessage, ServerResponse } from "node:http";
import { SAHA_SYSTEM_PROMPT } from "../src/lib/sahaContext.js";

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role?: string; text?: string }>;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  try {
    let bodyStr = "";
    for await (const chunk of req) {
      bodyStr += chunk;
    }

    const body: ChatRequestBody = JSON.parse(bodyStr || "{}");
    const cleanMessage = (body.message || "").trim().slice(0, 500);

    if (!cleanMessage) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        response: "Hello! I am Saha. Feel free to ask me about Harish Sabari's AI projects, stack, or background.",
      }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        response: "Harish Sabari P V is a final-year AI & ML student at Kongu Engineering College (CGPA: 7.77*) and RiseUp with ServiceNow Alumni. He specializes in Multi-Agent RAG (DEA), Safina Women Safety, and real-time vision (YOLOv8). Contact him at harish23alr@gmail.com!",
      }));
      return;
    }

    const formattedContents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
    if (Array.isArray(body.history)) {
      for (const h of body.history.slice(-6)) {
        if (h && h.text) {
          formattedContents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: String(h.text).slice(0, 500) }],
          });
        }
      }
    }

    while (formattedContents.length > 0 && formattedContents[0].role === "model") {
      formattedContents.shift();
    }

    formattedContents.push({
      role: "user",
      parts: [{ text: cleanMessage }],
    });

    const payload = {
      system_instruction: { parts: [{ text: SAHA_SYSTEM_PROMPT }] },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 350,
      },
    };

    let replyText = "";
    const models = ["gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    for (const model of models) {
      try {
        const apiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          }
        );

        if (apiRes.ok) {
          const data = await apiRes.json() as any;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text.trim();
            break;
          }
        }
      } catch {}
    }
    clearTimeout(timeoutId);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      response: replyText || "Harish Sabari is a final-year AI & ML student at Kongu Engineering College with a 7.77* CGPA and RiseUp ServiceNow Alumni. Reach him at harish23alr@gmail.com!",
    }));
  } catch {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      response: "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA: 7.77*). Reach him at harish23alr@gmail.com!",
    }));
  }
}
