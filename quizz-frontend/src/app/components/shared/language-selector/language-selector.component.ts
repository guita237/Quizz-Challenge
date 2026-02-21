import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Language, LanguageOption } from '../../../models/language.model';
import { GameStateService } from '../../../services/game-state.service';
import { Router } from '@angular/router';
import {TranslatePipe} from '../../pages/pipes/translate.pipe';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  @Input() selectedLanguage: Language = Language.FR;
  @Input() languages: LanguageOption[] = [];
  @Output() languageSelected = new EventEmitter<Language>();

  private gameStateService = inject(GameStateService);
  private router = inject(Router);

  onLanguageSelect(lang: Language): void {
    //  Save the current game state before changing the language
    const currentState = this.gameStateService.getState();

    //  Update the game state with the new language while preserving other properties
    this.gameStateService.updateState({
      selectedLanguage: lang,

    });

    this.languageSelected.emit(lang);

    // Redirect to the current page to trigger a reload of categories and configurations
    const currentUrl = this.router.url;
    if (currentUrl.includes('/categories') || currentUrl.includes('/config')) {
      // reload the page to ensure categories and configurations are reloaded with the new language
      window.location.reload();
    }
  }
}
