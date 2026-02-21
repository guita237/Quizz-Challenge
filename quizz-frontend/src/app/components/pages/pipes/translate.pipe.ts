import { Pipe, PipeTransform, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {TranslationService} from '../../../services/translation.service';


@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // IMPORTANT: pure:false permet les mises à jour dynamiques
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private subscription: Subscription;

  private lastKey = '';
  private lastParams: any = null;
  private lastValue = '';

  constructor() {
    // S'abonner aux changements de traductions
    this.subscription = this.translationService.translations$.subscribe(() => {
      console.log('Traductions mises à jour, mise à jour du template');
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: any): string {
    // Vérifier si la clé a changé
    if (this.lastKey === key && JSON.stringify(this.lastParams) === JSON.stringify(params)) {
      return this.lastValue;
    }

    this.lastKey = key;
    this.lastParams = params;
    this.lastValue = this.translationService.getTranslation(key, params);

    return this.lastValue;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
