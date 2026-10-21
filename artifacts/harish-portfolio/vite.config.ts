import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

import fs from "fs";
import { SAHA_SYSTEM_PROMPT } from "./src/lib/sahaContext";

function sahaApiDevMiddleware() {
  return {
    name: "saha-api-dev-middleware",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === "/api/chat" && req.method === "POST") {
          let bodyStr = "";
          req.on("data", (chunk: any) => (bodyStr += chunk));
          req.on("end", async () => {
            try {
              const body = JSON.parse(bodyStr || "{}");
              const message = (body.message || "").trim().slice(0, 500);

              let apiKey = process.env.GEMINI_API_KEY || "";
              if (!apiKey) {
                try {
                  const envPath = path.resolve(import.meta.dirname, "../../.env");
                  if (fs.existsSync(envPath)) {
                    const match = fs.readFileSync(envPath, "utf-8").match(/GEMINI_API_KEY=(.+)/);
                    if (match) apiKey = match[1].trim();
                  }
                } catch {}
              }

              if (!apiKey) {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                  response: "Hello! I am Saha. Harish Sabari P V is a final-year AI & ML student at Kongu Engineering College with a 7.77* CGPA and a ServiceNow RiseUp Alumni. Ask me about his DEA Multi-Agent RAG project, Safina, or YOLOv8 vision!"
                }));
                return;
              }

              const history = Array.isArray(body.history) ? body.history : [];
              const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

              for (const h of history.slice(-6)) {
                if (h && h.text) {
                  formattedContents.push({
                    role: h.role === "user" ? "user" : "model",
                    parts: [{ text: String(h.text).slice(0, 500) }],
                  });
                }
              }

              while (formattedContents.length > 0 && formattedContents[0].role === "model") {
                formattedContents.shift();
              }

              formattedContents.push({
                role: "user",
                parts: [{ text: message || "Hello Saha!" }],
              });

              const payload = {
                system_instruction: { parts: [{ text: SAHA_SYSTEM_PROMPT }] },
                contents: formattedContents,
                generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 350 },
              };

              let replyText = "";
              const models = ["gemini-3.5-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"];
              for (const model of models) {
                try {
                  const apiRes = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
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

              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                response: replyText || "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA 7.77*) and RiseUp with ServiceNow Alumni. He specializes in Multi-Agent RAG, computer vision (YOLOv8), and Safina Women Safety. Feel free to contact him at harish23alr@gmail.com!"
              }));
            } catch (err) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({
                response: "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA 7.77*). Reach him at harish23alr@gmail.com!"
              }));
            }
          });
          return;
        }

        if (req.url === "/api/contact" && req.method === "POST") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ success: true, message: "Transmission received" }));
          return;
        }

        next();
      });
    },
  };
}

const rawPort = process.env.PORT || "5173";
const port = Number(rawPort) || 5173;
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    sahaApiDevMiddleware(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
