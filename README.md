# Vasav P Ramesh // Cinematic Portfolio Platform

A world-class, production-grade creative technologist portfolio and digital archive designed for **Vasav P Ramesh** (Bachelor of Computer Applications - AI/ML & Data Science at MAC Ramapuram).

The aesthetic vibe is inspired by **underground tech culture, Rick Owens minimalism, cinematic brutality, A24 campaigns, and introspective creative coding**. It features smooth high-performance Three.js background rendering, key-bound HUD command consoles, a full markdown editorial CMS blog with dynamic comment queues, and a premium dark SaaS admin dashboard.

---

## 🛠️ Technology Stack

- **Frontend Core**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP.
- **3D Graphics Engine**: Three.js, React Three Fiber (R3F), `@react-three/drei` (SSR-decoupled).
- **Backend Database & ORM**: PostgreSQL, Prisma ORM (Client singleton pattern).
- **Authentication**: Auth.js / NextAuth v5 (Beta) - Secure Credentials Provider.
- **Form Verification & Parsing**: Zod schemas, React 19 `useActionState` hooks.
- **Rich Text Engine**: Markdown-It (Server-side HTML rendering).

---

## 🔒 Security Gateways

- **Admin Dashboard Route Protection**: Enforced using Next.js global edge middleware. Unauthorized requests are immediately blocked and routed to the secure administrator login page.
- **Secured Database Transactions**: All administrative operations (seeding, status adjusting, blog publication, comment moderation) are encapsulated inside secure **Next.js Server Actions** which verify active admin sessions before executing.
- **Cryptographic Hashing**: User authentication passwords are securely hashed using `bcryptjs`.

---

## 🚀 Getting Started (Local Development)

To spin up the PostgreSQL database, seed initial data, and start the Next.js dev server, execute the following commands:

### 1. Prerequisite Containers (Docker)
Ensure Docker is installed and running, then spin up the local PostgreSQL database service:
```bash
docker compose up -d
```
*This starts a persistent PostgreSQL container matching the `DATABASE_URL` in `.env`.*

### 2. Install Project Libraries
Install all production and dev dependencies:
```bash
npm install --legacy-peer-deps
```

### 3. Sync Database Tables & Seed Sample Data
Execute the Prisma migration/push and populate the database tables with our high-fidelity seed scripts:
```bash
# Push database schemas
npx prisma db push

# Seed default admin user and initial articles/projects
npx -y tsx prisma/seed.ts
```

### 4. Run Dev Environment
Start the high-performance Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 Administrative Access

- **Login Route**: `/admin/login`
- **Seed Username**: `admin`
- **Seed Password**: `PasswordVasav2026`
*Change these default credentials inside the admin dashboard settings once authenticated!*

---

## ⌨️ Command Console (HUD Shortcuts)

Summon the system command palette overlay anywhere on the website:
- **Shortcut**: `Cmd+K` (macOS) or `Ctrl+K` (Linux/Windows)
- **Interactive Controls**:
  - Jump/scroll smoothly to any page section.
  - Toggle analog CRT scanlines scan grid.
  - Run database matrix diagnostic test (launching glitched confetti particles).
  - Open secure Admin Portal dashboard.

---

## 📦 Production Compiling & Containerization

Verify type-safety and build production optimization assets:
```bash
npm run build
```

To run the entire app (both PostgreSQL database and Next.js Next node) in a single dockerized environment:
```bash
# Build and run containers
docker compose up --build -d
```
