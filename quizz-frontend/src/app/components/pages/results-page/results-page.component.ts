import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ProgressStepsComponent } from '../../layout/progress-steps/progress-steps.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { GameStateService } from '../../../services/game-state.service';
import { GameResultDto, QuestionResultDto } from '../../../models/game.model';

export interface EnrichedQuestionResult extends QuestionResultDto {
  userAnswerText: string;
  correctAnswerText: string;
  userAnswerLetter: string;
  correctAnswerLetter: string;
  wasAnswered: boolean;
  questionText: string;
}

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProgressStepsComponent,
    TranslatePipe
  ],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent implements OnInit, AfterViewInit {
  private gameStateService = inject(GameStateService);
  private router = inject(Router);

  result?: GameResultDto;
  timeSpent: number = 0;
  percentage: number = 0;
  showDetails: boolean = true;

  enrichedResults: EnrichedQuestionResult[] = [];

  // Statistics
  totalQuestions: number = 0;
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  unanswered: number = 0;

  ngOnInit(): void {
    const state = this.gameStateService.getState();
    this.result = state.result;

    if (!this.result) {
      this.router.navigate(['/']);
      return;
    }

    if (state.startTime && state.endTime) {
      this.timeSpent = Math.floor((state.endTime.getTime() - state.startTime.getTime()) / 1000);
    }

    this.totalQuestions = this.result.totalQuestions;
    this.correctAnswers = this.result.correctAnswers;
    this.incorrectAnswers = this.result.details.filter(d => !d.correct && d.chosenAnswerIndex >= 0).length;
    this.unanswered = this.result.details.filter(d => d.chosenAnswerIndex === undefined || d.chosenAnswerIndex < 0).length;

    this.percentage = (this.correctAnswers / this.totalQuestions) * 100;

    // enrich results with question text and answer texts
    this.enrichResults(state);
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  private enrichResults(state: any): void {
    if (!this.result || !state.questions) {
      console.error('Pas de questions dans le state');
      return;
    }

    console.log('State questions:', state.questions);
    console.log('Result details:', this.result.details);

    this.enrichedResults = this.result.details.map((detail: QuestionResultDto) => {
      // Find the corresponding question in the state by matching the question text
      const question = state.questions.find((q: any) => q.text === detail.questionText);

      let userAnswerText = 'Pas de réponse';
      let correctAnswerText = 'Inconnu';
      let userAnswerLetter = '-';
      let correctAnswerLetter = '-';
      let wasAnswered = false;

      if (question && question.answers) {
        console.log('Question trouvée:', question.text);
        console.log('Answers:', question.answers);
        console.log('correctAnswerIndex:', detail.correctAnswerIndex);
        console.log('chosenAnswerIndex:', detail.chosenAnswerIndex);

        // correct answer
        if (detail.correctAnswerIndex !== undefined &&
          detail.correctAnswerIndex >= 0 &&
          detail.correctAnswerIndex < question.answers.length) {
          correctAnswerText = question.answers[detail.correctAnswerIndex];
          correctAnswerLetter = String.fromCharCode(65 + detail.correctAnswerIndex);
        }

        // Answer of the user
        if (detail.chosenAnswerIndex !== undefined &&
          detail.chosenAnswerIndex >= 0 &&
          detail.chosenAnswerIndex < question.answers.length) {
          userAnswerText = question.answers[detail.chosenAnswerIndex];
          userAnswerLetter = String.fromCharCode(65 + detail.chosenAnswerIndex);
          wasAnswered = true;
        }
      } else {
        console.warn('Question non trouvée pour:', detail.questionText);
      }

      return {
        ...detail,
        questionText: detail.questionText,
        userAnswerText,
        correctAnswerText,
        userAnswerLetter,
        correctAnswerLetter,
        wasAnswered
      };
    });

    console.log('Résultats enrichis:', this.enrichedResults);
  }

  getGrade(): { letter: string; color: string; message: string } {
    if (this.percentage >= 90) return {
      letter: 'A',
      color: '#4ade80',
      message: 'results.excellent'
    };
    if (this.percentage >= 70) return {
      letter: 'B',
      color: '#60a5fa',
      message: 'results.good'
    };
    if (this.percentage >= 50) return {
      letter: 'C',
      color: '#fbbf24',
      message: 'results.average'
    };
    if (this.percentage >= 30) return {
      letter: 'D',
      color: '#fb923c',
      message: 'results.tryAgain'
    };
    return {
      letter: 'F',
      color: '#ef4444',
      message: 'results.tryAgain'
    };
  }

  getTimeFormatted(): string {
    const minutes = Math.floor(this.timeSpent / 60);
    const seconds = this.timeSpent % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getScoreMessage(): string {
    return this.getGrade().message;
  }

  getStatusIcon(detail: EnrichedQuestionResult): string {
    if (!detail.wasAnswered) return '⏰';
    return detail.correct ? '✓' : '✗';
  }

  getStatusClass(detail: EnrichedQuestionResult): string {
    if (!detail.wasAnswered) return 'timeout';
    return detail.correct ? 'correct' : 'incorrect';
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  // back to home or play again just resets the game state
  goToHome(): void {
    this.gameStateService.resetGame();
    this.animateExit(() => {
      this.router.navigate(['/']);
    });
  }

  playAgain(): void {
    this.gameStateService.resetGame();
    this.animateExit(() => {
      this.router.navigate(['/']);
    });
  }

  newPlayer(): void {
    this.gameStateService.resetGame();
    this.animateExit(() => {
      this.router.navigate(['/player']);
    });
  }

  getScoreColor(): string {
    if (this.percentage >= 70) return '#4ade80';
    if (this.percentage >= 50) return '#fbbf24';
    if (this.percentage >= 30) return '#fb923c';
    return '#ef4444';
  }

  private animateEntrance(): void {
    const tl = gsap.timeline();

    tl.from('.results-container', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    })
      .from('.score-circle', {
        duration: 1,
        scale: 0,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: 0.2
      })
      .from('.score-details', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.stats-grid', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.2')
      .from('.details-section', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.2')
      .from('.actions', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.2');
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.results-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
