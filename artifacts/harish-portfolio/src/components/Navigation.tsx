import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'HOME', id: 'hero' },
  { name: 'ABOUT', id: 'about' },
  { name: 'SKILLS', id: 'skills' },
  { name: 'PROJECTS', id: 'projects' },
  { name: 'EXPERIENCE', id: 'experience' },
  { name: 'CERTIFICATIONS', id: 'certifications' },
  { name: 'CONTACT', id: 'contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeRef = useRef('hero');

  /* ── Scroll-based background blur & border ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Intersection Observer for Active Section ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            activeRef.current = id;
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-[rgba(5,8,22,0.92)] backdrop-blur-2xl border-b border-[rgba(0,212,255,0.2)] shadow-[0_4px_30px_rgba(0,212,255,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo Mark */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2.5 group cursor-pointer"
          data-interactive="true"
          aria-label="Back to top"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-500 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.9)]"
            >
              {/* Outer hexagon */}
              <path
                d="M18 2 L32 10 L32 26 L18 34 L4 26 L4 10 Z"
                stroke="#00d4ff"
                strokeWidth="1.2"
                fill="none"
                strokeOpacity="0.7"
              />
              {/* Inner hexagon */}
              <path
                d="M18 7 L28 13 L28 23 L18 29 L8 23 L8 13 Z"
                stroke="#bd93f9"
                strokeWidth="0.8"
                fill="none"
                strokeOpacity="0.4"
              />
              {/* H letter */}
              <line x1="13" y1="13" x2="13" y2="23" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
              <line x1="23" y1="13" x2="23" y2="23" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
              <line x1="13" y1="18" x2="23" y2="18" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col leading-none text-left">
            <span
              className="text-[12px] font-mono font-bold tracking-[0.2em]"
              style={{ color: '#00d4ff', textShadow: '0 0 8px rgba(0,212,255,0.5)' }}
            >
              HARISH
            </span>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#bd93f9]/80">
              SABARI
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="relative px-3 py-2 text-[11px] font-mono tracking-[0.16em] transition-colors duration-200 cursor-pointer"
                style={{
                  color: isActive ? '#00d4ff' : 'rgba(255,255,255,0.6)',
                  textShadow: isActive ? '0 0 10px rgba(0,212,255,0.8)' : 'none',
                }}
                data-interactive="true"
              >
                {link.name}

                {/* Active Underline Pill */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
                      boxShadow: '0 0 10px #00d4ff',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}

          {/* Quick Contact CTA */}
          <button
            onClick={() => scrollTo('contact')}
            className="ml-3 px-4 py-2 text-[11px] font-mono tracking-widest border border-[#00d4ff]/40 bg-[#00d4ff]/8 text-[#00d4ff] hover:bg-[#00d4ff]/20 hover:border-[#00d4ff] hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-all cursor-pointer rounded-sm"
            data-interactive="true"
          >
            CONNECT_
          </button>
        </div>

        {/* Mobile Menu Hamburger Button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 border border-[#00d4ff]/30 bg-[#00d4ff]/5 rounded-sm cursor-pointer"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle navigation menu"
          data-interactive="true"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span
              className={`block h-0.5 w-full bg-[#00d4ff] transition-all duration-300 origin-left ${
                mobileOpen ? 'rotate-45 translate-x-0.5' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-[#00d4ff] transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-[#00d4ff] transition-all duration-300 origin-left ${
                mobileOpen ? '-rotate-45 translate-x-0.5' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden px-6 pt-2 pb-6 flex flex-col gap-2 border-t border-[rgba(0,212,255,0.15)] bg-[#050816]/98 backdrop-blur-2xl overflow-hidden"
          >
            {NAV_LINKS.map((link, idx) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-left py-2.5 px-3 text-xs font-mono tracking-widest transition-all rounded-sm flex items-center justify-between ${
                    isActive
                      ? 'text-[#00d4ff] bg-[#00d4ff]/10 border-l-2 border-[#00d4ff]'
                      : 'text-white/70 hover:text-[#00d4ff] hover:bg-white/5'
                  }`}
                  data-interactive="true"
                >
                  <span>{link.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">0{idx + 1}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-1 border-t border-border/60">
              <button
                onClick={() => scrollTo('contact')}
                className="w-full py-3 text-center text-xs font-mono font-bold tracking-widest bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-[#050816] rounded-sm shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                data-interactive="true"
              >
                [ INITIALIZE CONTACT ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
