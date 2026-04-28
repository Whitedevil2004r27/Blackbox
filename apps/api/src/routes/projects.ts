import { FastifyInstance } from 'fastify';
import { db, projects, projectMembers, projectTasks, milestones, proposals, contracts, users } from '@freelancex/db';
import { eq, and, or, desc } from 'drizzle-orm';

export async function projectRoutes(server: FastifyInstance) {
  // List all projects (with optional status filter)
  server.get('/', async (request, reply) => {
    const { status } = request.query as { status?: string };

    let query = db.select().from(projects);
    if (status) {
      query = query.where(eq(projects.status, status as any)) as any;
    }

    const result = await query.orderBy(desc(projects.createdAt)).limit(50);
    return reply.send(result);
  });

  // Create project
  server.post('/', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as {
      title: string;
      description?: string;
      detailedBrief?: string;
      categoryId?: string;
      type?: 'fixed' | 'hourly' | 'milestone';
      budgetMin?: number;
      budgetMax?: number;
      durationDays?: number;
      deadline?: string;
      requiredSkills?: string[];
      visibility?: 'public' | 'invite_only' | 'connections';
    };

    if (!body.title) {
      return reply.status(400).send({ error: 'Title is required' });
    }

    const [project] = await db.insert(projects).values({
      title: body.title,
      description: body.description || null,
      detailedBrief: body.detailedBrief || null,
      clientId: userId,
      categoryId: body.categoryId || null,
      type: body.type || 'fixed',
      budgetMin: body.budgetMin?.toString() || null,
      budgetMax: body.budgetMax?.toString() || null,
      durationDays: body.durationDays || null,
      deadline: body.deadline ? new Date(body.deadline) : null,
      requiredSkills: body.requiredSkills || [],
      visibility: body.visibility || 'public',
      status: 'draft',
    }).returning();

    return reply.status(201).send(project);
  });

  // Get project by ID
  server.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (result.length === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    return reply.send(result[0]);
  });

  // Update project
  server.patch('/:id', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };
    const body = request.body as Partial<{
      title: string;
      description: string;
      status: string;
      budgetMin: number;
      budgetMax: number;
      durationDays: number;
      leadFreelancerId: string;
    }>;

    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    // Only client or lead freelancer can update
    const project = existing[0];
    if (project.clientId !== userId && project.leadFreelancerId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const updateData: any = { ...body, updatedAt: new Date() };
    if (body.budgetMin !== undefined) updateData.budgetMin = body.budgetMin.toString();
    if (body.budgetMax !== undefined) updateData.budgetMax = body.budgetMax.toString();

    const [updated] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
    return reply.send(updated);
  });

  // Delete project
  server.delete('/:id', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    if (existing[0].clientId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    await db.delete(projects).where(eq(projects.id, id));
    return reply.status(204).send();
  });

  // Publish project (open for proposals)
  server.post('/:id/publish', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const { id } = request.params as { id: string };

    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    if (existing[0].clientId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const [updated] = await db.update(projects)
      .set({ status: 'open', updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    return reply.send(updated);
  });

  // Close project
  server.post('/:id/close', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const { id } = request.params as { id: string };

    const existing = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Project not found' });
    }

    if (existing[0].clientId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const [updated] = await db.update(projects)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    return reply.send(updated);
  });

  // Get proposals for project
  server.get('/:id/proposals', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select().from(proposals)
      .where(eq(proposals.projectId, id))
      .orderBy(desc(proposals.createdAt));

    return reply.send(result);
  });

  // Get members for project
  server.get('/:id/members', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select().from(projectMembers)
      .where(eq(projectMembers.projectId, id));

    return reply.send(result);
  });

  // Invite member to project
  server.post('/:id/members/invite', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const { id } = request.params as { id: string };
    const body = request.body as { userId: string; role?: string; revenueShare?: string };

    // Verify inviter is member/lead
    const existingMembers = await db.select().from(projectMembers)
      .where(and(eq(projectMembers.projectId, id), eq(projectMembers.userId, userId)));

    if (existingMembers.length === 0) {
      return reply.status(403).send({ error: 'Not a project member' });
    }

    const [member] = await db.insert(projectMembers).values({
      projectId: id,
      userId: body.userId,
      role: (body.role as any) || 'collaborator',
      invitedBy: userId,
      revenueShare: body.revenueShare || null,
    }).returning();

    return reply.status(201).send(member);
  });

  // Get tasks for project
  server.get('/:id/tasks', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select().from(projectTasks)
      .where(eq(projectTasks.projectId, id))
      .orderBy(projectTasks.position);

    return reply.send(result);
  });

  // Create task for project
  server.post('/:id/tasks', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const { id } = request.params as { id: string };
    const body = request.body as {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      assignedTo?: string;
      estimatedHrs?: number;
      dueDate?: string;
      tags?: string[];
    };

    const [task] = await db.insert(projectTasks).values({
      projectId: id,
      title: body.title,
      description: body.description || null,
      status: (body.status as any) || 'backlog',
      priority: (body.priority as any) || 'medium',
      assignedTo: body.assignedTo || null,
      createdBy: userId,
      estimatedHrs: body.estimatedHrs?.toString() || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      tags: body.tags || [],
    }).returning();

    return reply.status(201).send(task);
  });

  // Get milestones for project
  server.get('/:id/milestones', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db.select().from(milestones)
      .where(eq(milestones.projectId, id))
      .orderBy(milestones.dueDate);

    return reply.send(result);
  });

  // Create milestone for project
  server.post('/:id/milestones', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    const { id } = request.params as { id: string };
    const body = request.body as {
      title: string;
      description?: string;
      amount?: number;
      dueDate?: string;
    };

    const [milestone] = await db.insert(milestones).values({
      projectId: id,
      title: body.title,
      description: body.description || null,
      amount: body.amount?.toString() || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    }).returning();

    return reply.status(201).send(milestone);
  });

  // Get user's active projects
  server.get('/me/active', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    // Projects where user is client OR lead freelancer
    const result = await db.select().from(projects)
      .where(
        or(
          eq(projects.clientId, userId),
          eq(projects.leadFreelancerId, userId)
        )
      )
      .orderBy(desc(projects.updatedAt));

    return reply.send(result);
  });

  // Get AI-recommended projects
  server.get('/recommended', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;

    // TODO: Implement AI matching using OpenAI embeddings
    // For now, return recently opened projects
    const result = await db.select().from(projects)
      .where(eq(projects.status, 'open'))
      .orderBy(desc(projects.createdAt))
      .limit(10);

    return reply.send(result);
  });
}
