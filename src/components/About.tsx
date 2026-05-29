'use client';

import { motion } from 'framer-motion';
import { BookOpen, BrainCircuit, Terminal, Cpu, Award } from 'lucide-react';

export default function About() {
  const timeline = [
    {
      year: '2024 - Present',
      title: 'Bachelor of Computer Applications (BCA)',
      subtitle: 'MAC Ramapuram',
      description:
        'Focusing on Artificial Intelligence, Machine Learning & Advanced Data Science. Active in neural networks modeling, data visualization, and creative hacking experiments.',
      icon: BookOpen,
    },
    {
      year: '2025',
      title: 'Procedural WebGL & Shaders Experimentations',
      subtitle: 'Creative Coding Sandbox',
      description:
        'Developed custom GLSL noise shaders, fluid grids, and interactive particles to integrate 3D computational pipelines directly into Next.js interfaces.',
      icon: Terminal,
    },
    {
      year: '2025',
      title: 'Deep Learning Model Specializations',
      subtitle: 'Neural Net Architecture Study',
      description:
        'Fine-tuned Transformer models and classification architectures using PyTorch and Hugging Face pipelines for generative text-to-graphics experiments.',
      icon: BrainCircuit,
    },
  ];

  const skillGroups = [
    {
      category: 'AI / Machine Learning',
      icon: BrainCircuit,
      skills: [
        'PyTorch',
        'TensorFlow',
        'Model Fine-Tuning',
        'Scikit-Learn',
        'Pandas / NumPy',
        'Computer Vision',
        'Hugging Face',
      ],
    },
    {
      category: 'Creative Frontend',
      icon: Cpu,
      skills: [
        'Next.js 15',
        'TypeScript',
        'Three.js / React Three Fiber',
        'Framer Motion',
        'GSAP ScrollTrigger',
        'TailwindCSS',
        'GLSL Shaders',
      ],
    },
    {
      category: 'Systems & Backend',
      icon: Terminal,
      skills: [
        'PostgreSQL',
        'Prisma ORM',
        'Node.js / Express',
        'NextAuth / JWT',
        'Docker',
        'REST / tRPC',
        'Vercel Deployment',
      ],
    },
  ];

  return (
    <section
      id="about"
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 select-none"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Title */}
        <div className="space-y-4">
          <div className="text-[#ff5d22] font-mono text-xs uppercase tracking-widest">
            01 // SYSTEM CORE // IDENTITY
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">
            Creative Coding Meets <br />
            <span className="text-stroke-white text-white/5">Neural Science</span>
          </h2>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Identity narrative */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-mono text-white/80 border-b border-white/10 pb-3 flex items-center gap-2">
              <Award size={18} className="text-[#ff5d22]" /> Profile Archive
            </h3>
            <p className="font-sans text-white/60 leading-relaxed">
              Vasav P Ramesh is a 19-year-old developer studying **Bachelor of
              Computer Applications in AI/ML &amp; Data Science** at **MAC Ramapuram**.
              He navigates the boundary where brutalist computational systems and
              fluid visual art meet.
            </p>
            <p className="font-sans text-white/60 leading-relaxed">
              Through creative coding, he converts data inputs into immersive experiences,
              treating the browser screen as an active canvas. His interest spans
              mathematical generative grids, custom shaders, and structural neural network architectures.
            </p>

            {/* Micro-diagnostic box */}
            <div className="glass-panel border-white/5 p-4 rounded text-[10px] font-mono text-white/40 space-y-1">
              <div>{"// BIO COMPILATION METRICS:"}</div>
              <div>{"AGE: 19 // LOC: CHENNAI, IN"}</div>
              <div>{"INSTITUTION: MAC RAMAPURAM [BCA]"}</div>
              <div>{"FOCUS: DEEP LEARNING MODEL OPTIMIZATIONS"}</div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-xl font-mono text-white/80 border-b border-white/10 pb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-[#ff5d22]" /> Academic Timeline
            </h3>

            <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
              {timeline.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title + idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className="relative space-y-2"
                  >
                    {/* Circle Node */}
                    <div className="absolute -left-[35px] top-1 bg-[#0b0b0c] border border-white/20 p-1.5 rounded-full text-white/80 hover:text-[#ff5d22] hover:border-[#ff5d22] duration-300">
                      <Icon size={12} />
                    </div>

                    <div className="text-[10px] font-mono text-[#ff5d22] tracking-widest uppercase">
                      {item.year}
                    </div>
                    <h4 className="text-md font-mono font-semibold text-white/90">
                      {item.title}
                    </h4>
                    <div className="text-xs font-mono text-white/40">
                      {item.subtitle}
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills Cards Showcase */}
        <div className="space-y-8">
          <h3 className="text-xl font-mono text-white/80 border-b border-white/10 pb-3 flex items-center gap-2">
            <Cpu size={18} className="text-[#ff5d22]" /> Technology Stack Node Map
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillGroups.map((group, gIdx) => {
              const Icon = group.icon;
              return (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: gIdx * 0.15 }}
                  className="glass-panel border-white/5 rounded-lg p-6 hover:border-[#ff5d22]/30 duration-300 select-none group"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
                    <Icon size={16} className="text-[#ff5d22]" />
                    <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-white/80 group-hover:text-white duration-300">
                      {group.category}
                    </h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-white/5 hover:bg-[#ff5d22]/10 border border-white/5 hover:border-[#ff5d22]/30 px-2.5 py-1 rounded text-[10px] font-mono text-white/60 hover:text-white duration-300 interactive cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
