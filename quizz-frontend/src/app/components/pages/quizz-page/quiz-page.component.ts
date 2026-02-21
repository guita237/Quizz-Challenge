import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { gsap } from 'gsap';
import { ProgressStepsComponent } from '../../layout/progress-steps/progress-steps.component';

import { GameStateService } from '../../../services/game-state.service';
import { GameService } from '../../../services/api/game.service';
import { GameQuestion } from '../../../models/question.model';
import {TranslatePipe} from '../pipes/translate.pipe';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProgressStepsComponent,
    TranslatePipe
  ],
  templateUrl: './quiz-page.component.html',
  styleUrls: ['./quiz-page.component.css']
})
export class QuizPageComponent implements OnInit, OnDestroy {
  private gameStateService = inject(GameStateService);
  private gameService = inject(GameService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  questions: GameQuestion[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion?: GameQuestion;
  selectedAnswer?: number;
  timeLeft: number = 30;
  maxTime: number = 30;
  timerActive: boolean = true;
  answerSubmitted: boolean = false;
  isSmartGame: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  private timerSubscription?: Subscription;

  ngOnInit(): void {
    const state = this.gameStateService.getState();
    this.questions = state.questions;

    if (this.questions.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    //  Détecter si c'est un smart game (les gameQuestionId sont null)
    this.isSmartGame = this.questions.some(q => q.gameQuestionId === null || q.gameQuestionId === undefined);
    console.log('Mode smart game:', this.isSmartGame);

    this.loadCurrentQuestion();
    this.startTimer();
    this.animateEntrance();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadCurrentQuestion(): void {
    this.currentQuestion = this.questions[this.currentQuestionIndex];

    //  Pour le smart game, on ne pré-charge PAS les réponses
    if (!this.isSmartGame) {
      const savedAnswer = this.gameStateService.getSelectedAnswer(this.currentQuestion.gameQuestionId);
      this.selectedAnswer = savedAnswer;
      this.answerSubmitted = savedAnswer !== undefined;
    } else {
      // Pour le smart game, on commence avec aucune réponse sélectionnée
      this.selectedAnswer = undefined;
      this.answerSubmitted = false;
    }

    this.timeLeft = this.maxTime;
    this.timerActive = !this.answerSubmitted;

    // Réactiver le timer si pas de réponse
    if (!this.answerSubmitted && !this.timerSubscription) {
      this.startTimer();
    }

    this.cdr.detectChanges();
  }

  startTimer(): void {
    this.stopTimer();
    this.timerActive = true;

    this.timerSubscription = interval(1000).subscribe(() => {
      if (!this.timerActive || this.answerSubmitted) return;

      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.detectChanges();

        // Avertissements visuels
        if (this.timeLeft === 10) {
          this.showTimerWarning();
        }
        if (this.timeLeft === 5) {
          this.showTimerCritical();
        }
      } else {
        // Temps écoulé
        this.timerActive = false;
        this.stopTimer();
        if (!this.answerSubmitted) {
          this.handleTimeout();
        }
      }
    });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  handleTimeout(): void {
    this.answerSubmitted = true;
    this.timerActive = false;
    this.cdr.detectChanges();

    // Sauvegarder l'absence de réponse
    if (this.currentQuestion) {
      this.gameStateService.setAnswer(this.currentQuestion.gameQuestionId, -1);
    }

    // Passer à la question suivante après un délai
    setTimeout(() => {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.nextQuestion();
      } else {
        this.finishQuiz();
      }
    }, 1500);
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  showTimerWarning(): void {
    gsap.to('.timer', {
      color: '#fbbf24',
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 2
    });
  }

  showTimerCritical(): void {
    gsap.to('.timer', {
      color: '#ef4444',
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 5,
      ease: 'power2.inOut'
    });
  }

  selectAnswer(index: number): void {
    // Empêcher de changer de réponse après soumission
    if (this.answerSubmitted) return;

    console.log('Réponse sélectionnée:', index);
    this.selectedAnswer = index;
    this.answerSubmitted = true;
    this.timerActive = false;
    this.stopTimer();

    // Sauvegarder la réponse
    this.saveAnswer();

    // Animation de sélection
    gsap.to(`.answer-option:nth-child(${index + 1})`, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    // Feedback visuel
    gsap.to('.answer-option.selected', {
      boxShadow: '0 0 20px rgba(74,222,128,0.5)',
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });

    this.cdr.detectChanges();
  }

  saveAnswer(): void {
    if (this.currentQuestion) {
      const answerIndex = this.selectedAnswer !== undefined ? this.selectedAnswer : -1;
      this.gameStateService.setAnswer(
        this.currentQuestion.gameQuestionId,
        answerIndex
      );

      // Auto-avance après 1 seconde (optionnel)
      setTimeout(() => {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.nextQuestion();
        }
      }, 800);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.animateQuestionExit(() => {
        this.currentQuestionIndex++;
        this.loadCurrentQuestion();
        this.animateQuestionEntrance();
      });
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.animateQuestionExit(() => {
        this.currentQuestionIndex--;
        this.loadCurrentQuestion();
        this.animateQuestionEntrance();
      });
    }
  }

  finishQuiz(): void {
    this.isSubmitting = true;
    this.stopTimer();

    const state = this.gameStateService.getState();

    const answers = Array.from(state.userAnswers.entries()).map(([gameQuestionId, chosenAnswerIndex]) => ({
      gameQuestionId,
      chosenAnswerIndex: chosenAnswerIndex !== undefined ? chosenAnswerIndex : -1
    }));

    const submitRequest = { answers };

    if (state.currentGameId) {
      this.gameService.submitAnswers(state.currentGameId, submitRequest).subscribe({
        next: (result) => {
          this.gameStateService.updateState({
            result,
            endTime: new Date()
          });
          this.isSubmitting = false;
          this.animateExit(() => {
            this.router.navigate(['/results']);
          });
        },
        error: (error) => {
          console.error('Failed to submit answers:', error);
          this.errorMessage = 'quiz.submitError';
          this.isSubmitting = false;
          setTimeout(() => {
            this.router.navigate(['/results']);
          }, 2000);
        }
      });
    } else {
      this.router.navigate(['/results']);
    }
  }

  confirmFinish(): void {
    if (confirm(this.getTranslation('quiz.confirmFinish'))) {
      this.finishQuiz();
    }
  }

  getProgressPercentage(): number {
    const answered = this.gameStateService.getAnsweredQuestionsCount();
    const total = this.gameStateService.getTotalQuestionsCount();
    return (answered / total) * 100;
  }

  getTimeFormatted(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getTimerColor(): string {
    if (this.timeLeft > 20) return '#4ade80';
    if (this.timeLeft > 10) return '#fbbf24';
    if (this.timeLeft > 5) return '#f97316';
    return '#ef4444';
  }

  getTimerWidth(): number {
    return (this.timeLeft / this.maxTime) * 100;
  }

  getTranslation(key: string): string {
    return key;
  }

  private animateEntrance(): void {
    gsap.from('.quiz-container', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });

    gsap.from('.question-card', {
      duration: 0.8,
      y: 40,
      opacity: 0,
      delay: 0.2,
      ease: 'back.out(1.2)'
    });

    gsap.from('.answers-grid', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      delay: 0.4,
      ease: 'power3.out'
    });
  }

  private animateQuestionExit(onComplete: () => void): void {
    gsap.to('.question-card', {
      duration: 0.2,
      x: -20,
      opacity: 0,
      ease: 'power2.in',
      onComplete
    });
  }

  private animateQuestionEntrance(): void {
    gsap.fromTo('.question-card',
      { x: 20, opacity: 0 },
      { duration: 0.3, x: 0, opacity: 1, ease: 'power2.out' }
    );
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.quiz-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
