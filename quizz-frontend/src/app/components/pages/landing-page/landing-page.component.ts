import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { LanguageSelectorComponent } from '../../shared/language-selector/language-selector.component';
import { TranslatePipe } from '../pipes/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { TranslationService } from '../../../services/translation.service';
import { GameStateService } from '../../../services/game-state.service';
import { LANGUAGES } from '../../../models/language.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LanguageSelectorComponent, TranslatePipe],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private translationService = inject(TranslationService);
  private gameStateService = inject(GameStateService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  languages = LANGUAGES;
  selectedLanguage = this.languageService.getCurrentLanguage();

  ngOnInit(): void {
    console.log(' [LandingPage] Initialisation, langue courante:', this.selectedLanguage);

    // Charger les traductions initiales
    this.loadTranslations(this.selectedLanguage);

    // Réinitialiser le jeu
    this.gameStateService.resetGame();
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  onLanguageSelect(lang: any): void {
    console.log(' [LandingPage] Clic sur langue:', lang);
    console.log('  → Avant changement - selectedLanguage:', this.selectedLanguage);

    // Mettre à jour la langue sélectionnée
    this.selectedLanguage = lang;

    // Sauvegarder dans le service
    this.languageService.setLanguage(lang);

    console.log('  → Après changement - selectedLanguage:', this.selectedLanguage);

    // Recharger les traductions
    this.loadTranslations(lang);
  }

  private loadTranslations(lang: any): void {
    console.log(' [LandingPage] Chargement des traductions pour:', lang);

    this.translationService.loadTranslations(lang).subscribe({
      next: () => {
        console.log(' [LandingPage] Traductions chargées avec succès');

        // Vérifier que les traductions sont bien dans le service
        const testTitle = this.translationService.getTranslation('app.title');
        console.log('  → Test app.title =', testTitle);

        // Forcer la mise à jour du template
        this.cdr.detectChanges();

        // Animation de feedback
        this.animateLanguageChange();
      },
      error: (err) => {
        console.error(' [LandingPage] Erreur chargement traductions:', err);
      }
    });
  }

  private animateLanguageChange(): void {
    // Petite animation pour montrer que la langue a changé
    gsap.to('.main-title', {
      duration: 0.3,
      scale: 1.05,
      color: '#667eea',
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  }

  startGame(): void {
    this.animateExit(() => {
      this.router.navigate(['/player']);
    });
  }

  private animateEntrance(): void {
    gsap.from('.landing-container', {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.landing-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
