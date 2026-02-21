import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Language } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);

  private translationsSubject = new BehaviorSubject<Record<string, any>>({});
  public translations$ = this.translationsSubject.asObservable();

  public loadTranslations(lang: Language): Observable<void> {
    const langCode = lang.toLowerCase();
    console.log(` Loading translations for: ${langCode}`);

    return this.http.get(`/assets/i18n/${langCode}.json`).pipe(
      tap(translations => {
        console.log(` Translations loaded for ${langCode}:`, translations);
        this.translationsSubject.next(translations);
      }),
      map(() => void 0),
      catchError(error => {
        console.error(` Failed to load translations for ${lang}:`, error);
        // Fallback to empty translations
        this.translationsSubject.next({});
        return of(void 0);
      })
    );
  }

  public getTranslation(key: string, params?: Record<string, any>): string {
    const translations = this.translationsSubject.getValue();

    //if no translations loaded, return the key as fallback
    if (Object.keys(translations).length === 0) {
      return key;
    }

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(` Translation key not found: ${key}`);
        return key;
      }
    }

    if (params && typeof value === 'string') {
      Object.keys(params).forEach(param => {
        value = value.replace(`{{${param}}}`, params[param].toString());
      });
    }

    return value;
  }
}
