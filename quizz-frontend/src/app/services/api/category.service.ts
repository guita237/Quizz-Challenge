import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { CategoryDto, Category } from '../../models/category.model';
import { Language } from '../../models/language.model';
import {CategoryQuestionCount, QuestionAvailabilityResponse} from '../../models/question.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api/categories';

  getCategoriesByLanguage(lang: Language): Observable<CategoryDto[]> {
    console.log(`Fetching categories for language: ${lang}`);

    return this.http.get<CategoryDto[]>(`${this.apiUrl}/by-language-dto?lang=${lang}`).pipe(
      catchError(error => {
        console.error(`Error fetching categories for ${lang}:`, error);
        // Retourner des données mock pour le développement
        return of(this.getMockCategories(lang));
      })
    );
  }

  checkQuestionAvailability(
    lang: Language,
    categoryNames: string[],
    requestedPerCategory: number
  ): Observable<QuestionAvailabilityResponse> {
    console.log('Checking question availability:', { lang, categoryNames, requestedPerCategory });

    return this.http.post<QuestionAvailabilityResponse>(
      `${this.apiUrl}/check-availability?lang=${lang}&requestedPerCategory=${requestedPerCategory}`,
      categoryNames
    ).pipe(
      catchError(error => {
        console.error('Error checking question availability:', error);
        // Retourner une réponse mock en cas d'erreur
        return of(this.getMockAvailabilityResponse(lang, categoryNames, requestedPerCategory));
      })
    );
  }

  private getMockAvailabilityResponse(
    lang: Language,
    categoryNames: string[],
    requestedPerCategory: number
  ): QuestionAvailabilityResponse {
    const categories: CategoryQuestionCount[] = categoryNames.map((name, index) => ({
      categoryId: index + 1,
      categoryName: name,
      language: lang,
      availableQuestions: Math.floor(Math.random() * 10) + 1,
      requestedQuestions: requestedPerCategory,
      sufficient: Math.random() > 0.3
    }));

    const allAvailable = categories.every(c => c.sufficient);

    return {
      allCategoriesAvailable: allAvailable,
      categories,
      language: lang,
      message: allAvailable ? 'All categories have enough questions' : 'Some categories have insufficient questions',
      messageEn: allAvailable ? 'All categories have enough questions' : 'Some categories have insufficient questions',
      messageDe: allAvailable ? 'Alle Kategorien haben genügend Fragen' : 'Einige Kategorien haben unzureichende Fragen',
      messageFr: allAvailable ? 'Toutes les catégories ont suffisamment de questions' : 'Certaines catégories ont un nombre insuffisant de questions'
    };
  }

  getMockCategories(lang: Language): CategoryDto[] {
    const categoriesByLang: Record<Language, CategoryDto[]> = {
      [Language.FR]: [
        { id: 1, name: 'Géographie', description: 'Testez vos connaissances géographiques', language: Language.FR },
        { id: 2, name: 'Histoire', description: 'Événements et personnages historiques', language: Language.FR },
        { id: 3, name: 'Science', description: 'Découvertes scientifiques', language: Language.FR },
        { id: 4, name: 'Sports', description: 'Sports et athlètes', language: Language.FR },
        { id: 5, name: 'Divertissement', description: 'Films, musique, célébrités', language: Language.FR }
      ],
      [Language.EN]: [
        { id: 1, name: 'Geography', description: 'Test your geography knowledge', language: Language.EN },
        { id: 2, name: 'History', description: 'Historical events and figures', language: Language.EN },
        { id: 3, name: 'Science', description: 'Scientific discoveries', language: Language.EN },
        { id: 4, name: 'Sports', description: 'Sports and athletes', language: Language.EN },
        { id: 5, name: 'Entertainment', description: 'Movies, music, celebrities', language: Language.EN }
      ],
      [Language.DE]: [
        { id: 1, name: 'Geographie', description: 'Testen Sie Ihr geografisches Wissen', language: Language.DE },
        { id: 2, name: 'Geschichte', description: 'Historische Ereignisse und Persönlichkeiten', language: Language.DE },
        { id: 3, name: 'Wissenschaft', description: 'Wissenschaftliche Entdeckungen', language: Language.DE },
        { id: 4, name: 'Sport', description: 'Sport und Athleten', language: Language.DE },
        { id: 5, name: 'Unterhaltung', description: 'Filme, Musik, Prominente', language: Language.DE }
      ]
    };

    return categoriesByLang[lang] || categoriesByLang[Language.FR];
  }
}
