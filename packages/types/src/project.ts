export interface Project {
  id: string;
  title: string;
  description: string | null;
  detailedBrief: string | null;
  clientId: string;
  leadFreelancerId: string | null;
  categoryId: string | null;
  status: 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'disputed';
  type: 'fixed' | 'hourly' | 'milestone';
  budgetMin: number | null;
  budgetMax: number | null;
  durationDays: number | null;
  deadline: Date | null;
  isPrivate: boolean;
  requiredSkills: string[];
  attachments: { url: string; name: string; size: number }[];
  visibility: 'public' | 'invite_only' | 'connections';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'lead' | 'collaborator' | 'reviewer' | 'observer';
  invitedBy: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'removed';
  revenueShare: number;
  joinedAt: Date | null;
  createdAt: Date;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string | null;
  createdBy: string;
  dueDate: Date | null;
  estimatedHrs: number | null;
  loggedHrs: number;
  position: number;
  parentTaskId: string | null;
  tags: string[];
  attachments: { url: string; name: string; size: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string | null;
  description: string | null;
  amount: number | null;
  dueDate: Date | null;
  status: 'pending' | 'in_review' | 'approved' | 'paid';
  deliverables: { url: string; name: string }[];
  approvedAt: Date | null;
  approvedBy: string | null;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string | null;
  proposedRate: number | null;
  estimatedDays: number | null;
  attachments: { url: string; name: string; size: number }[];
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
}

export interface Contract {
  id: string;
  projectId: string;
  clientId: string;
  freelancerId: string;
  terms: string | null;
  rate: number | null;
  type: 'fixed' | 'hourly';
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'terminated';
  signedAt: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
}

export interface TimeLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string | null;
  loggedAt: Date;
  createdAt: Date;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  headline: string | null;
  body: string | null;
  skillsRatings: Record<string, number>;
  isPublic: boolean;
  createdAt: Date;
}

export interface ActivityFeedItem {
  id: string;
  actorId: string;
  verb: string;
  objectType: string;
  objectId: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface AIMatchScore {
  projectId: string;
  userId: string;
  score: number;
  reasons: string[];
  computedAt: Date;
}
