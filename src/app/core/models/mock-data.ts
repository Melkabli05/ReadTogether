import { UserProfile } from './user-profile.model';
import { Club } from '../../features/clubs/models/club.model';
import { TextContent } from './text-content.model';
import { TextContentType } from './text-content-type.enum';
import { LanguageProficiency } from './language-proficiency.enum';
import { Room } from '../../features/reading-room/models/room.model';
import { RoomStatus } from '../../features/reading-room/models/room-status.enum';
import { ReadingTurn } from '../../features/reading-room/models/reading-turn.model';
import { Reaction } from '../../core/models/reaction.model';
import { Annotation } from '../../core/models/annotation.model';
import { Notification } from '../../core/models/notification.model';
import { NotificationType } from '../../core/models/notification-type.enum';
import { ChatMessage } from '../../core/models/chat-message.model';
import { AudienceMember } from '../../features/reading-room/models/audience-member.model';
import { AudienceRole } from '../../features/reading-room/models/audience-role.enum';

export const USER_UUIDS = {
  alex: 'b1a2c3d4-e5f6-7890-1234-56789abcdef0',
  sara: 'c2b3d4e5-f6a7-8901-2345-6789abcdef01',
  john: 'd3c4e5f6-a7b8-9012-3456-789abcdef012',
  noavatar: 'e4d5f6a7-b8c9-0123-4567-89abcdef0123',
  maria: 'f5e6d7c8-b9a0-1234-5678-9abcdef01234',
  luc: 'a2b3c4d5-e6f7-8901-2345-6789abcdef02',
  emily: 'b3c4d5e6-f7a8-9012-3456-789abcdef013',
  sven: 'c4d5e6f7-a8b9-0123-4567-89abcdef0145'
};

export const CLUB_UUIDS = {
  club1: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  club2: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
  club3: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
  club4: 'd4e5f6a7-b8c9-0123-4567-89abcdef0123',
  club5: 'e5f6a7b8-c9d0-1234-5678-9abcdef01234',
  club6: 'f6a7b8c9-d0e1-2345-6789-abcdef012345'
};

export const ROOM_UUIDS = {
  room1: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  room2: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
  room3: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
  room4: 'd4e5f6a7-b8c9-0123-4567-89abcdef0123'
};

export const TEXT_CONTENT_UUIDS = {
  text1: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  text2: 'b2c3d4e5-f6a7-8901-2345-6789abcdef01',
  text3: 'c3d4e5f6-a7b8-9012-3456-789abcdef012',
  text4: 'd4e5f6a7-b8c9-0123-4567-89abcdef0123',
  text5: 'e5f6a7b8-c9d0-1234-5678-9abcdef01234'
};


// MOCK USERS (user_profiles)
export const MOCK_USER_PROFILES: any[] = [
  {
    id: USER_UUIDS.alex,
    username: 'alex',
    display_name: 'Alex Smith',
    profile_picture_url: '',
    bio: 'Language enthusiast',
    email: 'alex@example.com',
    created_at: new Date('2024-01-01T10:00:00Z'),
    reading_interests: ['Spanish', 'Literature'],
    languages: [
      { language_code: 'es', proficiency: 'Fluent' }
    ],
    followers: [USER_UUIDS.sara],
    following: [USER_UUIDS.sara],
    blocked_users: [],
    is_online: true,
    last_active: new Date('2024-01-01T12:00:00Z'),
    badge: null,
    badge_description: null,
    stats: { stages_hosted: 2, kudos_received: 10, partners_read_with: 5 }
  },
  {
    id: USER_UUIDS.sara,
    username: 'sara',
    display_name: 'Sara Lee',
    profile_picture_url: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Poetry lover and French speaker',
    email: 'sara@example.com',
    created_at: new Date('2024-01-02T10:00:00Z'),
    reading_interests: ['Poetry', 'French'],
    languages: [
      { language_code: 'fr', proficiency: 'Native' }
    ],
    followers: [USER_UUIDS.alex],
    following: [USER_UUIDS.alex],
    blocked_users: [],
    is_online: true,
    last_active: new Date('2024-01-02T12:00:00Z'),
    badge: null,
    badge_description: null,
    stats: { stages_hosted: 1, kudos_received: 5, partners_read_with: 3 }
  },
  {
    id: USER_UUIDS.john,
    username: 'john',
    display_name: 'John Doe',
    profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Avid reader and club founder',
    email: 'john@example.com',
    created_at: new Date('2024-01-03T10:00:00Z'),
    reading_interests: ['Novels', 'History'],
    languages: [
      { language_code: 'en', proficiency: 'Fluent' }
    ],
    followers: [],
    following: [],
    blocked_users: [],
    is_online: true,
    last_active: new Date('2024-01-03T12:00:00Z'),
    badge: null,
    badge_description: null,
    stats: { stages_hosted: 3, kudos_received: 8, partners_read_with: 7 }
  },
  {
    id: USER_UUIDS.noavatar,
    username: 'noavatar',
    display_name: 'No Avatar',
    profile_picture_url: '',
    bio: '',
    email: 'noavatar@example.com',
    created_at: new Date('2024-01-04T10:00:00Z'),
    reading_interests: [],
    languages: [
      { language_code: 'de', proficiency: 'Learning' }
    ],
    followers: [],
    following: [],
    blocked_users: [],
    is_online: false,
    last_active: null,
    badge: null,
    badge_description: null,
    stats: { stages_hosted: 0, kudos_received: 0, partners_read_with: 0 }
  }
];

// Mock Hosts
export const MOCK_HOST: any = {
  id: USER_UUIDS.maria,
  username: 'maria',
  display_name: 'Maria Garcia',
  profile_picture_url: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Spanish literature expert',
  email: 'maria@example.com',
  created_at: new Date(),
  reading_interests: ['Spanish', 'Literature'],
  languages: [{ language_code: 'es', proficiency: LanguageProficiency.Fluent }],
  followers: [],
  following: [],
  blocked_users: [],
  stats: { stages_hosted: 5, kudos_received: 20, partners_read_with: 15 }
};

export const MOCK_HOST_2: any = {
  id: USER_UUIDS.luc,
  username: 'luc',
  display_name: 'Luc Moreau',
  profile_picture_url: 'https://randomuser.me/api/portraits/men/45.jpg',
  bio: 'French poetry enthusiast',
  email: 'luc@example.com',
  created_at: new Date(),
  reading_interests: ['Poetry', 'French'],
  languages: [{ language_code: 'fr', proficiency: LanguageProficiency.Native }],
  followers: [],
  following: [],
  blocked_users: [],
  is_online: true,
  stats: { stages_hosted: 2, kudos_received: 12, partners_read_with: 9 }
};

export const MOCK_HOST_3: any = {
  id: USER_UUIDS.emily,
  username: 'emily',
  display_name: 'Emily Clark',
  profile_picture_url: 'https://randomuser.me/api/portraits/women/68.jpg',
  bio: 'History buff and discussion leader',
  email: 'emily@example.com',
  created_at: new Date(),
  reading_interests: ['History', 'Discussion'],
  languages: [{ language_code: 'en', proficiency: LanguageProficiency.Fluent }],
  followers: [],
  following: [],
  blocked_users: [],
  is_online: true,
  stats: { stages_hosted: 4, kudos_received: 15, partners_read_with: 10 }
};

export const MOCK_HOST_4: any = {
  id: USER_UUIDS.sven,
  username: 'sven',
  display_name: 'Sven Müller',
  profile_picture_url: 'https://randomuser.me/api/portraits/men/77.jpg',
  bio: 'German literature and philosophy',
  email: 'sven@example.com',
  created_at: new Date(),
  reading_interests: ['Philosophy', 'German'],
  languages: [{ language_code: 'de', proficiency: LanguageProficiency.Native }],
  followers: [],
  following: [],
  blocked_users: [],
  is_online: true,
  stats: { stages_hosted: 2, kudos_received: 3, partners_read_with: 2 }
};

export const MOCK_ROOMS: any[] = [
  {
    id: ROOM_UUIDS.room1,
    title: 'Spanish Literature Club',
    description: 'Reading classic Spanish novels together.',
    status: 'Live',
    text_content_id: TEXT_CONTENT_UUIDS.text1,
    language: 'es',
    book_club_id: CLUB_UUIDS.club1,
    hosts: [USER_UUIDS.alex, USER_UUIDS.sara],
    current_reader_id: USER_UUIDS.alex,
    current_position: { paragraph_index: 0, word_index: 0 },
    reading_order: [USER_UUIDS.alex, USER_UUIDS.sara],
    audience_count: 12,
    scheduled_time: new Date('2024-02-01T18:00:00Z'),
    start_time: new Date('2024-02-01T18:05:00Z'),
    end_time: null,
    tags: ['Classic', 'Literature']
  },
  {
    id: ROOM_UUIDS.room2,
    title: 'French Poetry Circle',
    description: 'Exploring modern French poetry with pronunciation practice.',
    status: RoomStatus.Live,
    text_content_id: TEXT_CONTENT_UUIDS.text2,
    language: 'fr',
    hosts: [MOCK_HOST_2],
    current_reader_id: USER_UUIDS.luc,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 8,
    scheduled_time: new Date(Date.now() + 3600 * 1000),
    tags: ['Poetry', 'French'],
    reading_order: [USER_UUIDS.luc],
    reading_turns: [
      { user_id: USER_UUIDS.luc, started_at: new Date(), paragraphs_read: 1 }
    ],
    start_time: new Date(Date.now() - 1800 * 1000),
    end_time: undefined,
    book_club_id: CLUB_UUIDS.club3,
  },
  {
    id: ROOM_UUIDS.room3,
    title: 'History Buffs',
    description: 'Dive into world history with engaging discussions.',
    status: RoomStatus.Live,
    text_content_id: TEXT_CONTENT_UUIDS.text3,
    language: 'en',
    hosts: [MOCK_HOST_3],
    current_reader_id: USER_UUIDS.emily,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 15,
    scheduled_time: new Date(Date.now() + 7200 * 1000),
    tags: ['History', 'Discussion'],
    reading_order: [USER_UUIDS.emily],
    reading_turns: [
      { user_id: USER_UUIDS.emily, started_at: new Date(), paragraphs_read: 2 }
    ],
    start_time: new Date(Date.now() - 1200 * 1000),
    end_time: undefined,
    book_club_id: CLUB_UUIDS.club2,
  },
  {
    id: ROOM_UUIDS.room4,
    title: 'German Philosophy Night',
    description: 'Discussing Kant and Nietzsche in the original language.',
    status: RoomStatus.Live,
    text_content_id: TEXT_CONTENT_UUIDS.text4,
    language: 'de',
    hosts: [MOCK_HOST_4],
    current_reader_id: USER_UUIDS.sven,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 3,
    scheduled_time: new Date(Date.now() + 3600 * 1000 * 5),
    tags: ['Philosophy', 'German'],
    reading_order: [USER_UUIDS.sven],
    reading_turns: [
      { user_id: USER_UUIDS.sven, started_at: new Date(), paragraphs_read: 1 }
    ],
    start_time: new Date(Date.now() - 600 * 1000),
    end_time: undefined,
    book_club_id: CLUB_UUIDS.club4,
  }
];

export const MOCK_UPCOMING_EVENTS: any[] = [
  {
    id: '4',
    title: 'Modern Novels Meetup',
    description: 'Discussing the latest in modern literature.',
    status: RoomStatus.Scheduled,
    text_content_id: 'book4',
    language: 'English',
    hosts: [MOCK_HOST_3],
    current_reader_id: undefined,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 10,
    scheduled_time: new Date(Date.now() + 10800 * 1000),
    tags: ['Novels', 'Modern']
  },
  {
    id: '5',
    title: 'Latin American Short Stories',
    description: 'A journey through Latin American short fiction.',
    status: RoomStatus.Scheduled,
    text_content_id: 'book5',
    language: 'Spanish',
    hosts: [MOCK_HOST],
    current_reader_id: undefined,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 7,
    scheduled_time: new Date(Date.now() + 14400 * 1000),
    tags: ['Short Stories', 'Latin America']
  },
  {
    id: '6',
    title: 'French Classics Revisited',
    description: 'Rediscovering the classics of French literature.',
    status: RoomStatus.Scheduled,
    text_content_id: 'book6',
    language: 'French',
    hosts: [MOCK_HOST_2],
    current_reader_id: undefined,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 9,
    scheduled_time: new Date(Date.now() + 18000 * 1000),
    tags: ['Classics', 'French']
  },
  {
    id: '7',
    title: 'Empty Event',
    description: '',
    status: RoomStatus.Scheduled,
    text_content_id: '',
    language: '',
    hosts: [],
    current_reader_id: undefined,
    current_position: { paragraph_index: 0, word_index: 0 },
    audience_count: 0,
    scheduled_time: new Date(Date.now() + 3600 * 1000 * 24),
    tags: []
  }
];

// MOCK TEXT CONTENTS
export const MOCK_TEXTS: any[] = [
  {
    id: TEXT_CONTENT_UUIDS.text1,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    content: '',
    type: 'Book',
    genre: 'Classic',
    reading_level: 'advanced',
    cover_image_url: '',
    uploader_id: USER_UUIDS.alex,
    is_public_domain: false,
    word_count: 100000,
    estimated_reading_time: null,
    rating: null
  },
  {
    id: TEXT_CONTENT_UUIDS.text2,
    title: 'Les Fleurs du mal',
    author: 'Charles Baudelaire',
    content: '',
    type: 'Book',
    genre: 'Poetry',
    reading_level: 'advanced',
    cover_image_url: '',
    uploader_id: USER_UUIDS.luc,
    is_public_domain: true,
    word_count: 50000,
    estimated_reading_time: null,
    rating: null
  },
  {
    id: TEXT_CONTENT_UUIDS.text3,
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    content: '',
    type: TextContentType.Book,
    genre: 'History',
    reading_level: 'intermediate',
    cover_image_url: '',
    uploader_id: USER_UUIDS.emily,
    is_public_domain: false,
    word_count: 60000
  },
  {
    id: TEXT_CONTENT_UUIDS.text4,
    title: 'Also sprach Zarathustra',
    author: 'Friedrich Nietzsche',
    content: '',
    type: TextContentType.Book,
    genre: 'Philosophy',
    reading_level: 'advanced',
    cover_image_url: '',
    uploader_id: USER_UUIDS.sven,
    is_public_domain: true,
    word_count: 40000
  }
];

// MOCK CLUBS
export const MOCK_CLUBS: any[] = [
  {
    id: CLUB_UUIDS.club1,
    name: 'Language Buddies',
    description: 'Practice English with friends every week!',
    cover_image_url: '',
    owner_id: USER_UUIDS.alex,
    admins: [USER_UUIDS.alex],
    members: [USER_UUIDS.alex, USER_UUIDS.sara, USER_UUIDS.john],
    is_public: true,
    created_at: new Date('2024-01-15T00:00:00Z'),
    tags: ['English', 'Conversation'],
    language: 'English',
    weekly_meeting_time: 'Saturdays 5pm',
    genre: 'Classic',
    activity_level: 'Very Active',
    membership_type: 'Open',
    views: 1200,
    likes: 89,
    currently_reading_title: 'Pride and Prejudice',
    currently_reading_author: 'Jane Austen',
    admin_name: 'Emily Watson',
    admin_messages: 45,
    next_meeting: 'Tomorrow, 7:00 PM',
    rating: 4.8
  },
  {
    id: CLUB_UUIDS.club2,
    name: 'Sci-Fi Explorers',
    description: 'Explore the universe of science fiction!',
    cover_image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    owner_id: USER_UUIDS.sara,
    admins: [USER_UUIDS.sara],
    members: [USER_UUIDS.sara, USER_UUIDS.john],
    is_public: false,
    created_at: new Date('2023-03-22T00:00:00Z'),
    tags: ['Sci-Fi', 'Movies', 'Space'],
    language: 'en',
    weekly_meeting_time: 'Fridays 8pm',
    genre: 'Sci-Fi',
    activity_level: 'Active',
    membership_type: 'Approval',
    views: 1450,
    likes: 134,
    currently_reading_title: 'Dune',
    currently_reading_author: 'Frank Herbert',
    admin_name: 'Marcus Chen',
    admin_messages: 67,
    next_meeting: 'Friday, 8:30 PM',
    rating: 4.5
  },
  {
    id: CLUB_UUIDS.club3,
    name: 'Francophone Readers',
    description: 'Pour les amateurs de littérature française. Venez partager vos lectures et auteurs préférés.',
    cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    owner_id: USER_UUIDS.luc,
    admins: [USER_UUIDS.luc],
    members: [USER_UUIDS.luc, USER_UUIDS.emily],
    is_public: true,
    created_at: new Date('2023-05-15'),
    tags: ['Français', 'Romans', 'Culture'],
    language: 'fr',
    weekly_meeting_time: 'Mardis 19h',
    genre: 'Fantasy',
    activity_level: 'Active',
    membership_type: 'Approval',
    views: 1000,
    likes: 50,
    currently_reading_title: 'Le Petit Prince',
    currently_reading_author: 'Antoine de Saint-Exupéry',
    admin_name: 'Sofia Rodriguez',
    admin_messages: 32,
    next_meeting: 'Sunday, 6:00 PM'
  },
  {
    id: CLUB_UUIDS.club4,
    name: 'Mystery & Thriller Society',
    description: 'Dive into the world of suspense, crime, and thrillers. Monthly book picks and lively debates!',
    cover_image_url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80',
    owner_id: USER_UUIDS.maria,
    admins: [USER_UUIDS.maria, USER_UUIDS.luc],
    members: [USER_UUIDS.maria, USER_UUIDS.luc, USER_UUIDS.emily, USER_UUIDS.sara, USER_UUIDS.john],
    is_public: true,
    created_at: new Date('2023-06-01'),
    tags: ['Mystery', 'Thriller', 'Crime'],
    language: 'en',
    weekly_meeting_time: 'Wednesdays 7pm',
    genre: 'Historical',
    activity_level: 'Active',
    membership_type: 'Approval',
    views: 800,
    likes: 35,
    currently_reading_title: 'The Hound of the Baskervilles',
    currently_reading_author: 'Arthur Conan Doyle',
    admin_name: 'Marcus Chen',
    admin_messages: 67,
    next_meeting: 'Friday, 8:30 PM'
  },
  {
    id: CLUB_UUIDS.club5,
    name: 'Círculo de Lectura Español',
    description: 'Un club para lectores hispanohablantes. Compartimos novelas, poesía y ensayos en español.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    owner_id: USER_UUIDS.john,
    admins: [USER_UUIDS.john],
    members: [USER_UUIDS.john, USER_UUIDS.sara, USER_UUIDS.emily],
    is_public: false,
    created_at: new Date('2023-07-12'),
    tags: ['Español', 'Novelas', 'Poesía'],
    language: 'es',
    weekly_meeting_time: 'Sábados 18:00',
    genre: 'Classic',
    activity_level: 'Active',
    membership_type: 'Approval',
    views: 800,
    likes: 35,
    currently_reading_title: 'The Hound of the Baskervilles',
    currently_reading_author: 'Arthur Conan Doyle',
    admin_name: 'Marcus Chen',
    admin_messages: 67,
    next_meeting: 'Friday, 8:30 PM'
  },
  {
    id: CLUB_UUIDS.club6,
    name: 'Young Adult Bookworms',
    description: 'For fans of YA fiction! Join us for fun discussions, themed events, and buddy reads.',
    cover_image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    owner_id: USER_UUIDS.john,
    admins: [USER_UUIDS.john],
    members: [USER_UUIDS.john, USER_UUIDS.sara, USER_UUIDS.emily],
    is_public: true,
    created_at: new Date('2023-08-05'),
    tags: ['YA', 'Fiction', 'Events'],
    language: 'en',
    weekly_meeting_time: 'Mondays 6pm',
    genre: 'Fiction',
    activity_level: 'Active',
    membership_type: 'Approval',
    views: 800,
    likes: 35,
    currently_reading_title: 'The Hound of the Baskervilles',
    currently_reading_author: 'Arthur Conan Doyle',
    admin_name: 'Marcus Chen',
    admin_messages: 67,
    next_meeting: 'Friday, 8:30 PM'
  }
];

// MOCK READING TURNS
export const MOCK_READING_TURNS: any[] = [
  {
    id: 'reading-turn-uuid-1',
    room_id: ROOM_UUIDS.room1,
    user_id: USER_UUIDS.alex,
    started_at: new Date('2024-02-01T18:05:00Z'),
    ended_at: null,
    paragraphs_read: 3
  }
];

// MOCK REACTIONS
export const MOCK_REACTIONS: any[] = [
  {
    id: 'reaction-uuid-1',
    stage_id: ROOM_UUIDS.room1,
    author_id: USER_UUIDS.alex,
    emoji: '👍',
    timestamp: new Date('2024-02-01T18:10:00Z'),
    target_paragraph_index: 1
  }
];

// MOCK ANNOTATIONS
export const MOCK_ANNOTATIONS: any[] = [
  {
    id: 'annotation-uuid-1',
    room_id: ROOM_UUIDS.room1,
    author_id: USER_UUIDS.alex,
    type: 'note',
    text: 'Interesting phrase!',
    target_word: null,
    position: { start: 10, end: 20 },
    created_at: new Date('2024-02-01T18:12:00Z'),
    resolved: false
  }
];

// MOCK NOTIFICATIONS
export const MOCK_NOTIFICATIONS: any[] = [
  {
    id: 'notif-uuid-1',
    type: 'invitation',
    from_user: USER_UUIDS.alex,
    message: 'You have been invited to join Language Buddies!',
    link: '/clubs/club-uuid-1',
    is_read: false,
    created_at: new Date('2024-02-01T18:15:00Z'),
    is_archived: false
  }
];

// MOCK CHAT MESSAGES
export const MOCK_CHAT_MESSAGES: any[] = [
  {
    id: 'msg-uuid-1',
    context_id: ROOM_UUIDS.room1,
    author: USER_UUIDS.alex,
    content: 'Hello everyone!',
    timestamp: new Date('2024-02-01T18:20:00Z'),
    type: 'text'
  }
];

// MOCK AUDIENCE MEMBERS
export const MOCK_AUDIENCE_MEMBERS: any[] = [
  {
    user_id: USER_UUIDS.alex,
    room_id: ROOM_UUIDS.room1,
    role: 'audience',
    joined_at: new Date('2024-02-01T18:00:00Z')
  }
];
