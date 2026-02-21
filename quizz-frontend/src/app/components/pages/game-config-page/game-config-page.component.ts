import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ProgressStepsComponent } from '../../layout/progress-steps/progress-steps.component';

import { GameStateService } from '../../../services/game-state.service';
import { CategoryService } from '../../../services/api/category.service';
import { GameService } from '../../../services/api/game.service';
import { SmartGameService } from '../../../services/api/smart-game.service';
import { LanguageService } from '../../../services/language.service';
import { TranslationService } from '../../../services/translation.service';

import { Language } from '../../../models/language.model';
import { SmartGameConfigResponse } from '../../../models/smart-game.model';
import {TranslatePipe} from '../pipes/translate.pipe';
import {CategoryQuestionCount} from '../../../models/question.model';

@Component({
  selector: 'app-game-config-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProgressStepsComponent,
    TranslatePipe
  ],
  templateUrl: './game-config-page.component.html',
  styleUrls: ['./game-config-page.component.css']
})
export class GameConfigPageComponent implements OnInit, AfterViewInit {
  private gameStateService = inject(GameStateService);
  private categoryService = inject(CategoryService);
  private gameService = inject(GameService);
  private smartGameService = inject(SmartGameService);
  private languageService = inject(LanguageService);
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  questionsPerCategory: number = 5;
  totalQuestions: number = 0;
  selectedCategoriesCount: number = 0;
  selectedCategories: string[] = [];
  categoryLimits: CategoryQuestionCount[] = [];
  currentLanguage: Language = Language.FR;

  isLoading: boolean = false;
  isValidating: boolean = false;
  errorMessage: string = '';
  warningMessage: string = '';
  canProceed: boolean = true;

  minQuestions: number = 1;
  maxQuestions: number = 20;

  // Propriétés pour l'ajustement intelligent
  showAdjustmentModal: boolean = false;
  smartConfigResponse?: SmartGameConfigResponse;

  ngOnInit(): void {
    console.log('📋 GameConfigPage initialized');
    const state = this.gameStateService.getState();
    this.questionsPerCategory = state.questionsPerCategory || 5;
    this.selectedCategories = state.selectedCategories;
    this.selectedCategoriesCount = this.selectedCategories.length;
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.calculateTotalQuestions();
    this.validateQuestionAvailability();
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  calculateTotalQuestions(): void {
    this.totalQuestions = this.selectedCategoriesCount * this.questionsPerCategory;
  }

  onQuestionsPerCategoryChange(value: number): void {
    console.log('📊 Questions per category changed to:', value);
    this.questionsPerCategory = value;
    this.gameStateService.setQuestionsPerCategory(value);
    this.calculateTotalQuestions();
    this.validateQuestionAvailability();
  }

  validateQuestionAvailability(): void {
    if (this.selectedCategories.length === 0) {
      this.warningMessage = this.translationService.getTranslation('config.noCategories');
      this.canProceed = false;
      this.cdr.detectChanges();
      return;
    }

    this.isValidating = true;
    this.cdr.detectChanges();

    const lang = this.currentLanguage;

    this.categoryService.checkQuestionAvailability(
      lang,
      this.selectedCategories,
      this.questionsPerCategory
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Availability response received:', response);
        this.categoryLimits = response.categories;

        const insufficientCategories = response.categories.filter((c: any) => !c.sufficient);

        if (response.allCategoriesAvailable) {
          this.warningMessage = '';
          this.canProceed = true;
        } else {
          this.warningMessage = response.message;
          this.canProceed = false;
        }

        this.isValidating = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Validation error:', error);
        this.warningMessage = this.translationService.getTranslation('config.validationError');
        this.canProceed = false;
        this.isValidating = false;
        this.cdr.detectChanges();
      }
    });
  }

  getMaxAllowed(): number {
    if (this.categoryLimits.length === 0) return this.questionsPerCategory;

    return Math.min(
      ...this.categoryLimits.map(c => c.availableQuestions),
      this.maxQuestions
    );
  }

  getCategoryLimit(categoryName: string): number {
    const cat = this.categoryLimits.find(c => c.categoryName === categoryName);
    return cat ? cat.availableQuestions : this.maxQuestions;
  }

  getSliderMax(): number {
    if (this.categoryLimits.length === 0) return this.maxQuestions;

    const minAvailable = Math.min(...this.categoryLimits.map(c => c.availableQuestions));
    return Math.min(minAvailable, this.maxQuestions);
  }

  getSliderColor(): string {
    if (this.questionsPerCategory > this.getSliderMax()) return '#ef4444';
    if (this.questionsPerCategory === this.getSliderMax()) return '#fbbf24';
    return '#4ade80';
  }

  increaseQuestions(): void {
    const maxAllowed = this.getSliderMax();
    if (this.questionsPerCategory < maxAllowed) {
      this.onQuestionsPerCategoryChange(this.questionsPerCategory + 1);
    }
  }

  decreaseQuestions(): void {
    if (this.questionsPerCategory > 1) {
      this.onQuestionsPerCategoryChange(this.questionsPerCategory - 1);
    }
  }

  getCategoryStatus(category: CategoryQuestionCount): { class: string; text: string } {
    if (category.sufficient) {
      return {
        class: 'available',
        text: this.translationService.getTranslation('config.sufficient')
      };
    } else {
      return {
        class: 'insufficient',
        text: this.translationService.getTranslation('config.insufficient')
      };
    }
  }

  trackByCategoryId(index: number, category: CategoryQuestionCount): number {
    return category.categoryId;
  }

  goBack(): void {
    this.animateExit(() => {
      this.router.navigate(['/categories']);
    });
  }

  // Méthode pour démarrer le jeu normal
  startGame(): void {
    if (!this.canProceed) {
      this.errorMessage = this.translationService.getTranslation('config.fixIssuesFirst');
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const state = this.gameStateService.getState();

    if (!state.playerId) {
      this.errorMessage = this.translationService.getTranslation('player.notFound');
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const startGameRequest = {
      playerId: state.playerId,
      language: state.selectedLanguage,
      categoryNames: state.selectedCategories,
      questionsPerCategory: this.questionsPerCategory
    };

    this.categoryService.checkQuestionAvailability(
      state.selectedLanguage,
      state.selectedCategories,
      this.questionsPerCategory
    ).subscribe({
      next: (response: any) => {
        if (response.allCategoriesAvailable) {
          this.proceedWithGameStart(startGameRequest);
        } else {
          this.warningMessage = response.message;
          this.canProceed = false;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('❌ Final validation error:', error);
        this.errorMessage = this.translationService.getTranslation('config.finalValidationError');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ Méthode pour démarrer avec la configuration intelligente
  startSmartGame(): void {
    console.log('🎯 startSmartGame() appelée');

    const state = this.gameStateService.getState();
    console.log('État actuel:', state);

    if (!state.playerId) {
      console.error('❌ playerId manquant');
      this.errorMessage = this.translationService.getTranslation('player.notFound');
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.warningMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    const request = {
      playerId: state.playerId,
      language: state.selectedLanguage,
      categoryNames: state.selectedCategories,
      questionsPerCategory: this.questionsPerCategory
    };

    console.log('📤 Envoi requête smart game:', request);

    this.smartGameService.startSmartGame(request).subscribe({
      next: (response: SmartGameConfigResponse) => {
        console.log('📥 Réponse smart game reçue:', response);

        // Arrêter le loading
        this.isLoading = false;

        // Sauvegarder la réponse
        this.smartConfigResponse = response;
        this.totalQuestions = response.totalQuestions;

        // Afficher la modale si ajustement nécessaire
        if (response.adjusted) {
          console.log('⚡ Configuration ajustée, affichage de la modale');
          this.showAdjustmentModal = true;
        } else {
          console.log('✅ Configuration directe, démarrage du jeu');
          this.proceedWithGameResponse(response);
        }

        // Forcer la mise à jour de l'UI
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ Erreur smart game:', error);
        this.isLoading = false;
        this.errorMessage = this.translationService.getTranslation('game.startError');
        this.cdr.detectChanges();
      }
    });
  }

  private proceedWithGameStart(request: any): void {
    console.log('🎮 Démarrage du jeu normal');
    this.gameService.startGame(request).subscribe({
      next: (response: any) => {
        this.gameStateService.setGameQuestions(response.gameId, response.questions);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.animateExit(() => {
          this.router.navigate(['/quiz']);
        });
      },
      error: (error: any) => {
        console.error('❌ Failed to start game:', error);
        this.errorMessage = this.translationService.getTranslation('game.startError');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private proceedWithGameResponse(response: SmartGameConfigResponse): void {
    console.log('🎮 Démarrage du jeu avec réponse smart');
    this.gameStateService.setGameQuestions(response.gameId, response.questions);
    this.animateExit(() => {
      this.router.navigate(['/quiz']);
    });
  }

  acceptAdjustedConfig(): void {
    console.log('✅ Configuration ajustée acceptée');
    this.showAdjustmentModal = false;
    if (this.smartConfigResponse) {
      this.proceedWithGameResponse(this.smartConfigResponse);
    }
  }

  declineAdjustedConfig(): void {
    console.log('❌ Configuration ajustée refusée');
    this.showAdjustmentModal = false;
    this.smartConfigResponse = undefined;
    this.cdr.detectChanges();
  }

  getAdjustmentMessage(): string {
    if (!this.smartConfigResponse) return '';

    switch (this.currentLanguage) {
      case Language.EN:
        return this.smartConfigResponse.messageEn;
      case Language.DE:
        return this.smartConfigResponse.messageDe;
      default:
        return this.smartConfigResponse.messageFr;
    }
  }

  getEfficiencyPercentage(): number {
    if (!this.smartConfigResponse) return 0;
    const requested = this.smartConfigResponse.requestedPerCategory * this.selectedCategories.length;
    const actual = this.smartConfigResponse.totalQuestions;
    return Math.round((actual / requested) * 100);
  }

  private animateEntrance(): void {
    gsap.from('.game-config-container', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.game-config-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
