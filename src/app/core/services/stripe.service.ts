import { Injectable, inject } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  quota: number;
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  private stripePromise: Promise<Stripe | null>;
  private toastService = inject(ToastService);

  readonly plans: SubscriptionPlan[] = environment.stripe.plans;

  constructor() {
    this.stripePromise = loadStripe(environment.stripe.publicKey);
  }

  async createCheckoutSession(priceId: string): Promise<string> {
    try {
      const { data, error } = await this.supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) {
        this.toastService.error($localize`:@@FAILED_TO_CREATE_CHECKOUT_SESSION:Failed to create checkout session. Please try again later.`);
        throw error;
      }
      if (!data?.sessionId) {
        this.toastService.error($localize`:@@NO_SESSION_ID_RETURNED:No session ID returned. Please try again later.`);
        throw new Error('No session ID returned');
      }
      return data.sessionId;
    } catch (error) {
      this.toastService.error($localize`:@@FAILED_TO_CREATE_CHECKOUT_SESSION:Failed to create checkout session. Please try again later.`);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await this.stripePromise;
      if (!stripe) {
        this.toastService.error($localize`:@@STRIPE_NOT_LOADED:Stripe not loaded. Please try again later.`);
        throw new Error('Stripe not loaded');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        this.toastService.error($localize`:@@FAILED_TO_REDIRECT_TO_CHECKOUT:Failed to redirect to checkout. Please try again later.`);
        throw error;
      }
    } catch (error) {
      this.toastService.error($localize`:@@FAILED_TO_REDIRECT_TO_CHECKOUT:Failed to redirect to checkout. Please try again later.`);
      throw error;
    }
  }

  async createPortalSession(): Promise<string> {
    try {
      const { data, error } = await this.supabase.functions.invoke('create-portal-session', {});
      
      if (error) {
        this.toastService.error($localize`:@@FAILED_TO_CREATE_PORTAL_SESSION:Failed to create portal session. Please try again later.`);
        throw error;
      }
      if (!data?.url) {
        this.toastService.error($localize`:@@NO_PORTAL_URL_RETURNED:No portal URL returned. Please try again later.`);
        throw new Error('No portal URL returned');
      }
      return data.url;
    } catch (error) {
      this.toastService.error($localize`:@@FAILED_TO_CREATE_PORTAL_SESSION:Failed to create portal session. Please try again later.`);
      throw error;
    }
  }

  async checkQuota(): Promise<{ remaining: number; total: number }> {
    try {
      const { data, error } = await this.supabase.rpc('check_usage_quota');
      if (error) {
        this.toastService.error($localize`:@@FAILED_TO_CHECK_QUOTA:Failed to check quota. Please try again later.`);
        throw error;
      }
      return data;
    } catch (error) {
      this.toastService.error($localize`:@@FAILED_TO_CHECK_QUOTA:Failed to check quota. Please try again later.`);
      throw error;
    }
  }

  async incrementUsage(units: number): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc('increment_usage', { units });
      if (error) {
        this.toastService.error($localize`:@@FAILED_TO_INCREMENT_USAGE:Failed to increment usage. Please try again later.`);
        throw error;
      }
      return data;
    } catch (error) {
      this.toastService.error($localize`:@@FAILED_TO_INCREMENT_USAGE:Failed to increment usage. Please try again later.`);
      throw error;
    }
  }
}