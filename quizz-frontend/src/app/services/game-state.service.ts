import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../models/game.model';
import { Language } from '../models/language.model';
import { GameQuestion } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private stateSubject = new BehaviorSubject<GameState>(this.getInitialState());
  public state$ = this.stateSubject.asObservable();

  private getInitialState(): GameState {
    // try to load saved state from localStorage
    const savedState = localStorage.getItem('quiz_game_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Restore userAnswers as Map
        if (parsed.userAnswers) {
          parsed.userAnswers = new Map(parsed.userAnswers);
        }
        return parsed;
      } catch (e) {
        console.error('Erreur chargement state:', e);
      }
    }

    return {
      playerId: undefined,
      playerName: '',
      selectedLanguage: Language.FR,
      selectedCategories: [],
      questionsPerCategory: 5,
      questions: [],
      userAnswers: new Map<number, number>()
    };
  }

  public getState(): GameState {
    return this.stateSubject.getValue();
  }

  public updateState(updates: Partial<GameState>): void {
    const currentState = this.getState();
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);

    // save to localStorage (except questions for privacy and size reasons)
    const toSave = {
      ...newState,
      questions: [], // On ne sauvegarde pas les questions
      userAnswers: Array.from(newState.userAnswers.entries())
    };
    localStorage.setItem('quiz_game_state', JSON.stringify(toSave));
  }

  public setPlayer(playerId: number, playerName: string): void {
    this.updateState({ playerId, playerName });
  }

  public setLanguage(language: Language): void {
    this.updateState({ selectedLanguage: language });
  }

  public setSelectedCategories(categories: string[]): void {
    this.updateState({ selectedCategories: categories });
  }

  public setQuestionsPerCategory(count: number): void {
    this.updateState({ questionsPerCategory: count });
  }

  public setGameQuestions(gameId: number, questions: GameQuestion[]): void {
    this.updateState({
      currentGameId: gameId,
      questions,
      startTime: new Date(),
      userAnswers: new Map<number, number>()
    });
  }

  public setAnswer(gameQuestionId: number, answerIndex: number): void {
    const currentAnswers = new Map(this.getState().userAnswers);
    currentAnswers.set(gameQuestionId, answerIndex);
    this.updateState({ userAnswers: currentAnswers });
  }

  public resetGame(): void {
    localStorage.removeItem('quiz_game_state');
    this.stateSubject.next(this.getInitialState());
  }

  public getProgress(): number {
    const state = this.getState();
    if (state.questions.length === 0) return 0;
    return (state.userAnswers.size / state.questions.length) * 100;
  }

  public isAnswerSelected(gameQuestionId: number): boolean {
    return this.getState().userAnswers.has(gameQuestionId);
  }

  public getSelectedAnswer(gameQuestionId: number): number | undefined {
    return this.getState().userAnswers.get(gameQuestionId);
  }

  public getAnsweredQuestionsCount(): number {
    return this.getState().userAnswers.size;
  }

  public getTotalQuestionsCount(): number {
    return this.getState().questions.length;
  }
}
