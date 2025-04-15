import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, input, OnInit, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-cancel-confirm',
  standalone: true,
  imports: [],
  template: `
    <div class="relative text-sm font-medium">
      <button type="button" (click)="onClick()" 
              class="w-full rounded-md relative overflow-hidden border border-warning rounded-md py-2 px-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[36px]" 
              [class]="isConfirming() ? 'btn-confirm' : 'btn-cancel'"
              [disabled]="disabled()">
        @if (isConfirming()) {
          <div class="absolute inset-0 bg-warning" [@emptyEffect]="'emptying'"></div>
          <span class="relative">
            <span class="mx-0 block text-fill" [attr.data-text]="confirmText()" [style.width.px]="minWidth()">{{confirmText()}}</span>
          </span>
        } @else {
          <span class="relative">
            <span class="mx-0 block" [style.width.px]="minWidth()">\u00A0\u00A0\u00A0\u00A0<span i18n="@@CANCEL">Cancel</span>\u00A0\u00A0\u00A0\u00A0</span>
          </span>
        }
      </button>
    </div>
  `,
  animations: [
    trigger('emptyEffect', [
      transition('void => emptying', [
        style({ transform: 'translateX(0)' }),
        animate('3s linear', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ],
  styles: [`
    .btn-cancel {
      @apply text-warning hover:bg-warning hover:text-white hover:border-none;
    }
    .text-fill {
      @apply relative text-white;
    }
    .text-fill::before {
      content: attr(data-text);
      @apply absolute text-warning overflow-hidden;
      width: 0%;
      animation: fillText 3s linear forwards;
    }

    @keyframes fillText {
      from {width: 0%;}
      to {width: 100%;}
    }
    `]
})
export class CancelConfirmComponent implements OnInit {
  confirmCallback = input<() => Observable<void>>(() => of(void 0));
  t?: NodeJS.Timeout;
  isConfirming = signal(false);
  minWidth = signal(0);
  confirmText = signal('');
  disabled = signal(false);

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    // Create temporary elements to measure text width
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    this.el.nativeElement.appendChild(tempDiv);
    tempDiv.textContent = '\u00A0\u00A0\u00A0\u00A0'+$localize`:@@CANCEL:Cancel`+'\u00A0\u00A0\u00A0\u00A0';
    const cancelWidth = tempDiv.offsetWidth;
    const confirm = $localize`:@@CONFIRM:Confirm`;
    this.confirmText.set(`\u00A0\u00A0\u00A0\u00A0${confirm}\u00A0\u00A0\u00A0\u00A0`);
    tempDiv.textContent = this.confirmText();
    let confirmWidth = tempDiv.offsetWidth;
    while (confirmWidth < cancelWidth) {
      this.confirmText.update(t => `\u00A0${t}\u00A0`);
      tempDiv.textContent = this.confirmText();
      confirmWidth = tempDiv.offsetWidth;
    }
    // Clean up
    this.el.nativeElement.removeChild(tempDiv);

    this.minWidth.set(Math.max(cancelWidth, confirmWidth));
  }
  
  onClick() {
    if (this.t) {
      clearTimeout(this.t);
    }
    if (!this.isConfirming()) {
      this.isConfirming.set(true);
      this.t = setTimeout(() => {
        this.isConfirming.set(false);
      }, 3000);
    } else {
      console.log('onClick');
      this.disabled.set(true);
      this.confirmCallback()().subscribe({
        next: () => {
          console.log('next');
          this.disabled.set(false);
        },
        error: () => {
          console.log('error');
          this.disabled.set(false);
        }
      });
    }
  }
} 