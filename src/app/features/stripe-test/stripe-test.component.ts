import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../core/services/stripe.service';

@Component({
  selector: 'app-stripe-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'stripe-test.component.html'
})
export class StripeTestComponent {
  public stripeService = inject(StripeService);
  protected loading = false;
  protected error: string | null = null;

  protected async subscribe(priceId: string) {
    this.loading = true;
    this.error = null;

    try {
      const sessionId = await this.stripeService.createCheckoutSession(priceId);
      await this.stripeService.redirectToCheckout(sessionId);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      this.error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      this.loading = false;
    }
  }
}