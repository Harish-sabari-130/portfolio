import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ExternalLink,
  Github,
  Mail,
  Linkedin,
  MapPin,
  Send,
  Award,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';
import QuantumNexus3D from './QuantumNexus3D';
import TiltCard3D from './TiltCard3D';

// Sound effect synthesizer (Web Audio API)
function playWarpChime(type: 'forward' | 'backward' | 'origin') {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'forward') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    } else if (type === 'backward') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio context not allowed or unsupported
  }
}

// Data definitions
const PROJECTS = [
  {
    title: 'Deterministic Epistemic Arbitration in Multi-Agent RAG',
    desc: 'Clinical decision support system for resolving conflicting medical guidelines using specialized clinical, pharmacological, and literature RAG agents.',
    tags: ['Multi-Agent RAG', 'Vector DB', 'LLM', 'Ragas', 'Python'],
    github: 'https://github.com/Harish-sabari-130/DEA',
    category: 'Multi-Agent AI & RAG',
  },
  {
    title: 'AI Call Intelligence',
    desc: 'Real-time AI voice system for automated audio transcription, speaker diarization, and low-latency voice communication processing.',
    tags: ['Deepgram API', 'LiveKit', 'Speech-to-Text', 'Diarization', 'Python'],
    github: 'https://github.com/hariharanj-dev/AI-Call-Intelligence',
    category: 'Audio AI & Communication',
  },
  {
    title: 'Real-Time Object Detection System',
    desc: 'Computer vision pipeline for real-time multi-object detection, tracking, and spatial depth estimation with YOLOv8, DeepSORT, and MiDaS.',
    tags: ['YOLOv8', 'DeepSORT', 'MiDaS Depth', 'OpenCV', 'PyTorch'],
    github: 'https://github.com/hariharanj-dev/real-time-object-detection',
    category: 'Computer Vision',
  },
  {
    title: 'Safina – Women Safety Analysis',
    desc: 'Women safety application that provides instant emergency alerts, real-time location tracking, and multi-level escalation to notify trusted contacts and emergency services.',
    tags: ['Safety Tech', 'Location Tracking', 'Emergency Escalation', 'Python'],
    github: 'https://github.com/Harish-sabari-130/Women-safety-application',
    category: 'Safety Systems & Mobile Tech',
  },
  {
    title: 'Nomad Visa Hub (ServiceNow RiseUp)',
    desc: 'Digital visa & immigration management portal built during ServiceNow RiseUp program using Flow Designer, ITSM, and App Engine Studio.',
    tags: ['ServiceNow', 'App Engine Studio', 'Flow Designer', 'ITSM'],
    github: null,
    category: 'Enterprise Automation',
  },
  {
    title: 'Client Web Solution (Freelancing)',
    desc: 'Delivered a client-based website solution from requirement analysis through responsive design and production deployment at firstinalltime.in.',
    tags: ['React', 'Web Architecture', 'Client Solution', 'Live Deploy'],
    github: null,
    category: 'Client Web Delivery',
  },
];

const SKILL_GROUPS = [
  {
    title: 'Programming Languages',
    items: ['Java', 'Python'],
    color: '#00d4ff',
    icon: '⚡',
  },
  {
    title: 'Machine Learning & AI',
    items: ['NumPy', 'Pandas', 'Scikit-learn', 'TensorFlow', 'OpenCV'],
    color: '#bd93f9',
    icon: '🧠',
  },
  {
    title: 'Web & Backend Development',
    items: ['React', 'Node.js', 'Express.js', 'MongoDB'],
    color: '#00d4ff',
    icon: '💻',
  },
  {
    title: 'Tools & Environments',
    items: ['Git', 'Google Colab', 'Jupyter Notebook', 'ServiceNow'],
    color: '#4d94ff',
    icon: '🛠️',
  },
];

const EXPERIENCES = [
  {
    title: 'ServiceNow Developer Intern',
    org: 'ServiceNow (RiseUp with ServiceNow Alumni)',
    period: 'Jan 2026 – Apr 2026',
    desc: 'Hands-on training across ServiceNow platform fundamentals, ITSM, Flow Designer, App Engine Studio, UI Builder, and workflow automation. Completed Nomad Visa Hub project.',
    tag: 'INTERNSHIP',
  },
  {
    title: 'Freelance Web Developer',
    org: 'Client Project (firstinalltime.in)',
    period: '2025 – Present',
    desc: 'Delivered client-based website solution focusing on requirement analysis, responsive design, and end-to-end production implementation.',
    tag: 'FREELANCING',
  },
  {
    title: 'B.Tech – Artificial Intelligence & Machine Learning',
    org: 'Kongu Engineering College',
    period: '2023 – 2027',
    desc: 'Undergraduate study in machine learning, deep learning, computer vision, data structures, and database systems. CGPA: 7.77*.',
    tag: 'EDUCATION',
  },
  {
    title: 'Higher Secondary Certificate (HSC)',
    org: 'AKV Matric Hr Sec School',
    period: '2022 – 2023',
    desc: 'Completed Higher Secondary education with distinction. Percentage: 86%.',
    tag: 'EDUCATION',
  },
];

const CERTS = [
  {
    name: 'Java SE 17 Developer',
    issuer: 'Oracle Certified Professional',
    code: '1Z0-819',
    badge: 'ORACLE',
    link: 'https://drive.google.com/file/d/1sGN4JfGIa7o5Ht5HBEvtdwE9UDlIUuOf/view?usp=sharing',
  },
  {
    name: 'Oracle APEX Cloud Developer',
    issuer: 'Oracle Certified Associate',
    code: '1Z0-770',
    badge: 'ORACLE',
    link: 'https://drive.google.com/file/d/1-KYNSlqkpGiy8lzYfuytkZbMpY7euilz/view?usp=sharing',
  },
];

// Layer navigation descriptors
const LAYERS = [
  { id: 0, code: '01', name: 'CORE GATEWAY', objectName: 'QUANTUM SINGULARITY' },
  { id: 1, code: '02', name: 'NEURAL BIO', objectName: 'SILICON CHIP' },
  { id: 2, code: '03', name: 'SKILL MATRIX', objectName: 'DATA CRYSTAL' },
  { id: 3, code: '04', name: 'PROJECT ARCHIVE', objectName: 'CHRONO BEACON' },
  { id: 4, code: '05', name: 'EXPERIENCE LOG', objectName: 'ORACLE CREST' },
  { id: 5, code: '06', name: 'CERT VAULT', objectName: 'COMM TRANSMITTER' },
  { id: 6, code: '07', name: 'CONTACT UPLINK', objectName: 'ORIGIN PORTAL' },
];

export default function InfiniteZoomPortfolio() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [zoomDirection, setZoomDirection] = useState<'forward' | 'backward'>('forward');
  const [isZooming, setIsZooming] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Wheel zoom throttle ref
  const wheelLockRef = useRef(false);

  const zoomTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentLayer || isZooming) return;
      if (targetIndex < 0 || targetIndex >= LAYERS.length) return;

      const dir = targetIndex > currentLayer ? 'forward' : 'backward';
      setZoomDirection(dir);
      setIsZooming(true);

      if (soundEnabled) {
        playWarpChime(targetIndex === 0 ? 'origin' : dir);
      }

      setCurrentLayer(targetIndex);

      setTimeout(() => {
        setIsZooming(false);
      }, 700);
    },
    [currentLayer, isZooming, soundEnabled]
  );

  const zoomIn = useCallback(() => {
    if (currentLayer < LAYERS.length - 1) {
      zoomTo(currentLayer + 1);
    }
  }, [currentLayer, zoomTo]);

  const zoomOut = useCallback(() => {
    if (currentLayer > 0) {
      zoomTo(currentLayer - 1);
    }
  }, [currentLayer, zoomTo]);

  // Wheel & Trackpad gesture zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't trigger if cursor is inside a scrollable modal or Saha AI chatbox
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

      if (wheelLockRef.current) return;

      if (e.deltaY > 35) {
        wheelLockRef.current = true;
        zoomIn();
        setTimeout(() => (wheelLockRef.current = false), 800);
      } else if (e.deltaY < -35) {
        wheelLockRef.current = true;
        zoomOut();
        setTimeout(() => (wheelLockRef.current = false), 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [zoomIn, zoomOut]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut]);

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
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030611] select-none font-sans text-foreground">
      {/* ── 3D Warp Starfield & Cosmic Grid ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Ambient radial deep nebula */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background:
              currentLayer % 2 === 0
                ? 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.08) 0%, rgba(5, 10, 30, 0.95) 75%)'
                : 'radial-gradient(circle at 50% 50%, rgba(189, 147, 249, 0.08) 0%, rgba(5, 10, 30, 0.95) 75%)',
          }}
        />

        {/* 3D Perspective Floor Grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-96 opacity-20"
          style={{
            background:
              'linear-gradient(to top, rgba(0,212,255,0.2) 1px, transparent 1px), linear-gradient(to right, rgba(0,212,255,0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(600px) rotateX(60deg) scale(2)',
            transformOrigin: 'bottom center',
          }}
        />
      </div>

      {/* ── Hyperspace Warp Speed Particle Tunnel (Active during zoom) ── */}
      <AnimatePresence>
        {isZooming && (
          <motion.div
            initial={{ opacity: 0, scale: zoomDirection === 'forward' ? 0.3 : 2 }}
            animate={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: zoomDirection === 'forward' ? 2.5 : 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden"
          >
            {/* Warp streak lines */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at center, transparent 30%, rgba(0, 212, 255, 0.25) 60%, rgba(189, 147, 249, 0.4) 100%)',
                filter: 'blur(2px)',
              }}
            />
            {/* Concentric hyperspace rings */}
            <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-[#00d4ff]/40 animate-ping" />
            <div
              className="absolute w-[900px] h-[900px] rounded-full border border-[#bd93f9]/30 animate-ping"
              style={{ animationDelay: '150ms' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP HUD NAVIGATION: Breadcrumb Matrix ── */}
      <header className="fixed top-0 inset-x-0 h-16 sm:h-20 z-40 px-4 sm:px-8 flex items-center justify-between border-b border-[#00d4ff]/20 bg-[#030611]/85 backdrop-blur-xl">
        {/* Brand identity */}
        <div
          onClick={() => zoomTo(0)}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Harish Sabari's AI Nexus — Return to Core Origin"
          data-interactive="true"
        >
          <div className="w-8 h-8 rounded-full border border-[#00d4ff] flex items-center justify-center bg-[#071326] shadow-[0_0_12px_#00d4ff] shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
          </div>
          <div>
            <div className="font-mono text-xs sm:text-sm font-bold tracking-[0.18em] text-[#00d4ff] group-hover:drop-shadow-[0_0_8px_#00d4ff] transition-all">
              HARISH SABARI<span className="text-white/90">'S</span>
            </div>
            <div className="font-mono text-[9px] tracking-widest text-[#bd93f9]/80 hidden sm:block">
              AI NEXUS // v4.0
            </div>
          </div>
        </div>

        {/* Interactive Breadcrumb Depth Track */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {LAYERS.map((layer, idx) => {
            const isActive = currentLayer === idx;
            const isPassed = currentLayer > idx;

            return (
              <button
                key={layer.id}
                onClick={() => zoomTo(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[10px] sm:text-[11px] tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00d4ff] text-[#030611] font-bold shadow-[0_0_15px_#00d4ff]'
                    : isPassed
                    ? 'text-[#00d4ff]/80 hover:text-white bg-[#00d4ff]/10 border border-[#00d4ff]/30'
                    : 'text-muted-foreground/60 hover:text-white border border-border/50'
                }`}
                data-interactive="true"
              >
                <span>{layer.code}</span>
                <span className="hidden lg:inline">{layer.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Audio Mute & Origin Reset Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="p-2 border border-[#00d4ff]/30 bg-[#00d4ff]/5 text-[#00d4ff] hover:bg-[#00d4ff]/15 rounded-sm transition-all cursor-pointer"
            title={soundEnabled ? 'Mute Warp Audio' : 'Enable Warp Audio'}
            data-interactive="true"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {currentLayer !== 0 && (
            <button
              onClick={() => zoomTo(0)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] border border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-[#030611] transition-all rounded-sm cursor-pointer"
              title="Reset Zoom to Layer 1"
              data-interactive="true"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">ORIGIN</span>
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN 3D ZOOM STAGE (Perspective Viewport) ── */}
      <main
        className="w-full h-full pt-16 sm:pt-20 pb-20 relative flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        <AnimatePresence mode="wait">
          {/* ==============================================================
              LAYER 0: COSMIC GATEWAY // HARISH SABARI & QUANTUM AI CORE
              ============================================================== */}
          {currentLayer === 0 && (
            <motion.div
              key="layer-0"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
                rotateX: zoomDirection === 'forward' ? -15 : 15,
              }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
                rotateX: zoomDirection === 'forward' ? 20 : -20,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Left Identity Column */}
              <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl">
                <div className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-[#00d4ff] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-ping" />
                  <span>ENTRY_COORDINATE // LEVEL_01</span>
                </div>

                <h1
                  className="text-4xl sm:text-6xl lg:text-7xl font-black font-mono leading-none tracking-tight mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 20%, #00d4ff 55%, #bd93f9 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 35px rgba(0,212,255,0.4))',
                  }}
                >
                  HARISH SABARI
                </h1>

                <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-[0.25em] text-[#bd93f9] mb-4">
                  P V
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 font-sans">
                  B.Tech Artificial Intelligence &amp; Machine Learning at Kongu Engineering College.
                  Specializing in computer vision pipelines, autonomous AI workflows, and modern full-stack architectures.
                </p>

                {/* Primary Focal Zoom Object Call-to-Action */}
                <div className="p-1 rounded-sm border border-[#00d4ff]/40 bg-[#00d4ff]/10 backdrop-blur-md">
                  <button
                    onClick={zoomIn}
                    className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-[#030611] font-mono font-bold text-xs sm:text-sm tracking-widest rounded-sm hover:shadow-[0_0_30px_#00d4ff] transition-all cursor-pointer group"
                    data-interactive="true"
                  >
                    <Sparkles size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                    <span>[ CLICK CORE TO ZOOM IN: ABOUT ME ]</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">→</span>
                  </button>
                </div>
              </div>

              {/* Right: 3D Quantum Nexus Core (Clickable portal to zoom in) */}
              <div
                onClick={zoomIn}
                className="flex-1 w-full max-w-[340px] sm:max-w-[440px] aspect-square relative cursor-pointer group"
                data-interactive="true"
              >
                <QuantumNexus3D />
                {/* Floating portal prompt */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-[#030611]/90 border border-[#00d4ff] text-[#00d4ff] font-mono text-xs rounded-sm shadow-[0_0_20px_#00d4ff] backdrop-blur-md">
                    DIVE INTO NEURAL CORE ➔
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 1: NEURAL BIO // ABOUT HARISH & ACADEMIC NODE
              ============================================================== */}
          {currentLayer === 1 && (
            <motion.div
              key="layer-1"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_02 // NEURAL CORTEX
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; ABOUT.HARISH_SABARI
                </h2>
              </div>

              {/* Bio Card */}
              <div className="w-full p-6 sm:p-8 border border-[#00d4ff]/30 bg-[#070e22]/90 backdrop-blur-xl rounded-sm shadow-[0_0_40px_rgba(0,212,255,0.15)] relative mb-8">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  I am a pre-final year B.Tech student majoring in Artificial Intelligence &amp; Data Science at{' '}
                  <span className="text-[#00d4ff] font-bold">Kongu Engineering College</span> (2023–2027), Tamil Nadu.
                  Passionate about engineering autonomous agents, computer vision platforms, and robust enterprise applications.
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/80 text-center font-mono">
                  <div className="p-3 bg-background/50 border border-border rounded-sm">
                    <div className="text-2xl font-bold text-[#00d4ff]">4+</div>
                    <div className="text-[10px] text-muted-foreground">TOP PROJECTS</div>
                  </div>
                  <div className="p-3 bg-background/50 border border-border rounded-sm">
                    <div className="text-2xl font-bold text-[#bd93f9]">2</div>
                    <div className="text-[10px] text-muted-foreground">ORACLE CERTS</div>
                  </div>
                  <div className="p-3 bg-background/50 border border-border rounded-sm">
                    <div className="text-2xl font-bold text-[#00d4ff]">3</div>
                    <div className="text-[10px] text-muted-foreground">LANGUAGES</div>
                  </div>
                  <div className="p-3 bg-background/50 border border-border rounded-sm">
                    <div className="text-2xl font-bold text-[#4d94ff]">6.0</div>
                    <div className="text-[10px] text-muted-foreground">CGPA</div>
                  </div>
                </div>
              </div>

              {/* Focal Nested Object: Cyber Silicon Microprocessor */}
              <div
                onClick={zoomIn}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-[#00d4ff] bg-[#071529] flex items-center justify-center shadow-[0_0_30px_#00d4ff] group-hover:scale-110 group-hover:shadow-[0_0_50px_#00d4ff] transition-all">
                  <div className="w-10 h-10 border border-[#bd93f9] rounded-lg flex items-center justify-center animate-pulse">
                    <span className="font-mono text-xs font-bold text-[#00d4ff]">AI/ML</span>
                  </div>
                </div>
                <div className="mt-3 px-4 py-1.5 bg-[#030611]/90 border border-[#00d4ff]/60 rounded-full font-mono text-xs text-[#00d4ff] shadow-[0_0_15px_#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-[#030611] transition-all">
                  [ CLICK CHIP TO ZOOM: SKILL MATRIX ] ➔
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 2: SKILL MATRIX // TECH STACK CONSTELLATION
              ============================================================== */}
          {currentLayer === 2 && (
            <motion.div
              key="layer-2"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_03 // SILICON CHIP ARCHITECTURE
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; SKILL.MATRIX
                </h2>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-8">
                {SKILL_GROUPS.map((group, idx) => (
                  <TiltCard3D key={idx} maxTilt={10} glareOpacity={0.2}>
                    <div className="p-5 border border-[#00d4ff]/25 bg-[#070e22]/90 rounded-sm backdrop-blur-md h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3 text-sm font-mono font-bold text-[#00d4ff]">
                          <span>{group.icon}</span>
                          <span>{group.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((item, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-[#030611] border border-border/80 text-foreground/85"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>

              {/* Focal Nested Object: Radiant Data Hologram Crystal */}
              <div
                onClick={zoomIn}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 border-[#bd93f9] bg-[#0c102a] flex items-center justify-center shadow-[0_0_30px_#bd93f9] group-hover:scale-110 group-hover:shadow-[0_0_50px_#bd93f9] transition-all rotate-45">
                  <div className="w-9 h-9 border border-[#00d4ff] rounded-md animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="mt-4 px-4 py-1.5 bg-[#030611]/90 border border-[#bd93f9]/60 rounded-full font-mono text-xs text-[#bd93f9] shadow-[0_0_15px_#bd93f9] group-hover:bg-[#bd93f9] group-hover:text-[#030611] transition-all">
                  [ CLICK CRYSTAL TO ZOOM: PROJECTS ] ➔
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 3: PROJECT ARCHIVE // DEPLOYED SYSTEMS
              ============================================================== */}
          {currentLayer === 3 && (
            <motion.div
              key="layer-3"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_04 // DATA CRYSTAL ARCHIVE
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; PROJECT.PORTALS
                </h2>
              </div>

              {/* Projects 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
                {PROJECTS.map((proj, idx) => (
                  <TiltCard3D key={idx} maxTilt={12} glareOpacity={0.25}>
                    <div className="p-5 border border-[#00d4ff]/25 bg-[#070e22]/90 rounded-sm backdrop-blur-md h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-2 py-0.5 rounded-sm">
                            {proj.category}
                          </span>
                          {proj.github && (
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-[#00d4ff] transition-colors"
                              data-interactive="true"
                            >
                              <Github size={15} />
                            </a>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-mono font-bold text-foreground mb-2">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                          {proj.desc}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/60">
                        {proj.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 bg-background border border-border/80 text-foreground/80 rounded-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>

              {/* Focal Nested Object: Spinning Chrono-Beacon */}
              <div
                onClick={zoomIn}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-[#00d4ff] bg-[#06142a] flex items-center justify-center shadow-[0_0_30px_#00d4ff] group-hover:scale-110 group-hover:shadow-[0_0_50px_#00d4ff] transition-all">
                  <div className="w-8 h-8 rounded-full border border-dashed border-[#00ffff] animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="mt-3 px-4 py-1.5 bg-[#030611]/90 border border-[#00d4ff]/60 rounded-full font-mono text-xs text-[#00d4ff] shadow-[0_0_15px_#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-[#030611] transition-all">
                  [ CLICK BEACON TO ZOOM: EXPERIENCE ] ➔
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 4: EXPERIENCE LOG // TIMELINE CHRONOLOGY
              ============================================================== */}
          {currentLayer === 4 && (
            <motion.div
              key="layer-4"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_05 // CHRONO BEACON TIMELINE
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; EXPERIENCE.LOG
                </h2>
              </div>

              {/* Timeline Cards */}
              <div className="w-full space-y-3.5 mb-8">
                {EXPERIENCES.map((exp, idx) => (
                  <TiltCard3D key={idx} maxTilt={8} glareOpacity={0.15}>
                    <div className="p-5 border border-[#00d4ff]/25 bg-[#070e22]/90 rounded-sm backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30">
                            {exp.tag}
                          </span>
                          <h3 className="text-sm sm:text-base font-mono font-bold text-foreground">
                            {exp.title}
                          </h3>
                        </div>
                        <div className="text-xs font-mono text-[#bd93f9] mb-1">
                          @ {exp.org}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {exp.desc}
                        </p>
                      </div>

                      <div className="text-xs font-mono text-[#00d4ff] shrink-0 self-start sm:self-auto bg-[#00d4ff]/5 px-2.5 py-1 border border-[#00d4ff]/20 rounded-sm">
                        {exp.period}
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>

              {/* Focal Nested Object: Luminous Oracle Gold Crest */}
              <div
                onClick={zoomIn}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-[#eab308] bg-[#1a1505] flex items-center justify-center shadow-[0_0_30px_#eab308] group-hover:scale-110 group-hover:shadow-[0_0_50px_#eab308] transition-all">
                  <Award size={30} className="text-[#eab308]" />
                </div>
                <div className="mt-3 px-4 py-1.5 bg-[#030611]/90 border border-[#eab308]/60 rounded-full font-mono text-xs text-[#eab308] shadow-[0_0_15px_#eab308] group-hover:bg-[#eab308] group-hover:text-[#030611] transition-all">
                  [ CLICK CREST TO ZOOM: CERTIFICATIONS ] ➔
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 5: ORACLE VAULT // ACCREDITATIONS
              ============================================================== */}
          {currentLayer === 5 && (
            <motion.div
              key="layer-5"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_06 // ORACLE VAULT
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; CERT.VAULT
                </h2>
              </div>

              {/* Certifications 2 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mb-8">
                {CERTS.map((cert, idx) => (
                  <TiltCard3D key={idx} maxTilt={14} glareOpacity={0.25}>
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-6 border border-[#00d4ff]/30 bg-[#070e22]/90 rounded-sm backdrop-blur-md block group hover:border-[#00d4ff] transition-all"
                      data-interactive="true"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2.5 py-0.5 border border-green-500/40 rounded-sm flex items-center gap-1">
                          <CheckCircle2 size={11} /> VERIFIED
                        </span>
                        <span className="text-xs font-mono text-[#00d4ff]">{cert.badge}</span>
                      </div>
                      <h3 className="text-lg font-mono font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-xs font-mono text-muted-foreground mb-4">
                        {cert.issuer} (Exam: {cert.code})
                      </p>
                      <div className="flex items-center gap-1 text-xs font-mono text-[#00d4ff]">
                        <ExternalLink size={13} />
                        <span>VIEW CREDENTIAL ON DRIVE</span>
                      </div>
                    </a>
                  </TiltCard3D>
                ))}
              </div>

              {/* Focal Nested Object: Quantum Comm Transmitter */}
              <div
                onClick={zoomIn}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full border-2 border-[#00d4ff] bg-[#051428] flex items-center justify-center shadow-[0_0_30px_#00d4ff] group-hover:scale-110 group-hover:shadow-[0_0_50px_#00d4ff] transition-all">
                  <Send size={26} className="text-[#00d4ff] -rotate-45" />
                </div>
                <div className="mt-3 px-4 py-1.5 bg-[#030611]/90 border border-[#00d4ff]/60 rounded-full font-mono text-xs text-[#00d4ff] shadow-[0_0_15px_#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-[#030611] transition-all">
                  [ CLICK TRANSMITTER TO ZOOM: CONTACT &amp; HIRE ] ➔
                </div>
              </div>
            </motion.div>
          )}

          {/* ==============================================================
              LAYER 6: CONTACT UPLINK // FINAL DESTINATION
              ============================================================== */}
          {currentLayer === 6 && (
            <motion.div
              key="layer-6"
              initial={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 0.25 : 3,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: zoomDirection === 'forward' ? 3.5 : 0.2,
              }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl px-4 sm:px-6 relative z-10 flex flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="text-center mb-6">
                <div className="font-mono text-xs text-[#00d4ff] tracking-[0.3em] mb-1">
                  DIMENSION_07 // FINAL TRANSMISSION UPLINK
                </div>
                <h2 className="text-2xl sm:text-4xl font-mono font-bold text-foreground">
                  &gt; CONNECT.PROTOCOL
                </h2>
              </div>

              {/* Direct Channels & Form Container */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mb-8">
                {/* Left quick channels */}
                <div className="md:col-span-5 space-y-3">
                  <a
                    href="https://mail.google.com/mail/?view=cm&to=harish23alr@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 bg-[#070e22]/90 border border-[#00d4ff]/30 rounded-sm flex items-center gap-3 hover:border-[#00d4ff] transition-all block group"
                    data-interactive="true"
                  >
                    <Mail size={18} className="text-[#00d4ff]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-muted-foreground">EMAIL</div>
                      <div className="text-xs font-mono text-white group-hover:text-[#00d4ff] truncate">
                        harish23alr@gmail.com
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com/in/harish-sabari-130hssh/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 bg-[#070e22]/90 border border-[#00d4ff]/30 rounded-sm flex items-center gap-3 hover:border-[#00d4ff] transition-all block group"
                    data-interactive="true"
                  >
                    <Linkedin size={18} className="text-[#00d4ff]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-muted-foreground">LINKEDIN</div>
                      <div className="text-xs font-mono text-white group-hover:text-[#00d4ff] truncate">
                        harish-sabari-130hssh
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://github.com/Harish-sabari-130"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 bg-[#070e22]/90 border border-[#00d4ff]/30 rounded-sm flex items-center gap-3 hover:border-[#00d4ff] transition-all block group"
                    data-interactive="true"
                  >
                    <Github size={18} className="text-[#00d4ff]" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-muted-foreground">GITHUB</div>
                      <div className="text-xs font-mono text-white group-hover:text-[#00d4ff] truncate">
                        Harish-sabari-130
                      </div>
                    </div>
                  </a>

                  <div className="p-3.5 bg-[#070e22]/90 border border-border rounded-sm flex items-center gap-3">
                    <MapPin size={18} className="text-muted-foreground" />
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground">LOCATION</div>
                      <div className="text-xs font-mono text-white">Kongu Engg, Tamil Nadu, India</div>
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="md:col-span-7 bg-[#070e22]/90 border border-[#00d4ff]/30 p-5 rounded-sm backdrop-blur-md">
                  {contactStatus === 'success' ? (
                    <div className="py-8 text-center flex flex-col items-center">
                      <CheckCircle2 size={36} className="text-green-400 mb-2" />
                      <div className="text-base font-mono font-bold text-green-400">
                        TRANSMISSION DELIVERED
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Thank you! Harish Sabari will review your transmission and reply.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono text-muted-foreground">NAME</label>
                        <input
                          required
                          type="text"
                          value={contactData.name}
                          onChange={e => setContactData({ ...contactData, name: e.target.value })}
                          className="w-full bg-[#030611] border border-border focus:border-[#00d4ff] outline-none px-3 py-2 text-xs text-white rounded-sm"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-muted-foreground">EMAIL</label>
                        <input
                          required
                          type="email"
                          value={contactData.email}
                          onChange={e => setContactData({ ...contactData, email: e.target.value })}
                          className="w-full bg-[#030611] border border-border focus:border-[#00d4ff] outline-none px-3 py-2 text-xs text-white rounded-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-muted-foreground">MESSAGE</label>
                        <textarea
                          required
                          rows={3}
                          value={contactData.message}
                          onChange={e => setContactData({ ...contactData, message: e.target.value })}
                          className="w-full bg-[#030611] border border-border focus:border-[#00d4ff] outline-none px-3 py-2 text-xs text-white rounded-sm resize-none"
                          placeholder="Project collaboration, hiring inquiry, or note..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={contactStatus === 'loading'}
                        className="w-full py-2.5 font-mono text-xs font-bold tracking-widest text-[#030611] bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-sm hover:opacity-95 transition-opacity cursor-pointer shadow-[0_0_15px_#00d4ff]"
                        data-interactive="true"
                      >
                        {contactStatus === 'loading' ? 'TRANSMITTING...' : '[ DISPATCH MESSAGE ]'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* End of Journey: Continuous Infinite Loop Rewind Button */}
              <div
                onClick={() => zoomTo(0)}
                className="group relative cursor-pointer flex flex-col items-center"
                data-interactive="true"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#00d4ff] bg-[#071328] flex items-center justify-center shadow-[0_0_30px_#00d4ff] group-hover:scale-110 group-hover:shadow-[0_0_50px_#00d4ff] transition-all">
                  <RotateCcw size={24} className="text-[#00d4ff] group-hover:-rotate-180 transition-transform duration-700" />
                </div>
                <div className="mt-3 px-5 py-2 bg-[#030611]/90 border border-[#00d4ff] rounded-full font-mono text-xs font-bold text-[#00d4ff] shadow-[0_0_20px_#00d4ff] group-hover:bg-[#00d4ff] group-hover:text-[#030611] transition-all">
                  [ 🔄 REVERSE WARP: ZOOM BACK TO COSMIC ORIGIN ]
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM HUD CONTROLLER: Zoom Controls & Depth Radar ── */}
      <footer className="fixed bottom-0 inset-x-0 h-16 z-40 px-4 sm:px-8 flex items-center justify-between border-t border-[#00d4ff]/20 bg-[#030611]/90 backdrop-blur-xl font-mono text-xs">
        {/* Left Zoom Out Button */}
        <button
          onClick={zoomOut}
          disabled={currentLayer === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00d4ff]/40 bg-[#00d4ff]/5 text-[#00d4ff] hover:bg-[#00d4ff]/20 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          data-interactive="true"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">ZOOM OUT</span>
        </button>

        {/* Center Depth Gauge Radar */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[#00d4ff] text-[11px] font-bold tracking-widest">
            <Compass size={13} className="animate-spin" style={{ animationDuration: '10s' }} />
            <span>
              DEPTH: LAYER 0{currentLayer + 1}/0{LAYERS.length} [
              {Math.round(((currentLayer + 1) / LAYERS.length) * 100)}%]
            </span>
          </div>

          <div className="w-36 sm:w-56 h-1 bg-[#071328] rounded-full overflow-hidden border border-[#00d4ff]/30">
            <div
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#bd93f9] shadow-[0_0_8px_#00d4ff] transition-all duration-500"
              style={{ width: `${((currentLayer + 1) / LAYERS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Zoom In Button */}
        <button
          onClick={zoomIn}
          disabled={currentLayer === LAYERS.length - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#00d4ff]/40 bg-[#00d4ff]/5 text-[#00d4ff] hover:bg-[#00d4ff]/20 rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          data-interactive="true"
        >
          <span className="hidden sm:inline">ZOOM IN</span>
          <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}
