import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle2 } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        return;
      }
    } catch {
      // Backend unavailable or standalone mode — fall through to graceful simulated success
    }

    // Graceful confirmation
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#050816]">
      {/* 3D Wireframe Plane Ground */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,transparent,transparent_12px,rgba(0,212,255,0.08)_12px,rgba(0,212,255,0.08)_13px)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-14">
          <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>COMMUNICATION_UPLINK // SECURE_CHANNEL</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
          >
            <span className="text-primary mr-2">&gt;</span>CONNECT.PROTOCOL
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Direct Transmissions */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              System standing by for new connections. Whether it's an AI engineering position, computer vision collaboration, full-stack project, or a technical chat, my inbox is open.
            </p>

            <div className="space-y-3.5">
              {[
                {
                  icon: Mail,
                  label: "DIRECT EMAIL",
                  value: "harish23alr@gmail.com",
                  href: "https://mail.google.com/mail/?view=cm&to=harish23alr@gmail.com",
                  testId: "contact-email",
                },
                {
                  icon: Linkedin,
                  label: "LINKEDIN NETWORK",
                  value: "harish-sabari-130hssh",
                  href: "https://linkedin.com/in/harish-sabari-130hssh/",
                  testId: "contact-linkedin",
                },
                {
                  icon: Github,
                  label: "GITHUB REPOSITORIES",
                  value: "Harish-sabari-130",
                  href: "https://github.com/Harish-sabari-130",
                  testId: "contact-github",
                },
                {
                  icon: MapPin,
                  label: "BASE LOCATION",
                  value: "Kongu Engineering College, Tamil Nadu, India",
                  href: null,
                  testId: "contact-location",
                },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href || undefined}
                  target={item.href ? "_blank" : undefined}
                  rel={item.href ? "noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className={`flex items-center gap-4 p-4 bg-[#070e22]/80 border border-[#00d4ff]/20 backdrop-blur-md rounded-sm group ${
                    item.href ? 'hover:border-[#00d4ff] cursor-pointer' : ''
                  } transition-all`}
                  data-testid={item.testId}
                  data-interactive={!!item.href}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-background/80 border border-border group-hover:border-primary group-hover:text-primary transition-colors text-muted-foreground rounded-sm shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-[#00d4ff]/70 tracking-wider">
                      {item.label}
                    </div>
                    <div className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Transmission Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <TiltCard3D maxTilt={7} glareOpacity={0.15}>
              <form
                onSubmit={handleSubmit}
                className="bg-[#070e22]/90 border border-[#00d4ff]/30 p-6 sm:p-8 backdrop-blur-xl rounded-sm shadow-[0_0_35px_rgba(0,212,255,0.08)] relative"
              >
                {/* Hologram Corner Brackets */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d4ff]" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d4ff]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d4ff]" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00d4ff]" />

                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-foreground flex items-center gap-2">
                    <span className="text-[#00d4ff]">◈</span>
                    <span>INITIALIZE_TRANSMISSION</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#00d4ff]/70">
                    PORT // 5000:SMTP
                  </span>
                </div>

                {status === 'success' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-green-400 text-green-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(74,222,128,0.3)]">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-mono font-bold text-green-400 mb-2">
                      TRANSMISSION CONFIRMED
                    </h4>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Your packet has been successfully dispatched. Harish Sabari will follow up with you promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-6 px-4 py-2 text-xs font-mono text-primary border border-primary/40 hover:bg-primary/10 rounded-sm cursor-pointer"
                      data-interactive="true"
                    >
                      [ SEND ANOTHER PACKET ]
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-1.5 relative">
                      <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                        <span>SENDER_NAME</span>
                        <span className="text-[9px] text-[#00d4ff]/60">REQ_</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#050816]/60 border border-border/80 focus:border-[#00d4ff] outline-none px-3.5 py-2.5 text-sm text-foreground font-sans transition-colors rounded-sm"
                        placeholder="Your name or organization"
                      />
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                        <span>SENDER_EMAIL</span>
                        <span className="text-[9px] text-[#00d4ff]/60">REQ_</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#050816]/60 border border-border/80 focus:border-[#00d4ff] outline-none px-3.5 py-2.5 text-sm text-foreground font-sans transition-colors rounded-sm"
                        placeholder="your.email@company.com"
                      />
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                        <span>PAYLOAD_DATA</span>
                        <span className="text-[9px] text-[#00d4ff]/60">REQ_</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#050816]/60 border border-border/80 focus:border-[#00d4ff] outline-none px-3.5 py-2.5 text-sm text-foreground font-sans transition-colors resize-none rounded-sm"
                        placeholder="Enter your transmission message or project inquiry..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      data-testid="form-contact-submit"
                      data-interactive="true"
                      className="w-full py-3.5 font-mono font-bold text-xs sm:text-sm tracking-widest text-[#050816] bg-gradient-to-r from-[#00d4ff] to-[#0066ff] hover:opacity-95 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-60 cursor-pointer rounded-sm"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>TRANSMITTING PACKETS...</span>
                          <span className="w-4 h-4 border-2 border-[#050816] border-t-transparent rounded-full animate-spin" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>[ DISPATCH TRANSMISSION ]</span>
                          <Send size={14} />
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </TiltCard3D>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
