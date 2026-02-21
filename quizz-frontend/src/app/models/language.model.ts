export enum Language {
  FR = 'FR',
  EN = 'EN',
  DE = 'DE'
}

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: Language.FR, name: 'Français', flag: 'fr.svg', nativeName: 'Français' },
  { code: Language.EN, name: 'English', flag: 'en.svg', nativeName: 'English' },
  { code: Language.DE, name: 'Deutsch', flag: 'de.svg', nativeName: 'Deutsch' }
];
