import { User } from './user.model';

export interface ChatMessage {
  id: string;
  contextId: string;
  author: User;
  content: string;
  timestamp: Date;
  type?: 'text';
} 