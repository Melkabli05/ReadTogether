export interface Annotation {
  id: string;
  roomId: string; // FK to Room
  authorId: string; // FK to User
  type: 'correction' | 'note' | 'question';
  text: string;
  targetWord?: string;
  position: {
    start: number;
    end: number;
  };
  createdAt: Date;
  resolved?: boolean;
} 