import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StripeService } from '../../core/services/stripe.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-price-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './price-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGridComponent {
  private auth = inject(AuthService);
  private stripeService = inject(StripeService);
  private toastService = inject(ToastService);
  
  isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  loading = signal(false);
  
  // Seulement les IDs des produits Stripe, les prix et crédits sont gérés côté serveur
  readonly silverPriceId = environment.stripe.silverPriceId;
  readonly goldPriceId = environment.stripe.goldPriceId;
  readonly diamondPriceId = environment.stripe.diamondPriceId;
  
  async buyCredits(priceId: string): Promise<void> {
    if (!this.isAuthenticated()) {
      this.toastService.secondary($localize`:@@PLEASE_LOGIN_TO_PURCHASE:Please login to purchase credits.`);
      return;
    }
    
    if (!priceId) {
      this.toastService.error($localize`:@@INVALID_PRICE_OPTION:Invalid price option.`);
      return;
    }
    
    this.loading.set(true);
    
    try {
      const sessionId = await this.stripeService.createCheckoutSession(priceId);
      await this.stripeService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      this.loading.set(false);
    }
  }
} 