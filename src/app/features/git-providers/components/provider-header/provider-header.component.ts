import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitProvider } from '../../../../core/services/git-provider.service';

@Component({
  selector: 'app-provider-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-header.component.html'
})
export class ProviderHeaderComponent {
  provider = input.required<GitProvider>();
}