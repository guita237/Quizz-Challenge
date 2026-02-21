import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './services/language.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      position: relative;
    }
  `]
})
export class AppComponent implements OnInit {
  private languageService = inject(LanguageService);
  private translationService = inject(TranslationService);

  ngOnInit(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    this.translationService.loadTranslations(currentLang).subscribe();
  }
}
