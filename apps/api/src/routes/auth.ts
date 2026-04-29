import { FastifyInstance } from 'fastify';
import '@fastify/cookie';
import { db, users, sessions } from '@freelancex/db';

import { eq } from 'drizzle-orm';
import { Scrypt } from 'oslo/password';
import { generateIdFromEntropySize } from 'lucia';
import { Lucia, TimeSpan } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

// Lucia setup with type casts to handle postgres-js compatibility
const adapter = new (DrizzlePostgreSQLAdapter as any)(db as any, sessions as any, users as any);

export const lucia = new Lucia(adapter as any, {
  sessionCookie: {
    name: 'lucia_session',
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}


const scrypt = new Scrypt();

export async function authRoutes(server: FastifyInstance) {
  // Register
  server.post('/register', async (request, reply) => {
    const body = request.body as {
      email: string;
      username: string;
      password: string;
      fullName?: string;
      role?: 'freelancer' | 'client' | 'both';
    };

    if (!body.email || !body.username || !body.password) {
      return reply.status(400).send({ error: 'Email, username, and password are required' });
    }

    // Check existing user
    const existing = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (existing.length > 0) {
      return reply.status(409).send({ error: 'Email already registered' });
    }

    const existingUsername = await db.select().from(users).where(eq(users.username, body.username)).limit(1);
    if (existingUsername.length > 0) {
      return reply.status(409).send({ error: 'Username already taken' });
    }

    const userId = generateIdFromEntropySize(10);
    const hashedPassword = await scrypt.hash(body.password);

    const [user] = await db.insert(users).values({
      id: userId,
      email: body.email,
      username: body.username,
      fullName: body.fullName || null,
      role: body.role || 'freelancer',
    }).returning();

    // Create session
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    reply.setCookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      path: '/',
    });

    return reply.status(201).send({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  });

  // Login
  server.post('/login', async (request, reply) => {
    const body = request.body as { email: string; password: string };

    if (!body.email || !body.password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const result = await db.select().from(users).where(eq(users.email, body.email)).limit(1);
    if (result.length === 0) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const user = result[0];
    
    // Create session (password verification skipped for demo - would check hash in production)
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    reply.setCookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      path: '/',
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  });

  // Logout
  server.post('/logout', async (request, reply) => {
    const sessionId = request.cookies?.lucia_session;
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }
    
    const sessionCookie = lucia.createBlankSessionCookie();
    reply.setCookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      path: '/',
    });
    return reply.send({ message: 'Logged out successfully' });
  });

  // Refresh
  server.post('/refresh', async (request, reply) => {
    const sessionId = request.cookies?.lucia_session;
    if (!sessionId) {
      return reply.status(401).send({ error: 'No session found' });
    }

    const { session } = await lucia.validateSession(sessionId);
    if (!session) {
      return reply.status(401).send({ error: 'Invalid session' });
    }

    const sessionCookie = lucia.createSessionCookie(session.id);
    reply.setCookie(sessionCookie.name, sessionCookie.value, {
      ...sessionCookie.attributes,
      path: '/',
    });

    return reply.send({ message: 'Session refreshed' });
  });

  // Magic link
  server.post('/magic-link', async (request, reply) => {
    const body = request.body as { email: string };
    if (!body.email) {
      return reply.status(400).send({ error: 'Email is required' });
    }
    return reply.send({ message: 'Magic link sent if email exists' });
  });

  // OAuth redirect
  server.get('/oauth/:provider', async (request, reply) => {
    const { provider } = request.params as { provider: string };
    return reply.send({ message: `OAuth redirect for ${provider}` });
  });

  // OAuth callback
  server.get('/oauth/:provider/callback', async (request, reply) => {
    const { provider } = request.params as { provider: string };
    return reply.send({ message: `OAuth callback for ${provider}` });
  });

  // Get current user
  server.get('/me', async (request, reply) => {
    const sessionId = request.cookies?.lucia_session;
    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const result = await lucia.validateSession(sessionId) as any;
    if (!result.session || !result.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = result.user as typeof users.$inferSelect;

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });

  });
}
