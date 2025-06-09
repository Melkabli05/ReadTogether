import { Component, inject, input, signal, computed } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { User } from '../../../../core/models/user.model';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-profile-card',
  imports: [AvatarModule, Button],
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss'
})
export class ProfileCard {
  user = input<User | null>(null);
  isLoading = input<boolean>(true);

  languages = computed(() => this.user()?.languages ?? []);
  readingInterests = computed(() => this.user()?.readingInterests ?? []);
  stats = computed(() => this.user()?.stats ?? { partnersReadWith: 0, kudosReceived: 0, stagesHosted: 0 });

  trackLang = (_: number, lang: { code: string }) => lang.code;
  trackInterest = (_: number, interest: string) => interest;
}
