// Club model placeholder. You may re-export or extend BookClub here. 
export interface Club {
    id: string;
    name: string;
    description: string;
    coverImageUrl?: string;
    ownerId: string; // FK to User
    isPublic: boolean;
    language?: string;
    genre?: string;
    tags?: string[];
    weeklyMeetingTime?: string;
    activityLevel?: string;
    membershipType?: string;
    createdAt: Date;
    updatedAt: Date;
    // UI/Stats
    views: number;
    likes: number;
    rating?: number;
    currentlyReadingTitle?: string;
    currentlyReadingAuthor?: string;
    nextMeeting?: Date;
    memberCount: number;
} 