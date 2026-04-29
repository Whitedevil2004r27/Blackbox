export interface Payment {
  id: string;
  contractId: string;
  milestoneId: string | null;
  payerId: string;
  payeeId: string;
  amount: number;
  platformFee: number;
  freelancerPayout: number;
  currency: string;
  stripePaymentId: string | null;
  stripeTransferId: string | null;
  status: 'pending' | 'escrowed' | 'released' | 'refunded' | 'disputed';
  releasedAt: Date | null;
  createdAt: Date;
}

export interface Escrow {
  id: string;
  projectId: string;
  amount: number;
  status: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';
  stripePaymentIntentId: string | null;
  releasedAt: Date | null;
  createdAt: Date;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stripePayoutId: string | null;
  createdAt: Date;
  completedAt: Date | null;
}
