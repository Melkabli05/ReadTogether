import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './SupabaseClient';
import { User } from '../models/user.model';
import { UserProfile } from '../models/user-profile.model';
import { Club } from '../../features/clubs/models/club.model';
import { ClubMembership, ClubRole } from '../../features/clubs/models/club-membership.model';
import { TextContent } from '../models/text-content.model';
import { TextContentType } from '../models/text-content-type.enum';
import { Room } from '../../features/reading-room/models/room.model';
import { RoomStatus } from '../../features/reading-room/models/room-status.enum';
import { AudienceMember } from '../../features/reading-room/models/audience-member.model';
import { AudienceRole } from '../../features/reading-room/models/audience-role.enum';
import { ReadingTurn } from '../../features/reading-room/models/reading-turn.model';
import { Annotation } from '../models/annotation.model';
import { Reaction } from '../models/reaction.model';
import { Notification } from '../models/notification.model';
import { NotificationType } from '../models/notification-type.enum';
import { LanguageProficiency } from '../models/language-proficiency.enum';

@Injectable({ providedIn: 'root' })
export class SeedService {
  private readonly supabase = inject(SupabaseClientService).supabase;

  // Helper arrays for generating realistic fake data
  private readonly firstNames = [
    'Alex', 'Blake', 'Casey', 'Dana', 'Eli', 'Finn', 'Grace', 'Harper', 'Indie', 'Jules',
    'Kai', 'Luna', 'Max', 'Nova', 'Oliver', 'Parker', 'Quinn', 'River', 'Sage', 'Taylor',
    'Uma', 'Vale', 'West', 'Xara', 'Yuki', 'Zara', 'Ash', 'Bryce', 'Cedar', 'Drew',
    'Echo', 'Fern', 'Gale', 'Haven', 'Iris', 'Jax', 'Koda', 'Lake', 'Mars', 'Noel'
  ];

  private readonly lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ];

  private readonly bookTitles = [
    'The Midnight Library', 'Dune', 'To Kill a Mockingbird', '1984', 'Pride and Prejudice',
    'The Great Gatsby', 'Harry Potter', 'Lord of the Rings', 'The Catcher in the Rye', 'Brave New World',
    'The Hobbit', 'Jane Eyre', 'Wuthering Heights', 'The Chronicles of Narnia', 'Animal Farm',
    'Fahrenheit 451', 'The Handmaid\'s Tale', 'Gone Girl', 'The Girl with the Dragon Tattoo', 'The Kite Runner'
  ];

  private readonly authors = [
    'Matt Haig', 'Frank Herbert', 'Harper Lee', 'George Orwell', 'Jane Austen',
    'F. Scott Fitzgerald', 'J.K. Rowling', 'J.R.R. Tolkien', 'J.D. Salinger', 'Aldous Huxley',
    'Charlotte Brontë', 'Emily Brontë', 'C.S. Lewis', 'Ray Bradbury', 'Margaret Atwood',
    'Gillian Flynn', 'Stieg Larsson', 'Khaled Hosseini', 'Stephen King', 'Agatha Christie'
  ];

  private readonly genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy',
    'Horror', 'Biography', 'History', 'Poetry', 'Drama', 'Thriller', 'Adventure'
  ];

  private readonly languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
  ];

  private readonly clubNames = [
    'Book Lovers United', 'The Reading Circle', 'Literary Minds', 'Page Turners',
    'The Book Club', 'Reading Adventures', 'Story Seekers', 'Novel Ideas',
    'Bookworms Anonymous', 'The Literary Society', 'Reading Enthusiasts',
    'Chapter & Verse', 'The Book Nook', 'Literary Legends', 'Reading Rainbow'
  ];

  private readonly readingInterests = [
    'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Biography',
    'History', 'Poetry', 'Drama', 'Thriller', 'Adventure', 'Philosophy',
    'Psychology', 'Self-Help', 'Travel', 'Cooking', 'Art', 'Music'
  ];

  private readonly emojis = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '💯', '⭐', '📚', '✨'];

  // ENUM values (must match schema.sql exactly)
  private readonly languageProficiencyDbValues = ['learning', 'fluent', 'native'];
  private readonly roomStatusDbValues = ['pending', 'live', 'ended', 'scheduled', 'cancelled'];
  private readonly textContentTypeDbValues = ['book', 'article', 'short-story', 'script', 'poetry', 'other'];
  private readonly notificationTypeDbValues = [
    'invitation', 'accepted', 'message', 'reminder', 'comment',
    'new_follower', 'stage_starting', 'practice_invite', 'club_invite', 'new_club_post'
  ];
  private readonly audienceRoleDbValues = ['listener', 'speaker', 'raised_hand'];
  private readonly clubRoleDbValues = ['member', 'admin', 'owner'];
  private readonly readingLevelDbValues = ['beginner', 'intermediate', 'advanced'];

  // Utility methods
  private randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  private randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateUsername(): string {
    const firstName = this.randomElement(this.firstNames).toLowerCase();
    const number = Math.floor(Math.random() * 1000);
    return `${firstName}${number}`;
  }

  private generateEmail(username: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
    return `${username}@${this.randomElement(domains)}`;
  }

  async clearDatabase() {
    console.log('Clearing existing data...');
    
    // Delete in reverse dependency order
    await this.supabase.from('reactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('annotations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('reading_turns').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('audience_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('club_memberships').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('text_contents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('clubs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  async seedUsers(): Promise<User[]> {
    console.log('Seeding users...');
    const users: User[] = Array.from({ length: 100 }).map(() => {
      const firstName = this.randomElement(this.firstNames);
      const lastName = this.randomElement(this.lastNames);
      const username = this.generateUsername();
      const createdAt = this.randomDate(new Date('2023-01-01'), new Date());
      const updatedAt = new Date();
      const readingInterests = this.randomElements(this.readingInterests, Math.floor(Math.random() * 5) + 1);
      const languages = this.randomElements(this.languages, Math.floor(Math.random() * 3) + 1).map(lang => ({
        code: lang.code,
        proficiency: this.randomElement(['learning', 'fluent', 'native']) as LanguageProficiency
      }));
      const followers: string[] = [];
      const following: string[] = [];
      const blockedUsers: string[] = [];
      const stats = {
        stagesHosted: Math.floor(Math.random() * 20),
        kudosReceived: Math.floor(Math.random() * 100),
        partnersReadWith: Math.floor(Math.random() * 30)
      };
      const isOnline = Math.random() > 0.7;
      const lastActive = this.randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());
      const badge = Math.random() > 0.8 ? this.randomElement(['Super Reader', 'Book Enthusiast', 'Reading Mentor']) : undefined;
      const badgeDescription = badge ? 'Awarded for outstanding contribution to the reading community' : undefined;
      const bio = Math.random() > 0.5 ? 'A passionate reader and club member.' : undefined;
      const email = this.generateEmail(username);
      return {
        id: this.generateUUID(),
        username,
        displayName: `${firstName} ${lastName}`,
        profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt,
        updatedAt,
        email,
        bio,
        readingInterests,
        languages,
        followers,
        following,
        blockedUsers,
        stats,
        isOnline,
        lastActive,
        badge,
        badgeDescription,
      };
    });
    // Insert to DB with snake_case
    const dbUsers = users.map(u => ({
      id: u.id,
      username: u.username,
      display_name: u.displayName,
      profile_picture_url: u.profilePictureUrl,
      created_at: u.createdAt.toISOString(),
      updated_at: u.updatedAt.toISOString(),
      bio: u.bio,
      email: u.email,
      reading_interests: u.readingInterests,
      languages: u.languages,
      followers: u.followers,
      following: u.following,
      blocked_users: u.blockedUsers,
      stats: u.stats,
      is_online: u.isOnline,
      last_active: u.lastActive?.toISOString(),
      badge: u.badge,
      badge_description: u.badgeDescription,
    }));
    const batchSize = 50;
    for (let i = 0; i < dbUsers.length; i += batchSize) {
      await this.supabase.from('users').insert(dbUsers.slice(i, i + batchSize));
    }
    return users;
  }

  async seedTextContents(users: User[]): Promise<TextContent[]> {
    console.log('Seeding text contents...');
    const textContents: TextContent[] = [];
    const dbTextContents = [];
    for (let i = 0; i < 100; i++) {
      const title = this.randomElement(this.bookTitles);
      const author = this.randomElement(this.authors);
      const genre = this.randomElement(this.genres);
      const wordCount = Math.floor(Math.random() * 100000) + 10000;
      const createdAt = this.randomDate(new Date('2023-01-01'), new Date());
      const updatedAt = createdAt;
      const readingLevel = this.randomElement(['beginner', 'intermediate', 'advanced']) as 'beginner' | 'intermediate' | 'advanced';
      const textContent: TextContent = {
        id: this.generateUUID(),
        title: `${title} ${i > 0 ? `- Volume ${i + 1}` : ''}`,
        author: author,
        content: `This is the content of ${title} by ${author}. Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
        type: this.randomElement(['book', 'article', 'short-story', 'script', 'poetry', 'other']) as any,
        genre: genre,
        readingLevel,
        coverImageUrl: `https://picsum.photos/300/400?random=${i}`,
        uploaderId: this.randomElement(users).id,
        isPublicDomain: Math.random() > 0.7,
        wordCount,
        estimatedReadingTime: Math.ceil(wordCount / 200),
        rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
        createdAt,
        updatedAt,
      };
      textContents.push(textContent);
      dbTextContents.push({
        id: textContent.id,
        title: textContent.title,
        author: textContent.author,
        content: textContent.content,
        type: textContent.type,
        genre: textContent.genre,
        reading_level: textContent.readingLevel,
        cover_image_url: textContent.coverImageUrl,
        uploader_id: textContent.uploaderId,
        is_public_domain: textContent.isPublicDomain,
        word_count: textContent.wordCount,
        estimated_reading_time: textContent.estimatedReadingTime,
        rating: textContent.rating,
        created_at: textContent.createdAt.toISOString(),
        updated_at: textContent.updatedAt.toISOString(),
      });
    }
    const batchSize = 50;
    for (let i = 0; i < dbTextContents.length; i += batchSize) {
      await this.supabase.from('text_contents').insert(dbTextContents.slice(i, i + batchSize));
    }
    console.log('Text contents seeded successfully');
    return textContents;
  }

  async seedClubs(users: User[]): Promise<Club[]> {
    console.log('Seeding clubs...');
    const clubs: Club[] = [];
    const dbClubs = [];
    for (let i = 0; i < 100; i++) {
      const owner = this.randomElement(users);
      const createdAt = this.randomDate(new Date('2023-01-01'), new Date());
      const updatedAt = createdAt;
      const tags = this.randomElements(this.genres, Math.floor(Math.random() * 3) + 1);
      const club: Club = {
        id: this.generateUUID(),
        name: `${this.randomElement(this.clubNames)} ${i + 1}`,
        description: `A wonderful book club focused on ${this.randomElement(this.genres)} literature. Join us for engaging discussions and literary adventures!`,
        coverImageUrl: `https://picsum.photos/400/200?random=${i + 100}`,
        ownerId: owner.id,
        isPublic: true,
        language: this.randomElement(this.languages).code,
        genre: this.randomElement(this.genres),
        tags,
        weeklyMeetingTime: this.randomElement(['Monday 7PM', 'Wednesday 6PM', 'Friday 8PM', 'Sunday 3PM']),
        activityLevel: this.randomElement(['Low', 'Medium', 'High']),
        membershipType: this.randomElement(['Open', 'Invite Only', 'Application Required']),
        createdAt,
        updatedAt,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 200),
        rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
        currentlyReadingTitle: Math.random() > 0.5 ? this.randomElement(this.bookTitles) : undefined,
        currentlyReadingAuthor: Math.random() > 0.5 ? this.randomElement(this.authors) : undefined,
        nextMeeting: this.randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        memberCount: 0,
      };
      clubs.push(club);
      dbClubs.push({
        id: club.id,
        name: club.name,
        description: club.description,
        cover_image_url: club.coverImageUrl,
        owner_id: club.ownerId,
        is_public: club.isPublic,
        language: club.language,
        genre: club.genre,
        tags: club.tags,
        weekly_meeting_time: club.weeklyMeetingTime,
        activity_level: club.activityLevel,
        membership_type: club.membershipType,
        created_at: club.createdAt.toISOString(),
        updated_at: club.updatedAt.toISOString(),
        views: club.views,
        likes: club.likes,
        rating: club.rating,
        currently_reading_title: club.currentlyReadingTitle ?? null,
        currently_reading_author: club.currentlyReadingAuthor ?? null,
        next_meeting: club.nextMeeting?.toISOString() ?? null,
        member_count: club.memberCount,
      });
    }
    const batchSize = 50;
    for (let i = 0; i < dbClubs.length; i += batchSize) {
      await this.supabase.from('clubs').insert(dbClubs.slice(i, i + batchSize));
    }
    console.log('Clubs seeded successfully');
    return clubs;
  }

  async seedClubMemberships(clubs: Club[], users: User[]) {
    console.log('Seeding club memberships...');
    const memberships = [];
    for (const club of clubs) {
      memberships.push({
        club_id: club.id,
        user_id: club.ownerId,
        role: 'owner',
        joined_at: club.createdAt.toISOString(),
        is_active: true,
      });
      const possibleAdmins = users.filter(u => u.id !== club.ownerId);
      const adminCount = Math.floor(Math.random() * 3);
      const admins = this.randomElements(possibleAdmins, adminCount);
      for (const admin of admins) {
        memberships.push({
          club_id: club.id,
          user_id: admin.id,
          role: 'admin',
          joined_at: club.createdAt.toISOString(),
          is_active: true,
        });
      }
      const adminIds = admins.map(a => a.id);
      const possibleMembers = users.filter(u => u.id !== club.ownerId && !adminIds.includes(u.id));
      const memberCount = Math.floor(Math.random() * 20) + 5;
      const members = this.randomElements(possibleMembers, memberCount);
      for (const member of members) {
        memberships.push({
          club_id: club.id,
          user_id: member.id,
          role: 'member',
          joined_at: club.createdAt.toISOString(),
          is_active: true,
        });
      }
    }
    const batchSize = 100;
    for (let i = 0; i < memberships.length; i += batchSize) {
      await this.supabase.from('club_memberships').insert(memberships.slice(i, i + batchSize));
    }
    console.log('Club memberships seeded successfully');
  }

  async seedRooms(users: User[], textContents: TextContent[], clubs: Club[]): Promise<Room[]> {
    console.log('Seeding rooms...');
    const rooms: Room[] = [];
    const dbRooms = [];
    for (let i = 0; i < 100; i++) {
      const textContent = this.randomElement(textContents);
      const hosts = this.randomElements(users, Math.floor(Math.random() * 3) + 1);
      const club = Math.random() > 0.5 ? this.randomElement(clubs) : undefined;
      const scheduledTime = this.randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      const startTime = Math.random() > 0.5 ? this.randomDate(scheduledTime, new Date()) : undefined;
      const endTime = Math.random() > 0.7 && startTime ? this.randomDate(startTime, new Date()) : undefined;
      const createdAt = scheduledTime;
      const updatedAt = scheduledTime;
      const tags = this.randomElements([textContent.genre, ...this.readingInterests], Math.floor(Math.random() * 3) + 1);
      const currentReader = Math.random() > 0.5 ? this.randomElement(hosts).id : undefined;
      // Mock reading order (random order of host/user IDs)
      const readingOrder = Math.random() > 0.3 ? this.randomElements(users.map(u => u.id), Math.floor(Math.random() * 5) + 1) : undefined;
      // Mock reading turns (1-5 turns, random users, random times)
      const readingTurns = Math.random() > 0.3 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map(() => {
        const reader = this.randomElement(users);
        const startedAt = this.randomDate(scheduledTime, new Date());
        const endedAt = Math.random() > 0.5 ? this.randomDate(startedAt, new Date()) : undefined;
        return {
          userId: reader.id,
          startedAt,
          endedAt,
          paragraphsRead: Math.floor(Math.random() * 20) + 1
        };
      }) : undefined;
      const room: Room = {
        id: this.generateUUID(),
        title: `Reading Session: ${textContent.title}`,
        description: `Join us for a collaborative reading session of ${textContent.title} by ${textContent.author}`,
        status: this.randomElement(['pending', 'live', 'ended', 'scheduled', 'cancelled']) as any,
        textContentId: textContent.id,
        language: this.randomElement(this.languages).code,
        bookClubId: club?.id,
        hosts,
        currentReaderId: currentReader,
        currentPosition: { paragraphIndex: Math.floor(Math.random() * 10), wordIndex: Math.floor(Math.random() * 100) },
        readingOrder,
        readingTurns,
        audienceCount: Math.floor(Math.random() * 50),
        scheduledTime,
        startTime,
        endTime,
        tags,
        createdAt,
        updatedAt,
      };
      rooms.push(room);
      dbRooms.push({
        id: room.id,
        title: room.title,
        description: room.description,
        status: room.status,
        text_content_id: room.textContentId,
        language: room.language,
        book_club_id: room.bookClubId ?? null,
        current_reader_id: room.currentReaderId ?? null,
        scheduled_time: room.scheduledTime.toISOString(),
        start_time: room.startTime?.toISOString() ?? null,
        end_time: room.endTime?.toISOString() ?? null,
        tags: room.tags,
        created_at: room.createdAt.toISOString(),
        updated_at: room.updatedAt.toISOString(),
        audience_count: room.audienceCount,
        // current_position, reading_order, reading_turns are not always stored in DB, but you can add them if your schema supports it
        current_position: room.currentPosition,
        reading_order: room.readingOrder ?? null,
        reading_turns: room.readingTurns ?? null,
      });
    }
    const batchSize = 50;
    for (let i = 0; i < dbRooms.length; i += batchSize) {
      await this.supabase.from('rooms').insert(dbRooms.slice(i, i + batchSize));
    }
    console.log('Rooms seeded successfully');
    return rooms;
  }

  async seedRoomHosts(rooms: Room[], users: User[]) {
    console.log('Seeding room hosts...');
    const roomHosts = [];
    for (const room of rooms) {
      const hosts = this.randomElements(users, Math.floor(Math.random() * 3) + 1);
      for (const host of hosts) {
        roomHosts.push({
          room_id: room.id,
          user_id: host.id,
          assigned_at: this.randomDate(new Date(room.scheduledTime), new Date()).toISOString()
        });
      }
    }
    const batchSize = 100;
    for (let i = 0; i < roomHosts.length; i += batchSize) {
      const batch = roomHosts.slice(i, i + batchSize);
      await this.supabase.from('room_hosts').insert(batch);
    }
    console.log('Room hosts seeded successfully');
  }

  async seedAudienceMembers(rooms: Room[], users: User[]) {
    console.log('Seeding audience members...');
    const audienceMembers = [];
    
    for (const room of rooms) {
      const audienceSize = Math.floor(Math.random() * 20) + 5;
      const audienceUsers = this.randomElements(users, audienceSize);
      
      for (const user of audienceUsers) {
        audienceMembers.push({
          user_id: user.id,
          room_id: room.id,
          role: this.randomElement(this.audienceRoleDbValues), // DB enum values
          joined_at: this.randomDate(new Date(room.scheduledTime), new Date()).toISOString()
        });
      }
    }
    
    const batchSize = 100;
    for (let i = 0; i < audienceMembers.length; i += batchSize) {
      const batch = audienceMembers.slice(i, i + batchSize);
      await this.supabase.from('audience_members').insert(batch);
    }
    
    console.log('Audience members seeded successfully');
  }

  async seedReadingTurns(rooms: Room[], users: User[]) {
    console.log('Seeding reading turns...');
    const readingTurns = [];
    
    for (let i = 0; i < 100; i++) {
      const room = this.randomElement(rooms);
      const user = this.randomElement(users);
      const startedAt = this.randomDate(new Date(room.scheduledTime), new Date());
      const endedAt = Math.random() > 0.3 ? this.randomDate(startedAt, new Date()) : null;
      
      const turn = {
        id: this.generateUUID(),
        room_id: room.id,
        user_id: user.id,
        started_at: startedAt.toISOString(),
        ended_at: endedAt?.toISOString() || null,
        paragraphs_read: Math.floor(Math.random() * 20) + 1
      };
      
      readingTurns.push(turn);
    }
    
    const batchSize = 50;
    for (let i = 0; i < readingTurns.length; i += batchSize) {
      const batch = readingTurns.slice(i, i + batchSize);
      await this.supabase.from('reading_turns').insert(batch);
    }
    
    console.log('Reading turns seeded successfully');
  }

  async seedChatMessages(rooms: Room[], users: User[]) {
    console.log('Seeding chat messages...');
    const chatMessages = [];
    for (let i = 0; i < 100; i++) {
      const room = this.randomElement(rooms);
      const author = this.randomElement(users);
      const messages = [
        'Great reading session!', 'I love this book!', 'Thanks for hosting!',
        'This is my favorite chapter', 'Beautiful narration', 'Can\'t wait for the next part',
        'The author\'s style is amazing', 'This reminds me of another book I read',
        'What do you think about the main character?', 'The plot twist was unexpected!'
      ];
      const message = {
        id: this.generateUUID(),
        context_id: room.id,
        author_id: author.id,
        content: this.randomElement(messages),
        timestamp: this.randomDate(new Date(room.scheduledTime), new Date()).toISOString(),
        type: 'text'
      };
      chatMessages.push(message);
    }
    const batchSize = 50;
    for (let i = 0; i < chatMessages.length; i += batchSize) {
      const batch = chatMessages.slice(i, i + batchSize);
      await this.supabase.from('chat_messages').insert(batch);
    }
    console.log('Chat messages seeded successfully');
  }

  async seedAnnotations(rooms: Room[], users: User[]) {
    console.log('Seeding annotations...');
    const annotations = [];
    for (let i = 0; i < 100; i++) {
      const room = this.randomElement(rooms);
      const author = this.randomElement(users);
      const annotationTypes = ['correction', 'note', 'question'];
      const annotationTexts = [
        'Important passage', 'Beautiful metaphor', 'Key plot point',
        'Character development', 'Foreshadowing', 'Symbolism here',
        'Historical reference', 'Need to research this', 'Favorite quote'
      ];
      const annotation = {
        id: this.generateUUID(),
        room_id: room.id,
        author_id: author.id,
        type: this.randomElement(annotationTypes),
        text: this.randomElement(annotationTexts),
        target_word: Math.random() > 0.5 ? this.randomElement(['metaphor', 'symbolism', 'character', 'plot']) : null,
        position: { paragraph: Math.floor(Math.random() * 50), word: Math.floor(Math.random() * 100) },
        created_at: this.randomDate(new Date(room.scheduledTime), new Date()).toISOString(),
        resolved: Math.random() > 0.7
      };
      annotations.push(annotation);
    }
    const batchSize = 50;
    for (let i = 0; i < annotations.length; i += batchSize) {
      const batch = annotations.slice(i, i + batchSize);
      await this.supabase.from('annotations').insert(batch);
    }
    console.log('Annotations seeded successfully');
  }

  async seedReactions(rooms: Room[], users: User[]) {
    console.log('Seeding reactions...');
    const reactions = [];
    
    for (let i = 0; i < 100; i++) {
      const room = this.randomElement(rooms);
      const author = this.randomElement(users);
      
      const reaction = {
        id: this.generateUUID(),
        stage_id: room.id, // Using room.id as stage_id based on schema
        author_id: author.id,
        emoji: this.randomElement(this.emojis),
        timestamp: this.randomDate(new Date(room.scheduledTime), new Date()).toISOString(),
        target_paragraph_index: Math.random() > 0.5 ? Math.floor(Math.random() * 50) : null
      };
      
      reactions.push(reaction);
    }
    
    const batchSize = 50;
    for (let i = 0; i < reactions.length; i += batchSize) {
      const batch = reactions.slice(i, i + batchSize);
      await this.supabase.from('reactions').insert(batch);
    }
    
    console.log('Reactions seeded successfully');
  }

  async seedNotifications(users: User[]) {
    console.log('Seeding notifications...');
    const notifications = [];
    
    for (let i = 0; i < 100; i++) {
      const fromUser = this.randomElement(users);
      
      const notificationTypes = this.notificationTypeDbValues; // DB enum values
      const messages = [
        'started following you', 'invited you to join their book club',
        'invited you to a reading session', 'mentioned you in a discussion',
        'liked your annotation'
      ];
      
      const notification = {
        id: this.generateUUID(),
        type: this.randomElement(notificationTypes), // DB enum values
        from_user_id: fromUser.id,
        to_user_id: this.randomElement(users).id,
        message: `${fromUser.displayName} ${this.randomElement(messages)}`,
        link: `/user/${fromUser.id}`,
        is_read: Math.random() > 0.6,
        created_at: this.randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
        is_archived: Math.random() > 0.8
      };
      
      notifications.push(notification);
    }
    
    const batchSize = 50;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      await this.supabase.from('notifications').insert(batch);
    }
    
    console.log('Notifications seeded successfully');
  }

  async seedAll() {
    try {
      console.log('Starting database seeding...');
      
      await this.clearDatabase();
      
      const users = await this.seedUsers();
      
      const textContents = await this.seedTextContents(users);
      const clubs = await this.seedClubs(users);
      
      // Seed club-related data
      await this.seedClubMemberships(clubs, users);
      
      // Seed room-related data
      const rooms = await this.seedRooms(users, textContents, clubs);
      await this.seedRoomHosts(rooms, users);
      await this.seedAudienceMembers(rooms, users);
      await this.seedReadingTurns(rooms, users);
      
      // Seed interaction data
      await this.seedChatMessages(rooms, users);
      await this.seedAnnotations(rooms, users);
      await this.seedReactions(rooms, users);
      await this.seedNotifications(users);
      
      // Update user relationships (followers/following)
      await this.updateUserRelationships(users);
      
      console.log('Database seeding completed successfully!');
      console.log('Summary:');
      console.log('- 100 Users created');
      console.log('- 100 User profiles created');
      console.log('- 100 Text contents created');
      console.log('- 100 Clubs created');
      console.log('- Club memberships populated');
      console.log('- 100 Rooms created');
      console.log('- Audience members populated');
      console.log('- 100 Reading turns populated');
      console.log('- 100 Chat messages created');
      console.log('- 100 Annotations created');
      console.log('- 100 Reactions created');
      console.log('- 100 Notifications created');
      console.log('- User relationships updated');
      
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  private async updateUserRelationships(users: User[]) {
    console.log('Updating user relationships...');
    for (const user of users) {
      if (Math.random() > 0.5) { // 50% chance to have followers/following
        const followingCount = Math.floor(Math.random() * 10) + 1;
        const following = this.randomElements(
          users.filter(u => u.id !== user.id), 
          followingCount
        ).map(u => u.id);
        const followerCount = Math.floor(Math.random() * 15) + 1;
        const followers = this.randomElements(
          users.filter(u => u.id !== user.id), 
          followerCount
        ).map(u => u.id);
        // Only update user_profiles
        await this.supabase
          .from('user_profiles')
          .update({ 
            following: following,
            followers: followers 
          })
          .eq('user_id', user.id);
      }
    }
    console.log('User relationships updated successfully');
  }

  // Individual seeding methods for testing/partial seeding
  async seedUsersOnly() {
    return await this.seedUsers();
  }

  async seedTextContentsOnly(users?: User[]) {
    if (!users) {
      const { data: existingUsers } = await this.supabase.from('users').select('*');
      users = existingUsers || [];
    }
    return await this.seedTextContents(users);
  }

  async seedClubsOnly(users?: User[]) {
    if (!users) {
      const { data: existingUsers } = await this.supabase.from('users').select('*');
      users = existingUsers || [];
    }
    const clubs = await this.seedClubs(users);
    await this.seedClubMemberships(clubs, users);
    return clubs;
  }

  async seedRoomsOnly(users?: User[], textContents?: TextContent[], clubs?: Club[]) {
    if (!users) {
      const { data: existingUsers } = await this.supabase.from('users').select('*');
      users = existingUsers || [];
    }
    if (!textContents) {
      const { data: existingTexts } = await this.supabase.from('text_contents').select('*');
      textContents = existingTexts || [];
    }
    if (!clubs) {
      const { data: existingClubs } = await this.supabase.from('clubs').select('*');
      clubs = existingClubs || [];
    }
    
    const rooms = await this.seedRooms(users, textContents, clubs);
    await this.seedRoomHosts(rooms, users);
    await this.seedAudienceMembers(rooms, users);
    await this.seedReadingTurns(rooms, users);
    return rooms;
  }

  // Utility method to get random sample of existing data
  async getRandomSample(table: string, count: number = 10) {
    const { data } = await this.supabase
      .from(table)
      .select('*')
      .limit(1000);
    
    if (!data || data.length === 0) return [];
    
    return this.randomElements(data, Math.min(count, data.length));
  }

  // Method to add more data to existing tables
  async addMoreData(entityType: string, count: number = 50) {
    try {
      const { data: users } = await this.supabase.from('users').select('*');
      if (!users || users.length === 0) {
        throw new Error('No users found. Please seed users first.');
      }

      switch (entityType.toLowerCase()) {
        case 'clubs':
          const clubs = [];
          for (let i = 0; i < count; i++) {
            const owner = this.randomElement(users);
            const members = this.randomElements(users, Math.floor(Math.random() * 20) + 5);
            const admins = this.randomElements(members, Math.floor(Math.random() * 3) + 1);
            
            clubs.push({
              id: this.generateUUID(),
              name: `${this.randomElement(this.clubNames)} - New ${i + 1}`,
              description: `A fresh book club focused on ${this.randomElement(this.genres)} literature.`,
              cover_image_url: `https://picsum.photos/400/200?random=${Date.now() + i}`,
              owner_id: owner.id,
              created_at: new Date().toISOString(),
              tags: this.randomElements(this.genres, Math.floor(Math.random() * 3) + 1),
              language: this.randomElement(this.languages).code,
              weekly_meeting_time: this.randomElement(['Monday 7PM', 'Wednesday 6PM', 'Friday 8PM']),
              genre: this.randomElement(this.genres),
              activity_level: this.randomElement(['Low', 'Medium', 'High']),
              membership_type: this.randomElement(['Open', 'Invite Only']),
              views: Math.floor(Math.random() * 1000),
              likes: Math.floor(Math.random() * 200),
              admin_name: admins[0].displayName,
              admin_messages: Math.floor(Math.random() * 50),
              next_meeting: this.randomDate(new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
              rating: Math.round((Math.random() * 4 + 1) * 10) / 10
            });
          }
          
          await this.supabase.from('clubs').insert(clubs);
          console.log(`Added ${count} new clubs`);
          break;

        case 'textcontents':
        case 'texts':
          const { data: textContents } = await this.supabase.from('text_contents').select('*');
          const newTexts = [];
          
          for (let i = 0; i < count; i++) {
            const title = this.randomElement(this.bookTitles);
            const author = this.randomElement(this.authors);
            const wordCount = Math.floor(Math.random() * 100000) + 10000;
            
            newTexts.push({
              id: this.generateUUID(),
              title: `${title} - Extended Edition ${i + 1}`,
              author: author,
              content: `Extended content for ${title} by ${author}...`,
              type: this.randomElement(['book', 'article', 'short_story']),
              genre: this.randomElement(this.genres),
              reading_level: this.randomElement(['Beginner', 'Intermediate', 'Advanced']),
              cover_image_url: `https://picsum.photos/300/400?random=${Date.now() + i + 1000}`,
              uploader_id: this.randomElement(users).id,
              is_public_domain: Math.random() > 0.7,
              word_count: wordCount,
              estimated_reading_time: Math.ceil(wordCount / 200),
              rating: Math.round((Math.random() * 4 + 1) * 10) / 10
            });
          }
          
          await this.supabase.from('text_contents').insert(newTexts);
          console.log(`Added ${count} new text contents`);
          break;

        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }
    } catch (error) {
      console.error(`Error adding more ${entityType}:`, error);
      throw error;
    }
  }
}