import { Component } from '@angular/core';
import { ProviderListComponent } from './components/provider-list/provider-list.component';

@Component({
  selector: 'app-git-providers',
  standalone: true,
  imports: [ProviderListComponent],
  templateUrl: './git-providers.component.html'
})
export class GitProvidersComponent {}