'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, Code, Sparkles, Filter } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  liveLink?: string | null;
  githubLink?: string | null;
  imageUrl: string;
  featured: boolean;
  order: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch((err) => console.error('Failed to load projects:', err));
  }, []);

  const filterProjects = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'ALL') {
      setFilteredProjects(projects);
    } else if (filter === 'AI/ML') {
      // Find stack or desc that matches PyTorch, Tensorflow, ML, Data, AI
      setFilteredProjects(
        projects.filter(
          (p) =>
            p.stack.toUpperCase().includes('PYTORCH') ||
            p.stack.toUpperCase().includes('TENSORFLOW') ||
            p.description.toUpperCase().includes('DEEP LEARNING') ||
            p.description.toUpperCase().includes('NEURAL')
        )
      );
    } else if (filter === 'CREATIVE') {
      // Find stack that matches Three, WebGL, GSAP, Shaders, Canvas
      setFilteredProjects(
        projects.filter(
          (p) =>
            p.stack.toUpperCase().includes('THREE') ||
            p.stack.toUpperCase().includes('GLSL') ||
            p.stack.toUpperCase().includes('SHADER') ||
            p.stack.toUpperCase().includes('GSAP')
        )
      );
    } else if (filter === 'FULLSTACK') {
      setFilteredProjects(
        projects.filter(
          (p) =>
            p.stack.toUpperCase().includes('POSTGRESQL') ||
            p.stack.toUpperCase().includes('PRISMA') ||
            p.stack.toUpperCase().includes('NEXTAUTH')
        )
      );
    }
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 select-none"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-4">
            <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest">
              02 // REPOSITORY // INVENTIONS
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">
              Aesthetic <br />
              <span className="text-stroke-white text-white/5">Engines</span>
            </h2>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['ALL', 'AI/ML', 'CREATIVE', 'FULLSTACK'].map((filter) => (
              <button
                key={filter}
                onClick={() => filterProjects(filter)}
                className={`px-4 py-2 border rounded transition-all duration-300 interactive cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === filter
                    ? 'border-[#ff5d22] bg-[#ff5d22]/10 text-white'
                    : 'border-white/10 hover:border-white/30 text-white/50 hover:text-white'
                }`}
              >
                {filter === 'ALL' ? (
                  <Filter size={10} />
                ) : (
                  <Code size={10} />
                )}
                <span>{filter}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedProject(project)}
                className="group relative glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between h-[380px] hover:border-[#ff5d22]/40 duration-500 cursor-pointer interactive"
              >
                {/* Image Banner */}
                <div className="relative h-44 w-full overflow-hidden border-b border-white/5">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-105 duration-700 opacity-70 group-hover:opacity-90"
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 bg-[#ff5d22] text-white px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={8} /> Featured
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-md font-mono font-bold tracking-tight text-white/90 group-hover:text-[#ff5d22] duration-300">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white/40 line-clamp-3 font-sans leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Badges Stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack
                      .split(',')
                      .slice(0, 3)
                      .map((badge) => (
                        <span
                          key={badge.trim()}
                          className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-white/40 group-hover:text-white/60 duration-300"
                        >
                          {badge.trim()}
                        </span>
                      ))}
                    {project.stack.split(',').length > 3 && (
                      <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-white/40">
                        +{project.stack.split(',').length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fullscreen Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Content box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-panel border-[#ff5d22]/20 rounded-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto glow-orange select-none"
            >
              {/* Image header */}
              <div className="relative h-60 w-full border-b border-white/10">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="object-cover w-full h-full opacity-80"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-black/60 border border-white/10 hover:border-white/30 text-white/70 hover:text-white p-2 rounded-full duration-300 interactive cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="text-[#ff5d22] font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                    <Code size={10} /> Inventions Telemetry Archive
                  </div>
                  <h3 className="text-2xl font-mono font-bold tracking-tight text-white">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="text-white/40 uppercase text-[9px] font-mono tracking-widest border-b border-white/15 pb-1">
                    System Abstract
                  </div>
                  <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-white/40 uppercase text-[9px] font-mono tracking-widest border-b border-white/15 pb-1">
                    Integrated Stack Node Map
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.split(',').map((tag) => (
                      <span
                        key={tag.trim()}
                        className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-mono text-white/60"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  {selectedProject.liveLink && (
                    <a
                      href={selectedProject.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-white text-black hover:bg-[#ff5d22] hover:text-white rounded text-xs font-mono font-bold flex items-center gap-2 duration-300 interactive"
                    >
                      <ExternalLink size={14} />
                      <span>Live Engine</span>
                    </a>
                  )}
                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 border border-white/10 hover:border-[#ff5d22]/50 hover:bg-[#ff5d22]/10 text-white/80 hover:text-white rounded text-xs font-mono font-bold flex items-center gap-2 duration-300 interactive"
                    >
                      <GithubIcon />
                      <span>Open Source Repo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
