import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent {
  @Input() category!: Category;
  @Input() isSelected: boolean = false;
  @Output() toggle = new EventEmitter<Category>();

  private iconMap: Record<string, string> = {
    // Français
    'Sport': '⚽',
    'Sports': '⚽',
    'Histoire': '🏛️',
    'Géographie': '🌍',
    'Science': '🔬',
    'Musique': '🎵',
    'Film': '🎬',
    'Littérature': '📚',
    'Technologie': '💻',
    'Nourriture': '🍕',
    'Art': '🎨',
    'Médecine': '🏥',
    'Politique': '🏛️',
    'Voyage': '✈️',
    'Animaux': '🐾',
    'Divertissement': '🎭',
    'Numérique': '💿',
    'Physique': '⚛️',
    'Astronomie': '🌠',
    'Mathématiques': '📐',
    'Mécanique': '🔧',
    'Informatique': '💻',

    // Anglais
    'History': '🏛️',
    'Geography': '🌍',

    'Music': '🎵',
    'Movie': '🎬',

    'Literature': '📚',
    'Technology': '💻',
    'Food': '🍕',

    'Medicine': '🏥',
    'Politics': '🏛️',
    'Travel': '✈️',
    'Animals': '🐾',
    'Entertainment': '🎭',
    'Digital': '💿',
    'Physics': '⚛️',
    'Astronomy': '🌠',
    'Mathematics': '📐',
    'Engineering': '🔧',
    'Computer': '💻',

    // Allemand

    'Geschichte': '🏛️',
    'Erdkunde': '🌍',
    'Geographie': '🌍',
    'Wissenschaft': '🔬',
    'Musik': '🎵',

    'Literatur': '📚',
    'Technik': '💻',
    'Essen': '🍕',
    'Kunst': '🎨',
    'Medizin': '🏥',
    'Politik': '🏛️',
    'Reisen': '✈️',
    'Tiere': '🐾',
    'Unterhaltung': '🎭',
    'Physik': '⚛️',
    'Mathematik': '📐',
    'Maschinenbau': '🔧',
    'Informatik': '💻',

    // Catégories spécifiques des CSV
    'Wintersport': '⛷️',
    'Winter Sports': '⛷️',
    'Sports d\'hiver': '⛷️',
    'Fussball': '⚽',
    'Football': '⚽',
    'Pop': '🎤',
    'Rock': '🎸',
    'Klassik': '🎼',
    'Classical': '🎼',
    'Schlager': '🎵',
    'TV': '📺',
    'Télévision': '📺',
    'Fernsehen': '📺',
    'Stars': '⭐',
    'High Society': '👑',
    'Haute Société': '👑',
    'Gesellschaft': '👥',
    'Society': '👥',
    'Religion': '⛪',
    'Mythologie': '🏛️',
    'Myths': '🏛️',
    'Mythes': '🏛️',
    'Proverbes': '💬',
    'Proverbs': '💬',
    'Sprichwörter': '💬',
    'Expressions': '💬',
    'Sayings': '💬',
    'Wirtschaft': '📊',
    'Economics': '📊',
    'Économie': '📊',
    'Mode': '👗',
    'Fashion': '👗',
    'Liebe': '❤️',
    'Love': '❤️',
    'Amour': '❤️',
    'Sex': '💋',
    'Sexe': '💋'
  };

  getCategoryIcon(): string {
    if (!this.category || !this.category.name) {
      return '📋';
    }

    const categoryName = this.category.name;

    // search for exact match
    for (const [key, icon] of Object.entries(this.iconMap)) {
      if (categoryName.toLowerCase() === key.toLowerCase()) {
        return icon;
      }
    }

    // search for partial match
    for (const [key, icon] of Object.entries(this.iconMap)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }

    return '📋';
  }

  onToggle(): void {
    this.toggle.emit(this.category);
  }
}
