import { GameQuestionDto } from './game.model';

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
