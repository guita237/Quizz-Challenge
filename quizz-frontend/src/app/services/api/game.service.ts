import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StartGameRequest,
  StartGameResponse,
  SubmitAnswersRequest,
  GameResultDto
} from '../../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = '/api/game';

  constructor(private http: HttpClient) {}

  startGame(request: StartGameRequest): Observable<StartGameResponse> {
    return this.http.post<StartGameResponse>(`${this.apiUrl}/start`, request);
  }

  submitAnswers(gameId: number, request: SubmitAnswersRequest): Observable<GameResultDto> {
    return this.http.post<GameResultDto>(`${this.apiUrl}/${gameId}/submit`, request);
  }
}
