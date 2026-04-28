const fs = require('fs');
const path = require('path');

const files = {
  'apps/web/src/components/3d/ProjectPlanet.tsx': `'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html, Ring } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface ProjectPlanetProps {
  position?: [number, number, number];
  title?: string;
  status?: 'open' | 'in_progress' | 'completed';
  budget?: number;
}

export function ProjectPlanet({ 
  position = [0, 0, 0], 
  title = 'New Project',
  status = 'open',
  budget = 5000
}: ProjectPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);

  const statusColors = {
    open: '#4ade80',
    in_progress: '#fbbf24',
    completed: '#818cf8'
  };

  const color = statusColors[status];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <RigidBody position={position} colliders="ball" restitution={0.3}>
      <group>
        <Sphere
          ref={meshRef}
          args={[1.5, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setSelected(!selected)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.4}
            metalness={0.6}
          />
        </Sphere>

        <Ring args={[2, 2.1, 64]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </Ring>

        <Sphere args={[1.7, 32, 32]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>

        {selected && (
          <Html distanceFactor={10}>
            <div className="bg-void/90 border border-nebula-400 rounded-lg p-4 min-w-[220px] text-white pointer-events-none">
              <h3 className="font-bold text-lg text-star-gold">{title}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-nebula-400">Status:</span>{' '}
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </p>
                <p className="text-sm">
                  <span className="text-nebula-400">Budget:</span> {'$'}{budget.toLocaleString()}
                </p>
              </div>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}
`,

  'apps/web/src/components/providers.tsx': `'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
`,

  'apps/web/src/trpc/client.ts': `import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@freelancex/trpc';

export const trpc = createTRPCReact<AppRouter>();
`,

  'apps/web/src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --void: #050507;
  --nebula-100: #e0e7ff;
  --nebula-400: #818cf8;
  --nebula-600: #4f46e5;
  --nebula-900: #1e1b4b;
  --star-gold: #fbbf24;
  --star-white: #f8fafc;
  --star-blue: #60a5fa;
}

body {
  background-color: var(--void);
  color: var(--star-white);
  overflow: hidden;
}

canvas {
  touch-action: none;
}
`,

  'apps/web/next-env.d.ts': `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`,

  'services/realtime/src/index.ts': `import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const PORT = parseInt(process.env.REALTIME_PORT || '3001');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function main() {
  const io = new Server({
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    socket.on('join', (userId: string) => {
      socket.join('user:' + userId);
      console.log('User ' + userId + ' joined');
    });

    socket.on('join-project', (projectId: string) => {
      socket.join('project:' + projectId);
      console.log('Joined project ' + projectId);
    });

    socket.on('cursor-move', (data: { x: number; y: number; z: number; projectId: string }) => {
      socket.to('project:' + data.projectId).emit('cursor-update', {
        userId: socket.id,
        position: { x: data.x, y: data.y, z: data.z },
      });
    });

    socket.on('message', (data: { projectId: string; content: string; senderId: string }) => {
      io.to('project:' + data.projectId).emit('new-message', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('object-grab', (data: { objectId: string; projectId: string }) => {
      socket.to('project:' + data.projectId).emit('object-grabbed', {
        objectId: data.objectId,
        userId: socket.id,
      });
    });

    socket.on('object-release', (data: { objectId: string; projectId: string; position: [number, number, number] }) => {
      socket.to('project:' + data.projectId).emit('object-released', {
        objectId: data.objectId,
        userId: socket.id,
        position: data.position,
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected: ' + socket.id);
    });
  });

  io.listen(PORT);
  console.log('Realtime server running on port ' + PORT);
}

main().catch(console.error);
`,

  'packages/ui/src/index.ts': `export { Button } from './button';
`,

  'packages/ui/src/button.tsx': `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-nebula-600 text-white hover:bg-nebula-900',
    secondary: 'bg-void border border-nebula-400 text-nebula-100 hover:bg-nebula-900/50',
    ghost: 'hover:bg-nebula-900/30 text-nebula-100',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={baseStyles + ' ' + variants[variant] + ' ' + sizes[size] + ' ' + className}
      {...props}
    >
      {children}
    </button>
  );
}
`,

  'packages/trpc/src/index.ts': `export { appRouter, type AppRouter } from './router';
export { createContext } from './context';
`,

  'packages/trpc/src/context.ts': `import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { db } from '@freelancex/db';

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getSession({ req });

  return {
    session,
    db,
    req,
    res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
`,

  'packages/trpc/src/router.ts': `import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db, users, projects, tasks, messages } from '@freelancex/db';
import { eq } from 'drizzle-orm';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new Error('Unauthorized');
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

const authedProcedure = t.procedure.use(authMiddleware);

export const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(users).where(eq(users.id, input.id));
      }),

    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string(),
        role: z.enum(['freelancer', 'client', 'admin']),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(users).values(input).returning();
      }),
  }),

  project: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(projects);
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(projects).where(eq(projects.id, input.id));
      }),

    create: authedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        budget: z.number(),
        skillsRequired: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(projects).values({
          ...input,
          clientId: parseInt(ctx.user.id),
          status: 'draft',
        }).returning();
      }),
  }),

  task: router({
    listByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(tasks).where(eq(tasks.projectId, input.projectId));
      }),

    create: authedProcedure
      .input(z.object({
        projectId: z.number(),
        title: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(tasks).values(input).returning();
      }),
  }),

  message: router({
    listByProject: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(messages).where(eq(messages.projectId, input.projectId));
      }),

    send: authedProcedure
      .input(z.object({
        receiverId: z.number(),
        content: z.string(),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(messages).values({
          ...input,
          senderId: parseInt(ctx.user.id),
        }).returning();
      }),
  }),
});

export type AppRouter = typeof appRouter;
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join('c:/Users/vaith/Desktop/freelancex', filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
  console.log('Created: ' + filePath);
}

console.log('All files generated successfully!');
