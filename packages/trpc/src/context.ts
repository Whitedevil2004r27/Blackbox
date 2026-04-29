import { db, users, sessions } from '@freelancex/db';
import { eq } from 'drizzle-orm';

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface Session {
  user?: SessionUser | null;
  sessionId?: string | null;
}

function parseCookieHeader(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  header.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

export async function createContext(opts: { headers?: Headers; req?: Request }) {
  let session: Session = {
    user: null,
    sessionId: null,
  };

  // Parse cookie header and validate session
  try {
    const cookieHeader = opts.headers?.get('cookie') || opts.req?.headers.get('cookie');
    if (cookieHeader) {
      const cookies = parseCookieHeader(cookieHeader);
      const sessionId = cookies['lucia_session'];
      if (sessionId) {
        // Look up session in database
        const sessionResult = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
        if (sessionResult.length > 0) {
          const sessionData = sessionResult[0];
          // Check if session is not expired
          if (new Date(sessionData.expiresAt) > new Date()) {
            // Look up user
            const userResult = await db.select().from(users).where(eq(users.id, sessionData.userId)).limit(1);
            if (userResult.length > 0) {
              const user = userResult[0];
              session = {
                sessionId,
                user: {
                  id: user.id,
                  name: user.fullName || user.username,
                  email: user.email,
                  image: user.avatarUrl,
                },
              };
            }
          }
        }
      }
    }
  } catch {
    // If session validation fails, continue with null session
  }

  return {
    session,
    db,
    req: opts.req,
    res: undefined,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
