import { FastifyInstance } from 'fastify';
import { db, users, notifications, freelancerProfiles, portfolioItems, connections, savedItems, activityFeed } from '@freelancex/db';
import { eq, and, or, desc, sql } from 'drizzle-orm';

export async function userRoutes(server: FastifyInstance) {
  // Get user by username (public profile)
  server.get('/:username', async (request, reply) => {
    const { username } = request.params as { username: string };

    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (result.length === 0) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const user = result[0];
    return reply.send({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      coverUrl: user.coverUrl,
      bio: user.bio,
      tagline: user.tagline,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  });

  // Update current user
  server.patch('/me', async (request, reply) => {
    // TODO: Extract userId from validated session
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as Partial<{
      fullName: string;
      bio: string;
      tagline: string;
      avatarUrl: string;
      coverUrl: string;
    }>;

    const [updated] = await db.update(users)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return reply.send(updated);
  });

  // Delete current user
  server.delete('/me', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    await db.delete(users).where(eq(users.id, userId));
    return reply.status(204).send();
  });

  // Get activity feed
  server.get('/me/feed', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const feed = await db.select()
      .from(activityFeed)
      .where(eq(activityFeed.actorId, userId))
      .orderBy(desc(activityFeed.createdAt))
      .limit(50);

    return reply.send(feed);
  });

  // Get notifications
  server.get('/me/notifications', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const items = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return reply.send(items);
  });

  // Mark notification as read
  server.patch('/me/notifications/:id/read', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    const [updated] = await db.update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();

    if (!updated) {
      return reply.status(404).send({ error: 'Notification not found' });
    }

    return reply.send(updated);
  });

  // Search users
  server.get('/search', async (request, reply) => {
    const { q } = request.query as { q?: string };

    let query = db.select().from(users);
    if (q) {
      query = query.where(sql`${users.username} ILIKE ${'%' + q + '%'}`) as any;
    }

    const results = await query.limit(20);
    return reply.send(results);
  });

  // Get freelancer profile by username
  server.get('/:username/profile', async (request, reply) => {
    const { username } = request.params as { username: string };

    const userResult = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (userResult.length === 0) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const profileResult = await db.select()
      .from(freelancerProfiles)
      .where(eq(freelancerProfiles.userId, userResult[0].id))
      .limit(1);

    const portfolio = await db.select()
      .from(portfolioItems)
      .where(eq(portfolioItems.userId, userResult[0].id))
      .orderBy(portfolioItems.position);

    return reply.send({
      user: userResult[0],
      profile: profileResult[0] ?? null,
      portfolio,
    });
  });

  // Get connections
  server.get('/me/connections', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const result = await db.select()
      .from(connections)
      .where(or(eq(connections.requesterId, userId), eq(connections.addresseeId, userId)));

    return reply.send(result);
  });

  // Get saved items
  server.get('/me/saved', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const result = await db.select()
      .from(savedItems)
      .where(eq(savedItems.userId, userId))
      .orderBy(desc(savedItems.createdAt));

    return reply.send(result);
  });
}
