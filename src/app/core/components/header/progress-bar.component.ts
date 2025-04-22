import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="relative w-full h-1 bg-gray-200 overflow-hidden">
      <div class="absolute top-0 left-0 h-1 w-full bg-primary"></div>
    </div>
  `,
  styles: [`
    @keyframes progress {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    :host div div {
      opacity: 0;
    }
    :host.active div div {
      animation: progress 4s linear infinite;
      opacity: 1;
    }
  `]
})
export class ProgressBarComponent {
  active = input<boolean>(false);
  @HostBinding('class.active') 
  get isActive() {
    return this.active();
  }
}
