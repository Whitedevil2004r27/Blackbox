import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import {
  users,
  projects,
  projectTasks,
  messages,
  conversations,
  conversationMembers,
  proposals,
  contracts,
  payments,
  reviews,
  notifications,
  freelancerProfiles,
  portfolioItems,
  connections,
  savedItems,
} from '@freelancex/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user as { id: string; name?: string | null; email?: string | null; image?: string | null },
    },
  });
});

const authedProcedure = t.procedure.use(authMiddleware);

const toNumeric = (val: number | undefined) => val?.toString();

export const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(users).where(eq(users.id, input.id)).limit(1);
        return result[0] ?? null;
      }),

    getByUsername: publicProcedure
      .input(z.object({ username: z.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(users).where(eq(users.username, input.username)).limit(1);
        return result[0] ?? null;
      }),

    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        username: z.string().min(3).max(255),
        fullName: z.string().optional(),
        role: z.enum(['freelancer', 'client', 'both']).default('freelancer'),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(users).values(input as any).returning();
      }),

    update: authedProcedure
      .input(z.object({
        fullName: z.string().optional(),
        bio: z.string().optional(),
        tagline: z.string().optional(),
        avatarUrl: z.string().url().optional(),
        coverUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.update(users).set({ ...input, updatedAt: new Date() } as any).where(eq(users.id, ctx.user.id)).returning();
      }),

    search: publicProcedure
      .input(z.object({
        q: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ ctx, input }) => {
        if (input.q) {
          return ctx.db
            .select()
            .from(users)
            .where(sql`${users.username} ILIKE ${'%' + input.q + '%'}`)
            .limit(input.limit)
            .offset(input.offset);
        }
        return ctx.db.select().from(users).limit(input.limit).offset(input.offset);
      }),
  }),

  freelancerProfile: router({
    getByUserId: publicProcedure
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(freelancerProfiles).where(eq(freelancerProfiles.userId, input.userId)).limit(1);
        return result[0] ?? null;
      }),

    update: authedProcedure
      .input(z.object({
        headline: z.string().optional(),
        hourlyRateMin: z.number().optional(),
        hourlyRateMax: z.number().optional(),
        availability: z.enum(['available', 'busy', 'not_available']).optional(),
        timezone: z.string().optional(),
        locationCountry: z.string().optional(),
        locationCity: z.string().optional(),
        yearsExperience: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const data: any = { ...input };
        if (input.hourlyRateMin !== undefined) data.hourlyRateMin = toNumeric(input.hourlyRateMin);
        if (input.hourlyRateMax !== undefined) data.hourlyRateMax = toNumeric(input.hourlyRateMax);

        const existing = await ctx.db.select().from(freelancerProfiles).where(eq(freelancerProfiles.userId, ctx.user.id)).limit(1);
        if (existing.length > 0) {
          return ctx.db.update(freelancerProfiles).set(data).where(eq(freelancerProfiles.userId, ctx.user.id)).returning();
        }
        return ctx.db.insert(freelancerProfiles).values({ ...data, userId: ctx.user.id }).returning();
      }),
  }),

  portfolio: router({
    getByUserId: publicProcedure
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(portfolioItems).where(eq(portfolioItems.userId, input.userId)).orderBy(portfolioItems.position);
      }),

    create: authedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        coverUrl: z.string().url().optional(),
        category: z.string().optional(),
        skillsUsed: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(portfolioItems).values({ ...input, userId: ctx.user.id } as any).returning();
      }),

    update: authedProcedure
      .input(z.object({ id: z.string().uuid(), title: z.string().optional(), description: z.string().optional(), featured: z.boolean().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.db.update(portfolioItems).set(data as any).where(and(eq(portfolioItems.id, id), eq(portfolioItems.userId, ctx.user.id))).returning();
      }),

    delete: authedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.delete(portfolioItems).where(and(eq(portfolioItems.id, input.id), eq(portfolioItems.userId, ctx.user.id))).returning();
      }),
  }),

  project: router({
    list: publicProcedure
      .input(z.object({
        status: z.enum(['draft', 'open', 'in_progress', 'review', 'completed', 'cancelled', 'disputed']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (input?.status) {
          return ctx.db
            .select()
            .from(projects)
            .where(eq(projects.status, input.status))
            .limit(input?.limit ?? 20)
            .offset(input?.offset ?? 0);
        }
        return ctx.db
          .select()
          .from(projects)
          .limit(input?.limit ?? 20)
          .offset(input?.offset ?? 0);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(projects).where(eq(projects.id, input.id)).limit(1);
        return result[0] ?? null;
      }),

    create: authedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        type: z.enum(['fixed', 'hourly', 'milestone']).default('fixed'),
        budgetMin: z.number().optional(),
        budgetMax: z.number().optional(),
        durationDays: z.number().optional(),
        requiredSkills: z.array(z.string()).optional(),
        visibility: z.enum(['public', 'invite_only', 'connections']).default('public'),
      }))
      .mutation(async ({ ctx, input }) => {
        const data: any = { ...input, clientId: ctx.user.id, status: 'draft' };
        if (input.budgetMin !== undefined) data.budgetMin = toNumeric(input.budgetMin);
        if (input.budgetMax !== undefined) data.budgetMax = toNumeric(input.budgetMax);
        return ctx.db.insert(projects).values(data).returning();
      }),

    update: authedProcedure
      .input(z.object({ id: z.string().uuid(), title: z.string().optional(), description: z.string().optional(), status: z.enum(['draft', 'open', 'in_progress', 'review', 'completed', 'cancelled', 'disputed']).optional() }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return ctx.db.update(projects).set({ ...data, updatedAt: new Date() } as any).where(eq(projects.id, id)).returning();
      }),

    delete: authedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.delete(projects).where(eq(projects.id, input.id)).returning();
      }),
  }),

  task: router({
    listByProject: publicProcedure
      .input(z.object({ projectId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(projectTasks).where(eq(projectTasks.projectId, input.projectId)).orderBy(projectTasks.position);
      }),

    create: authedProcedure
      .input(z.object({
        projectId: z.string().uuid(),
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        assignedTo: z.string().uuid().optional(),
        estimatedHrs: z.number().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const data: any = { ...input, createdBy: ctx.user.id };
        if (input.estimatedHrs !== undefined) data.estimatedHrs = toNumeric(input.estimatedHrs);
        return ctx.db.insert(projectTasks).values(data).returning();
      }),

    update: authedProcedure
      .input(z.object({
        taskId: z.string().uuid(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        assignedTo: z.string().uuid().optional(),
        loggedHrs: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { taskId, ...data } = input;
        const updateData: any = { ...data, updatedAt: new Date() };
        if (data.loggedHrs !== undefined) updateData.loggedHrs = toNumeric(data.loggedHrs);
        return ctx.db.update(projectTasks).set(updateData).where(eq(projectTasks.id, taskId)).returning();
      }),

    delete: authedProcedure
      .input(z.object({ taskId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.delete(projectTasks).where(eq(projectTasks.id, input.taskId)).returning();
      }),
  }),

  msg: router({
    listByConversation: publicProcedure
      .input(z.object({ conversationId: z.string().uuid(), limit: z.number().min(1).max(100).default(50), offset: z.number().min(0).default(0) }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(messages).where(eq(messages.conversationId, input.conversationId)).orderBy(desc(messages.createdAt)).limit(input.limit).offset(input.offset);
      }),

    send: authedProcedure
      .input(z.object({
        conversationId: z.string().uuid(),
        content: z.string(),
        type: z.enum(['text', 'file', 'image', 'video', 'system', 'contract_request', 'payment_request']).default('text'),
        replyToId: z.string().uuid().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(messages).values({ ...input, senderId: ctx.user.id } as any).returning();
      }),
  }),

  conversation: router({
    list: authedProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(conversations)
        .innerJoin(conversationMembers, eq(conversations.id, conversationMembers.conversationId))
        .where(eq(conversationMembers.userId, ctx.user.id))
        .orderBy(desc(conversations.lastMessageAt));
    }),

    create: authedProcedure
      .input(z.object({ type: z.enum(['direct', 'project', 'group']).default('direct'), name: z.string().optional(), participantIds: z.array(z.string().uuid()), projectId: z.string().uuid().optional() }))
      .mutation(async ({ ctx, input }) => {
        const [conversation] = await ctx.db.insert(conversations).values({ type: input.type, name: input.name, projectId: input.projectId, createdBy: ctx.user.id }).returning();
        const allParticipants = [...new Set([...input.participantIds, ctx.user.id])];
        await ctx.db.insert(conversationMembers).values(allParticipants.map((userId) => ({ conversationId: conversation.id, userId, isAdmin: userId === ctx.user.id })) as any);
        return conversation;
      }),
  }),

  proposal: router({
    listByProject: publicProcedure
      .input(z.object({ projectId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(proposals).where(eq(proposals.projectId, input.projectId)).orderBy(desc(proposals.createdAt));
      }),

    create: authedProcedure
      .input(z.object({ projectId: z.string().uuid(), coverLetter: z.string().optional(), proposedRate: z.number().optional(), estimatedDays: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const data: any = { ...input, freelancerId: ctx.user.id };
        if (input.proposedRate !== undefined) data.proposedRate = toNumeric(input.proposedRate);
        return ctx.db.insert(proposals).values(data).returning();
      }),

    updateStatus: authedProcedure
      .input(z.object({ proposalId: z.string().uuid(), status: z.enum(['shortlisted', 'accepted', 'rejected']) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.update(proposals).set({ status: input.status }).where(eq(proposals.id, input.proposalId)).returning();
      }),
  }),

  contract: router({
    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(contracts).where(eq(contracts.id, input.id)).limit(1);
        return result[0] ?? null;
      }),

    create: authedProcedure
      .input(z.object({ projectId: z.string().uuid(), freelancerId: z.string().uuid(), terms: z.string().optional(), rate: z.number().optional(), type: z.enum(['fixed', 'hourly']).default('fixed') }))
      .mutation(async ({ ctx, input }) => {
        const data: any = { ...input, clientId: ctx.user.id, status: 'draft' };
        if (input.rate !== undefined) data.rate = toNumeric(input.rate);
        return ctx.db.insert(contracts).values(data).returning();
      }),

    sign: authedProcedure
      .input(z.object({ contractId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.update(contracts).set({ status: 'signed', signedAt: new Date() }).where(eq(contracts.id, input.contractId)).returning();
      }),
  }),

  payment: router({
    listByUser: authedProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(payments)
        .where(sql`${payments.payerId} = ${ctx.user.id} OR ${payments.payeeId} = ${ctx.user.id}`)
        .orderBy(desc(payments.createdAt));
    }),

    create: authedProcedure
      .input(z.object({ contractId: z.string().uuid(), milestoneId: z.string().uuid().optional(), payerId: z.string().uuid(), payeeId: z.string().uuid(), amount: z.number(), currency: z.string().default('usd') }))
      .mutation(async ({ ctx, input }) => {
        const amount = input.amount;
        const platformFee = (amount * 0.1).toString();
        const freelancerPayout = (amount * 0.9).toString();
        return ctx.db.insert(payments).values({
          ...input,
          amount: amount.toString(),
          platformFee,
          freelancerPayout,
          status: 'pending',
        } as any).returning();
      }),
  }),

  review: router({
    listByUser: publicProcedure
      .input(z.object({ userId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.db.select().from(reviews).where(eq(reviews.revieweeId, input.userId)).orderBy(desc(reviews.createdAt));
      }),

    create: authedProcedure
      .input(z.object({ contractId: z.string().uuid(), revieweeId: z.string().uuid(), rating: z.number().min(1).max(5), headline: z.string().optional(), body: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(reviews).values({ ...input, reviewerId: ctx.user.id } as any).returning();
      }),
  }),

  notification: router({
    list: authedProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(notifications).where(eq(notifications.userId, ctx.user.id)).orderBy(desc(notifications.createdAt)).limit(50);
    }),

    markAsRead: authedProcedure
      .input(z.object({ notificationId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, input.notificationId), eq(notifications.userId, ctx.user.id))).returning();
      }),
  }),

  connection: router({
    list: authedProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(connections)
        .where(sql`${connections.requesterId} = ${ctx.user.id} OR ${connections.addresseeId} = ${ctx.user.id}`);
    }),

    request: authedProcedure
      .input(z.object({ addresseeId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(connections).values({ requesterId: ctx.user.id, addresseeId: input.addresseeId, status: 'pending' }).returning();
      }),

    accept: authedProcedure
      .input(z.object({ requesterId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.update(connections).set({ status: 'accepted' })
          .where(and(eq(connections.requesterId, input.requesterId), eq(connections.addresseeId, ctx.user.id))).returning();
      }),
  }),

  savedItem: router({
    list: authedProcedure.query(async ({ ctx }) => {
      return ctx.db.select().from(savedItems).where(eq(savedItems.userId, ctx.user.id)).orderBy(desc(savedItems.createdAt));
    }),

    save: authedProcedure
      .input(z.object({ itemId: z.string().uuid(), itemType: z.enum(['project', 'freelancer', 'portfolio_item']) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.insert(savedItems).values({ ...input, userId: ctx.user.id } as any).returning();
      }),

    remove: authedProcedure
      .input(z.object({ itemId: z.string().uuid(), itemType: z.enum(['project', 'freelancer', 'portfolio_item']) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.db.delete(savedItems)
          .where(and(eq(savedItems.userId, ctx.user.id), eq(savedItems.itemId, input.itemId), eq(savedItems.itemType, input.itemType))).returning();
      }),
  }),
});

export type AppRouter = typeof appRouter;
