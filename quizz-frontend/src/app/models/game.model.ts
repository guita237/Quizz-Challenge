import { Language } from './language.model';

export interface StartGameRequest {
  playerId: number;
  language: Language;
  categoryNames: string[];
  questionsPerCategory: number;
}

export interface GameQuestionDto {
  gameQuestionId: number;
  questionId: number;
  text: string;
  answers: string[];
}

export interface StartGameResponse {
  gameId: number;
  questions: GameQuestionDto[];
}

export interface AnswerSubmissionDto {
  gameQuestionId: number;
  chosenAnswerIndex: number;
}

export interface SubmitAnswersRequest {
  answers: AnswerSubmissionDto[];
}

export interface QuestionResultDto {
  questionText: string;
  chosenAnswerIndex: number;
  correctAnswerIndex: number;
  correct: boolean;
}

export interface GameResultDto {
  gameId: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  details: QuestionResultDto[];
}

export interface GameState {
  playerId?: number;
  playerName: string;
  selectedLanguage: Language;
  selectedCategories: string[];
  questionsPerCategory: number;
  currentGameId?: number;
  questions: GameQuestionDto[];
  userAnswers: Map<number, number>;
  startTime?: Date;
  endTime?: Date;
  result?: GameResultDto;
}

export interface SmartGameConfigResponse {
  gameId: number;
  requestedPerCategory: number;
  actualPerCategory: number;
  totalQuestions: number;
  distributionPerCategory: Record<string, number>;
  questions: GameQuestionDto[];
  message: string;
  messageEn: string;
  messageDe: string;
  messageFr: string;
  adjusted: boolean;
}
