import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minus, ChevronDown, Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';

interface Message {
  role: 'ai' | 'user';
  content: string;
  timestamp?: Date;
}

const RESPONSES: Record<string, string[]> = {
  saha: [
    "I'm Saha — Harish Sabari's AI companion built into this portfolio. I can answer anything about his skills, projects (such as Multi-Agent RAG and AI Call Intelligence), ServiceNow internship, or background. What would you like to explore?",
    "Saha here! I'm the AI assistant embedded in this portfolio. I know all about Harish Sabari's work in Multi-Agent RAG, YOLOv8 vision, audio AI, and full-stack development. Ask away!",
    "Hello! I am Saha. I can provide details on Harish's technical capabilities, projects (like DEA Clinical Decision Support, AI Call Intelligence, and Real-Time YOLO Detection), ServiceNow internship, or how to reach him directly.",
  ],
  greeting: [
    "Hey! I'm Saha — Harish Sabari's AI companion. What would you like to know about him?",
    "Hello! Saha here. I can walk you through Harish Sabari's work, AI projects, tech stack, and background. What are you curious about?",
    "Hi there! Ask me anything about Harish Sabari — his projects, skills, education, or how to get in touch.",
  ],
  skills: [
    "Harish Sabari's core stack: Languages — Java, Python. Machine Learning & AI — NumPy, Pandas, Scikit-learn, TensorFlow, OpenCV. Web & Backend — React, Node.js, Express.js, MongoDB. Tools — Git, Google Colab, Jupyter Notebook, ServiceNow.",
    "He develops primarily in Python and Java. For AI/ML work he leverages TensorFlow, Scikit-learn, and OpenCV for computer vision. On the web side, he builds full-stack applications with React, Node.js, Express.js, and MongoDB.",
    "Core strengths: Multi-Agent RAG systems, AI audio diarization (Deepgram + LiveKit), computer vision (YOLOv8 + DeepSORT + MiDaS), and ServiceNow enterprise workflow automation.",
  ],
  projects: [
    "Harish's standout projects: 1) Deterministic Epistemic Arbitration in Multi-Agent RAG (Clinical decision support for resolving conflicting medical guidelines), 2) AI Call Intelligence (Speech-to-text & diarization using Deepgram and LiveKit), 3) Real-Time Object Detection (YOLOv8 + DeepSORT + MiDaS depth), 4) Nomad Visa Hub (ServiceNow RiseUp workflow portal), and 5) Client Web Solution (firstinalltime.in).",
    "His primary AI research project is Deterministic Epistemic Arbitration (DEA) — specialized RAG agents for clinical, pharmacological, and literature evidence with Ragas evaluation. For computer vision, he built a high-speed YOLOv8 + DeepSORT + MiDaS pipeline. Both are open source on GitHub!",
    "On GitHub: DEA Multi-Agent RAG (Harish-sabari-130/DEA), AI Call Intelligence (hariharanj-dev/AI-Call-Intelligence), and Real-Time Object Detection (hariharanj-dev/real-time-object-detection). His ServiceNow project is Nomad Visa Hub.",
  ],
  experience: [
    "Harish has hands-on experience as a ServiceNow Developer Intern (RiseUp with ServiceNow Alumni, Jan–Apr 2026), building ITSM workflows, Flow Designer actions, and low-code apps like Nomad Visa Hub. He is also a freelance web developer with a deployed client site at firstinalltime.in.",
    "ServiceNow internship (Jan–Apr 2026): Platform fundamentals, ITSM, Flow Designer, App Engine Studio, UI Builder, and AI workflow automation. He also freelances, delivering full client production websites.",
  ],
  contact: [
    "You can reach Harish Sabari directly via email at harish23alr@gmail.com or call him at +91 9080562629. He's also on LinkedIn (harish-sabari-130hssh), GitHub (Harish-sabari-130), and LeetCode (Harish_sabari).",
    "The fastest way to reach Harish is emailing harish23alr@gmail.com or calling +91 9080562629. You can also send a direct transmission through the Contact section of this portfolio!",
  ],
  hire: [
    "Yes! Harish Sabari is actively seeking opportunities in Software Development and AI Engineering. Feel free to contact him at harish23alr@gmail.com or call +91 9080562629.",
    "Harish is a B.Tech AIML student (CGPA: 7.77*) looking for challenging roles where practical development experience and analytical problem-solving create real-world product impact.",
  ],
  certifications: [
    "Harish holds two verified Oracle credentials: Oracle Certified Professional Java SE 17 Developer (1Z0-819) and Oracle Certified Associate APEX Cloud Developer (1Z0-770). Both are linked to verified Google Drive credentials in the Certifications section.",
    "He is Oracle-certified in Java SE 17 Development and Oracle APEX Cloud Development. You can click on the cards in the Certifications section to inspect the verified certificates.",
  ],
  about: [
    "Harish Sabari P V is a final-year AI & ML student at Kongu Engineering College (2023–2027) with a CGPA of 7.77* and a proud RiseUp with ServiceNow Alumni. He is passionate about exploring AI technologies, experimenting with bold ideas, and continuously learning to build innovative solutions.",
    "Final-year AIML engineer with proven experience in Multi-Agent RAG, Safina Women Safety app, real-time vision (YOLOv8 + DeepSORT), audio AI communication, and ServiceNow enterprise workflows.",
  ],
  ai: [
    "Harish's AI engineering work spans Multi-Agent RAG systems (DEA clinical decision support), computer vision (YOLOv8 + DeepSORT + MiDaS), audio communication (Deepgram + LiveKit), and ServiceNow AI workflows.",
  ],
  resume: [
    "You can view Harish Sabari's official resume directly on Google Drive: https://drive.google.com/file/d/1-P0qkKw85lUcahaGjvQKtvyJMRBPl7HT/view?usp=sharing or by clicking the 'Resume PDF' button in the Overview section!",
  ],
  default: [
    "I can tell you about Harish Sabari's skills, projects (Multi-Agent RAG, Safina, AI Call Intelligence, YOLOv8), ServiceNow internship, Oracle certifications, or contact info. What would you like to know?",
    "Ask me about his AI/ML projects (DEA RAG, Safina Women Safety, Deepgram Call Intelligence, YOLOv8), ServiceNow experience, 7.77* CGPA, or how to reach him directly at harish23alr@gmail.com!",
    "Ask me about his technical stack, education at Kongu Engineering College, live projects, or career objective. I'm here to assist!",
  ],
};

function getCategory(input: string): string {
  const t = input.toLowerCase().trim();
  if (/\b(who are you|what are you|introduce yourself|your name|are you (an )?ai|are you (a )?bot|tell me about yourself)\b/.test(t)) return 'saha';
  if (/\b(saha|your purpose|what can you do|what do you know)\b/.test(t)) return 'saha';
  if (/^(hi|hello|hey|sup|yo|hii|hola|greetings|howdy)[!?.,\s]*$/.test(t)) return 'greeting';
  if (/\b(resume|cv|curriculum|download|pdf)\b/.test(t)) return 'resume';
  if (/\b(skill|tech|stack|language|tool|framework|python|java|react|node|tensorflow|opencv|scikit|servicenow|mongodb)\b/.test(t)) return 'skills';
  if (/\b(project|dea|rag|call intelligence|deepgram|livekit|yolo|vision|safina|women safety|nomad|visa|firstinalltime|github|portfolio)\b/.test(t)) return 'projects';
  if (/\b(experience|intern|internship|servicenow|riseup|freelance|client|firstinalltime)\b/.test(t)) return 'experience';
  if (/\b(contact|email|phone|call|mobile|reach|connect|linkedin|github|leetcode|gmail)\b/.test(t)) return 'contact';
  if (/\b(hire|hiring|available|opportunity|recruit|position|job|career|objective)\b/.test(t)) return 'hire';
  if (/\b(cert|certification|certificate|oracle|apex|java se|1z0)\b/.test(t)) return 'certifications';
  if (/\b(about|who is|harish|sabari|cgpa|kongu|college|education|school|akv|matric)\b/.test(t)) return 'about';
  if (/\b(ai|ml|rag|multi-agent|machine learning|deep learning|computer vision|yolo|deepgram|livekit)\b/.test(t)) return 'ai';
  return 'default';
}

function getReply(input: string): string {
  const category = getCategory(input);
  const opts = RESPONSES[category] || RESPONSES['default'];
  return opts[Math.floor(Math.random() * opts.length)];
}

// Lightweight synthesized sound generator (Web Audio API)
function playCyberChime(type: 'send' | 'receive') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'send') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio context not allowed without user gesture or unsupported
  }
}

/* ── SAHA Holographic Pixel-Art Portrait ── */
export function SAHAPortrait({
  size = 'md',
  isHovered = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  isHovered?: boolean;
}) {
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  return (
    <div
      className={`relative ${dim} rounded-full overflow-hidden shrink-0 border border-cyan-400/60 bg-[#061224] transition-all duration-300 ${
        isHovered
          ? 'shadow-[0_0_20px_rgba(0,212,255,0.85)] border-cyan-300 scale-105'
          : 'shadow-[0_0_12px_rgba(0,212,255,0.35)]'
      }`}
    >
      {/* Pixel Avatar Cropped to Head & Shoulders */}
      <img
        src="/saha-pixel.png"
        alt="Saha AI Avatar"
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none max-w-none"
        style={{
          width: size === 'sm' ? '210%' : '230%',
          top: size === 'sm' ? '-10%' : '-12%',
          imageRendering: 'pixelated',
        }}
      />
      {/* Holographic cyan wash */}
      <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-cyan-400/20 via-transparent to-blue-900/40 mix-blend-screen" />
      {/* Subtle cyber scanlines */}
      <div className="absolute inset-0 rounded-full pointer-events-none opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.25)_2px,rgba(0,212,255,0.25)_3px)]" />
    </div>
  );
}

export default function AIAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPromptBadge, setShowPromptBadge] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Greetings! I'm Saha, Harish Sabari's AI assistant. Ask me anything about his technical stack, projects, experience, or certifications.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent wheel events inside chatbox from bubbling to window / 3D canvas
  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const stopWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    modalEl.addEventListener('wheel', stopWheel, { passive: true });
    return () => {
      modalEl.removeEventListener('wheel', stopWheel);
    };
  }, [isOpen, isMinimized]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowPromptBadge(false);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      const userText = text.trim();

      setMessages(prev => [...prev, { role: 'user', content: userText, timestamp: new Date() }]);
      setInput('');
      setIsTyping(true);

      if (soundEnabled) playCyberChime('send');

      // Attempt to query backend /api/chat with resilient timeout
      let reply = '';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const recentHistory = messages
          .filter(m => m.role === 'user' || m.role === 'ai')
          .slice(-6)
          .map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            text: m.content,
          }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText, history: recentHistory }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.response) {
            reply = data.response;
          }
        }
      } catch {
        // Fallback to local intelligent Saha knowledge base
      }

      if (!reply) {
        reply = getReply(userText);
      }

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'ai', content: reply, timestamp: new Date() }]);
        if (soundEnabled) playCyberChime('receive');
      }, 350 + Math.random() * 200);
    },
    [soundEnabled, messages]
  );

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
      setIsMinimized(false);
    };
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('toggle-saha-ai', handleToggle);
    window.addEventListener('open-saha-ai', handleOpen);
    return () => {
      window.removeEventListener('toggle-saha-ai', handleToggle);
      window.removeEventListener('open-saha-ai', handleOpen);
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: "Memory buffer refreshed. What would you like to explore next?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── Chat Modal Drawer ── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            ref={modalRef}
            id="saha-ai-modal"
            data-saha-chat="true"
            onWheel={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="allow-scroll saha-chatbox fixed z-50 flex flex-col overflow-hidden inset-x-3 top-18 sm:top-20 sm:inset-x-auto sm:right-6 sm:w-[400px] h-[520px] sm:h-[580px] max-h-[calc(100vh-100px)] rounded-2xl border border-sky-400/40 bg-[#060b18]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.25)]"
          >
            {/* Cyber Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.1)_2px,rgba(0,212,255,0.1)_3px)]" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#00d4ff]/20 bg-[#00d4ff]/5 relative z-10">
              <div className="flex items-center gap-3">
                {/* SAHA Holographic Pixel Portrait */}
                <div className="relative">
                  <SAHAPortrait size="md" isHovered={true} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#060b18] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </span>
                </div>

                <div>
                  <div className="font-mono font-bold text-white text-xs tracking-wider flex items-center gap-1.5 flex-wrap">
                    <span>SAHA AI</span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/35 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-sky-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_4px_#00d4ff]" />
                    <span>AI ASSISTANT // HARISH'S PORTFOLIO</span>
                  </div>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <button
                  onClick={() => setSoundEnabled(s => !s)}
                  className="p-1.5 hover:text-[#00d4ff] transition-colors rounded cursor-pointer"
                  title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                  data-interactive="true"
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                <button
                  onClick={clearChat}
                  className="p-1.5 hover:text-[#00d4ff] transition-colors rounded cursor-pointer"
                  title="Clear conversation"
                  data-interactive="true"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:text-white transition-colors rounded cursor-pointer"
                  title="Minimize"
                  data-interactive="true"
                >
                  <Minus size={15} />
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-red-400 transition-colors rounded cursor-pointer"
                  title="Close"
                  data-interactive="true"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div
              ref={messagesContainerRef}
              data-saha-chat="true"
              onWheel={(e) => e.stopPropagation()}
              className="allow-scroll flex-1 overflow-y-auto px-4 py-3 space-y-3.5 text-sm overscroll-contain relative z-10"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'ai' && (
                    <div className="shrink-0 mb-0.5">
                      <SAHAPortrait size="sm" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-lg leading-relaxed text-xs sm:text-[13px] ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-none bg-gradient-to-r from-[#0066ff] to-[#7c3aed] shadow-[0_0_15px_rgba(0,102,255,0.3)]'
                        : 'text-white/95 rounded-bl-none border border-[#00d4ff]/25 bg-[#00d4ff]/10 shadow-[0_0_15px_rgba(0,212,255,0.06)]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-end gap-2"
                >
                  <div className="shrink-0">
                    <SAHAPortrait size="sm" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-lg rounded-bl-none border border-[#00d4ff]/25 bg-[#00d4ff]/10">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              data-saha-chat="true"
              onWheel={(e) => e.stopPropagation()}
              className="allow-scroll px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-[#00d4ff]/15 bg-[#050816]/90 no-scrollbar relative z-10 shrink-0"
            >
              {[
                { label: '⚡ Tech Stack', prompt: 'Tell me about Harish Sabari tech stack and programming skills' },
                { label: '🚀 AI Projects', prompt: 'What are his top machine learning and computer vision projects?' },
                { label: '💼 Experience', prompt: 'Tell me about his ServiceNow internship and freelance experience' },
                { label: '📜 Certifications', prompt: 'What Oracle certifications does Harish hold?' },
                { label: '✉️ Contact', prompt: 'How can I contact or hire Harish Sabari?' },
              ].map(chip => (
                <button
                  key={chip.label}
                  onClick={() => sendMessage(chip.prompt)}
                  className="text-[10px] font-mono px-2.5 py-1 whitespace-nowrap rounded-sm border border-[#00d4ff]/25 text-[#00d4ff] bg-[#00d4ff]/5 hover:bg-[#00d4ff]/15 hover:border-[#00d4ff]/60 transition-all cursor-pointer"
                  data-interactive="true"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div
              data-saha-chat="true"
              onWheel={(e) => e.stopPropagation()}
              className="px-3 py-2.5 border-t border-[#00d4ff]/20 bg-[#00d4ff]/5 relative z-10 shrink-0"
            >
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask Saha about Harish's skills, projects..."
                  className="flex-1 bg-[#00d4ff]/10 border border-[#00d4ff]/25 focus:border-[#00d4ff] focus:outline-none px-3 py-2 rounded-sm text-white placeholder-white/35 text-xs transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-sm flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-[#050816] font-bold shadow-[0_0_10px_#00d4ff]"
                  data-interactive="true"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized Pill (Top-Right Dock) ── */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => setIsMinimized(false)}
            className="fixed right-4 sm:right-6 top-18 sm:top-20 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer bg-slate-900/90 border border-sky-400/50 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.25)] select-none group"
            data-interactive="true"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono text-sky-300 tracking-wider font-bold">
              SAHA AI [EXPAND]
            </span>
            <ChevronDown size={13} className="text-sky-400 group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
