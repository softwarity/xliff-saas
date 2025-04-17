import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase-credits-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a 
      routerLink="/pricing"
      class="button {{buttonClass}}"
      i18n="@@PURCHASE_CREDITS_BUTTON">
      Purchase credits
    </a>
  `
})
export class PurchaseCreditsButtonComponent {
  @Input() buttonClass: string = 'flat-secondary';
} 