import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TiltCard3D from './TiltCard3D';

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1800;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = (time - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <span className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-primary drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]">
      {count}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 w-full overflow-hidden bg-background">
      {/* 3D Hex Perspective Overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00d4ff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-14">
          <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>NEURAL_PROFILE // SYSTEM_BIO</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
          >
            <span className="text-primary mr-2">&gt;</span>ABOUT.EXE
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Bio Card with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <TiltCard3D maxTilt={8} glareOpacity={0.18}>
              <div className="p-6 sm:p-8 border border-[#00d4ff]/30 bg-[#070e22]/85 backdrop-blur-md rounded-sm relative shadow-[0_0_30px_rgba(0,212,255,0.06)] group">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

                <div className="font-mono text-xs text-[#00d4ff] mb-4 flex items-center justify-between border-b border-border/80 pb-2">
                  <span>BIO_STREAM // ACTIVE_NODE</span>
                  <span className="text-muted-foreground">LOC: TAMIL NADU, INDIA</span>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  I am <span className="text-white font-medium">Harish Sabari P V</span>, a B.Tech Artificial Intelligence and Machine Learning student at <span className="text-[#00d4ff]">Kongu Engineering College</span> (2023–2027) with a deep passion for autonomous AI agents, computer vision, and scalable software platforms.
                </p>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  From building real-time YOLO object detection systems and women emergency escalation platforms to orchestrating enterprise workflows during my ServiceNow internship, I thrive at the frontier where advanced machine learning intersects with responsive, high-performance web engineering.
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60 font-mono text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/25 rounded-sm">
                    AIML_STUDENT
                  </span>
                  <span className="px-2.5 py-1 bg-[#bd93f9]/10 text-[#bd93f9] border border-[#bd93f9]/25 rounded-sm">
                    VISION_ENGINEER
                  </span>
                  <span className="px-2.5 py-1 bg-[#0066ff]/10 text-[#4d94ff] border border-[#0066ff]/25 rounded-sm">
                    SERVICENOW_DEV
                  </span>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>

          {/* Right Metrics Grid with 3D Stat Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { end: 4, suffix: '+', label: 'Projects Completed', sub: 'Production & Open Source' },
              { end: 3, suffix: '', label: 'Core Languages', sub: 'Java, Python, C' },
              { end: 2, suffix: '', label: 'Oracle Certifications', sub: 'Java SE 17 & APEX Cloud' },
              { end: 3, suffix: '+', label: 'Years Experience', sub: 'Continuous Learning' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="h-full"
              >
                <TiltCard3D maxTilt={14} glareOpacity={0.25} scaleOnHover={1.04} className="h-full">
                  <div className="h-full flex flex-col items-center justify-center p-5 sm:p-6 border border-[#00d4ff]/20 bg-[#070e22]/80 backdrop-blur-md rounded-sm hover:border-[#00d4ff] transition-all duration-300 text-center group">
                    <div style={{ transform: 'translateZ(20px)' }}>
                      <Counter end={stat.end} suffix={stat.suffix} />
                    </div>
                    <span
                      className="text-xs sm:text-sm font-mono text-muted-foreground mt-2 group-hover:text-foreground transition-colors font-semibold"
                      style={{ transform: 'translateZ(14px)' }}
                    >
                      {stat.label}
                    </span>
                    <span
                      className="text-[10px] font-mono text-muted-foreground/60 mt-1"
                      style={{ transform: 'translateZ(10px)' }}
                    >
                      {stat.sub}
                    </span>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
