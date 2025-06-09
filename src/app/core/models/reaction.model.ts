export interface Reaction {
  id: string;
  stageId: string; // FK to Room or Stage
  authorId: string; // FK to User
  emoji: string;
  timestamp: Date;
  targetParagraphIndex?: number;
} 