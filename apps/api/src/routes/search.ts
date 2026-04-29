import { FastifyInstance } from 'fastify';
import { db, users, projects, portfolioItems } from '@freelancex/db';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function searchRoutes(server: FastifyInstance) {
  // Global search
  server.get('/', async (request, reply) => {
    const { q, type } = request.query as { q?: string; type?: 'all' | 'freelancers' | 'projects' | 'portfolio' };

    if (!q || q.length < 2) {
      return reply.status(400).send({ error: 'Query must be at least 2 characters' });
    }

    const searchType = type || 'all';
    const results: any = {};

    if (searchType === 'all' || searchType === 'freelancers') {
      results.freelancers = await db.select()
        .from(users)
        .where(sql`${users.username} ILIKE ${'%' + q + '%'} OR ${users.fullName} ILIKE ${'%' + q + '%'}`)
        .limit(20);
    }

    if (searchType === 'all' || searchType === 'projects') {
      results.projects = await db.select()
        .from(projects)
        .where(
          and(
            eq(projects.status, 'open'),
            sql`${projects.title} ILIKE ${'%' + q + '%'} OR ${projects.description} ILIKE ${'%' + q + '%'}`
          )
        )
        .orderBy(desc(projects.createdAt))
        .limit(20);
    }

    if (searchType === 'all' || searchType === 'portfolio') {
      results.portfolio = await db.select()
        .from(portfolioItems)
        .where(
          sql`${portfolioItems.title} ILIKE ${'%' + q + '%'} OR ${portfolioItems.description} ILIKE ${'%' + q + '%'}`
        )
        .limit(20);
    }

    return reply.send(results);
  });

  // Search freelancers
  server.get('/freelancers', async (request, reply) => {
    const { q, skill, minRate, maxRate, availability } = request.query as {
      q?: string;
      skill?: string;
      minRate?: string;
      maxRate?: string;
      availability?: string;
    };

    let query = db.select().from(users).where(eq(users.role, 'freelancer')) as any;

    if (q) {
      query = query.where(sql`${users.username} ILIKE ${'%' + q + '%'} OR ${users.fullName} ILIKE ${'%' + q + '%'}`);
    }

    const result = await query.limit(50);
    return reply.send(result);
  });

  // Search projects
  server.get('/projects', async (request, reply) => {
    const { q, category, type, minBudget, maxBudget } = request.query as {
      q?: string;
      category?: string;
      type?: string;
      minBudget?: string;
      maxBudget?: string;
    };

    let conditions: any[] = [eq(projects.status, 'open')];

    if (q) {
      conditions.push(sql`${projects.title} ILIKE ${'%' + q + '%'} OR ${projects.description} ILIKE ${'%' + q + '%'}`);
    }

    if (category) {
      conditions.push(eq(projects.categoryId, category));
    }

    if (type) {
      conditions.push(eq(projects.type, type as any));
    }

    const result = await db.select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(desc(projects.createdAt))
      .limit(50);

    return reply.send(result);
  });

  // Search portfolio items
  server.get('/portfolio', async (request, reply) => {
    const { q, category, skill } = request.query as {
      q?: string;
      category?: string;
      skill?: string;
    };

    let conditions: any[] = [];

    if (q) {
      conditions.push(sql`${portfolioItems.title} ILIKE ${'%' + q + '%'} OR ${portfolioItems.description} ILIKE ${'%' + q + '%'}`);
    }

    if (category) {
      conditions.push(eq(portfolioItems.category, category));
    }

    if (skill) {
      conditions.push(sql`${skill} = ANY(${portfolioItems.skillsUsed})`);
    }

    const query = conditions.length > 0
      ? db.select().from(portfolioItems).where(and(...conditions)).limit(50)
      : db.select().from(portfolioItems).limit(50);

    const result = await query;
    return reply.send(result);
  });
}
