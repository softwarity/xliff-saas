import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-price-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './price-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceGridComponent {
  private auth = inject(AuthService);
  isAuthenticated = toSignal(this.auth.isAuthenticated$, { initialValue: false });
} 