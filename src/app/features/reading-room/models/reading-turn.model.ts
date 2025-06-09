// Represents a single user's reading turn in a room
export interface ReadingTurn {
  /** The user ID of the reader */
  readonly userId: string;
  /** When the turn started */
  readonly startedAt: Date;
  /** When the turn ended (optional, if still ongoing) */
  readonly endedAt?: Date;
  /** Number of paragraphs read during this turn */
  readonly paragraphsRead: number;
} 