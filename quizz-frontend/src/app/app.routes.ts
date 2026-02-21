import { Routes } from '@angular/router';
import { PlayerSetupPageComponent } from './components/pages/player-setup-page/player-setup-page.component';
import { CategorySelectionPageComponent } from './components/pages/category-selection-page/category-selection-page.component';

import { ResultsPageComponent } from './components/pages/results-page/results-page.component';
import {QuizPageComponent} from './components/pages/quizz-page/quiz-page.component';
import {GameConfigPageComponent} from './components/pages/game-config-page/game-config-page.component';
import { LandingPageComponent } from "./components/pages/landing-page/landing-page.component";

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'player', component: PlayerSetupPageComponent },
  { path: 'categories', component: CategorySelectionPageComponent },
  { path: 'config', component: GameConfigPageComponent },
  { path: 'quiz', component: QuizPageComponent },
  { path: 'results', component: ResultsPageComponent },
  { path: '**', redirectTo: '' }
];
