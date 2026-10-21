import { motion } from 'framer-motion';
import TiltCard3D from './TiltCard3D';

const skills = [
  {
    category: "Programming Languages",
    items: ["Java", "Python"],
    color: "border-primary",
    text: "text-primary",
    icon: "⚡",
  },
  {
    category: "Machine Learning & AI",
    items: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "OpenCV"],
    color: "border-purple-500",
    text: "text-purple-400",
    icon: "🧠",
  },
  {
    category: "Web & Backend Development",
    items: ["React", "Node.js", "Express.js", "MongoDB"],
    color: "border-primary",
    text: "text-primary",
    icon: "💻",
  },
  {
    category: "Tools & Environments",
    items: ["Git", "Google Colab", "Jupyter Notebook", "ServiceNow"],
    color: "border-accent",
    text: "text-accent",
    icon: "🛠️",
  },
  {
    category: "Areas of Interest",
    items: ["Machine Learning", "Full Stack Development"],
    color: "border-purple-500",
    text: "text-purple-400",
    icon: "🎯",
  },
  {
    category: "Evolution & Milestones",
    items: ["2023 → B.Tech AI & ML (Kongu)", "2024 → Real-Time YOLO Vision", "2025 → AI Call Intelligence", "2026 → Multi-Agent RAG & ServiceNow"],
    color: "border-accent",
    text: "text-accent",
    icon: "🚀",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120 },
  },
};

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative bg-[#050816] overflow-hidden">
      {/* 3D Grid Ambient Horizon */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,212,255,0.08)_40px,rgba(0,212,255,0.08)_41px)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>CAPABILITY_INDEX // 3D MATRIX</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
            >
              <span className="text-primary mr-2">&gt;</span>SKILL.MATRIX
            </motion.h2>
          </div>

          <p className="font-mono text-xs text-muted-foreground/80 max-w-sm">
            LAYERED ARCHITECTURE ACROSS SYSTEM LANGUAGES, DEEP LEARNING FRAMEWORKS, AND CLOUD INFRASTRUCTURE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skills.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-full"
            >
              <TiltCard3D maxTilt={10} glareOpacity={0.2} scaleOnHover={1.02} className="h-full">
                <div className="h-full p-6 sm:p-7 border border-[#00d4ff]/20 bg-[#070e20]/80 backdrop-blur-md rounded-sm hover:border-[#00d4ff]/60 transition-all duration-300 flex flex-col justify-between group">
                  {/* Card Corner Accents */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d4ff]/40 group-hover:border-[#00d4ff] transition-colors" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d4ff]/40 group-hover:border-[#00d4ff] transition-colors" />

                  <div>
                    {/* Header with 3D offset */}
                    <div
                      className="flex items-center justify-between mb-5 border-b border-border/80 pb-3"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <h3 className={`text-lg sm:text-xl font-mono font-bold ${group.text} flex items-center gap-2`}>
                        <span className="text-base">{group.icon}</span>
                        <span>{group.category}</span>
                      </h3>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        [{group.items.length}]
                      </span>
                    </div>

                    {/* Skill Pills */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-2.5 mb-2"
                      style={{ transform: 'translateZ(25px)' }}
                    >
                      {group.items.map((skill, j) => (
                        <motion.div
                          key={j}
                          variants={itemVariants}
                          className={`px-3 py-1.5 text-xs sm:text-sm font-medium border ${group.color} ${group.text} bg-[#050816]/70 rounded-sm hover:shadow-[0_0_12px_currentColor] transition-all cursor-default flex items-center gap-1.5`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                          <span>{skill}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div
                    className="mt-6 pt-3 border-t border-border/40 flex items-center justify-between font-mono text-[9px] text-muted-foreground/60"
                    style={{ transform: 'translateZ(14px)' }}
                  >
                    <span>MODULE.STATUS: VERIFIED</span>
                    <span className="text-[#00d4ff]/60 group-hover:text-[#00d4ff] transition-colors">
                      OK_
                    </span>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
