import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProviderLogoComponent } from '../../shared/components/provider-logo/provider-logo.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink, ProviderLogoComponent],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {}