import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  numeric,
  pgEnum,
  index,
  primaryKey,
  vector,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';


// Enums
export const userRoleEnum = pgEnum('user_role', ['freelancer', 'client', 'both', 'admin']);
export const availabilityEnum = pgEnum('availability', ['available', 'busy', 'not_available']);
export const projectStatusEnum = pgEnum('project_status', ['draft', 'open', 'in_progress', 'review', 'completed', 'cancelled', 'disputed']);
export const projectTypeEnum = pgEnum('project_type', ['fixed', 'hourly', 'milestone']);
export const projectVisibilityEnum = pgEnum('project_visibility', ['public', 'invite_only', 'connections']);
export const taskStatusEnum = pgEnum('task_status', ['backlog', 'todo', 'in_progress', 'review', 'done']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const milestoneStatusEnum = pgEnum('milestone_status', ['pending', 'in_review', 'approved', 'paid']);
export const proposalStatusEnum = pgEnum('proposal_status', ['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn']);
export const contractStatusEnum = pgEnum('contract_status', ['draft', 'sent', 'signed', 'active', 'completed', 'terminated']);
export const conversationTypeEnum = pgEnum('conversation_type', ['direct', 'project', 'group']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'file', 'image', 'video', 'system', 'contract_request', 'payment_request']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'escrowed', 'released', 'refunded', 'disputed']);
export const escrowStatusEnum = pgEnum('escrow_status', ['pending', 'funded', 'released', 'disputed', 'refunded']);
export const connectionStatusEnum = pgEnum('connection_status', ['pending', 'accepted', 'blocked']);
export const savedItemTypeEnum = pgEnum('saved_item_type', ['project', 'freelancer', 'portfolio_item']);
export const memberRoleEnum = pgEnum('member_role', ['lead', 'collaborator', 'reviewer', 'observer']);
export const memberStatusEnum = pgEnum('member_status', ['pending', 'accepted', 'declined', 'removed']);
export const skillLevelEnum = pgEnum('skill_level', ['beginner', 'intermediate', 'expert']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  bio: text('bio'),
  tagline: text('tagline'),
  role: userRoleEnum('role').default('freelancer').notNull(),
  isVerified: boolean('is_verified').default(false),
  isOnline: boolean('is_online').default(false),
  lastSeenAt: timestamp('last_seen_at'),
  onboardingComplete: boolean('onboarding_complete').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Freelancer profiles
export const freelancerProfiles = pgTable('freelancer_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  headline: text('headline'),
  hourlyRateMin: numeric('hourly_rate_min', { precision: 10, scale: 2 }),
  hourlyRateMax: numeric('hourly_rate_max', { precision: 10, scale: 2 }),
  availability: availabilityEnum('availability').default('available'),
  timezone: text('timezone'),
  locationCountry: text('location_country'),
  locationCity: text('location_city'),
  yearsExperience: integer('years_experience'),
  totalEarned: numeric('total_earned', { precision: 12, scale: 2 }).default('0'),
  jobsCompleted: integer('jobs_completed').default(0),
  responseTimeHrs: integer('response_time_hrs'),
  ratingAvg: numeric('rating_avg', { precision: 3, scale: 2 }).default('0'),
  ratingCount: integer('rating_count').default(0),
  profileViews: integer('profile_views').default(0),
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  iconUrl: text('icon_url'),
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id),

});

// Skills
export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  categoryId: uuid('category_id').references(() => categories.id),
});

// User skills
export const userSkills = pgTable('user_skills', {
  userId: uuid('user_id').references(() => users.id).notNull(),
  skillId: uuid('skill_id').references(() => skills.id).notNull(),
  level: skillLevelEnum('level').default('beginner').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.skillId] }),
}));

// Portfolio items
export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  coverUrl: text('cover_url'),
  mediaUrls: jsonb('media_urls').$type<{ url: string; type: string; caption?: string }[]>().default([]),
  videoUrl: text('video_url'),
  liveUrl: text('live_url'),
  repoUrl: text('repo_url'),
  category: text('category'),
  skillsUsed: text('skills_used').array().default([]),
  featured: boolean('featured').default(false),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  position: integer('position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  detailedBrief: text('detailed_brief'),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  leadFreelancerId: uuid('lead_freelancer_id').references(() => users.id),
  categoryId: uuid('category_id').references(() => categories.id),
  status: projectStatusEnum('status').default('draft').notNull(),
  type: projectTypeEnum('type').default('fixed').notNull(),
  budgetMin: numeric('budget_min', { precision: 10, scale: 2 }),
  budgetMax: numeric('budget_max', { precision: 10, scale: 2 }),
  durationDays: integer('duration_days'),
  deadline: timestamp('deadline'),
  isPrivate: boolean('is_private').default(false),
  requiredSkills: text('required_skills').array().default([]),
  attachments: jsonb('attachments').$type<{ url: string; name: string; size: number }[]>().default([]),
  visibility: projectVisibilityEnum('visibility').default('public').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  clientIdx: index('project_client_idx').on(table.clientId),
  statusIdx: index('project_status_idx').on(table.status),
  categoryIdx: index('project_category_idx').on(table.categoryId),
}));

// Project members
export const projectMembers = pgTable('project_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: memberRoleEnum('role').default('collaborator').notNull(),
  invitedBy: uuid('invited_by').references(() => users.id),
  status: memberStatusEnum('status').default('pending').notNull(),
  revenueShare: numeric('revenue_share', { precision: 5, scale: 2 }),
  joinedAt: timestamp('joined_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Project tasks
export const projectTasks = pgTable('project_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('backlog').notNull(),
  priority: taskPriorityEnum('priority').default('medium').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  dueDate: timestamp('due_date'),
  estimatedHrs: numeric('estimated_hrs', { precision: 6, scale: 2 }),
  loggedHrs: numeric('logged_hrs', { precision: 6, scale: 2 }).default('0'),
  position: integer('position'),
  parentTaskId: uuid('parent_task_id').references((): AnyPgColumn => projectTasks.id),

  tags: text('tags').array().default([]),
  attachments: jsonb('attachments').$type<{ url: string; name: string; size: number }[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Milestones
export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  title: text('title'),
  description: text('description'),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  dueDate: timestamp('due_date'),
  status: milestoneStatusEnum('status').default('pending').notNull(),
  deliverables: jsonb('deliverables').$type<{ url: string; name: string }[]>().default([]),
  approvedAt: timestamp('approved_at'),
  approvedBy: uuid('approved_by').references(() => users.id),
});

// Proposals
export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  freelancerId: uuid('freelancer_id').references(() => users.id).notNull(),
  coverLetter: text('cover_letter'),
  proposedRate: numeric('proposed_rate', { precision: 10, scale: 2 }),
  estimatedDays: integer('estimated_days'),
  attachments: jsonb('attachments').$type<{ url: string; name: string; size: number }[]>().default([]),
  status: proposalStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Contracts
export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  clientId: uuid('client_id').references(() => users.id).notNull(),
  freelancerId: uuid('freelancer_id').references(() => users.id).notNull(),
  terms: text('terms'),
  rate: numeric('rate', { precision: 10, scale: 2 }),
  type: projectTypeEnum('type').default('fixed').notNull(),
  status: contractStatusEnum('status').default('draft').notNull(),
  signedAt: timestamp('signed_at'),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Conversations
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: conversationTypeEnum('type').default('direct').notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  lastMessageAt: timestamp('last_message_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Conversation members
export const conversationMembers = pgTable('conversation_members', {
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  isAdmin: boolean('is_admin').default(false),
  unreadCount: integer('unread_count').default(0),
  lastReadAt: timestamp('last_read_at'),
}, (table) => ({
  pk: primaryKey({ columns: [table.conversationId, table.userId] }),
}));

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content'),
  type: messageTypeEnum('type').default('text').notNull(),
  metadata: jsonb('metadata').default({}),
  isEdited: boolean('is_edited').default(false),
  replyToId: uuid('reply_to_id').references((): AnyPgColumn => messages.id),

  reactions: jsonb('reactions').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  title: text('title'),
  body: text('body'),
  data: jsonb('data').default({}),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reviews
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractId: uuid('contract_id').references(() => contracts.id).notNull(),
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  revieweeId: uuid('reviewee_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  headline: text('headline'),
  body: text('body'),
  skillsRatings: jsonb('skills_ratings').default({}),
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  contractId: uuid('contract_id').references(() => contracts.id).notNull(),
  milestoneId: uuid('milestone_id').references(() => milestones.id),
  payerId: uuid('payer_id').references(() => users.id).notNull(),
  payeeId: uuid('payee_id').references(() => users.id).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  platformFee: numeric('platform_fee', { precision: 10, scale: 2 }),
  freelancerPayout: numeric('freelancer_payout', { precision: 10, scale: 2 }),
  currency: text('currency').default('usd'),
  stripePaymentId: text('stripe_payment_id'),
  stripeTransferId: text('stripe_transfer_id'),
  status: paymentStatusEnum('status').default('pending').notNull(),
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Connections
export const connections = pgTable('connections', {
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  addresseeId: uuid('addressee_id').references(() => users.id).notNull(),
  status: connectionStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.requesterId, table.addresseeId] }),
}));

// Saved items
export const savedItems = pgTable('saved_items', {
  userId: uuid('user_id').references(() => users.id).notNull(),
  itemId: uuid('item_id').notNull(),
  itemType: savedItemTypeEnum('item_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.itemId, table.itemType] }),
}));

// Time logs
export const timeLogs = pgTable('time_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').references(() => projectTasks.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  hours: numeric('hours', { precision: 6, scale: 2 }).notNull(),
  description: text('description'),
  loggedAt: timestamp('logged_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Activity feed
export const activityFeed = pgTable('activity_feed', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: uuid('actor_id').references(() => users.id).notNull(),
  verb: text('verb').notNull(),
  objectType: text('object_type').notNull(),
  objectId: uuid('object_id').notNull(),
  targetType: text('target_type'),
  targetId: uuid('target_id'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI match scores
export const aiMatchScores = pgTable('ai_match_scores', {
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  score: numeric('score', { precision: 5, scale: 4 }).notNull(),
  reasons: text('reasons').array().default([]),
  computedAt: timestamp('computed_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.userId] }),
}));

// Escrows (legacy table for compatibility)
export const escrows = pgTable('escrows', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull().unique(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: escrowStatusEnum('status').default('pending').notNull(),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Lucia sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});
