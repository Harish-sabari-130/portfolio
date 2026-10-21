import { useEffect, useRef, useState } from 'react';

type CursorMode = 'default' | 'button' | '3d' | 'text';

export default function CustomCursor() {
  const [mode, setMode] = useState<CursorMode>('default');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // References for zero-latency direct hardware transforms
  const dotRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only active on desktop devices with fine pointer
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let reticleX = -100;
    let reticleY = -100;

    let isMouseDown = false;
    let currentMode: CursorMode = 'default';

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant 1:1 hardware contact for the center laser dot (ZERO LAG)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsPressed(true);

      if (currentMode === '3d') {
        setDragActive(true);
      }

      // Trigger tactile micro-shockwave pulse
      if (pulseRef.current) {
        pulseRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(0.3)`;
        pulseRef.current.classList.remove('quantum-pulse-active');
        void pulseRef.current.offsetWidth; // Force CSS reflow
        pulseRef.current.classList.add('quantum-pulse-active');
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setIsPressed(false);
      setDragActive(false);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Contextual target detection tailored to this cyber 3D portfolio
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) {
        currentMode = 'default';
        setMode('default');
        return;
      }

      // 1. Text input elements
      const isInput = Boolean(target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea');
      if (isInput) {
        currentMode = 'text';
        setMode('text');
        return;
      }

      // 2. Clickable buttons, links, tabs, chips, and interactive cards
      const isButton = Boolean(target.closest('button') || target.tagName.toLowerCase() === 'button' || target.closest('[role="button"]'));
      const isLink = Boolean(target.closest('a') || target.tagName.toLowerCase() === 'a');
      const isInteractive = Boolean(target.closest('[data-interactive="true"]') || target.closest('.cursor-pointer'));
      const isCard = Boolean(target.closest('.tilt-card') || target.closest('[data-tilt]') || target.closest('.allow-scroll'));

      if (isButton || isLink || isInteractive || isCard) {
        currentMode = 'button';
        setMode('button');
        return;
      }

      // 3. 3D WebGL Canvas or open space
      const isCanvas = Boolean(target.tagName.toLowerCase() === 'canvas' || target.closest('canvas') || target.closest('.three-canvas'));
      const isMainBg = Boolean(target.tagName.toLowerCase() === 'main' || target.id === 'root' || target.tagName.toLowerCase() === 'body');

      if (isCanvas || isMainBg) {
        currentMode = '3d';
        setMode('3d');
        return;
      }

      currentMode = 'default';
      setMode('default');
    };

    // Ultra-smooth 60/120fps physics lerp for trailing reticle
    let animId: number;
    const renderLoop = () => {
      // Dynamic lerp speed based on mode (snappier on buttons, smoother in 3D space)
      const lerp = currentMode === 'button' ? 0.28 : currentMode === 'text' ? 0.35 : 0.2;
      reticleX += (mouseX - reticleX) * lerp;
      reticleY += (mouseY - reticleY) * lerp;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticleX}px, ${reticleY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  // Don't render on mobile screens
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[999999] transition-opacity duration-200 select-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* ── 1. Tactile Click Shockwave Ring ── */}
      <div
        ref={pulseRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-cyan-400 pointer-events-none opacity-0 will-change-transform"
      />

      {/* ── 2. Quantum Optical Reticle (Smooth Trailing Halo) ── */}
      <div
        ref={reticleRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* MODE A: Button / Interactive Element (Aiming Crosshair Brackets) */}
        {mode === 'button' && (
          <div
            className={`relative flex items-center justify-center transition-all duration-200 ${
              isPressed ? 'scale-90' : 'scale-100'
            }`}
          >
            {/* Brackets Box */}
            <div className="w-11 h-11 relative rounded-lg border border-cyan-400/40 shadow-[0_0_15px_rgba(0,245,255,0.35)] transition-all">
              {/* Top-Left Corner Caliper */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
              {/* Top-Right Corner Caliper */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
              {/* Bottom-Left Corner Caliper */}
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
              {/* Bottom-Right Corner Caliper */}
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />
            </div>

            {/* Subtle Interactive Label */}
            <span className="absolute -bottom-5 text-[8px] font-mono tracking-widest text-cyan-300 bg-slate-950/90 px-1.5 py-0.2 rounded border border-cyan-400/30 whitespace-nowrap shadow-[0_0_8px_rgba(0,245,255,0.3)]">
              CLICK
            </span>
          </div>
        )}

        {/* MODE B: 3D Celestial WebGL Viewport (Orbit Telemetry Caliper) */}
        {mode === '3d' && (
          <div
            className={`relative flex items-center justify-center transition-all duration-200 ${
              dragActive ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Dashed Orbit Ring */}
            <div
              className={`w-9 h-9 rounded-full border border-dashed transition-all ${
                dragActive
                  ? 'border-cyan-300 animate-spin shadow-[0_0_16px_rgba(0,245,255,0.6)]'
                  : 'border-cyan-400/50 shadow-[0_0_8px_rgba(0,245,255,0.2)]'
              }`}
              style={{ animationDuration: dragActive ? '3s' : '8s' }}
            />

            {/* 4 Cardinal Optic Ticks */}
            <div className="absolute inset-0 flex items-center justify-between px-0.5">
              <div className="w-1 h-[1.5px] bg-cyan-300" />
              <div className="w-1 h-[1.5px] bg-cyan-300" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-0.5">
              <div className="h-1 w-[1.5px] bg-cyan-300" />
              <div className="h-1 w-[1.5px] bg-cyan-300" />
            </div>

            {/* Useful 3D Interaction Cue */}
            <span
              className={`absolute -bottom-5 text-[7.5px] font-mono tracking-wider transition-all px-1.5 py-0.2 rounded whitespace-nowrap ${
                dragActive
                  ? 'text-cyan-200 bg-cyan-950/90 border border-cyan-300 shadow-[0_0_10px_#00f5ff]'
                  : 'text-cyan-400/75 bg-slate-950/80 border border-cyan-400/25'
              }`}
            >
              {dragActive ? 'ORBITING' : 'DRAG 3D'}
            </span>
          </div>
        )}

        {/* MODE C: Text Input (Precision I-Beam Brackets) */}
        {mode === 'text' && (
          <div className="relative flex items-center justify-center">
            <div className="w-1 h-6 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f5ff] animate-pulse" />
          </div>
        )}

        {/* MODE D: Default Idle Reticle (Clean, Minimal, Non-distracting) */}
        {mode === 'default' && (
          <div
            className={`w-7 h-7 rounded-full border border-cyan-400/35 transition-all duration-150 flex items-center justify-center ${
              isPressed ? 'scale-75 border-cyan-300' : 'scale-100'
            }`}
          >
            {/* 4 subtle cardinal ticks */}
            <div className="absolute inset-0 flex items-center justify-between px-0.5">
              <div className="w-1 h-[1px] bg-cyan-400/50" />
              <div className="w-1 h-[1px] bg-cyan-400/50" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-0.5">
              <div className="h-1 w-[1px] bg-cyan-400/50" />
              <div className="h-1 w-[1px] bg-cyan-400/50" />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. The Precision Laser Core (Instant 1:1 Contact Point) ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`rounded-full transition-transform duration-100 ${
            isPressed
              ? 'w-1 h-1 bg-cyan-200 scale-75'
              : mode === 'button'
              ? 'w-2 h-2 bg-white scale-125 shadow-[0_0_8px_#ffffff,0_0_16px_#00f5ff]'
              : 'w-1.5 h-1.5 bg-white shadow-[0_0_6px_#ffffff,0_0_12px_#00f5ff]'
          }`}
        />
      </div>

      {/* Tactile shockwave animation */}
      <style>{`
        @keyframes quantumPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0.9;
            border-width: 2px;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.2);
            opacity: 0;
            border-width: 0.5px;
          }
        }
        .quantum-pulse-active {
          animation: quantumPulse 0.3s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}
