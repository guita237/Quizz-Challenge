import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private apiUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  importForLanguage(lang: Language): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/import-csv?lang=${lang}`, {});
  }

  importAll(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/import-all`, {});
  }

  ping(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/ping`);
  }
}
