import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import cookie from '@fastify/cookie';
import { appRouter } from '@freelancex/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { db } from '@freelancex/db';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { projectRoutes } from './routes/projects';
import { paymentRoutes } from './routes/payments';
import { messageRoutes } from './routes/messages';
import { searchRoutes } from './routes/search';

export async function buildServer() {
  const server = Fastify({
    logger: true,
    trustProxy: true,
  });

  // Decorate Fastify instance with db for use in routes
  server.decorate('db', db);

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Swagger documentation
  await server.register(swagger, {
    openapi: {
      info: {
        title: 'FreelanceX API',
        description: 'Next-generation freelancing platform API',
        version: '1.0.0',
      },
      servers: [{ url: '/api/v1' }],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await server.register(cookie);

  // Health check
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // tRPC handler with real db context
  server.all('/api/trpc/*', async (request, reply) => {
    const req = request.raw as unknown as Request;
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: () => ({
        session: { user: null, sessionId: null },
        db,
        req,
        res: reply.raw as any,
      }),
    });

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    reply.send(response.body);
  });

  // Register API routes
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(userRoutes, { prefix: '/api/v1/users' });
  await server.register(projectRoutes, { prefix: '/api/v1/projects' });
  await server.register(paymentRoutes, { prefix: '/api/v1/payments' });
  await server.register(messageRoutes, { prefix: '/api/v1/messages' });
  await server.register(searchRoutes, { prefix: '/api/v1/search' });

  return server;
}
