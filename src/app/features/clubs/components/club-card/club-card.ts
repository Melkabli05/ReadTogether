import { Component, inject, input, computed, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { Club } from '../../models/club.model';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user-service';
import { Button } from '../../../../shared/components/button/button';

type ClubGenre = 'Classic' | 'Sci-Fi' | 'Poetry' | 'Fantasy' | 'Historical' | 'Mystery' | 'Philosophy';

interface ClubTypeColor {
  readonly bg: string;
  readonly accent: string;
  readonly text: string;
  readonly button: string;
}

@Component({
  selector: 'app-club-card',
  templateUrl: './club-card.html',
  imports: [NgClass, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubCard {
  readonly club = input.required<Club>();
  readonly owner = signal<User | undefined>(undefined);

  private readonly userService = inject(UserService);

  constructor() {
    effect(() => {
      this.userService.getUser(this.club().ownerId).then((user) => {
        this.owner.set(user);
      });
    });
  }

  readonly ownerInitials = computed((): string => {
    const name =
      this.owner()?.displayName ??
      this.owner()?.username ??
      'Club Owner';
    return name.toUpperCase();
  });

  readonly ownerDisplayName = computed((): string =>
    this.owner()?.displayName || this.owner()?.username || 'Club Owner'
  );

  readonly isPrivate = computed((): boolean => !this.club().isPublic);

  private readonly clubTypeColors: Record<ClubGenre, ClubTypeColor> = {
    Classic: {
      bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
      accent: 'bg-purple-500',
      text: 'text-purple-700',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
    'Sci-Fi': {
      bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      accent: 'bg-blue-500',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    Poetry: {
      bg: 'bg-gradient-to-br from-orange-100 to-yellow-100',
      accent: 'bg-orange-500',
      text: 'text-orange-700',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    Fantasy: {
      bg: 'bg-gradient-to-br from-green-100 to-cyan-100',
      accent: 'bg-green-500',
      text: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700',
    },
    Historical: {
      bg: 'bg-gradient-to-br from-yellow-100 to-amber-100',
      accent: 'bg-amber-500',
      text: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    Mystery: {
      bg: 'bg-gradient-to-br from-gray-100 to-gray-300',
      accent: 'bg-gray-500',
      text: 'text-gray-700',
      button: 'bg-gray-600 hover:bg-gray-700',
    },
    Philosophy: {
      bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
      accent: 'bg-indigo-500',
      text: 'text-indigo-700',
      button: 'bg-indigo-600 hover:bg-indigo-700',
    },
  };

  readonly clubColors = computed((): ClubTypeColor => {
    const genre = (this.club().genre as ClubGenre) || 'Classic';
    return this.clubTypeColors[genre] ?? this.clubTypeColors['Classic'];
  });

  readonly genre = computed((): string => this.club().genre ?? 'Classic');
  readonly rating = computed((): number | string => this.club().rating ?? '4.8');
  readonly currentlyReadingTitle = computed((): string => this.club().currentlyReadingTitle ?? '—');
  readonly currentlyReadingAuthor = computed((): string => this.club().currentlyReadingAuthor ?? '—');
  readonly formattedNextMeeting = computed((): string => {
    const nextMeeting = this.club().nextMeeting;
    if (!nextMeeting) return 'TBA';
    const date = nextMeeting instanceof Date ? nextMeeting : new Date(nextMeeting);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  });
} 