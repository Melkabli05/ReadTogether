import { Component, signal, TemplateRef, viewChild, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../../reading-room/models/room.model';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { Club } from '../../../clubs/models/club.model';
import { TextContent } from '../../../../core/models/text-content.model';
import { RoomCard } from '../../../../shared/components/room-card/room-card';
import { WelcomeCard } from '../../../../core/layout/components/welcome-card/welcome-card';
import { ProfileCard } from '../../../user-profile/components/profile-card/profile-card';
import { ClubCard } from '../../../clubs/components/club-card/club-card';
import { TextCard } from '../../components/text-card/text-card';
import { ExploreSection, ExploreSectionEmptyState } from '../../../../shared/components/explore-section/explore-section';

@Component({
  selector: 'app-explore-page',
  imports: [
    RoomCard,
    WelcomeCard,
    TextCard,
    ProfileCard,
    ClubCard,
    ExploreSection
  ],
  templateUrl: './explore-page.html'
})
export class ExplorePage {
  readonly liveStages = signal<Room[]>([]);
  readonly upcomingEvents = signal<Room[]>([]);
  readonly popularTexts = signal<TextContent[]>([]);
  readonly suggestedPartners = signal<UserProfile[]>([]);
  readonly suggestedClubs = signal<Club[]>([]);

  readonly roomCardTemplate = viewChild.required<TemplateRef<any>>('roomCardTemplate');
  readonly textCardTemplate = viewChild.required<TemplateRef<any>>('textCardTemplate');
  readonly profileCardTemplate = viewChild.required<TemplateRef<any>>('profileCardTemplate');
  readonly clubCardTemplate = viewChild.required<TemplateRef<any>>('clubCardTemplate');

  readonly liveEmptyState: ExploreSectionEmptyState = {
    icon: 'pi-video',
    title: "It's a bit quiet...",
    message: 'No live sessions at the moment. Why not start your own?'
  };
  readonly eventsEmptyState: ExploreSectionEmptyState = {
    icon: 'pi-calendar',
    title: 'No upcoming events',
    message: 'Check back soon for new events.'
  };
  readonly textsEmptyState: ExploreSectionEmptyState = {
    icon: 'pi-book',
    title: 'No popular texts found',
    message: 'Check back soon for new texts. Why not upload your own?'
  };
  readonly partnersEmptyState: ExploreSectionEmptyState = {
    icon: 'pi-user-plus',
    title: 'No partners to suggest',
    message: 'Check back soon for new partners.'
  };
  readonly clubsEmptyState: ExploreSectionEmptyState = {
    icon: 'pi-users',
    title: 'No clubs to suggest',
    message: 'Check back soon for new clubs. Why not create your own?'
  };

  constructor() {
    const route = inject(ActivatedRoute);
    const data = route.snapshot.data['exploreData'];
    this.liveStages.set(data.liveStages ?? []);
    this.upcomingEvents.set(data.upcomingEvents ?? []);
    this.popularTexts.set(data.popularTexts ?? []);
    this.suggestedPartners.set(data.suggestedPartners ?? []);
    this.suggestedClubs.set(data.suggestedClubs ?? []);
  }
}
