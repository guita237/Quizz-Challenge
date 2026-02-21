import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '../../pages/pipes/translate.pipe';

@Component({
  selector: 'app-progress-steps',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './progress-steps.component.html',
  styleUrls: ['./progress-steps.component.css']
})
export class ProgressStepsComponent {
  @Input() currentStep: number = 1;

  steps: { label: string; step: number }[] = [
    { label: 'language.step', step: 1 },
    { label: 'player.step', step: 2 },
    { label: 'categories.step', step: 3 },
    { label: 'config.step', step: 4 },
    { label: 'game.step', step: 5 },
    { label: 'results.step', step: 6 }
  ];

  isActive(step: number): boolean {
    return this.currentStep === step;
  }

  isCompleted(step: number): boolean {
    return this.currentStep > step;
  }
}
