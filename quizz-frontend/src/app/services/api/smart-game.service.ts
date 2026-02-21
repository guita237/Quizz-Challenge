import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SmartGameConfigResponse } from '../../models/smart-game.model';
import { StartGameRequest } from '../../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class SmartGameService {
  private http = inject(HttpClient);
  private apiUrl = '/api/smart-game';

  startSmartGame(request: StartGameRequest): Observable<SmartGameConfigResponse> {
    console.log(' [SmartGameService] Envoi requête:', request);
    console.log(' URL:', `${this.apiUrl}/start`);

    return this.http.post<SmartGameConfigResponse>(`${this.apiUrl}/start`, request);
  }
}
