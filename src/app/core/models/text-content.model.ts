import { TextContentType } from './text-content-type.enum';

export interface TextContent {
  id: string;
  title: string;
  author: string;
  content: string;
  type: TextContentType;
  genre: string;
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  coverImageUrl?: string;
  uploaderId: string; // FK to User
  isPublicDomain: boolean;
  wordCount: number;
  estimatedReadingTime?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
} 