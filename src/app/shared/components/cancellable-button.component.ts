import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-cancellable-button',
  standalone: true,
  imports: [],
  template: `
    <div class="relative">
      <button (click)="onClick()" class="w-full rounded-md relative overflow-hidden" [class]="isPlaned() ? 'btn-cancel' : 'btn-action'">
        @if (isPlaned()) {
          <div class="absolute inset-0 bg-primary" [@emptyEffect]="'emptying'"></div>
          <span class="relative">
            <span class="btn-label text-fill" [attr.data-text]="cancelText()" [style.width.px]="minWidth()">{{cancelText()}}</span>
          </span>
        } @else {
          <span class="relative">
            <span class="btn-label" [style.width.px]="minWidth()">\u00A0\u00A0\u00A0\u00A0{{actionText()}}\u00A0\u00A0\u00A0\u00A0</span>
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
    :host {
      @apply text-sm font-medium;
    }
    button {
      @apply border border-primary rounded-md py-2 px-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-[36px];
    }
    .btn-action {
      @apply text-primary hover:bg-primary hover:text-white hover:border-none;
    }
    .btn-label {
      @apply block;
    }
    .text-fill {
      @apply relative text-white;
    }
    .text-fill::before {
      content: attr(data-text);
      @apply absolute text-primary overflow-hidden;
      width: 0%;
      animation: fillText 3s linear forwards;
    }

    @keyframes fillText {
      from {width: 0%;}
      to {width: 100%;}
    }
    `]
})
export class CancellableButtonComponent implements OnInit {
  action = output<void>();
  t?: NodeJS.Timeout;
  isPlaned = signal(false);
  actionText = input('Action');
  cancelText= signal('');
  minWidth = signal(0);

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    // Create temporary elements to measure text width
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    this.el.nativeElement.appendChild(tempDiv);
    tempDiv.textContent = '\u00A0\u00A0\u00A0\u00A0'+this.actionText()+'\u00A0\u00A0\u00A0\u00A0';
    const actionWidth = tempDiv.offsetWidth;
    const cancel = $localize`:@@CANCEL:Cancel`;
    this.cancelText.set(`\u00A0\u00A0\u00A0\u00A0${cancel}\u00A0\u00A0\u00A0\u00A0`);
    tempDiv.textContent = this.cancelText();
    let cancelWidth = tempDiv.offsetWidth;
    while (cancelWidth < actionWidth) {
      this.cancelText.update(t => `\u00A0${t}\u00A0`);
      tempDiv.textContent = this.cancelText();
      cancelWidth = tempDiv.offsetWidth;
    }
    // Clean up
    this.el.nativeElement.removeChild(tempDiv);

    this.minWidth.set(Math.max(actionWidth, cancelWidth));
  }
  
  onClick() {
    if (this.t) {
      clearTimeout(this.t);
    }
    if (!this.isPlaned()) {
      this.isPlaned.set(true);
      this.t = setTimeout(() => {
        this.action.emit();
        this.isPlaned.set(false);
      }, 3000);
    }
  }
}