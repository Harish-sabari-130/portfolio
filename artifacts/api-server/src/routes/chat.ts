import { Router, type IRouter } from "express";
import { SendChatMessageBody, SendChatMessageResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { SAHA_SYSTEM_PROMPT } from "../lib/sahaContext";

const router: IRouter = Router();

// In-memory rate limiting map: IP -> timestamp array
const ipRequestWindow = new Map<string, number[]>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestWindow.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (validTimestamps.length >= RATE_LIMIT_MAX) {
    ipRequestWindow.set(ip, validTimestamps);
    return true;
  }
  validTimestamps.push(now);
  ipRequestWindow.set(ip, validTimestamps);
  return false;
}

router.post("/chat", async (req, res, next) => {
  try {
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client";
    if (isRateLimited(clientIp)) {
      logger.warn({ ip: clientIp }, "Rate limit exceeded for /api/chat");
      res.status(429).json(SendChatMessageResponse.parse({
        response: "I've received quite a few messages recently! Please wait a moment before sending another transmission.",
      }));
      return;
    }

    const body = SendChatMessageBody.parse(req.body);
    const { message, history } = body;

    // Sanitize and length-bound input
    const cleanMessage = (message || "").trim().slice(0, 500);
    if (!cleanMessage) {
      res.json(SendChatMessageResponse.parse({
        response: "Hello! Feel free to ask me anything about Harish Sabari's AI projects, stack, or background.",
      }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.warn("GEMINI_API_KEY not configured. Falling back to local Saha intelligence.");
      res.json(SendChatMessageResponse.parse({
        response: `Greetings! I am Saha. Harish Sabari P V is a final-year AI & ML student at Kongu Engineering College with a 7.77* CGPA and a ServiceNow RiseUp Alumni. His flagship projects include Deterministic Epistemic Arbitration (DEA Multi-Agent RAG), Safina (Women Safety), AI Call Intelligence, and YOLOv8 Vision. You can reach him directly at harish23alr@gmail.com!`,
      }));
      return;
    }

    // Format multi-turn conversation contents for Gemini REST API
    const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h && h.text) {
          const role = h.role === 'user' ? 'user' : 'model';
          formattedContents.push({
            role,
            parts: [{ text: h.text.slice(0, 500) }],
          });
        }
      }
    }

    // Gemini requires conversation to begin with a 'user' turn
    while (formattedContents.length > 0 && formattedContents[0].role === 'model') {
      formattedContents.shift();
    }

    // Append the new message
    formattedContents.push({
      role: 'user',
      parts: [{ text: cleanMessage }],
    });

    const payload = {
      system_instruction: {
        parts: [{ text: SAHA_SYSTEM_PROMPT }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 350,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
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
          const data = await apiRes.json() as { candidates?: Array<{ content?: { parts?: Array<{ text: string }> } }> };
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text.trim();
            break;
          }
        }
      } catch {
        // Try next model
      }
    }
    clearTimeout(timeoutId);

    if (!replyText) {
      replyText = "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA 7.77*) and RiseUp with ServiceNow Alumni. Reach him at harish23alr@gmail.com!";
    }

    res.json(SendChatMessageResponse.parse({ response: replyText }));
  } catch (error) {
    logger.error({ err: error }, "Error in chat router handler");
    // Deployment-safe fallback so the user always receives a response
    res.json(SendChatMessageResponse.parse({
      response: "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA 7.77*) with projects in Multi-Agent RAG, computer vision, and ServiceNow automation. Reach him at harish23alr@gmail.com!",
    }));
  }
});

export default router;
