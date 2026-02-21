import { Language } from './language.model';

// DTO received from the backend, it may not have all the properties needed for the frontend, so we can create a separate interface for the frontend use
export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  language: Language;
}

// for frontend use, we can add a 'selected' property to track if the category is selected by the user
export interface Category extends CategoryDto {
  selected?: boolean;
}
