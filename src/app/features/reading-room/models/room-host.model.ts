export interface RoomHost {
  /** Unique room host ID */
  readonly id: string;
  /** Associated room ID */
  readonly roomId: string;
  /** Associated user ID */
  readonly userId: string;
  /** Timestamp when the host was assigned */
  readonly assignedAt: Date;
}
