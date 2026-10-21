import { useEffect, useState, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CSSParticles from './CSSParticles';
import QuantumNexus3D from './QuantumNexus3D';

const ROLES = [
  'AI / ML Student',
  'Full-Stack Developer',
  'AI Systems Builder',
];

/* ── Holographic Portrait Panel ── */
function HolographicPortrait({ mousePos }: { mousePos: { x: number; y: number } }) {
  const tiltX = mousePos.y * -14;
  const tiltY = mousePos.x * 14;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-full max-w-[240px] sm:max-w-[320px] md:max-w-[380px] mx-auto"
      style={{ perspective: '1000px' }}
    >
      {/* Outer glow halo */}
      <div
        className="absolute -inset-6 rounded-2xl pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,212,255,0.12), transparent 70%)',
        }}
      />

      {/* Portrait card */}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '3/4',
          background: 'linear-gradient(160deg, #0d1f3c 0%, #080f1e 60%, #0a0518 100%)',
          border: '1px solid rgba(0,212,255,0.3)',
          boxShadow: '0 0 50px rgba(0,212,255,0.15), inset 0 0 40px rgba(0,212,255,0.04)',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.12s ease-out',
        }}
      >
        {/* Corner brackets */}
        {[
          'top-0 left-0 border-t-2 border-l-2',
          'top-0 right-0 border-t-2 border-r-2',
          'bottom-0 left-0 border-b-2 border-l-2',
          'bottom-0 right-0 border-b-2 border-r-2',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-7 h-7 ${cls} border-[#00d4ff]`} />
        ))}

        {/* Real photo with holographic treatment */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/harish.jpg"
            alt="Harish Sabari P V"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 15%' }}
          />
          {/* Cyan holographic colour wash */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0,102,255,0.18) 0%, rgba(0,212,255,0.08) 50%, rgba(124,58,237,0.18) 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Edge rim lighting */}
          <div
            className="absolute inset-y-0 left-0 w-8"
            style={{
              background: 'linear-gradient(to right, rgba(0,212,255,0.35), transparent)',
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-8"
            style={{
              background: 'linear-gradient(to left, rgba(124,58,237,0.35), transparent)',
            }}
          />
        </div>

        {/* Scan line sweep */}
        <div
          className="absolute left-0 right-0 h-[2px] animate-scanline pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)',
            boxShadow: '0 0 8px #00d4ff',
          }}
        />

        {/* Holographic grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(5,8,22,0.92), transparent)',
          }}
        />

        {/* Identity label */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 z-10">
          <div
            className="text-xs font-mono tracking-[0.3em] font-bold"
            style={{ color: '#00d4ff', textShadow: '0 0 10px #00d4ff' }}
          >
            HARISH SABARI P V
          </div>
          <div
            className="text-[9px] font-mono tracking-widest"
            style={{ color: 'rgba(189,147,249,0.8)' }}
          >
            AI/ML · COMPUTER VISION · FULL STACK
          </div>
        </div>

        {/* Expanding rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [0.7, 1.15], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
            className="absolute w-28 h-28 rounded-full border border-[#00d4ff]"
          />
          <motion.div
            animate={{ scale: [0.7, 1.15], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 1.2, ease: 'easeOut' }}
            className="absolute w-28 h-28 rounded-full border border-[#bd93f9]"
          />
        </div>
      </motion.div>

      {/* Floating HUD chips */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute top-4 -right-2 sm:-right-4 px-2.5 py-1 font-mono text-[9px] z-10"
        style={{
          background: 'rgba(5,8,22,0.9)',
          border: '1px solid rgba(0,212,255,0.5)',
          color: '#00d4ff',
          boxShadow: '0 0 10px rgba(0,212,255,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        ◉ STATUS: ONLINE
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 1 }}
        className="absolute bottom-16 -left-3 sm:-left-6 px-2.5 py-1 font-mono text-[9px] z-10"
        style={{
          background: 'rgba(5,8,22,0.9)',
          border: '1px solid rgba(77,148,255,0.5)',
          color: '#4d94ff',
          boxShadow: '0 0 10px rgba(77,148,255,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        ◈ SKILLS: 14+
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [typedText, setTypedText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayMode, setDisplayMode] = useState<'3d' | 'portrait'>('3d');

  useEffect(() => {
    const current = ROLES[typeIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setTypedText(current.substring(0, charIndex - 1));
          setCharIndex(c => c - 1);
        }, 45);
      } else {
        setIsDeleting(false);
        setTypeIndex(i => (i + 1) % ROLES.length);
      }
    } else {
      if (charIndex < current.length) {
        timer = setTimeout(() => {
          setTypedText(current.substring(0, charIndex + 1));
          setCharIndex(c => c + 1);
        }, 85);
      } else {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      }
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typeIndex]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    setMousePos({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Cosmic Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CSSParticles />
      </div>

      {/* Cyberpunk 3D Horizon Grid Lines */}
      <div
        className="absolute inset-x-0 bottom-0 h-80 pointer-events-none opacity-25"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 212, 255, 0.05) 50%, rgba(0, 212, 255, 0.15) 100%)',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Ambient Depth Gradients */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 70% at 75% 50%, rgba(0,102,255,0.08), transparent 70%), radial-gradient(ellipse 50% 50% at 20% 30%, rgba(189,147,249,0.06), transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* ── Left Column: Bio & Terminal Header ── */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          {/* Futuristic Protocol Tag */}
          <div
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] mb-4 sm:mb-5 flex items-center justify-center lg:justify-start gap-2.5"
            style={{ color: 'rgba(0,212,255,0.8)' }}
          >
            <motion.span
              animate={{ scaleX: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="inline-block w-5 h-[1.5px]"
              style={{ background: '#00d4ff' }}
            />
            <span>SYSTEM // AI-NEXUS v3.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-[0_0_6px_#00d4ff]" />
          </div>

          {/* Harish Sabari Name */}
          <h1
            className="text-[2.2rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[4.6rem] font-black font-mono leading-none tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff 25%, #00d4ff 60%, #bd93f9 95%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 28px rgba(0,212,255,0.35))',
            }}
          >
            HARISH SABARI
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-[0.35em]"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #bd93f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              P V
            </h2>
            <div className="h-5 w-[1px] bg-[#00d4ff]/40" />
            <span className="text-[11px] font-mono tracking-widest text-[#00d4ff]/80">
              KONGU ENGG COLLEGE
            </span>
          </div>

          {/* Animated Role Terminal */}
          <div className="h-10 mb-6 flex items-center justify-center lg:justify-start gap-2">
            <span className="text-primary font-mono text-lg">&gt;</span>
            <span
              className="text-lg sm:text-2xl font-medium"
              style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {typedText}
            </span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="inline-block w-1.5 h-5 align-middle"
              style={{ background: '#00d4ff', boxShadow: '0 0 8px #00d4ff' }}
            />
          </div>

          {/* Bio Mission */}
          <p
            className="text-sm sm:text-base mb-8 max-w-xl leading-relaxed text-muted-foreground"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Engineering intelligent, high-impact software systems across machine learning, computer vision,
            and full-stack platforms. Specializing in autonomous agents, real-time object detection, and ServiceNow automations.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <motion.button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto relative px-7 py-3.5 font-mono font-bold text-xs sm:text-sm overflow-hidden group rounded-sm cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)',
                color: '#050816',
                boxShadow: '0 0 25px rgba(0,212,255,0.35)',
                letterSpacing: '0.15em',
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,212,255,0.55)' }}
              whileTap={{ scale: 0.98 }}
              data-interactive="true"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>[ VIEW PROJECTS ]</span>
                <span className="font-sans text-xs">→</span>
              </span>
            </motion.button>

            <motion.a
              href="https://drive.google.com/file/d/1-P0qkKw85lUcahaGjvQKtvyJMRBPl7HT/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto relative px-7 py-3.5 font-mono font-bold text-xs sm:text-sm overflow-hidden group transition-all text-center rounded-sm"
              style={{
                color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.4)',
                background: 'rgba(0,212,255,0.06)',
                letterSpacing: '0.15em',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{
                scale: 1.02,
                borderColor: 'rgba(0,212,255,0.9)',
                background: 'rgba(0,212,255,0.12)',
                boxShadow: '0 0 25px rgba(0,212,255,0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              data-interactive="true"
            >
              <span className="relative z-10">[ DOWNLOAD CV ]</span>
            </motion.a>
          </div>

          {/* Social Quick Launchpad */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 sm:mt-10">
            {[
              { label: 'GITHUB', href: 'https://github.com/Harish-sabari-130' },
              { label: 'LINKEDIN', href: 'https://linkedin.com/in/harish-sabari-130hssh/' },
              { label: 'GMAIL', href: 'https://mail.google.com/mail/?view=cm&to=harish23alr@gmail.com' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono tracking-widest text-muted-foreground/70 hover:text-[#00d4ff] transition-colors relative group py-1"
                data-interactive="true"
              >
                {s.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00d4ff] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* ── Right Column: Interactive 3D Quantum Nexus & Switcher ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="lg:col-span-5 flex flex-col items-center justify-center relative w-full"
        >
          {/* Futuristic Display Mode Toggle Switcher */}
          <div className="flex items-center gap-2 p-1 mb-5 bg-[#050816]/90 border border-[#00d4ff]/30 backdrop-blur-xl rounded-full z-20 shadow-[0_0_20px_rgba(0,212,255,0.1)]">
            <button
              onClick={() => setDisplayMode('3d')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all cursor-pointer ${
                displayMode === '3d'
                  ? 'bg-[#00d4ff] text-[#050816] font-bold shadow-[0_0_12px_#00d4ff]'
                  : 'text-[#00d4ff]/70 hover:text-[#00d4ff] hover:bg-[#00d4ff]/10'
              }`}
              data-interactive="true"
            >
              <span>◈</span>
              <span>3D QUANTUM CORE</span>
            </button>

            <button
              onClick={() => setDisplayMode('portrait')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all cursor-pointer ${
                displayMode === 'portrait'
                  ? 'bg-[#bd93f9] text-[#050816] font-bold shadow-[0_0_12px_#bd93f9]'
                  : 'text-[#bd93f9]/70 hover:text-[#bd93f9] hover:bg-[#bd93f9]/10'
              }`}
              data-interactive="true"
            >
              <span>◉</span>
              <span>HOLOGRAPHIC ID</span>
            </button>
          </div>

          {/* Mode Viewport Container */}
          <div className="relative w-full flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
            <AnimatePresence mode="wait">
              {displayMode === '3d' ? (
                <motion.div
                  key="3d-core"
                  initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotateY: 20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full flex items-center justify-center"
                >
                  <QuantumNexus3D />
                </motion.div>
              ) : (
                <motion.div
                  key="portrait-id"
                  initial={{ opacity: 0, scale: 0.85, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.85, rotateY: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full flex items-center justify-center"
                >
                  <HolographicPortrait mousePos={mousePos} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Futuristic Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
      >
        <span
          className="text-[9px] font-mono tracking-[0.3em]"
          style={{ color: 'rgba(0,212,255,0.6)' }}
        >
          SCROLL TO EXPLORE
        </span>
        <div
          className="w-[1.5px] h-7"
          style={{ background: 'linear-gradient(to bottom, #00d4ff, transparent)' }}
        />
      </motion.div>
    </section>
  );
}
