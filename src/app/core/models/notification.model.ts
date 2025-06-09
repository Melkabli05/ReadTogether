import { NotificationType } from './notification-type.enum';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string; // FK to User
  toUserId: string;   // FK to User
  message: string;
  link: string;
  isRead: boolean;
  createdAt: Date;
  isArchived?: boolean;
} 