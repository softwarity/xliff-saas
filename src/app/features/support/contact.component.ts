import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupportService } from './support.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [SupportService],
  template: `
    <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white" i18n="@@CONTACT_US_TITLE">Contact Us</h1>
          
          <div class="mt-4 mb-6">
            <p class="text-lg text-gray-600 dark:text-gray-400" i18n="@@CONTACT_US_DESCRIPTION">
              Have a question? Send us a message and we'll get back to you as soon as possible.
            </p>
            <p class="mt-2 text-gray-600 dark:text-gray-400" i18n="@@CONTACT_US_SUPPORT_LINK">
              If you have an account, you can also <a [routerLink]="['/support']" class="text-primary hover:underline">access our support ticket system</a> for faster assistance.
            </p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-dark-800 rounded-lg shadow-md p-6 mb-8">
          <form [formGroup]="contactForm" (ngSubmit)="submitForm()">
            <div class="mb-6">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" i18n="@@EMAIL_LABEL">Email</label>
              <input type="email" id="email" formControlName="email" class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-dark-900 text-gray-900 dark:text-white" i18n-placeholder="@@EMAIL_PLACEHOLDER" placeholder="your.email@example.com">
              @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  @if (contactForm.get('email')?.errors?.['required']) {
                    <span i18n="@@EMAIL_REQUIRED">Email is required</span>
                  } @else if (contactForm.get('email')?.errors?.['email']) {
                    <span i18n="@@EMAIL_INVALID">Please enter a valid email address</span>
                  }
                </div>
              }
            </div>
            
            <div class="mb-6">
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" i18n="@@SUBJECT_LABEL">Subject</label>
              <input type="text" id="subject" formControlName="subject" class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-dark-900 text-gray-900 dark:text-white" i18n-placeholder="@@SUBJECT_PLACEHOLDER" placeholder="How can we help you?">
              @if (contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  <span i18n="@@SUBJECT_REQUIRED">Subject is required</span>
                </div>
              }
            </div>
            
            <div class="mb-6">
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" i18n="@@MESSAGE_LABEL">Message</label>
              <textarea id="message" rows="6" formControlName="message" class="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-dark-900 text-gray-900 dark:text-white" i18n-placeholder="@@MESSAGE_PLACEHOLDER" placeholder="Please describe your question or issue in detail..."></textarea>
              @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                <div class="mt-1 text-sm text-red-600 dark:text-red-400">
                  <span i18n="@@MESSAGE_REQUIRED">Message is required</span>
                </div>
              }
            </div>
            
            <div class="flex justify-end">
              <button type="submit" class="button flat-primary" [disabled]="contactForm.invalid || isSubmitting()">
                @if (!isSubmitting()) {
                  <span i18n="@@SEND_MESSAGE">Send Message</span>
                } @else {
                  <span class="flex items-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span i18n="@@SENDING">Sending...</span>
                  </span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supportService = inject(SupportService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  
  protected readonly contactForm: FormGroup;
  protected readonly isSubmitting = signal(false);
  
  constructor() {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  
  protected submitForm(): void {
    if (this.contactForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting.set(true);
    
    const { email, subject, message } = this.contactForm.value;
    
    this.supportService.sendContactForm(email, subject, message)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          this.isSubmitting.set(false);
          
          if (success) {
            this.toastService.success($localize`:@@CONTACT_FORM_SUCCESS:Your message has been sent successfully!`);
            this.contactForm.reset();
          } else {
            this.toastService.error($localize`:@@CONTACT_FORM_ERROR:Failed to send your message. Please try again later.`);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          this.toastService.error($localize`:@@CONTACT_FORM_ERROR:Failed to send your message. Please try again later.`);
        }
      });
  }
} 