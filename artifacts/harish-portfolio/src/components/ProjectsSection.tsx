import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

const projects = [
  {
    id: '01',
    title: 'Deterministic Epistemic Arbitration in Multi-Agent RAG',
    desc: 'An AI-based clinical decision support system for resolving conflicting medical guidelines using specialized clinical, pharmacological, and literature RAG agents.',
    tags: ['Multi-Agent RAG', 'Vector DB', 'LLM', 'Ragas', 'Python'],
    github: 'https://github.com/Harish-sabari-130/DEA',
    link: 'https://github.com/Harish-sabari-130/DEA',
    category: 'Multi-Agent AI & RAG',
    features: ['Specialized RAG agents for evidence', 'Hybrid retrieval with vector DBs', 'Deterministic evidence scoring via Ragas'],
  },
  {
    id: '02',
    title: 'AI Call Intelligence',
    desc: 'An AI-powered system for automated speech-to-text audio transcription, speaker diarization, and real-time voice communication processing.',
    tags: ['Deepgram API', 'LiveKit', 'Speech-to-Text', 'Diarization', 'Python'],
    github: 'https://github.com/hariharanj-dev/AI-Call-Intelligence',
    link: 'https://github.com/hariharanj-dev/AI-Call-Intelligence',
    category: 'Audio AI & Communication',
    features: ['Deepgram API speech diarization', 'LiveKit real-time voice processing', 'Low-latency audio streaming'],
  },
  {
    id: '03',
    title: 'Real-Time Object Detection System',
    desc: 'A real-time computer vision system using YOLOv8, DeepSORT, and MiDaS for multi-object detection, spatial tracking, and depth estimation.',
    tags: ['YOLOv8', 'DeepSORT', 'MiDaS Depth', 'OpenCV', 'PyTorch'],
    github: 'https://github.com/hariharanj-dev/real-time-object-detection',
    link: 'https://github.com/hariharanj-dev/real-time-object-detection',
    category: 'Computer Vision',
    features: ['YOLOv8 real-time object detection', 'DeepSORT multi-object tracking', 'MiDaS monocular depth estimation'],
  },
  {
    id: '04',
    title: 'Safina – Women Safety Analysis',
    desc: 'A dedicated women safety application designed to provide instant emergency alerts, real-time location tracking, and multi-level emergency escalation.',
    tags: ['Safety Tech', 'Location Tracking', 'Emergency Escalation', 'Python'],
    github: 'https://github.com/Harish-sabari-130/Women-safety-application',
    link: 'https://github.com/Harish-sabari-130/Women-safety-application',
    category: 'Safety Systems & Mobile Tech',
    features: ['Instant emergency alert system', 'Real-time GPS location tracking', 'Multi-level escalation for contacts and emergency services'],
  },
  {
    id: '05',
    title: 'Nomad Visa Hub (ServiceNow RiseUp)',
    desc: 'A ServiceNow-based digital visa & immigration management portal built during the RiseUp program using Flow Designer, ITSM, and App Engine Studio.',
    tags: ['ServiceNow', 'App Engine Studio', 'Flow Designer', 'ITSM'],
    github: null,
    link: 'https://secure-access-hub--harish43135200.replit.app',
    category: 'Enterprise Automation',
    features: ['Automated ITSM workflows', 'Low-code portal with UI Builder', 'Automated visa application flow'],
  },
  {
    id: '06',
    title: 'Client Web Solution (Freelancing)',
    desc: 'A client-based website solution engineered from requirement analysis through responsive web design and live production deployment at firstinalltime.in.',
    tags: ['React', 'Web Architecture', 'Client Solution', 'Live Deploy'],
    github: null,
    link: 'https://firstinalltime.in/',
    category: 'Full Stack & Client Delivery',
    features: ['Requirement analysis & design', 'Responsive web application', 'Live production deployment'],
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 relative bg-background overflow-hidden">
      {/* Background 3D Perspective Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="font-mono text-xs text-primary tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>DEPLOYED_SYSTEMS // 3D ARCHIVE</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground glitch-text"
            >
              <span className="text-primary mr-2">&gt;</span>PROJECT.ARCHIVE
            </motion.h2>
          </div>

          <p className="font-mono text-xs text-muted-foreground/80 max-w-sm">
            HOVER &amp; MOVE CURSOR OVER CARDS TO EXPERIENCE 3D SPATIAL PERSPECTIVE AND REAL-TIME LIGHT GLARE
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="h-full"
            >
              <TiltCard3D maxTilt={14} glareOpacity={0.28} scaleOnHover={1.02} className="h-full">
                <div className="h-full p-6 sm:p-8 bg-[#070d1e]/85 border border-[#00d4ff]/25 backdrop-blur-md rounded-sm flex flex-col justify-between relative group hover:border-[#00d4ff] transition-all duration-300">
                  {/* Top Corner Brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00d4ff]" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00d4ff]" />

                  {/* Top Bar Accent Glow */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Header: Project Index & Category */}
                    <div
                      className="flex items-center justify-between mb-4 font-mono text-xs"
                      style={{ transform: 'translateZ(18px)' }}
                    >
                      <span className="text-[#00d4ff] tracking-widest font-bold">
                        [ #{project.id} ]
                      </span>
                      <span className="px-2 py-0.5 bg-[#00d4ff]/10 border border-[#00d4ff]/30 text-[#00d4ff] text-[10px] rounded-full">
                        {project.category}
                      </span>
                    </div>

                    {/* Title with 3D elevation */}
                    <h3
                      className="text-xl sm:text-2xl font-mono font-bold text-foreground mb-3 group-hover:text-primary transition-colors flex items-center gap-2"
                      style={{ transform: 'translateZ(26px)' }}
                    >
                      <span>{project.title}</span>
                    </h3>

                    {/* Description */}
                    <p
                      className="text-muted-foreground text-sm mb-5 leading-relaxed"
                      style={{ transform: 'translateZ(15px)' }}
                    >
                      {project.desc}
                    </p>

                    {/* Feature Highlights */}
                    <div
                      className="flex flex-wrap gap-2 mb-6"
                      style={{ transform: 'translateZ(22px)' }}
                    >
                      {project.features.map((f, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-sm flex items-center gap-1.5"
                          style={{
                            background: 'rgba(0,212,255,0.08)',
                            color: 'rgba(0,212,255,0.85)',
                            border: '1px solid rgba(0,212,255,0.2)',
                          }}
                        >
                          <span className="w-1 h-1 rounded-full bg-[#00d4ff]" />
                          <span>{f}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Tech Stack Tags */}
                    <div
                      className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-border/60"
                      style={{ transform: 'translateZ(16px)' }}
                    >
                      {project.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="text-[11px] font-mono px-2.5 py-1 bg-background/60 border border-border/80 text-foreground/80 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ transform: 'translateZ(28px)' }}
                    >
                      {project.github ? (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-xs font-mono text-[#00d4ff] hover:underline transition-colors"
                          data-interactive="true"
                        >
                          <Github size={15} />
                          <span>SOURCE_CODE</span>
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground/50 cursor-not-allowed">
                          <Github size={15} />
                          <span>ENTERPRISE_INTERNAL</span>
                        </span>
                      )}

                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-[#00d4ff] transition-colors"
                          data-interactive="true"
                        >
                          <span>INSPECT</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
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
