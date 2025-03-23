import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitProvider } from '../../../../core/services/git-provider.service';

@Component({
  selector: 'app-provider-scopes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-scopes.component.html'
})
export class ProviderScopesComponent {
  provider = input.required<GitProvider>();
}