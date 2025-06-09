import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { RoomService } from '../../features/reading-room/data-access/room.service';
import { ClubService } from '../../features/clubs/services/club.service';
import { SupabaseClientService } from '../services/SupabaseClient';
import { Room } from '../../features/reading-room/models/room.model';
import { Club } from '../../features/clubs/models/club.model';
import { TextContent } from '../models/text-content.model';
import { User } from '../models/user.model';
import { UserService } from '../services/user-service';
import { TextContentService } from '../services/textContent';
import { RoomStatus } from '../../features/reading-room/models/room-status.enum';
export interface ExplorePageData {
  liveStages: Room[];
  upcomingEvents: Room[];
  suggestedPartners: User[];
  popularTexts: TextContent[];
  suggestedClubs: Club[];
}

export const explorePageResolver: ResolveFn<ExplorePageData> = async () => {
  const roomService = inject(RoomService);
  const clubService = inject(ClubService);
  const userService = inject(UserService);
  const textContentService = inject(TextContentService);
  const supabase = inject(SupabaseClientService).supabase;

  const [
    liveStagesResult,
    upcomingEventsResult,
    suggestedPartnersResult,
    suggestedClubsResult,
  ] = await Promise.all([
    roomService.getRooms({ status: RoomStatus.Live, page: 1, pageSize: 4 }).catch(() => ({ rooms: [], total: 0 })),
    roomService.getRooms({ status: RoomStatus.Scheduled, page: 1, pageSize: 4 }).catch(() => ({ rooms: [], total: 0 })),
    userService.getUsers({ sortBy: 'most-followers', page: 1, pageSize: 4 }),
    clubService.getClubs({ sortBy: 'most-members', page: 1, pageSize: 4 }).catch(() => ({ clubs: [], total: 0 })),
  ]);


  let popularTextsResult: TextContent[] = [];
  try {
    const { data } = await supabase
      .from('text_contents')
      .select('*')
      .order('rating', { ascending: false })
      .limit(4);
    popularTextsResult = data ?? [];
  } catch {
    popularTextsResult = [];
  }

  return {
    liveStages: liveStagesResult.rooms ?? [],
    upcomingEvents: upcomingEventsResult.rooms ?? [],
    popularTexts: popularTextsResult,
    suggestedPartners: suggestedPartnersResult,
    suggestedClubs: suggestedClubsResult.clubs ?? [],
  };
};
