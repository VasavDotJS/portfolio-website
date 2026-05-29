import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.adminUser.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.musicEntry.deleteMany({});
  await prisma.systemStatus.deleteMany({});

  console.log('🧹 Cleaned existing database tables.');

  // 2. Create Default Admin User
  const passwordHash = await bcrypt.hash('PasswordVasav2026', 10);
  const admin = await prisma.adminUser.create({
    data: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log(`👤 Created default admin user: ${admin.username}`);

  // 3. Create Default System Status
  const status = await prisma.systemStatus.create({
    data: {
      statusText: 'Active / Synthesizing neural generative textures at MAC Ramapuram',
      location: 'MAC Ramapuram',
      availability: 'Open for creative technology collaborations',
    },
  });
  console.log(`📡 Created system status: "${status.statusText}"`);

  // 4. Create Initial Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'SynapseNet // Neuro-Texture Synthesizer',
      description: 'An experimental interface analyzing brainwave telemetry and converting data into procedural WebGL neural textures. Utilizes deep learning classifications to map cognitive focus thresholds onto 3D particle nodes.',
      stack: 'Next.js 15, TypeScript, React Three Fiber, PyTorch, TailwindCSS',
      liveLink: 'https://github.com/VasavDotJS',
      githubLink: 'https://github.com/VasavDotJS',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      featured: true,
      order: 1,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Aether OS // Ambient Terminal Environment',
      description: 'A cinematic hacker terminal interface with embedded visualizers, customizable audio loops, custom shader canvases, and complete markdown script runtimes designed as an aesthetic work companion.',
      stack: 'React, Vite, Three.js, GSAP, Custom GLSL Shaders, TailwindCSS',
      liveLink: 'https://github.com/VasavDotJS',
      githubLink: 'https://github.com/VasavDotJS',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
      featured: true,
      order: 2,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'VloneArchive // Underground Digital Runway',
      description: 'A luxury brand catalog utilizing interactive 3D apparel models, immersive glassmorphic scrolling, horizontal A24-style galleries, and elastic fluid mechanics to present an introspective collection.',
      stack: 'Next.js, NextAuth, PostgreSQL, Framer Motion, Spline 3D, Prisma',
      liveLink: 'https://github.com/VasavDotJS',
      githubLink: 'https://github.com/VasavDotJS',
      imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      featured: false,
      order: 3,
    },
  });
  console.log('📁 Created 3 starter showcase projects.');

  // 5. Create Initial Blog Post
  const blog1 = await prisma.blogPost.create({
    data: {
      title: 'The Art of Creative Coding: Beyond Standard Web Templates',
      slug: 'art-of-creative-coding',
      excerpt: 'Why does the modern web look so corporate and identical? An investigation into luxury fashion branding, underground hacker aesthetics, and the emotional resonance of procedural WebGL design.',
      content: `## The Modern Web is Flat.

Open up a browser, browse five corporate tech websites, and you will notice a striking pattern: the same gradients, the same soft rounded corners, the same friendly illustration style, and the same generic grid layouts. The web has transitioned from an open, experimental playground into a hyper-optimized, sterile digital shopping mall.

As creative technologists, we must reject this standard uniformity. We should treat web browsers not just as layout systems, but as dynamic digital canvases capable of creating deep cinematic immersion.

### Underground Tech & Luxury Aesthetics

If we draw inspiration from modern luxury brands (like Rick Owens, Balenciaga) or indie cinema houses (like A24), we find a completely different aesthetic paradigm:

*   **Monochromatic Brutalism:** Extreme contrast, dark graphite textures, structural grids.
*   **Aesthetic Friction:** Intentionally oversized typography, custom kinetic scroll speed, noise overlays, and scanlines that recall analogue terminal screens.
*   **Ambient Motion:** Motion should not just be transitional; it should be ambient. Interactive particles that glide like smoke, shaders that morph like mercury, and responsive hover magnets that make the layout feel alive.

### Leveraging the WebGL Pipeline

Using technologies like \`Three.js\` and \`React Three Fiber\` (R3F) within frameworks like \`Next.js 15\`, we can inject genuine 3D graphics directly into our layout flow. By binding mesh morphing parameters to user scroll behavior and custom cursors, the page becomes an interactive sculpture:

\`\`\`javascript
// Ambient morph shader values bound to scroll velocity
const scrollVelocity = useScrollVelocity();
useFrame((state) => {
  const time = state.clock.getElapsedTime();
  meshRef.current.rotation.y = time * 0.1;
  meshRef.current.position.y = Math.sin(time) * 0.2;
  // Increase noise scale with scroll speed
  materialRef.current.uniforms.uNoiseScale.value = 1.0 + scrollVelocity * 0.05;
});
\`\`\`

We are not building interfaces to be clicked and forgotten. We are building digital archives of identity.

Let me know your thoughts below. Are we ready to make the web weird again?`,
      tags: 'Creative Coding,Design,WebGL,Philosophy',
      category: 'Design Philosophy',
      published: true,
      readingTime: 4,
    },
  });

  // Add a sample approved comment to this post
  await prisma.comment.create({
    data: {
      postId: blog1.id,
      authorName: 'Neo_Hacker',
      authorEmail: 'neo@matrix.io',
      content: 'This represents exactly what is missing on the internet today. The CRT scanline overlay is incredibly immersive. Fantastic work Vasav!',
      approved: true,
    },
  });
  console.log('✍️ Created blog post with first community comment.');

  // 6. Create Initial Music Entry
  const music = await prisma.musicEntry.create({
    data: {
      trackName: 'After Hours',
      artistName: 'The Weeknd',
      albumName: 'After Hours',
      artworkUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop',
      mood: 'Introspective, cinematic night drives',
      notes: 'Listening to this on repeat while compiling WebGL shaders and tweaking custom canvas physics. The baseline synth fits the dark brutalist aesthetic perfectly.',
      active: true,
    },
  });
  console.log(`🎵 Seeded currently listening: "${music.trackName}" by ${music.artistName}.`);

  console.log('✅ Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
