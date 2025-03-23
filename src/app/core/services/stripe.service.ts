import { Injectable, inject } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { loadStripe, Stripe } from '@stripe/stripe-js';

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

  readonly plans: SubscriptionPlan[] = environment.stripe.plans;

  constructor() {
    this.stripePromise = loadStripe(environment.stripe.publicKey);
  }

  async createCheckoutSession(priceId: string): Promise<string> {
    const { data, error } = await this.supabase.functions.invoke('create-checkout-session', {
      body: { priceId }
    });

    if (error) throw error;
    if (!data?.sessionId) throw new Error('No session ID returned');
    return data.sessionId;
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe not loaded');
    
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  }

  async createPortalSession(): Promise<string> {
    const { data, error } = await this.supabase.functions.invoke('create-portal-session', {});
    
    if (error) throw error;
    if (!data?.url) throw new Error('No portal URL returned');
    return data.url;
  }

  async checkQuota(): Promise<{ remaining: number; total: number }> {
    const { data, error } = await this.supabase.rpc('check_usage_quota');
    if (error) throw error;
    return data;
  }

  async incrementUsage(units: number): Promise<boolean> {
    const { data, error } = await this.supabase.rpc('increment_usage', { units });
    if (error) throw error;
    return data;
  }
}