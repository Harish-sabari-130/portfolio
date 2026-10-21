import { motion } from 'framer-motion';
import { Award, ExternalLink, CheckCircle } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const certs = [
  {
    name: "Java SE 17 Developer",
    issuer: "Oracle Certified Professional",
    badge: "ORACLE",
    code: "1Z0-819",
    skills: ["Object-Oriented Programming", "Concurreny & Streams", "Java Core Architecture"],
    link: "https://drive.google.com/file/d/1sGN4JfGIa7o5Ht5HBEvtdwE9UDlIUuOf/view?usp=sharing"
  },
  {
    name: "Oracle APEX Cloud Developer",
    issuer: "Oracle Certified Associate",
    badge: "ORACLE",
    code: "1Z0-770",
    skills: ["Cloud Applications", "Database Workflows", "Enterprise Rapid Dev"],
    link: "https://drive.google.com/file/d/1-KYNSlqkpGiy8lzYfuytkZbMpY7euilz/view?usp=sharing"
  }
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-24 relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>ACCREDITATION // VERIFIED_CREDENTIALS</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
            >
              <span className="text-primary mr-2">&gt;</span>CERT.VAULT
            </motion.h2>
          </div>

          <p className="font-mono text-xs text-muted-foreground/80 max-w-sm">
            INDUSTRY-CERTIFIED PROFICIENCY IN ENTERPRISE JAVA ECOSYSTEMS AND ORACLE CLOUD ARCHITECTURES
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="h-full"
            >
              <TiltCard3D maxTilt={14} glareOpacity={0.28} scaleOnHover={1.03} className="h-full">
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="h-full p-6 sm:p-8 bg-[#070e22]/90 border border-[#00d4ff]/25 backdrop-blur-md rounded-sm hover:border-[#00d4ff] transition-all duration-300 flex flex-col justify-between group block relative overflow-hidden"
                  data-interactive="true"
                >
                  {/* Holographic corner brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00d4ff]" />

                  {/* Top Bar Accent Glow */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header: Verified Tag & Exam Code */}
                    <div
                      className="flex items-center justify-between mb-5 font-mono text-xs"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 border border-green-500/50 text-green-400 bg-green-500/10 text-[10px] rounded-sm">
                        <CheckCircle size={11} />
                        <span>VERIFIED_CREDENTIAL</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/80">
                        EXAM: {cert.code}
                      </span>
                    </div>

                    {/* Award Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center rounded-sm text-[#00d4ff] group-hover:scale-110 group-hover:shadow-[0_0_15px_#00d4ff] transition-all shrink-0"
                        style={{ transform: 'translateZ(25px)' }}
                      >
                        <Award size={24} />
                      </div>

                      <div style={{ transform: 'translateZ(24px)' }}>
                        <h3 className="text-lg sm:text-xl font-mono font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {cert.name}
                        </h3>
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div
                      className="flex flex-wrap gap-1.5 mt-4 mb-5"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      {cert.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-0.5 bg-background/50 border border-border/80 text-foreground/75 rounded-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer view certificate prompt */}
                  <div
                    className="flex items-center justify-between pt-4 border-t border-border/60 font-mono text-xs"
                    style={{ transform: 'translateZ(26px)' }}
                  >
                    <span className="flex items-center gap-1.5 text-[#00d4ff] text-[11px] group-hover:underline">
                      <ExternalLink size={12} />
                      <span>VIEW OFFICIAL CERTIFICATE</span>
                    </span>
                    <span className="text-[10px] tracking-widest text-[#bd93f9]/70">
                      {cert.badge}
                    </span>
                  </div>
                </a>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
