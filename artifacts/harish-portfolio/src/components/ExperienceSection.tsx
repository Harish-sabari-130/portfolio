import { motion } from 'framer-motion';
import TiltCard3D from './TiltCard3D';

const experiences = [
  {
    role: "ServiceNow Developer Intern",
    company: "ServiceNow",
    period: "Jan 2026 – Apr 2026",
    type: "work",
    tag: "INTERNSHIP",
    points: [
      "Completed hands-on enterprise training across ServiceNow platform architecture, ITSM workflows, Flow Designer, App Engine Studio, and UI Builder.",
      "Engineered automated low-code solutions and scripted business rules with AI-driven workflow optimisations.",
      "Developed custom applications utilizing Service Portal and App Engine Studio for streamlined enterprise request cycles.",
    ],
  },
  {
    role: "Freelance Web Developer",
    company: "Independent Client Project",
    period: "2025 – Present",
    type: "work",
    tag: "PRODUCTION",
    points: [
      "Delivered full-cycle web development: technical requirement gathering, responsive UI/UX architecture, and production cloud deployment.",
      "Managed client relationship directly, ensuring fast loading speeds, SEO optimization, and responsive design across all devices.",
      "Live production website: firstinalltime.in",
    ],
    link: "https://firstinalltime.in/",
  },
  {
    role: "B.Tech – Artificial Intelligence & Machine Learning",
    company: "Kongu Engineering College",
    period: "2023 – 2027",
    type: "education",
    tag: "UNDERGRADUATE",
    points: [
      "Specialization in Artificial Intelligence, Deep Neural Networks, and Machine Learning Systems.",
      "Current CGPA: 6.0 | Location: Perundurai, Erode, Tamil Nadu.",
      "Relevant Coursework: Machine Learning, Deep Learning, Computer Vision, Data Structures & Algorithms, Database Management.",
    ],
  },
  {
    role: "Higher Secondary Certificate (HSC)",
    company: "AKV Matric Higher Secondary School",
    period: "2022 – 2023",
    type: "education",
    tag: "HSC // 86%",
    points: [
      "Secured 86% in Higher Secondary Board Examination.",
      "Core focus on Mathematics, Computer Science, and Physics.",
      "Location: Namakkal, Tamil Nadu.",
    ],
  },
  {
    role: "Secondary School Leaving Certificate (SSLC)",
    company: "AKV Matric Higher Secondary School",
    period: "2020 – 2021",
    type: "education",
    tag: "SSLC",
    points: [
      "Completed Secondary School Examination with full qualification.",
      "Location: Namakkal, Tamil Nadu.",
    ],
  },
];

export default function ExperienceSection() {
  const work = experiences.filter(e => e.type === 'work');
  const edu = experiences.filter(e => e.type === 'education');

  const TimelineList = ({ items }: { items: typeof experiences }) => (
    <div className="relative border-l-2 border-[#00d4ff]/30 ml-3 sm:ml-6 space-y-10">
      {items.map((exp, i) => (
        <motion.div
          key={exp.role}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          className="relative pl-7 sm:pl-10"
        >
          {/* Animated 3D Node Dot */}
          <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-[#050816] border-2 border-[#00d4ff] flex items-center justify-center shadow-[0_0_12px_#00d4ff]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-ping" />
          </div>

          <TiltCard3D maxTilt={8} glareOpacity={0.2} scaleOnHover={1.01}>
            <div className="p-6 border border-[#00d4ff]/20 bg-[#070e22]/85 backdrop-blur-md rounded-sm hover:border-[#00d4ff]/60 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/25 mr-2">
                    {exp.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-foreground group-hover:text-primary transition-colors inline">
                    {exp.role}
                  </h3>
                </div>
                <span className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 border border-accent/20 shrink-0 self-start sm:self-auto rounded-sm">
                  {exp.period}
                </span>
              </div>

              <div className="text-muted-foreground font-mono text-xs mb-4 text-[#bd93f9]">
                @ {exp.company}
              </div>

              <ul className="space-y-2 text-muted-foreground text-xs sm:text-sm">
                {exp.points.map((point, j) => (
                  <li key={j} className="flex gap-2 leading-relaxed">
                    <span className="text-primary mt-1 shrink-0 text-xs">▹</span>
                    <span>
                      {exp.link && point.includes('firstinalltime') ? (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline hover:text-white transition-colors"
                          data-interactive="true"
                        >
                          {point}
                        </a>
                      ) : (
                        point
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard3D>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="experience" className="py-24 relative bg-[#070b18] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16">
          <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>CAREER_TRACK // LOGBOOK</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
          >
            <span className="text-primary mr-2">&gt;</span>EXPERIENCE.LOG
          </motion.h2>
        </div>

        {/* Work Experience */}
        <div className="mb-16">
          <h3 className="text-xs font-mono tracking-[0.3em] mb-8 text-[#00d4ff] flex items-center gap-2">
            <span>◈ PROFESSIONAL EXPERIENCE</span>
            <span className="h-[1px] flex-1 bg-[#00d4ff]/20" />
          </h3>
          <TimelineList items={work} />
        </div>

        {/* Academic Journey */}
        <div>
          <h3 className="text-xs font-mono tracking-[0.3em] mb-8 text-[#bd93f9] flex items-center gap-2">
            <span>◈ ACADEMIC TIMELINE</span>
            <span className="h-[1px] flex-1 bg-[#bd93f9]/20" />
          </h3>
          <TimelineList items={edu} />
        </div>
      </div>
    </section>
  );
}
