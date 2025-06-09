import { ChangeDetectionStrategy, Component, model, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { Club } from '../../models/club.model';
import { ClubCard } from '../../components/club-card/club-card';
import { ExploreSection } from '../../../../shared/components/explore-section/explore-section';
import { PopoverMultiselect } from "../../../../shared/components/popover-multiselect/popover-multiselect";
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { ClubService } from '../../services/club.service';
import { LANGUAGE_LIST, LanguageEntry } from '../../../../shared/models/language-list.model';
import { SeedService } from '../../../../core/services/SeedService';

export interface FilterType {
  key: 'language' | 'genre' | 'type' | 'activity' | 'membershipType' | 'joinedOnly';
  value: string;
  label: string;
}

@Component({
  selector: 'app-club-list-page',
  imports: [FormsModule, InputTextModule, MultiSelectModule, DropdownModule, CheckboxModule, ButtonModule, TooltipModule, AvatarModule, AvatarGroupModule, CardModule, DialogModule, PopoverModule, ClubCard, ExploreSection, PopoverMultiselect, TagModule, PageHeader],
  templateUrl: './club-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClubListPage implements OnInit {
  clubs = signal<Club[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  search = model('');
  showJoinedOnly = model(false);
  selectedLanguages = model<string[]>([]);
  selectedGenres = model<string[]>([]);
  selectedTypes = model<string[]>([]);
  selectedActivity = model<string[]>([]);
  selectedMembershipTypes = model<string[]>([]);
  sortBy = model<string>('best-match');
  createClubDialogOpen = model(false);

  activeFilters = signal<FilterType[]>([]);

  languageOptions = LANGUAGE_LIST.map((lang: LanguageEntry) => ({
    label: lang.name,
    value: lang.code
  }));

  sortOptions = [
    { label: 'Best Match', value: 'best-match' },
    { label: 'Most Members', value: 'most-members' },
    { label: 'Recently Active', value: 'recently-active' },
    { label: 'Newest', value: 'newest' },
    { label: 'A-Z', value: 'az' }
  ];

  genreOptions = [
    { label: 'Fiction', value: 'Fiction' },
    { label: 'Poetry', value: 'Poetry' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Philosophy', value: 'Philosophy' }
  ];

  privacyOptions = [
    { label: 'Public', value: 'Public' },
    { label: 'Private', value: 'Private' }
  ];

  membershipOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'Approval', value: 'Approval' }
  ];

  activityOptions = [
    { label: 'Very Active', value: 'Very Active' },
    { label: 'Active', value: 'Active' },
    { label: 'Casual', value: 'Casual' }
  ];

  constructor(private clubService: ClubService, private seedService: SeedService) {}

  ngOnInit(): void {
    this.fetchClubs();
    //this.seedService.seedAll();
  }

  async fetchClubs(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const clubs = await this.clubService.getClubs({
        search: this.search(),
        languages: this.selectedLanguages(),
        genres: this.selectedGenres(),
        types: this.selectedTypes(),
        activity: this.selectedActivity(),
        membershipTypes: this.selectedMembershipTypes(),
        sortBy: this.sortBy()
      });
      this.clubs.set(clubs.clubs);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load clubs');
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.fetchClubs();
  }

  onLanguagesChange(langs: string[]): void {
    this.selectedLanguages.set(langs);
    this.fetchClubs();
  }

  onGenresChange(genres: string[]): void {
    this.selectedGenres.set(genres);
    this.fetchClubs();
  }

  onTypesChange(types: string[]): void {
    this.selectedTypes.set(types);
    this.fetchClubs();
  }

  onActivityChange(activity: string[]): void {
    this.selectedActivity.set(activity);
    this.fetchClubs();
  }

  onMembershipTypeChange(types: string[]): void {
    this.selectedMembershipTypes.set(types);
    this.fetchClubs();
  }

  onSortChange(value: string | string[]): void {
    this.sortBy.set(Array.isArray(value) ? value[0] ?? 'best-match' : value);
    this.fetchClubs();
  }

  getTotalResults(): number {
    return this.clubs().length;
  }

  openCreateClubDialog(): void {
    this.createClubDialogOpen.set(true);
  }

  closeCreateClubDialog(): void {
    this.createClubDialogOpen.set(false);
  }

  toggleMyClubs(): void {
    this.showJoinedOnly.update(prev => !prev);
    this.fetchClubs();
  }

  removeFilterFromState(filter: { key: string; value: string; label: string }): void {
    const validKeys = ['language', 'genre', 'type', 'activity', 'membershipType', 'joinedOnly'] as const;
    if (!validKeys.includes(filter.key as any)) return;
    
    const typedFilter = filter as FilterType;
    
    switch (typedFilter.key) {
      case 'language':
        this.selectedLanguages.update(langs => langs.filter(lang => lang !== typedFilter.value));
        break;
      case 'genre':
        this.selectedGenres.update(genres => genres.filter(genre => genre !== typedFilter.value));
        break;
      case 'type':
        this.selectedTypes.update(types => types.filter(type => type !== typedFilter.value));
        break;
      case 'activity':
        this.selectedActivity.set([]);
        break;
      case 'membershipType':
        this.selectedMembershipTypes.update(types => types.filter(type => type !== typedFilter.value));
        break;
      case 'joinedOnly':
        this.showJoinedOnly.set(false);
        break;
    }
    this.fetchClubs();
  }

  clearAllFiltersFromState(): void {
    this.search.set('');
    this.showJoinedOnly.set(false);
    this.selectedLanguages.set([]);
    this.selectedGenres.set([]);
    this.selectedTypes.set([]);
    this.selectedActivity.set([]);
    this.selectedMembershipTypes.set([]);
    this.sortBy.set('best-match');
    this.fetchClubs();
  }

  private applySorting(clubs: Club[]): Club[] {
    const sortBy = this.sortBy();
    const sorted = [...clubs];
    
    switch (sortBy) {
      case 'most-members':
        return sorted.sort((a, b) => (b.memberCount ?? 0) - (a.memberCount ?? 0));
      case 'recently-active':
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'az':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'best-match':
      default:
        return sorted;
    }
  }

  private updateActiveFilters(): void {
    const filters: FilterType[] = [];
    
    this.selectedLanguages().forEach(code => {
      const found = this.languageOptions.find(opt => opt.value === code);
      filters.push({ 
        key: 'language', 
        value: code, 
        label: found ? found.label : code 
      });
    });
    
    this.selectedGenres().forEach(genre => {
      filters.push({ key: 'genre', value: genre, label: genre });
    });
    
    this.selectedTypes().forEach(type => {
      filters.push({ key: 'type', value: type, label: type });
    });
    
    if (this.selectedActivity().length > 0) {
      filters.push({ 
        key: 'activity', 
        value: this.selectedActivity().join(', '), 
        label: this.selectedActivity().join(', ') 
      });
    }
    
    this.selectedMembershipTypes().forEach(type => {
      filters.push({ key: 'membershipType', value: type, label: type });
    });
    
    if (this.showJoinedOnly()) {
      filters.push({ key: 'joinedOnly', value: 'true', label: 'My Clubs Only' });
    }
    
    this.activeFilters.set(filters);
  }
}