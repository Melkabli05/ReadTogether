export interface NotificationItem {
  readonly id: string;
  readonly type: 'invitation' | 'accepted' | 'message' | 'reminder' | 'comment';
  readonly text: string;
  readonly time: string;
  readonly read: boolean;
}

export interface NotificationGroup {
  readonly group: string;
  readonly items: readonly NotificationItem[];
} 