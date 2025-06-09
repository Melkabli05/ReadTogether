export type ClubRole = 'member' | 'admin' | 'owner';

export interface ClubMembership {
  id: string;
  clubId: string; // FK to Club
  userId: string; // FK to User
  role: ClubRole;
  joinedAt: Date;
  isActive: boolean;
}
