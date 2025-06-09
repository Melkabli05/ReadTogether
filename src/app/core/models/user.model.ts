import { LanguageProficiency } from "./language-proficiency.enum";

export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  bio?: string;
  email: string;
  readingInterests: string[];
  languages: {
    code: string;
    proficiency: LanguageProficiency;
  }[];
  followers: string[];
  following: string[];
  blockedUsers: string[];
  stats: {
    stagesHosted: number;
    kudosReceived: number;
    partnersReadWith: number;
  };
  isOnline?: boolean;
  lastActive?: Date;
  badge?: string;
  badgeDescription?: string;
}

export function mapUserFromDb(db: any): User {
  return {
    id: db.id,
    username: db.username,
    displayName: db.display_name,
    profilePictureUrl: db.profile_picture_url,
    createdAt: db.created_at ? new Date(db.created_at) : new Date(0),
    updatedAt: db.updated_at ? new Date(db.updated_at) : new Date(0),
    bio: db.bio ?? undefined,
    email: db.email,
    readingInterests: Array.isArray(db.reading_interests) ? db.reading_interests : [],
    languages: Array.isArray(db.languages) ? db.languages : [],
    followers: Array.isArray(db.followers) ? db.followers : [],
    following: Array.isArray(db.following) ? db.following : [],
    blockedUsers: Array.isArray(db.blocked_users) ? db.blocked_users : [],
    stats: db.stats ?? { stagesHosted: 0, kudosReceived: 0, partnersReadWith: 0 },
    isOnline: typeof db.is_online === 'boolean' ? db.is_online : undefined,
    lastActive: db.last_active ? new Date(db.last_active) : undefined,
    badge: db.badge ?? undefined,
    badgeDescription: db.badge_description ?? undefined,
  };
} 


