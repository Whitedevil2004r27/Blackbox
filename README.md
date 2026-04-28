# FreelanceX - Anti-Gravity 3D Freelancer Platform

## 🚀 Overview

FreelanceX is a next-generation freelancer platform where the entire UI exists in a fully immersive 3D anti-gravity workspace powered by Three.js, React Three Fiber, and Rapier physics. Freelancers are glowing orbs (stars), projects are orbiting planets, tasks are satellites. Navigate by flying through 3D space with physics-based interactions.

**Everything defies gravity. No flat screens.**

## 🛠️ Technology Stack

### Frontend (Next.js 14)
- **3D Engine**: Three.js + React Three Fiber + @react-three/drei + @react-three/rapier
- **State**: Zustand + TanStack Query
- **Styling**: Tailwind CSS + Custom GLSL shaders
- **Animations**: GSAP + @react-spring/three

### Backend
- **API**: tRPC (type-safe)
- **Database**: PostgreSQL + Drizzle ORM + pgvector (AI embeddings)
- **Realtime**: Socket.io + Redis
- **Auth**: NextAuth.js
- **Payments**: Stripe Connect
- **Search**: Meilisearch
- **AI**: OpenAI GPT-4o + Anthropic Claude

### Infrastructure
- Vercel (frontend/API)
- Railway/Supabase (DB + services)
- Cloudflare R2 (files)

## 📦 Prerequisites

1. **Node.js 20+** (or Bun)
2. **PostgreSQL 16+** with `pgvector` extension
3. **Redis** (Upstash or local)
4. **Stripe** account (test mode)
5. **Resend** (email)
6. **OpenAI/Anthropic** API keys
7. **GitHub OAuth** app for auth

## 🧪 Quick Setup (Development)

### 1. Clone & Install
```bash
cd C:/Users/vaith/Desktop
git clone <your-repo> freelancex
cd freelancex
npm install
```

### 2. Environment Variables
Copy `.env.example` → `.env.local`:

```env
# Database (Supabase/Neon)
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GITHUB_ID="..."
GITHUB_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
RESEND_API_KEY="re_..."

# AI
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="..."

# Other
MEILISEARCH_HOST="http://localhost:7700"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:migrate
npm run db:seed  # Optional: sample freelancers/projects
```

### 4. Services
```bash
# Terminal 1: Realtime server
npm run realtime

# Terminal 2: Web
npm run dev
```

Open `http://localhost:3000` → enter the 3D void!

## 🏗️ Project Structure

```
freelancex/
├── apps/
│   ├── web/           # Next.js app (main 3D platform)
│   └── mobile/        # Expo RN app (iOS/Android)
├── packages/
│   ├── db/            # Drizzle schema/migrations
│   ├── trpc/          # Shared API types
│   └── ui/            # Shared components
├── services/
│   └── realtime/      # Socket.io server
├── .env.example
├── turbo.json
└── package.json
```

## 🎮 Usage Guide

### User Onboarding Flow
1. **Sign Up** → Choose Freelancer/Client → Enter details
2. **Skills Galaxy** → Grab floating skill orbs to build your constellation
3. **Portfolio** → Drag GitHub repos or upload screenshots
4. **Launch** → Your orb spawns in the 3D void!

### Core Interactions
- **Fly**: WASD + mouse / touch drag + pinch
- **Focus**: Double-click orb/planet → camera orbits it
- **Grab**: Click+drag any object (full 3D physics drag)
- **Search**: Press 'E' → fly to discovery zone
- **Home**: Press 'H' → return to your zone

### Creating Projects
1. Click your orb → spawn new project planet
2. Fly to planet → expands to cockpit dashboard
3. Drag tasks between kanban columns (physics!)
4. @mention freelancers → invite to orbit

### Client Workflow
1. Explore void → skill clusters glow by category
2. Fly to freelancer → click contact comet
3. Message → deposit escrow → freelancer accepts
4. Tasks complete → approve milestones → funds release

## 🔧 Development Commands

```bash
npm run dev          # Web app (localhost:3000)
npm run realtime     # Socket.io server
npm run db:studio    # Drizzle Studio (DB browser)
npm run db:push      # Push schema changes
npm run lint         # ESLint
npm run test         # Vitest
npm run storybook    # Component docs
npm run build        # Production build
npm run preview      # Preview production
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```
Auto-deploys API + frontend.

### Railway/Supabase
```
1. Railway: deploy `services/realtime`
2. Supabase: import schema, enable pgvector
3. Set env vars in Vercel dashboard
```

## 🤝 Contributing

1. Fork → branch `feat/your-feature`
2. Follow **3D-first** principle: all UI in 3D space
3. Add new shaders to `apps/web/components/3d/shaders/`
4. Update DB schema → `npm run db:generate`
5. Test physics interactions!
6. PR with animated GIF of 3D effect

## 🐛 Troubleshooting

**Physics lag**: Reduce `maxBodies` in Rapier config
**Shader errors**: Check console → WebGL debug mode
**Realtime disconnects**: Verify Redis URL + Socket.io CORS
**Stripe test**: Use test cards `4242 4242 4242 4242`
**Mobile perf**: Enable LOD switching in devtools

## 📈 Performance Targets
- Desktop: 120fps (RTX 3060)
- Mobile: 60fps (iPhone 13)
- Particles: 200K max
- Draw calls: <150/frame

## 🎨 Design Tokens
See `apps/web/tailwind.config.js` + `--neon-*` CSS vars.

## 🔮 Roadmap
- [x] Core 3D void + physics
- [x] Auth + onboarding
- [x] Profiles + projects
- [x] Realtime collab
- [ ] VR/WebXR mode
- [ ] Voice chat + spatial audio
- [ ] AR project previews

**Built with ❤️ in anti-gravity. Fly safe!** 👨‍🚀

---

*FreelanceX v1.0 — The universe of freelance work*

# Blackbox
