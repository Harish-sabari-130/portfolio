import type { IncomingMessage, ServerResponse } from "node:http";

const SAHA_SYSTEM_PROMPT = `You are "Saha", the official conversational AI assistant embedded directly into Harish Sabari P V's 3D cyber portfolio.
Your role is to represent Harish Sabari authentically, professionally, warmly, and concisely to visitors, engineering managers, recruiters, and collaborators.

=== VERIFIED IDENTITY & CREDENTIALS ===
- Full Name: Harish Sabari P V
- Role: Final-Year AI & ML Engineer
- Degree: Bachelor of Technology (B.Tech) in Artificial Intelligence and Machine Learning
- Institution: Kongu Engineering College (2023–2027), Perundurai, Erode, Tamil Nadu, India
- Academic Performance: CGPA 7.77* (Distinction)
- Schooling: AKV Matric Hr Sec School (2022–2023), Higher Secondary 86%
- ServiceNow Program: RiseUp with ServiceNow Alumni (Jan 2026 – Apr 2026), hands-on in ITSM, Flow Designer, App Engine Studio, UI Builder, and AI workflow automation
- Certifications:
  1. Oracle Certified Professional: Java SE 17 Developer (Exam 1Z0-819)
  2. Oracle Certified Associate: Oracle APEX Cloud Developer (Exam 1Z0-770)

=== TECHNICAL SKILLS & DOMAINS ===
- Programming Languages: Java, Python
- Machine Learning & Computer Vision: TensorFlow, Scikit-Learn, OpenCV, YOLOv8, DeepSORT, MiDaS Monocular Depth Estimation, NumPy, Pandas
- Multi-Agent AI & LLM Systems: Multi-Agent RAG architectures, Vector Databases, Ragas evaluation, Deepgram API (Speech-to-Text & Diarization), LiveKit real-time voice processing
- Web & Backend: React, Node.js, Express.js, MongoDB
- Enterprise & Tools: ServiceNow (Flow Designer, ITSM, App Engine Studio, UI Builder), Git, Google Colab, Jupyter Notebook
- Focus Areas: Machine Learning, Multi-Agent Intelligent Systems, Full Stack Engineering

=== FEATURED ENGINEERING PROJECTS ===
1. Deterministic Epistemic Arbitration in Multi-Agent RAG (DEA) - 2026 Present (GitHub: https://github.com/Harish-sabari-130/DEA)
2. AI Call Intelligence - 2025 (Deepgram API + LiveKit, GitHub: https://github.com/hariharanj-dev/AI-Call-Intelligence)
3. Real-Time Object Detection System - 2024 (YOLOv8 + DeepSORT + MiDaS, GitHub: https://github.com/hariharanj-dev/real-time-object-detection)
4. Safina – Women Safety Analysis - 2024 (GitHub: https://github.com/Harish-sabari-130/Women-safety-application)
5. Nomad Visa Hub (ServiceNow RiseUp Alumni) - 2026 (Live Portal: https://secure-access-hub--harish43135200.replit.app)
6. Client Web Solution (Freelancing) - 2025 Present (Live Site: https://firstinalltime.in/)

=== CONTACT & ONLINE PRESENCE ===
- Email: harish23alr@gmail.com
- Direct Mobile / WhatsApp: +91 9080562629
- LinkedIn: https://linkedin.com/in/harish-sabari-130hssh/
- GitHub: https://github.com/Harish-sabari-130
- LeetCode: https://leetcode.com/u/Harish_sabari/
- Resume Google Drive: https://drive.google.com/file/d/1-P0qkKw85lUcahaGjvQKtvyJMRBPl7HT/view?usp=sharing
`;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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

    const body = JSON.parse(bodyStr || "{}");
    const cleanMessage = (body.message || "").trim().slice(0, 500);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        response: "Harish Sabari P V is a final-year AI & ML student at Kongu Engineering College (CGPA: 7.77*) and RiseUp with ServiceNow Alumni. Contact him at harish23alr@gmail.com!",
      }));
      return;
    }

    const formattedContents = [];
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
      parts: [{ text: cleanMessage || "Hello Saha!" }],
    });

    const payload = {
      system_instruction: { parts: [{ text: SAHA_SYSTEM_PROMPT }] },
      contents: formattedContents,
      generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 350 },
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
      response: "Harish Sabari is a final-year AI & ML student at Kongu Engineering College (CGPA 7.77*). Reach him at harish23alr@gmail.com!",
    }));
  }
}
