import { LanguageProficiency } from './language-proficiency.enum';

export interface UserProfile {
  userId: string; // FK to User
  profilePicture?: string;
  displayName?: string;
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
  createdAt: Date;
  updatedAt: Date;
} 