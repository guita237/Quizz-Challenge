import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ProgressStepsComponent } from '../../layout/progress-steps/progress-steps.component';
import { CategoryCardComponent } from '../../shared/category-card/category-card.component';

import { CategoryService } from '../../../services/api/category.service';
import { GameStateService } from '../../../services/game-state.service';
import { LanguageService } from '../../../services/language.service';
import { CategoryDto, Category } from '../../../models/category.model';
import {TranslatePipe} from '../pipes/translate.pipe';

@Component({
  selector: 'app-category-selection-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProgressStepsComponent,
    CategoryCardComponent,
    TranslatePipe
  ],
  templateUrl: './category-selection-page.component.html',
  styleUrls: ['./category-selection-page.component.css']
})
export class CategorySelectionPageComponent implements OnInit, AfterViewInit {
  private categoryService = inject(CategoryService);
  private gameStateService = inject(GameStateService);
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Addition to force change detection

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategories: string[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  debug: string = '';

  ngOnInit(): void {
    console.log('CategorySelectionPage initialized');
    const state = this.gameStateService.getState();
    this.selectedCategories = state.selectedCategories || [];
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.animateEntrance();
  }

  loadCategories(): void {
    const lang = this.languageService.getCurrentLanguage();
    console.log(`Loading categories for language: ${lang}`);
    this.isLoading = true;

    this.categoryService.getCategoriesByLanguage(lang).subscribe({
      next: (categoriesDto) => {
        console.log('Categories received:', categoriesDto);
        console.log('Number of categories:', categoriesDto.length);

        //  IMPORTANT: Map DTOs to Categories
        const newCategories = categoriesDto.map(dto => ({
          ...dto,
          selected: this.selectedCategories.includes(dto.name)
        }));

        console.log('Mapped categories:', newCategories);

        // Update the tables
        this.categories = [...newCategories];
        this.filteredCategories = [...this.categories];

        console.log('this.categories length:', this.categories.length);
        console.log('this.filteredCategories length:', this.filteredCategories.length);

        this.debug = `Chargées: ${this.categories.length} catégories`;
        this.isLoading = false;

        //  Force Change Detection
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.errorMessage = 'categories.loadError';
        this.debug = `Erreur: ${error.message}`;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterCategories(): void {
    console.log('Filtering categories with query:', this.searchQuery);

    if (!this.searchQuery.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredCategories = this.categories.filter(cat =>
        cat.name.toLowerCase().includes(query) ||
        (cat.description?.toLowerCase().includes(query) || false)
      );
    }

    console.log('Filtered categories count:', this.filteredCategories.length);
    this.cdr.detectChanges(); // Force update
  }

  toggleCategory(category: Category): void {
    console.log('Toggling category:', category.name);

    // Invert selection
    category.selected = !category.selected;

    if (category.selected) {
      this.selectedCategories.push(category.name);
    } else {
      const index = this.selectedCategories.indexOf(category.name);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }

    console.log('Selected categories:', this.selectedCategories);
    this.gameStateService.setSelectedCategories(this.selectedCategories);

    // Force filteredCategories to update to reflect the change
    this.filteredCategories = [...this.categories];
    this.cdr.detectChanges();
  }

  selectAll(): void {
    console.log('Selecting all categories');
    this.categories.forEach(cat => cat.selected = true);
    this.selectedCategories = this.categories.map(cat => cat.name);
    this.filteredCategories = [...this.categories];
    this.gameStateService.setSelectedCategories(this.selectedCategories);
    this.cdr.detectChanges();
  }

  deselectAll(): void {
    console.log('Deselecting all categories');
    this.categories.forEach(cat => cat.selected = false);
    this.selectedCategories = [];
    this.filteredCategories = [...this.categories];
    this.gameStateService.setSelectedCategories(this.selectedCategories);
    this.cdr.detectChanges();
  }

  getSelectedCount(): number {
    return this.selectedCategories.length;
  }

  goBack(): void {
    this.animateExit(() => {
      this.router.navigate(['/player']);
    });
  }

  continue(): void {
    if (this.selectedCategories.length === 0) {
      this.showError('categories.minError');
      return;
    }

    this.animateExit(() => {
      this.router.navigate(['/config']);
    });
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.cdr.detectChanges();

    gsap.to('.error-message', {
      y: 0,
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        setTimeout(() => {
          gsap.to('.error-message', {
            y: -10,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              this.errorMessage = '';
              this.cdr.detectChanges();
            }
          });
        }, 2000);
      }
    });
  }

  private animateEntrance(): void {
    gsap.from('.category-selection-container', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      ease: 'power3.out'
    });
  }

  private animateExit(onComplete: () => void): void {
    gsap.to('.category-selection-container', {
      duration: 0.6,
      opacity: 0,
      scale: 0.95,
      ease: 'power3.in',
      onComplete
    });
  }
}
