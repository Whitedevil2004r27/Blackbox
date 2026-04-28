import { FastifyInstance } from 'fastify';
import { db, payments, escrows, contracts, milestones, users } from '@freelancex/db';
import { eq, or, desc } from 'drizzle-orm';

export async function paymentRoutes(server: FastifyInstance) {
  // Create Stripe setup intent
  server.post('/setup-intent', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    // TODO: Create Stripe setup intent via Stripe SDK
    return reply.send({ clientSecret: 'seti_xxxxxxxxxx_secret_xxxxxxxxxx' });
  });

  // Create escrow payment for a contract
  server.post('/create', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as {
      contractId: string;
      milestoneId?: string;
      payeeId: string;
      amount: number;
      currency?: string;
    };

    if (!body.contractId || !body.payeeId || !body.amount) {
      return reply.status(400).send({ error: 'contractId, payeeId, and amount are required' });
    }

    const amount = body.amount;
    const platformFee = (amount * 0.1).toFixed(2);
    const freelancerPayout = (amount * 0.9).toFixed(2);

    const [payment] = await db.insert(payments).values({
      contractId: body.contractId,
      milestoneId: body.milestoneId || null,
      payerId: userId,
      payeeId: body.payeeId,
      amount: amount.toFixed(2),
      platformFee,
      freelancerPayout,
      currency: body.currency || 'usd',
      status: 'pending',
    }).returning();

    // Update escrow status
    await db.update(escrows)
      .set({ status: 'funded' })
      .where(eq(escrows.projectId, body.contractId));

    return reply.status(201).send(payment);
  });

  // Release payment from escrow
  server.post('/:id/release', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    // Verify payer
    const existing = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Payment not found' });
    }

    if (existing[0].payerId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const [updated] = await db.update(payments)
      .set({ status: 'released', releasedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();

    // TODO: Initiate Stripe Connect transfer to freelancer
    return reply.send(updated);
  });

  // Dispute payment
  server.post('/:id/dispute', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };

    const existing = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    if (existing.length === 0) {
      return reply.status(404).send({ error: 'Payment not found' });
    }

    // Either party can dispute
    const payment = existing[0];
    if (payment.payerId !== userId && payment.payeeId !== userId) {
      return reply.status(403).send({ error: 'Forbidden' });
    }

    const [updated] = await db.update(payments)
      .set({ status: 'disputed' })
      .where(eq(payments.id, id))
      .returning();

    return reply.send(updated);
  });

  // Get payment history
  server.get('/history', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const result = await db.select().from(payments)
      .where(
        or(
          eq(payments.payerId, userId),
          eq(payments.payeeId, userId)
        )
      )
      .orderBy(desc(payments.createdAt));

    return reply.send(result);
  });

  // Get Stripe Connect balance
  server.get('/balance', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    // TODO: Fetch actual balance from Stripe Connect API
    return reply.send({
      available: 0,
      pending: 0,
      currency: 'usd',
    });
  });

  // Withdraw funds
  server.post('/withdraw', async (request, reply) => {
    const userId = (request as any).userId as string | undefined;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const body = request.body as { amount: number; accountId: string };
    if (!body.amount || !body.accountId) {
      return reply.status(400).send({ error: 'amount and accountId are required' });
    }

    // TODO: Create Stripe payout
    return reply.send({
      message: 'Withdrawal initiated',
      amount: body.amount,
      status: 'pending',
    });
  });

  // Stripe webhook handler
  server.post('/stripe/webhook', async (request, reply) => {
    // TODO: Validate Stripe signature, handle events
    return reply.send({ received: true });
  });
}
