import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ProgressStepsComponent } from '../../layout/progress-steps/progress-steps.component';

import { PlayerService } from '../../../services/api/player.service';
import { GameStateService } from '../../../services/game-state.service';
import { LanguageService } from '../../../services/language.service';
import {TranslatePipe} from '../pipes/translate.pipe';

@Component({
  selector: 'app-player-setup-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProgressStepsComponent,
    TranslatePipe
  ],
  templateUrl: './player-setup-page.component.html',
  styleUrls: ['./player-setup-page.component.css']
})
export class PlayerSetupPageComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private gameStateService = inject(GameStateService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  playerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    const state = this.gameStateService.getState();
    if (state.playerName) {
      this.playerForm.patchValue({ name: state.playerName });
    }
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  animateEntrance(): void {
    gsap.from('.player-setup-container', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  goBack(): void {
    this.animateExit(() => {
      this.router.navigate(['/']);
    });
  }

  onSubmit(): void {
    if (this.playerForm.valid) {
      this.isLoading = true;

      this.playerService.createPlayer({ name: this.playerForm.value.name }).subscribe({
        next: (player) => {
          this.gameStateService.setPlayer(player.id!, player.name);
          this.isLoading = false;
          this.animateExit(() => {
            this.router.navigate(['/categories']);
          });
        },
        error: (error) => {
          console.error('Failed to create player:', error);
          this.errorMessage = 'player.error';
          this.isLoading = false;
        }
      });
    }
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.player-setup-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
