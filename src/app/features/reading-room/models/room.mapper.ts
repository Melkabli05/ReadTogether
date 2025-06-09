import { Room } from './room.model';
import { RoomStatus } from './room-status.enum';

export function mapRoomFromDb(db: any): Room {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    status: db.status as RoomStatus,
    textContentId: db.text_content_id,
    language: db.language,
    bookClubId: db.book_club_id ?? undefined,
    hosts: [], // Hosts must be fetched separately
    currentReaderId: db.current_reader_id ?? undefined,
    currentPosition: db.current_position ?? { paragraphIndex: 0, wordIndex: 0 },
    readingOrder: db.reading_order ?? undefined,
    readingTurns: db.reading_turns ?? undefined,
    audienceCount: db.audience_count ?? 0,
    scheduledTime: db.scheduled_time ? new Date(db.scheduled_time) : new Date(0),
    startTime: db.start_time ? new Date(db.start_time) : undefined,
    endTime: db.end_time ? new Date(db.end_time) : undefined,
    tags: Array.isArray(db.tags) ? db.tags : [],
    createdAt: db.created_at ? new Date(db.created_at) : new Date(0),
    updatedAt: db.updated_at ? new Date(db.updated_at) : new Date(0),
  };
} 