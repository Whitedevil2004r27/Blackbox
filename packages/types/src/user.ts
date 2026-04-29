export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  tagline: string | null;
  role: 'freelancer' | 'client' | 'both';
  isVerified: boolean;
  isOnline: boolean;
  lastSeenAt: Date | null;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  headline: string | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  availability: 'available' | 'busy' | 'not_available';
  timezone: string | null;
  locationCountry: string | null;
  locationCity: string | null;
  yearsExperience: number | null;
  totalEarned: number;
  jobsCompleted: number;
  responseTimeHrs: number | null;
  ratingAvg: number;
  ratingCount: number;
  profileViews: number;
  embedding: number[] | null;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  categoryId: string | null;
}

export interface UserSkill {
  userId: string;
  skillId: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  mediaUrls: { url: string; type: string; caption?: string }[];
  videoUrl: string | null;
  liveUrl: string | null;
  repoUrl: string | null;
  category: string | null;
  skillsUsed: string[];
  featured: boolean;
  views: number;
  likes: number;
  position: number;
  createdAt: Date;
}

export interface Connection {
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

export interface SavedItem {
  userId: string;
  itemId: string;
  itemType: 'project' | 'freelancer' | 'portfolio_item';
  createdAt: Date;
}
