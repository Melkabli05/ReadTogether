import {User} from '../../../core/models/user.model';
import {ReadingTurn} from './reading-turn.model';
import {RoomStatus} from './room-status.enum';

// Represents a real-time reading room
export interface Room {
  /** Unique room ID */
  readonly id: string;
  /** Room title */
  readonly title: string;
  /** Room description */
  readonly description: string;
  /** Room status */
  readonly status: RoomStatus;
  /** Associated text content ID */
  readonly textContentId: string;
  /** Room language (ISO code) */
  readonly language: string;
  /** Associated book club ID (optional) */
  readonly bookClubId?: string;
  /** Hosts (users with moderator/reader privileges) */
  readonly hosts: User[];
  /** Current reader's user ID (optional) */
  readonly currentReaderId?: string;
  /** Current reading position in the text */
  readonly currentPosition: {
    paragraphIndex: number;
    wordIndex: number;
  };
  /** Reading order (user IDs, optional) */
  readonly readingOrder?: string[];
  /** Reading turns (optional) */
  readonly readingTurns?: ReadingTurn[];
  /** Number of audience members */
  readonly audienceCount: number;
  /** Scheduled time for the room */
  readonly scheduledTime: Date;
  /** Actual start time (optional) */
  readonly startTime?: Date;
  /** Actual end time (optional) */
  readonly endTime?: Date;
  /** Tags for the room */
  readonly tags: string[];
  /** Timestamp for when the room was created */
  readonly createdAt: Date;
  /** Timestamp for when the room was last updated */
  readonly updatedAt: Date;
}
