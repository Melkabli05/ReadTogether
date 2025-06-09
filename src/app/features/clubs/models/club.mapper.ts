import { Club } from './club.model';

export function mapClubFromDb(db: any): Club {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    coverImageUrl: db.cover_image_url,
    ownerId: db.owner_id,
    isPublic: db.is_public,
    language: db.language,
    genre: db.genre,
    tags: db.tags,
    weeklyMeetingTime: db.weekly_meeting_time,
    activityLevel: db.activity_level,
    membershipType: db.membership_type,
    createdAt: db.created_at ? new Date(db.created_at) : new Date(0),
    updatedAt: db.updated_at ? new Date(db.updated_at) : new Date(0),   
    views: db.views,
    likes: db.likes,
    rating: db.rating,
    currentlyReadingTitle: db.currently_reading_title,
    currentlyReadingAuthor: db.currently_reading_author,
    nextMeeting: db.next_meeting ? new Date(db.next_meeting) : undefined,
    memberCount: db.member_count,
  };
}
