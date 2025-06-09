import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LANGUAGE_LIST } from '../../../../shared/models/language-list.model';
import { ClubService } from '../../../clubs/services/club.service';
import { UserService } from '../../../../core/services/user-service';
import { TextContentService } from '../../../../core/services/textContent';
import { Club } from '../../../clubs/models/club.model';
import { User } from '../../../../core/models/user.model';
import { TextContent } from '../../../../core/models/text-content.model';
import { TabsListComponent } from "../../../../shared/components/tabs-list/tabs-list.component";
import { StepperModule } from 'primeng/stepper';
import { Button } from '../../../../shared/components/button/button';

export type RoomPrivacy = 'public' | 'private' | 'club';
export type TurnSystem = 'host-assigned' | 'round-robin';
export type StartTimeOption = 'now' | 'schedule';

@Component({
  selector: 'app-room-create-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    InputSwitchModule,
    DatePickerModule,
    ChipsModule,
    ToastModule,
    TabsListComponent,
    StepperModule,
    Button
],
  providers: [MessageService],
  templateUrl: './room-create.page.html',
  styles: `
    :host ::ng-deep .p-steppanels {
      padding: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomCreatePage {
  // --- PrimeNG Toast ---
  readonly showTitle = input<boolean>(true);
  private readonly messageService = inject(MessageService);

  // --- Services ---
  private readonly clubService = inject(ClubService);
  private readonly userService = inject(UserService);
  private readonly textContentService = inject(TextContentService);
  private readonly fb = inject(NonNullableFormBuilder);

  // --- Signals for options ---
  readonly privacyOptions = [
    { label: 'Public', value: 'public', icon: 'pi pi-globe', activeColor: 'bg-blue-500', tooltip: 'Anyone can join and participate.' },
    { label: 'Private', value: 'private', icon: 'pi pi-lock', activeColor: 'bg-red-500', tooltip: 'Only invited users can join via link or direct invite.' },
    { label: 'Club-Only', value: 'club', icon: 'pi pi-users', activeColor: 'bg-green-500', tooltip: 'Accessible only to members of your selected club.' },
  ] as const;
  readonly languageOptions = LANGUAGE_LIST.map(lang => ({ label: lang.name, value: lang.code }));
  readonly turnSystemOptions = [
    { label: 'Host-Assigned Turns', value: 'host-assigned', helper: 'Host manually assigns who reads next.' },
    { label: 'Automatic Round-Robin', value: 'round-robin', helper: 'Users read in a predetermined, rotating order.' },
  ] as const;

  // --- Signals: UI State ---
  readonly textModalOpen = signal(false);
  readonly uploadingText = signal(false);
  readonly creationSuccess = signal(false);
  readonly creationResult = signal<{ roomId: string; inviteLink: string } | null>(null);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly currentStep = signal(0);

  // --- Signals for fetched data ---
  readonly clubs = signal<Club[]>([]);
  readonly users = signal<User[]>([]);
  readonly texts = signal<TextContent[]>([]);
  readonly filteredTexts = signal<TextContent[]>([]);
  readonly selectedText = signal<TextContent | null>(null);

  // --- Form State ---
  readonly form = signal(this.fb.group({
    name: this.fb.control<string>('', { validators: [Validators.required, Validators.maxLength(100)] }),
    description: this.fb.control<string>(''),
    privacy: this.fb.control<RoomPrivacy>('public'),
    clubId: this.fb.control<string | null>(null),
    language: this.fb.control<string>('en'),
    textContentId: this.fb.control<string>(''),
    invitedUserIds: this.fb.control<string[]>([]),
    turnSystem: this.fb.control<TurnSystem>('host-assigned'),
    enableTimer: this.fb.control<boolean>(false),
    timerSeconds: this.fb.control<number>(60),
    enablePeerRating: this.fb.control<boolean>(false),
    startTimeOption: this.fb.control<StartTimeOption>('now'),
    scheduledTime: this.fb.control<Date | null>(null),
    tags: this.fb.control<string[]>([]),
  }));

  // --- Computed: Show club selection only if privacy is 'club' ---
  readonly showClubSelect = computed(() => this.form().get('privacy')?.value === 'club');
  readonly showTimerInput = computed(() => this.form().get('enableTimer')?.value === true);
  readonly showScheduledTime = computed(() => this.form().get('startTimeOption')?.value === 'schedule');

  // --- Time zone getter for template ---
  readonly timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // --- Stepper Logic ---
  readonly steps = [
    { label: 'Room Info', icon: 'pi pi-home', fields: ['name', 'privacy', 'language', 'textContentId'] },
    { label: 'Schedule & Invitations', icon: 'pi pi-calendar', fields: ['startTimeOption', 'scheduledTime', 'invitedUserIds', 'tags'] },
  ] as const;

  // --- Effects: Load options ---
  constructor() {
    effect(() => {
      this.clubService.getClubs({ sortBy: 'az', page: 1, pageSize: 50 })
        .then(res => this.clubs.set(res.clubs));
      this.userService.getUsers({ sortBy: 'most-followers', page: 1, pageSize: 50 })
        .then(users => this.users.set(users));
      this.textContentService.getTextContentByIds([])
        .then(texts => {
          this.texts.set(texts);
          this.filteredTexts.set(texts);
        });
    });
  }

  // --- PopoverMultiselect value getters and handlers (unchanged) ---
  get privacySelected(): string[] {
    const v = this.form().get('privacy')?.value;
    return v ? [v] : ['public'];
  }
  onPrivacyChange(values: string[]) {
    this.form().get('privacy')?.setValue((values[0] ?? 'public') as RoomPrivacy);
  }

  get clubOptions() {
    return this.clubs().map(club => ({ label: club.name, value: club.id }));
  }
  get userOptions() {
    return this.users().map(user => ({ label: user.displayName || user.username, value: user.id }));
  }

  get clubSelected(): string[] {
    const v = this.form().get('clubId')?.value;
    return v ? [v] : [];
  }
  onClubChange(values: string[]) {
    this.form().get('clubId')?.setValue(values[0] ?? null);
  }
  get languageSelected(): string[] {
    const v = this.form().get('language')?.value;
    return v ? [v] : ['en'];
  }
  onLanguageChange(values: string[]) {
    this.form().get('language')?.setValue(values[0] ?? 'en');
  }
  get textSelected(): string[] {
    const v = this.form().get('textContentId')?.value;
    return v ? [v] : [];
  }
  onTextChange(values: string[]) {
    this.form().get('textContentId')?.setValue(values[0] ?? '');
  }
  get invitedUsersSelected(): string[] {
    return this.form().get('invitedUserIds')?.value ?? [];
  }
  onInvitedUsersChange(values: string[]) {
    this.form().get('invitedUserIds')?.setValue(values ?? []);
  }

  // --- Handler for turn system radio change ---
  onTurnSystemChange(value: string) {
    this.form().get('turnSystem')?.setValue(value as TurnSystem);
  }

  // --- Text Search/Selection ---
  onTextSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    this.filteredTexts.set(
      this.texts().filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      )
    );
  };
  selectText = (text: TextContent) => {
    this.selectedText.set(text);
    this.form().get('textContentId')?.setValue(text.id);
    this.closeTextModal();
  };
  removeSelectedText = () => {
    this.selectedText.set(null);
    this.form().get('textContentId')?.setValue('');
  };
  uploadNewText = () => {
    this.uploadingText.set(true);
    // TODO: Implement upload logic, then set selectedText and textContentId
    // After upload:
    // this.uploadingText.set(false);
    // this.selectText(newText);
  };

  // --- Stepper Navigation ---
  nextStep = () => {
    console.log('nextStep', this.currentStep());
    if (this.currentStep() < this.steps.length - 1 && this.isStepValid(this.currentStep())) {
      this.currentStep.set(this.currentStep() + 1);
    }
  };
  prevStep = () => {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  };
  goToStep = (index: number) => {
    if (index >= 0 && index < this.steps.length && this.isStepValid(index - 1)) {
      this.currentStep.set(index);
    }
  };

  // --- Step Validation ---
  isStepValid = (stepIndex: number): boolean => {
    if (stepIndex < 0) return true;
    const step = this.steps[stepIndex];
    if (!step) return true;
    const formGroup = this.form();
    let valid = true;
    for (const field of step.fields) {
      const control = formGroup.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
        valid = false;
      }
    }
    return valid;
  };

  // --- Privacy Selection ---
  setPrivacy = (value: string) => {
    if (['public', 'private', 'club'].includes(value)) {
      this.form().get('privacy')?.setValue(value as RoomPrivacy);
    }
  };

  // --- Modal Logic ---
  openTextModal = () => this.textModalOpen.set(true);
  closeTextModal = () => this.textModalOpen.set(false);

  // --- Submission ---
  submit = async () => {
    if (this.currentStep() < this.steps.length - 1) {
      this.nextStep();
      return;
    }
    this.isSubmitting.set(true);
    this.submitError.set(null);
    const formValue = this.form().getRawValue();
    try {
      // TODO: Call RoomService.createRoom with mapped payload
      // const result = await this.roomService.createRoom(...)
      // this.creationResult.set({ roomId: result.id, inviteLink: ... });
      this.creationSuccess.set(true);
      this.isSubmitting.set(false);
      this.messageService.add({ severity: 'success', summary: 'Room Created', detail: 'Your reading room was created successfully!', life: 4000 });
    } catch (err: any) {
      this.submitError.set((err as any)?.message ?? 'Failed to create room');
      this.isSubmitting.set(false);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: this.submitError() ?? 'Failed to create room', life: 4000 });
    }
  };

  // --- Post-creation Actions ---
  goToRoom = () => {
    // TODO: Implement navigation to created room
  };
  copyInviteLink = () => {
    // TODO: Implement clipboard copy logic
  };
  inviteFriends = () => {
    // TODO: Implement invite friends logic (e.g., open invite modal)
  };

  // --- Misc Handlers ---
  onTagsBlur = (event: FocusEvent) => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const value = input.value || '';
    const tags = value.split(',').map(t => t.trim()).filter(Boolean);
    this.form().get('tags')?.setValue(tags);
  };
  onScheduledTimeChange = (value: string) => {
    this.form().get('scheduledTime')?.setValue(value ? new Date(value) : null);
  };

  // --- PrimeNG usage comments ---
  // Use pInputText for text inputs, pInputText for textarea, pRadioButton for radio, pDropdown for dropdowns, pMultiSelect for multi-select, pButton for buttons, pDialog for modals, pInputSwitch for toggles, pCalendar for date/time, pChips for tags, pToast for notifications (add <p-toast></p-toast> to the template).

  getNameErrors(): { key: string; value: any }[] {
    const errors = this.form().get('name')?.errors;
    return errors ? Object.entries(errors).map(([key, value]) => ({ key, value })) : [];
  }
}
