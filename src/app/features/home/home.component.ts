import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import '../../web-components/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent {
  private auth = inject(AuthService);
  protected isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
  constructor() {}
}