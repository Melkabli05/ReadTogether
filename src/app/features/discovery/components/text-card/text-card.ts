import { Component, input } from '@angular/core';
import { TextContent } from '../../../../core/models/text-content.model';
import { DecimalPipe } from '@angular/common';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-text-card',
  imports: [DecimalPipe, Button],
  templateUrl: './text-card.html'
})
export class TextCard {
  text = input.required<TextContent>();

} 