import { Component, CUSTOM_ELEMENTS_SCHEMA, input, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GitProvider, GitProviderService } from '../../../../core/services/git-provider.service';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import '../../../../web-components/icon';
@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './provider-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProviderCardComponent implements OnInit {
  provider = input.required<GitProvider>();

  private gitProviderService = inject(GitProviderService);
  private fb = inject(FormBuilder);

  protected showTokenInput = signal<boolean>(false);
  protected loading = signal<boolean>(false);
  protected error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    token: ['', []],
    username: ['', []],
    appPassword: ['', []]
  });

  ngOnInit() {
    if (this.provider().type === 'bitbucket') {
      this.form.controls.username.addValidators(Validators.required);
      this.form.controls.appPassword.addValidators(Validators.required);
    } else {
      this.form.controls.token.addValidators(Validators.required);
    }
  }

  protected isFormValid(): boolean {
    if (this.provider().type === 'bitbucket') {
      const username = this.form.controls.username.value;
      const appPassword = this.form.controls.appPassword.value;
      return !!username && !!appPassword;
    }
    return !!this.form.controls.token.value;
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) return;

    let token: string;
    if (this.provider().type === 'bitbucket') {
      const username = this.form.controls.username.value;
      const appPassword = this.form.controls.appPassword.value;
      token = `${username}:${appPassword}`;
    } else {
      token = this.form.controls.token.value;
    }

    this.loading.set(true);
    this.error.set(null);
    
    this.gitProviderService.validateAndStoreToken(this.provider(), token).subscribe({
      next: () => {
        this.form.reset();
        this.updateShowTokenInput(false);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to validate credentials.'+err.message);
        this.loading.set(false);
      }
    });
  }

  protected updateShowTokenInput(value: boolean): void {
    this.showTokenInput.set(value);
    if (!value) {
      this.form.reset();
      this.error.set(null);
    }
  }

  protected disconnectProvider(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.gitProviderService.disconnectProvider(this.provider().type);
    
    setTimeout(() => {
      this.loading.set(false);
      this.form.reset();
    }, 500);
  }
}