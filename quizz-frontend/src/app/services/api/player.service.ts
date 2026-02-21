import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, CreatePlayerRequest } from '../../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = '/api/players';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  getPlayerByName(name: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/by-name?name=${encodeURIComponent(name)}`);
  }

  createPlayer(playerRequest: CreatePlayerRequest): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, playerRequest);
  }

  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
