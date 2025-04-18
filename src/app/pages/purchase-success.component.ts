import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StripeService } from '../core/services/stripe.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-16 text-center">
      <div class="bg-light-surface dark:bg-dark-700 rounded-lg shadow-lg p-8 mb-8">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-3xl font-bold mb-4 text-light-text-primary dark:text-white" i18n="@@PURCHASE_SUCCESS_TITLE">Payment Successful!</h1>
        
        <p class="text-light-text-secondary dark:text-gray-300 mb-6" i18n="@@PURCHASE_SUCCESS_MESSAGE">Thank you for your purchase. Your payment has been processed successfully, and your credits have been added to your account.</p>
        
        <div class="mb-8 py-4 px-6 bg-light-background dark:bg-dark-800 rounded-lg inline-block">
          <h2 class="text-xl font-semibold mb-2 text-light-text-primary dark:text-white" i18n="@@TRANSACTION_SUMMARY">Transaction Summary</h2>
          
          <div class="flex justify-between text-light-text-secondary dark:text-gray-300 mb-2">
            <span i18n="@@TRANSACTION_STATUS">Status:</span>
            <span class="font-medium text-green-500">Completed</span>
          </div>
          
          <div class="flex justify-between text-light-text-secondary dark:text-gray-300">
            <span i18n="@@TRANSACTION_DATE">Date:</span>&nbsp;
            <span>{{ date() | date:'medium' }}</span>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a routerLink="/dashboard" class="button flat-primary" i18n="@@GO_TO_DASHBOARD">Go to Dashboard</a>
          <a routerLink="/pricing" class="button flat-secondary" i18n="@@VIEW_PLANS">View Plans</a>
        </div>
      </div>
    </div>
  `
})
export class PurchaseSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private stripeService = inject(StripeService);
  private toastService = inject(ToastService);
  protected date = signal(new Date());
  
  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    
    if (!sessionId) {
      this.router.navigate(['/pricing']);
      return;
    }
    
    // Vous pourriez ajouter une vérification supplémentaire du statut de la session ici
    // en appelant une fonction du service Stripe si nécessaire
    this.toastService.success($localize`:@@CREDITS_ADDED_SUCCESSFULLY:Credits have been added to your account successfully.`);
  }
} 