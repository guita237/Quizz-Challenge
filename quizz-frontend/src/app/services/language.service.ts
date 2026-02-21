import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language, LanguageOption, LANGUAGES } from '../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>(Language.FR);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  public readonly languages: LanguageOption[] = LANGUAGES;

  constructor() {
    this.loadSavedLanguage();
  }

  private loadSavedLanguage(): void {
    const savedLang = localStorage.getItem('quiz_language') as Language;
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.currentLanguageSubject.next(savedLang);
    }
  }

  private isValidLanguage(lang: string): lang is Language {
    return Object.values(Language).includes(lang as Language);
  }

  public setLanguage(lang: Language, save: boolean = true): void {
    if (save) {
      localStorage.setItem('quiz_language', lang);
    }
    this.currentLanguageSubject.next(lang);
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.getValue();
  }

  public getLanguageOption(lang: Language): LanguageOption {
    return this.languages.find(l => l.code === lang) || this.languages[0];
  }
}
