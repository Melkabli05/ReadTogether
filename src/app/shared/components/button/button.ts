import { Component, input, computed, output, HostBinding } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonSeverity =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'basic'
  | 'dark'
  | 'vibrant'
  | 'white'
  | 'text';
export type ButtonGradient =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'radial'
  | 'none';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  label = input<string>('');
  size = input<ButtonSize>('md');
  severity = input<ButtonSeverity>('primary');
  icon = input<string | null>(null);
  iconPos = input<'left' | 'right'>('right');
  gradient = input<ButtonGradient>('none');
  rounded = input<boolean>(false);
  outlined = input<boolean>(false);
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  buttonClick = output<void>();

  @HostBinding('style.display')
  get display(): string {
    return this.fullWidth() ? 'block' : 'inline-block';
  }

  protected readonly buttonClass = computed(() => {
    const isIconOnly = !this.label() && !!this.icon();
    return {
      'button': true,
      [`button--${this.size()}`]: true,
      [`button--${this.severity()}`]: true,
      [`button--gradient-${this.gradient()}`]: this.gradient() !== 'none',
      'button--rounded': this.rounded(),
      'button--icon-only': isIconOnly,
      'button--outlined': this.outlined(),
      'button--full-width': this.fullWidth(),
      'button--disabled': this.disabled(),
      'button--loading': this.loading()
    };
  });

  handleClick() {
    this.buttonClick.emit();
  }
}