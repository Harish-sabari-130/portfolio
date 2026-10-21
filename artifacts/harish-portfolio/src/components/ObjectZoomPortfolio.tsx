import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Github,
  Mail,
  Linkedin,
  MapPin,
  Send,
  ExternalLink,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Code2,
  Cpu,
  GraduationCap,
  Briefcase,
  Phone,
  Globe,
  Copy,
  Check,
  MessageSquare,
} from 'lucide-react';
import FuturisticObject3D, { SECTION_WAYPOINTS } from './FuturisticObject3D';
import { SAHAPortrait } from './AIAvatar';

const SECTIONS = [
  { id: 0, label: 'Overview', tag: '01 // OVERVIEW' },
  { id: 1, label: 'About', tag: '02 // IDENTITY' },
  { id: 2, label: 'Skills', tag: '03 // STACK' },
  { id: 3, label: 'Projects', tag: '04 // PORTFOLIO' },
  { id: 4, label: 'Experience', tag: '05 // TIMELINE' },
  { id: 5, label: 'Certifications', tag: '06 // CREDENTIALS' },
  { id: 6, label: 'Contact', tag: '07 // REACH OUT' },
];

const PROJECTS = [
  {
    title: 'Deterministic Epistemic Arbitration in Multi-Agent RAG',
    period: '2026 – Present',
    desc: 'Developing an AI-based clinical decision support system for resolving conflicting medical guidelines using specialized clinical, pharmacological, and literature RAG agents.',
    highlights: 'Hybrid retrieval with vector databases, LLM-based generation, and deterministic evidence scoring (Ragas evaluation).',
    tags: ['Multi-Agent RAG', 'Vector DB', 'LLMs', 'Ragas', 'Python'],
    github: 'https://github.com/Harish-sabari-130/DEA',
    live: null,
  },
  {
    title: 'AI Call Intelligence',
    period: '2025',
    desc: 'AI-powered real-time system for automated speech-to-text audio transcription, speaker diarization, and voice communication processing.',
    highlights: 'Deepgram API for transcription & speaker diarization; LiveKit for real-time low-latency audio processing.',
    tags: ['Deepgram API', 'LiveKit', 'Speech-to-Text', 'Diarization', 'Python'],
    github: 'https://github.com/hariharanj-dev/AI-Call-Intelligence',
    live: null,
  },
  {
    title: 'Real-Time Object Detection System',
    period: '2024',
    desc: 'High-performance computer vision system for real-time multi-object detection, spatial tracking, and monocular depth estimation.',
    highlights: 'YOLOv8 for real-time object detection, DeepSORT for multi-object tracking, and MiDaS for depth estimation.',
    tags: ['YOLOv8', 'DeepSORT', 'MiDaS Depth', 'OpenCV', 'PyTorch'],
    github: 'https://github.com/hariharanj-dev/real-time-object-detection',
    live: null,
  },
  {
    title: 'Safina – Women Safety Analysis',
    period: '2024',
    desc: 'Designed a women safety application that provides instant emergency alerts and real-time location tracking.',
    highlights: 'Implemented a multi-level escalation system to notify trusted contacts and emergency services during critical situations.',
    tags: ['Safety Tech', 'Location Tracking', 'Emergency Escalation', 'Python'],
    github: 'https://github.com/Harish-sabari-130/Women-safety-application',
    live: null,
  },
  {
    title: 'Nomad Visa Hub (ServiceNow RiseUp)',
    period: '2026',
    desc: 'Immigration workflow automation platform built during ServiceNow RiseUp program utilizing Flow Designer, ITSM, and App Engine Studio.',
    highlights: 'ITSM workflows, business logic automation, and low-code portal design using UI Builder.',
    tags: ['ServiceNow', 'App Engine Studio', 'Flow Designer', 'ITSM'],
    github: null,
    live: 'https://secure-access-hub--harish43135200.replit.app',
  },
  {
    title: 'Client Web Solution (Freelancing)',
    period: '2025 – Present',
    desc: 'Client-based production website solution engineered from requirement analysis through responsive design and live deployment.',
    highlights: 'Requirement analysis, full-stack implementation, and production deployment at firstinalltime.in.',
    tags: ['React', 'Web Architecture', 'Client Solution', 'Live Deploy'],
    github: null,
    live: 'https://firstinalltime.in/',
  },
];

const SKILL_CATEGORIES = [
  {
    title: 'Programming Languages',
    skills: ['Java', 'Python'],
  },
  {
    title: 'Machine Learning & AI',
    skills: ['NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'OpenCV'],
  },
  {
    title: 'Web & Backend Development',
    skills: ['React', 'Node.js', 'Express.js', 'MongoDB'],
  },
  {
    title: 'Tools & Environments',
    skills: ['Git', 'Google Colab', 'Jupyter Notebook', 'ServiceNow'],
  },
  {
    title: 'Areas of Interest',
    skills: ['Machine Learning', 'Full Stack Development'],
  },
];

const EXPERIENCES = [
  {
    role: 'ServiceNow Developer Intern',
    org: 'ServiceNow (RiseUp with ServiceNow Alumni)',
    period: 'Jan 2026 – Apr 2026',
    desc: 'Completed hands-on training across ServiceNow platform fundamentals, ITSM, Flow Designer, App Engine Studio, UI Builder, and workflow automation. Built knowledge in scripting, AI-powered workflows, and low code application development. Completed Nomad Visa Hub project.',
    link: 'https://secure-access-hub--harish43135200.replit.app',
  },
  {
    role: 'Freelance Web Developer',
    org: 'Client Project (firstinalltime.in)',
    period: '2025 – Present',
    desc: 'Delivered a client-based website solution, focusing on requirement analysis, responsive design, and end-to-end production implementation.',
    link: 'https://firstinalltime.in/',
  },
  {
    role: 'Bachelor of Technology (B.Tech)',
    org: 'Kongu Engineering College',
    period: '2023 – 2027',
    desc: 'Artificial Intelligence and Machine Learning. Coursework in machine learning architectures, computer vision, data structures, and database systems. CGPA: 7.77*.',
    link: null,
  },
  {
    role: 'Higher Secondary Certificate (HSC)',
    org: 'AKV Matric Hr Sec School',
    period: '2022 – 2023',
    desc: 'Completed Higher Secondary education with distinction. Aggregate score: 86%.',
    link: null,
  },
];

const CERTS = [
  {
    name: 'Java SE 17 Developer',
    issuer: 'Oracle Certified Professional',
    code: '1Z0-819',
    link: 'https://drive.google.com/file/d/1sGN4JfGIa7o5Ht5HBEvtdwE9UDlIUuOf/view?usp=sharing',
  },
  {
    name: 'Oracle APEX Cloud Developer',
    issuer: 'Oracle Certified Associate',
    code: '1Z0-770',
    link: 'https://drive.google.com/file/d/1-KYNSlqkpGiy8lzYfuytkZbMpY7euilz/view?usp=sharing',
  },
];

export default function ObjectZoomPortfolio() {
  const [currentSection, setCurrentSection] = useState(0);
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Ignore copy error
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const scrollCooldownRef = useRef(false);

  const goToSection = useCallback((idx: number) => {
    if (idx < 0 || idx >= SECTIONS.length) return;
    setCurrentSection(idx);
  }, []);

  const nextSection = useCallback(() => {
    if (currentSection < SECTIONS.length - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, goToSection]);

  const prevSection = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  // Scroll to zoom between 3D camera waypoints
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Allow standard scrolling inside long text lists & Saha AI chatbox
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('.allow-scroll') ||
        target.closest('[data-saha-chat]') ||
        target.closest('#saha-ai-modal') ||
        target.closest('.saha-chatbox') ||
        target.closest('input') ||
        target.closest('textarea')
      ) {
        return;
      }

      if (scrollCooldownRef.current) return;

      if (e.deltaY > 30) {
        scrollCooldownRef.current = true;
        nextSection();
        setTimeout(() => (scrollCooldownRef.current = false), 600);
      } else if (e.deltaY < -30) {
        scrollCooldownRef.current = true;
        prevSection();
        setTimeout(() => (scrollCooldownRef.current = false), 600);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [nextSection, prevSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSection();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSection, prevSection]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
    } catch {
      // Fallback
    }
    setTimeout(() => {
      setContactStatus('success');
      setContactData({ name: '', email: '', message: '' });
    }, 900);
  };

  const activeWaypoint = SECTION_WAYPOINTS[currentSection] || SECTION_WAYPOINTS[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] text-slate-100 select-none font-sans">
      {/* ── Real 3D WebGL Canvas (Smooth Camera Zoom & Orbit) ── */}
      <FuturisticObject3D
        currentSection={currentSection}
        onSelectSection={goToSection}
      />

      {/* Subtle Studio Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(7, 11, 20, 0.75) 100%)',
        }}
      />

      {/* ── Sleek Brand Capsule (Top-Left) ── */}
      <div
        onClick={() => goToSection(0)}
        className="fixed top-4 left-4 sm:top-5 sm:left-6 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-amber-400/30 bg-slate-950/80 hover:bg-slate-900/90 hover:border-amber-400/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 cursor-pointer group select-none"
        title="Harish Sabari's AI Nexus — Return to Overview"
        data-interactive="true"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden border border-amber-400/60 shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform shrink-0">
          <img
            src="/hs-emblem.png"
            alt="Harish Sabari HS Emblem"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wider text-slate-100 group-hover:text-amber-200 transition-colors leading-tight">
            HARISH SABARI<span className="text-amber-400 font-serif">'S</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-sky-400/90 group-hover:text-sky-300 leading-tight">
            AI NEXUS
          </span>
        </div>
      </div>

      {/* ── Floating Navigation Capsule Dock (Top-Center) ── */}
      <nav className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1 p-1.5 rounded-full border border-white/10 bg-slate-900/65 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] select-none">
        {SECTIONS.map((sec, i) => {
          const isActive = currentSection === i;
          return (
            <button
              key={sec.id}
              onClick={() => goToSection(i)}
              className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-400 text-slate-950 font-semibold shadow-[0_0_14px_rgba(56,189,248,0.4)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
              }`}
              data-interactive="true"
            >
              {sec.label}
            </button>
          );
        })}
      </nav>

      {/* ── Floating Header Action Capsules (Top-Right) ── */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-30 flex items-center gap-2 sm:gap-2.5 select-none">
        {/* Saha AI Avatar Capsule Trigger */}
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('toggle-saha-ai'));
          }}
          className="group relative flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-cyan-400/40 bg-slate-900/85 hover:bg-cyan-950/40 hover:border-cyan-300 backdrop-blur-xl shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_24px_rgba(0,212,255,0.45)] transition-all duration-300 cursor-pointer"
          data-interactive="true"
          title="Open Saha AI Assistant"
        >
          {/* Micro Avatar Portrait with pulsing status */}
          <div className="relative">
            <SAHAPortrait size="sm" isHovered={false} />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#060b18] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-xs font-bold tracking-wider text-cyan-300 group-hover:text-cyan-200 transition-colors">
              Saha AI
            </span>
            <span className="hidden sm:inline text-[8px] tracking-wider text-cyan-400/80 px-1.5 py-0.2 rounded-full bg-cyan-950/80 border border-cyan-400/30">
              Copilot
            </span>
          </div>
        </button>

        {/* Contact Me Button */}
        <button
          onClick={() => goToSection(6)}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-sky-300 border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 backdrop-blur-xl shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all cursor-pointer flex items-center gap-1.5"
          data-interactive="true"
        >
          <span>Contact Me</span>
        </button>
      </div>

      {/* ── Main Dynamic Stage with Smooth Content Overlays ── */}
      <main className="w-full h-full pt-16 pb-16 px-4 sm:px-8 lg:px-12 flex items-center justify-center relative z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {/* =========================================================
              SECTION 0: OVERVIEW (Consistent Visible Card: 440px x 360px)
              ========================================================= */}
          {currentSection === 0 && (
            <motion.div
              key="sec-0"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-[495px] lg:w-[495px] lg:mr-auto lg:ml-6 xl:ml-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">01 // OVERVIEW</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">1 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 flex flex-col justify-between py-1.5 overflow-y-auto allow-scroll pr-1">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5 leading-snug">
                      Engineering with{' '}
                      <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                        AI &amp; Intelligent Systems
                      </span>
                    </h1>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      To secure a challenging role in software development or AI engineering where I can apply my
                      practical development experience and analytical mindset to build real-world products,
                      contribute to team success, and continuously evolve as a problem-solving engineer.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <button
                        onClick={() => goToSection(1)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-xs tracking-wide shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all cursor-pointer flex items-center gap-1"
                        data-interactive="true"
                      >
                        <span>Begin Tour</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <a
                        href="https://drive.google.com/file/d/1-P0qkKw85lUcahaGjvQKtvyJMRBPl7HT/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-slate-200 text-xs tracking-wide transition-all cursor-pointer"
                        data-interactive="true"
                      >
                        Resume PDF
                      </a>
                    </div>
                  </div>

                  {/* Interactive Node Chips */}
                  <div className="pt-2 border-t border-white/[0.08]">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Sparkles size={10} className="text-sky-400" />
                      <span>Quick Camera Waypoints:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SECTIONS.slice(1).map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => goToSection(sec.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.03] hover:bg-sky-500/15 border border-white/[0.07] hover:border-sky-400/40 text-slate-300 hover:text-sky-300 transition-all cursor-pointer"
                          data-interactive="true"
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.08] text-[9.5px] font-mono text-slate-500 flex items-center justify-between shrink-0">
                  <span>Spatial Telemetry // 01</span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 1: ABOUT (Dual-Wing Grand Cyber Dossier)
              ========================================================= */}
          {currentSection === 1 && (
            <motion.div
              key="sec-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[830px] lg:mr-auto lg:ml-6 xl:ml-10 pointer-events-auto flex flex-col md:flex-row items-center md:items-stretch gap-4"
            >
              {/* ── Wing A: High-Definition Holographic Portrait Stand ── */}
              <div
                onClick={() => setIsPhotoExpanded(true)}
                className="w-[280px] sm:w-[305px] lg:w-[320px] h-[410px] rounded-2xl border border-sky-400/40 bg-[#090e1a]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(56,189,248,0.25)] overflow-hidden relative group cursor-pointer shrink-0 select-none flex flex-col justify-between p-3.5"
                data-interactive="true"
                title="Click to Expand Full High-Resolution Portrait"
              >
                {/* Full-bleed Photo with Precise Face Framing */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src="/harish.jpg"
                    alt="Harish Sabari P V"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{
                      objectPosition: 'center 46%',
                      transform: 'scale(1.28)',
                      transformOrigin: '50% 46%',
                    }}
                  />
                  {/* Subtle Cinematic Vignette */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(9,14,26,0.25) 0%, transparent 20%, transparent 65%, rgba(9,14,26,0.92) 100%)',
                    }}
                  />
                  {/* Cyan Rim Accent Lines */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-sky-400/70 to-transparent" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-indigo-400/70 to-transparent" />
                </div>

                {/* Top Corner Calipers & Status Badge */}
                <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-sky-300">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 border border-sky-400/40 backdrop-blur-md shadow-[0_0_10px_rgba(56,189,248,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold tracking-widest text-emerald-300">BIOMETRIC ID</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-slate-300">
                    #HS-2027
                  </div>
                </div>

                {/* Tactical HUD Corner Brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-sky-400 pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-sky-400 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-sky-400 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-sky-400 pointer-events-none" />

                {/* Bottom Biometric Identity Plaque */}
                <div className="relative z-10 p-2.5 rounded-xl bg-slate-950/90 border border-sky-400/35 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                  <div className="text-xs font-bold text-white tracking-wider truncate flex items-center justify-between">
                    <span>HARISH SABARI P V</span>
                    <Sparkles size={11} className="text-sky-400 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="text-[9.5px] font-mono text-sky-400 mt-0.5 truncate">
                    Final-Year B.Tech AI &amp; Machine Learning
                  </div>
                  <div className="text-[8.5px] text-slate-400 flex items-center justify-between mt-1 pt-1 border-t border-white/10 font-mono">
                    <span>Kongu Eng. College · CGPA 7.77*</span>
                    <span className="text-sky-300/90 group-hover:underline">Click to Enlarge ↗</span>
                  </div>
                </div>
              </div>

              {/* ── Wing B: Identity Credentials & Accomplishments Card ── */}
              <div className="flex-1 w-full md:w-[450px] lg:w-[495px] h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between shrink-0">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">02 // IDENTITY ARCHIVE</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">2 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 flex flex-col justify-between py-1.5 overflow-y-auto allow-scroll pr-1">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                      About Harish Sabari
                    </h2>

                    <p className="text-xs text-slate-300 leading-relaxed mb-1.5">
                      Final-year <span className="text-sky-400 font-semibold">AI &amp; ML Engineer</span> at{' '}
                      <span className="text-white font-medium">Kongu Engineering College</span> (2023–2027) with a <span className="text-emerald-400 font-mono font-semibold">7.77* CGPA</span>, and proud <span className="text-purple-300 font-semibold">RiseUp with ServiceNow Alumni</span>.
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      Deeply passionate about exploring modern AI technologies and turning bold ideas into reality. Constantly experimenting with multi-agent RAG, real-time computer vision, and intelligent workflows—learning rapidly and architecting innovative solutions that solve meaningful problems.
                    </p>
                  </div>

                  {/* Core Focus Specialization Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-400/30 text-[9px] font-mono text-sky-300">
                      Final-Year AI &amp; ML
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-400/30 text-[9px] font-mono text-purple-300">
                      RiseUp ServiceNow Alumni
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-400/30 text-[9px] font-mono text-indigo-300">
                      Multi-Agent RAG
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/30 text-[9px] font-mono text-emerald-300">
                      Innovative Solutions
                    </span>
                  </div>

                  {/* 3 Metric Stat Chips */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-white/[0.08] text-center">
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-base font-bold text-sky-400">6+</div>
                      <div className="text-[9px] text-slate-400">AI / Web Apps</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-base font-bold text-indigo-400">2</div>
                      <div className="text-[9px] text-slate-400">Oracle Certs</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <div className="text-base font-bold text-emerald-400">7.77*</div>
                      <div className="text-[9px] text-slate-400">CGPA</div>
                    </div>
                  </div>
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] shrink-0">
                  <button
                    onClick={() => goToSection(2)}
                    className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    data-interactive="true"
                  >
                    <span>Fly to Skills Matrix (Bird's Eye)</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 2: SKILLS (Consistent Visible Card: 440px x 360px)
              ========================================================= */}
          {currentSection === 2 && (
            <motion.div
              key="sec-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[495px] lg:w-[495px] lg:ml-auto lg:mr-6 xl:mr-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">03 // CAPABILITIES</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">3 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 overflow-y-auto allow-scroll pr-1 py-1 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Technical Stack
                  </h2>

                  {SKILL_CATEGORIES.map((cat, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="text-[11px] font-medium text-slate-300">{cat.title}</div>
                      <div className="flex flex-wrap gap-1">
                        {cat.skills.map((skill, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/[0.04] border border-white/[0.08] text-slate-200 hover:border-sky-400/40 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] shrink-0">
                  <button
                    onClick={() => goToSection(3)}
                    className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    data-interactive="true"
                  >
                    <span>Fly to Featured Projects</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 3: PROJECTS (Consistent Visible Card: 440px x 360px)
              ========================================================= */}
          {currentSection === 3 && (
            <motion.div
              key="sec-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[495px] lg:w-[495px] lg:mr-auto lg:ml-6 xl:ml-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">04 // PORTFOLIO</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">4 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 overflow-y-auto allow-scroll pr-1 space-y-1.5 py-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Featured Projects
                    </h2>
                    <button
                      onClick={() => goToSection(4)}
                      className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      data-interactive="true"
                    >
                      <span>Timeline</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>

                  {PROJECTS.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.07] hover:border-sky-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 min-w-0 pr-1">
                          <h3 className="text-xs font-semibold text-white truncate">{proj.title}</h3>
                          <span className="text-[8.5px] font-mono text-sky-400 shrink-0 px-1 py-0.2 rounded bg-sky-950/80 border border-sky-400/25">
                            {proj.period}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {proj.github && (
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-sky-400 transition-colors p-0.5"
                              data-interactive="true"
                              title="View GitHub Repository"
                            >
                              <Github size={12} />
                            </a>
                          )}
                          {proj.live && (
                            <a
                              href={proj.live}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5"
                              data-interactive="true"
                              title="View Live Web Solution"
                            >
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug mb-1">
                        {proj.desc}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {proj.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[8px] px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-300 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] shrink-0">
                  <button
                    onClick={() => goToSection(4)}
                    className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    data-interactive="true"
                  >
                    <span>Fly to Experience Orbit (Dutch Tilt)</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 4: EXPERIENCE (Consistent Visible Card: 440px x 360px)
              ========================================================= */}
          {currentSection === 4 && (
            <motion.div
              key="sec-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[495px] lg:w-[495px] lg:ml-auto lg:mr-6 xl:mr-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">05 // CHRONOLOGY</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">5 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 overflow-y-auto allow-scroll pr-1 space-y-1.5 py-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Experience &amp; Education
                  </h2>

                  {EXPERIENCES.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.07] hover:border-sky-400/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 mb-0.5">
                        <h3 className="text-xs font-semibold text-white">{exp.role}</h3>
                        <span className="text-[9px] text-sky-400 font-mono shrink-0">{exp.period}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-indigo-300 mb-0.5">
                        <span>@ {exp.org}</span>
                        {exp.link && (
                          <a
                            href={exp.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[9px] text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-0.5"
                            data-interactive="true"
                          >
                            <span>Live Link</span>
                            <ExternalLink size={9} />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">{exp.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] shrink-0">
                  <button
                    onClick={() => goToSection(5)}
                    className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    data-interactive="true"
                  >
                    <span>Fly to Certifications Vault</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 5: CERTIFICATIONS (Consistent Visible Card: 440px x 360px)
              ========================================================= */}
          {currentSection === 5 && (
            <motion.div
              key="sec-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[495px] lg:w-[495px] lg:mr-auto lg:ml-6 xl:ml-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">06 // ACCREDITATIONS</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">6 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 overflow-y-auto allow-scroll pr-1 space-y-2 py-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    Industry Certifications
                  </h2>

                  {CERTS.map((cert, idx) => (
                    <a
                      key={idx}
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/50 transition-colors block group"
                      data-interactive="true"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9.5px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 rounded-full flex items-center gap-1">
                          <CheckCircle2 size={9} /> Verified
                        </span>
                        <span className="text-[11px] text-sky-400 font-mono">{cert.code}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors mb-0.5">
                        {cert.name}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 mb-1">{cert.issuer}</p>
                      <div className="flex items-center gap-1 text-[11px] text-sky-400">
                        <span>View Document on Google Drive</span>
                        <ExternalLink size={11} />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] shrink-0">
                  <button
                    onClick={() => goToSection(6)}
                    className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    data-interactive="true"
                  >
                    <span>Fly to Quantum Contact Core</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================
              SECTION 6: CONTACT (Efficient Visible Card: 495px x 410px)
              ========================================================= */}
          {currentSection === 6 && (
            <motion.div
              key="sec-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-[495px] lg:w-[495px] lg:mr-auto lg:ml-6 xl:ml-10 pointer-events-auto"
            >
              <div className="w-full h-[410px] max-h-[calc(100vh-130px)] p-5 rounded-2xl border border-white/[0.12] bg-[#090e1a]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
                {/* Fixed Card Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-2 border-b border-white/[0.08] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-sky-400 font-semibold tracking-wider">07 // DIRECT LINK</span>
                  </div>
                  <span className="text-slate-500 text-[10px] tracking-widest">7 / 7</span>
                </div>

                {/* Middle Content Body */}
                <div className="flex-1 flex flex-col justify-between py-1.5 overflow-y-auto allow-scroll pr-1">
                  {/* Title & Availability Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        Direct Communication Hub
                      </h2>
                      <p className="text-[10.5px] text-slate-400">
                        Available for AI Engineering &amp; Full Stack Roles
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[9px] font-mono flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open to Work
                    </span>
                  </div>

                  {/* Primary Direct Channels: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-1.5">
                    {/* Email Channel */}
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/40 transition-colors flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-sky-400 uppercase tracking-wider">
                          <Mail size={11} />
                          <span>Email</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('harish23alr@gmail.com', 'email')}
                          className="text-[8.5px] font-mono text-slate-400 hover:text-sky-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
                          title="Copy email to clipboard"
                          data-interactive="true"
                        >
                          {copiedField === 'email' ? (
                            <>
                              <Check size={9} className="text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={9} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href="https://mail.google.com/mail/?view=cm&to=harish23alr@gmail.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11.5px] font-semibold text-white hover:text-sky-300 truncate transition-colors block"
                        data-interactive="true"
                        title="Compose email to Harish Sabari"
                      >
                        harish23alr@gmail.com
                      </a>
                    </div>

                    {/* Phone Channel */}
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-400/40 transition-colors flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-400 uppercase tracking-wider">
                          <Phone size={11} />
                          <span>Mobile / Direct</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('+919080562629', 'phone')}
                          className="text-[8.5px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] transition-colors cursor-pointer"
                          title="Copy phone number"
                          data-interactive="true"
                        >
                          {copiedField === 'phone' ? (
                            <>
                              <Check size={9} className="text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={9} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href="tel:+919080562629"
                        className="text-[11.5px] font-semibold text-white hover:text-emerald-300 truncate transition-colors block"
                        data-interactive="true"
                        title="Click to Call +91 9080562629"
                      >
                        +91 9080562629
                      </a>
                    </div>
                  </div>

                  {/* Professional & Code Hub (3 Columns) */}
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <a
                      href="https://linkedin.com/in/harish-sabari-130hssh/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-400/50 hover:bg-sky-500/5 transition-all text-center group block"
                      data-interactive="true"
                      title="LinkedIn: /in/harish-sabari-130hssh/"
                    >
                      <Linkedin size={12} className="text-sky-400 mx-auto mb-0.5 group-hover:scale-110 transition-transform" />
                      <div className="text-[8.5px] font-mono text-slate-400">LinkedIn</div>
                      <div className="text-[9.5px] font-semibold text-white group-hover:text-sky-300 truncate">
                        harish-sabari
                      </div>
                    </a>

                    <a
                      href="https://github.com/Harish-sabari-130"
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-400/50 hover:bg-purple-500/5 transition-all text-center group block"
                      data-interactive="true"
                      title="GitHub: @Harish-sabari-130"
                    >
                      <Github size={12} className="text-purple-400 mx-auto mb-0.5 group-hover:scale-110 transition-transform" />
                      <div className="text-[8.5px] font-mono text-slate-400">GitHub</div>
                      <div className="text-[9.5px] font-semibold text-white group-hover:text-purple-300 truncate">
                        Harish-sabari
                      </div>
                    </a>

                    <a
                      href="https://leetcode.com/u/Harish_sabari/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/50 hover:bg-amber-500/5 transition-all text-center group block"
                      data-interactive="true"
                      title="LeetCode: @Harish_sabari"
                    >
                      <Code2 size={12} className="text-amber-400 mx-auto mb-0.5 group-hover:scale-110 transition-transform" />
                      <div className="text-[8.5px] font-mono text-slate-400">LeetCode</div>
                      <div className="text-[9.5px] font-semibold text-white group-hover:text-amber-300 truncate">
                        Harish_sabari
                      </div>
                    </a>
                  </div>

                  {/* Direct Transmission Form */}
                  <div className="pt-2 border-t border-white/[0.08]">
                    {contactStatus === 'success' ? (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-center flex flex-col items-center justify-center">
                        <CheckCircle2 size={18} className="text-emerald-400 mb-0.5" />
                        <div className="text-xs font-semibold text-white">Transmission Delivered</div>
                        <p className="text-[10px] text-slate-300 mt-0.5">
                          Thank you for reaching out! I will respond directly to your email shortly.
                        </p>
                        <button
                          type="button"
                          onClick={() => setContactStatus('idle')}
                          className="mt-1.5 px-3 py-0.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[9.5px] text-slate-200 transition-colors cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <MessageSquare size={10} className="text-sky-400" />
                            <span>Quick Message Dispatch:</span>
                          </span>
                          <span className="text-[8.5px] text-slate-500">Instant Notification</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={contactData.name}
                            onChange={e => setContactData({ ...contactData, name: e.target.value })}
                            className="w-full px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-sky-400 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                          />
                          <input
                            required
                            type="email"
                            placeholder="Your Email"
                            value={contactData.email}
                            onChange={e => setContactData({ ...contactData, email: e.target.value })}
                            className="w-full px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-sky-400 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                          />
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            required
                            type="text"
                            placeholder="Your Message..."
                            value={contactData.message}
                            onChange={e => setContactData({ ...contactData, message: e.target.value })}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-sky-400 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={contactStatus === 'loading'}
                            className="px-3.5 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-slate-950 font-semibold text-xs tracking-wider transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                            data-interactive="true"
                          >
                            <span>{contactStatus === 'loading' ? 'Sending...' : 'Send'}</span>
                            <Send size={10} />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                {/* Fixed Card Footer */}
                <div className="pt-2 border-t border-white/[0.08] text-[9.5px] font-mono text-slate-500 flex items-center justify-between shrink-0">
                  <span className="flex items-center gap-1 text-slate-400 truncate pr-2">
                    <MapPin size={10} className="text-sky-400 shrink-0" />
                    <span className="truncate">Kongu Engineering College &bull; Erode, Tamil Nadu</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ready</span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Floating Orbit Controller Capsule (Bottom-Center) ── */}
      <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 sm:gap-4 px-4 py-2 rounded-full border border-white/12 bg-slate-900/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-xs select-none">
        {/* Previous Button */}
        <button
          onClick={prevSection}
          disabled={currentSection === 0}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Previous Section (Left Arrow)"
          data-interactive="true"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline text-xs font-medium">Prev</span>
        </button>

        {/* Divider */}
        <span className="w-px h-4 bg-white/10" />

        {/* Orbit Progress & Section Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-xs font-semibold text-sky-400">
            {SECTIONS[currentSection].tag}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            {SECTIONS[currentSection].label}
          </span>

          {/* Mini Interactive Dot Stepper */}
          <div className="flex items-center gap-1.5 ml-1">
            {SECTIONS.map((sec, i) => (
              <button
                key={sec.id}
                onClick={() => goToSection(i)}
                title={`Go to ${sec.label}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSection === i
                    ? 'w-4 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                    : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                }`}
                data-interactive="true"
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <span className="w-px h-4 bg-white/10" />

        {/* Next Button */}
        <button
          onClick={nextSection}
          disabled={currentSection === SECTIONS.length - 1}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Next Section (Right Arrow / Space)"
          data-interactive="true"
        >
          <span className="hidden sm:inline text-xs font-medium">Next</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* ── High-Resolution Biometric Photo Lightbox Modal ── */}
      <AnimatePresence>
        {isPhotoExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPhotoExpanded(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[460px] w-full max-h-[85vh] rounded-2xl border border-sky-400/50 bg-[#090e1a]/95 backdrop-blur-2xl p-4 shadow-[0_0_50px_rgba(56,189,248,0.35)] flex flex-col items-center cursor-default"
            >
              {/* Header */}
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono">
                <div className="flex items-center gap-2 text-sky-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold tracking-wider">HARISH SABARI P V · BIOMETRIC DOSSIER</span>
                </div>
                <button
                  onClick={() => setIsPhotoExpanded(false)}
                  className="px-2 py-0.5 rounded text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  data-interactive="true"
                >
                  ✕ Close
                </button>
              </div>

              {/* Large Portrait Image */}
              <div className="relative w-full aspect-[3/4] max-h-[60vh] rounded-xl overflow-hidden border border-sky-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <img
                  src="/harish.jpg"
                  alt="Harish Sabari P V"
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 46%',
                    transform: 'scale(1.25)',
                    transformOrigin: '50% 46%',
                  }}
                />
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-400 pointer-events-none" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-400 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-400 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-400 pointer-events-none" />
              </div>

              {/* Footer Details */}
              <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono text-slate-400">
                <span>Kongu Engineering College · 2023–2027</span>
                <span className="text-emerald-400">12MP RAW SOURCE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
