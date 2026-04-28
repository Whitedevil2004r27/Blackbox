import { FastifyInstance } from 'fastify';
import { db, messages, conversations, conversationMembers } from '@freelancex/db';
import { eq, and, desc } from 'drizzle-orm';

export async function messageRoutes(server: FastifyInstance) {
  // List all conversations for current user
  server.get('/conversations', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const result = await db.select()
      .from(conversations)
      .innerJoin(conversationMembers, eq(conversations.id, conversationMembers.conversationId))
      .where(eq(conversationMembers.userId, userId))
      .orderBy(desc(conversations.lastMessageAt));

    return reply.send(result);
  });

  // Create a new conversation
  server.post('/conversations', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as {
      type?: 'direct' | 'project' | 'group';
      name?: string;
      participantIds: string[];
      projectId?: string;
    };

    if (!body.participantIds || body.participantIds.length === 0) {
      return reply.status(400).send({ error: 'participantIds are required' });
    }

    const [conversation] = await db.insert(conversations).values({
      type: body.type || 'direct',
      name: body.name || null,
      projectId: body.projectId || null,
      createdBy: userId,
    }).returning();

    const allParticipants = [...new Set([...body.participantIds, userId])];
    await db.insert(conversationMembers).values(
      allParticipants.map((pid) => ({
        conversationId: conversation.id,
        userId: pid,
        isAdmin: pid === userId,
      }))
    );

    return reply.status(201).send(conversation);
  });

  // Get conversation by ID
  server.get('/conversations/:id', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    const membership = await db.select()
      .from(conversationMembers)
      .where(and(eq(conversationMembers.conversationId, id), eq(conversationMembers.userId, userId)))
      .limit(1);

    if (membership.length === 0) {
      return reply.status(403).send({ error: 'Not a member of this conversation' });
    }

    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    if (result.length === 0) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    return reply.send(result[0]);
  });

  // Get messages for a conversation
  server.get('/conversations/:id/messages', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    const membership = await db.select()
      .from(conversationMembers)
      .where(and(eq(conversationMembers.conversationId, id), eq(conversationMembers.userId, userId)))
      .limit(1);

    if (membership.length === 0) {
      return reply.status(403).send({ error: 'Not a member of this conversation' });
    }

    const result = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(desc(messages.createdAt))
      .limit(100);

    return reply.send(result);
  });

  // Send a message
  server.post('/conversations/:id/messages', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };
    const body = request.body as {
      content: string;
      type?: string;
      replyToId?: string;
    };

    const membership = await db.select()
      .from(conversationMembers)
      .where(and(eq(conversationMembers.conversationId, id), eq(conversationMembers.userId, userId)))
      .limit(1);

    if (membership.length === 0) {
      return reply.status(403).send({ error: 'Not a member of this conversation' });
    }

    const [message] = await db.insert(messages).values({
      conversationId: id,
      senderId: userId,
      content: body.content,
      type: (body.type as any) || 'text',
      replyToId: body.replyToId || null,
    }).returning();

    // Update conversation last message time
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, id));

    return reply.status(201).send(message);
  });

  // Mark conversation as read
  server.patch('/conversations/:id/read', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    await db.update(conversationMembers)
      .set({ unreadCount: 0, lastReadAt: new Date() })
      .where(and(eq(conversationMembers.conversationId, id), eq(conversationMembers.userId, userId)));

    return reply.send({ success: true });
  });
}
