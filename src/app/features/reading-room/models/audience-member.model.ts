import { User } from '../../../core/models/user.model';
import { AudienceRole } from './audience-role.enum';

export interface AudienceMember {
  /** Unique audience member ID */
  readonly id: string;
  /** Associated room ID */
  readonly roomId: string;
  /** Associated user ID */
  readonly userId: string;
  /** Role of the audience member */
  readonly role: AudienceRole;
  /** Timestamp when the user joined */
  readonly joinedAt: Date;
} 