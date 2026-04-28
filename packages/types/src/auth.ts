export interface UserSession {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: 'freelancer' | 'client' | 'both' | 'admin';
  isVerified: boolean;
}

export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
}

export interface MagicLinkToken {
  email: string;
  token: string;
  expiresAt: Date;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat: number;
  exp: number;
}
