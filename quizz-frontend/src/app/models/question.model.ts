import { Language } from './language.model';
export interface Answer {
  text: string;
}

export interface Question {
  id: number;
  text: string;
  categoryId: number;
  answers: Answer[];
  correctAnswerIndex: number;
}

export interface GameQuestion {
  gameQuestionId: number;
  questionId: number;
  text: string;
  answers: string[];
  selectedAnswer?: number;
  isCorrect?: boolean;
  correctAnswerIndex?: number;
}

export interface CategoryQuestionCount {
  categoryId: number;
  categoryName: string;
  language: Language;
  availableQuestions: number;
  requestedQuestions: number;
  sufficient: boolean;
}

export interface QuestionAvailabilityResponse {
  allCategoriesAvailable: boolean;
  categories: CategoryQuestionCount[];
  language: Language;
  message: string;
  messageEn: string;
  messageDe: string;
  messageFr: string;
}
