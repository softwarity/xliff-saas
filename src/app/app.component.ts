import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor() {
    console.log('AppComponent constructed');
  }

  ngOnInit() {
    console.log('AppComponent initialized');
  }

  ngAfterViewInit() {
    console.log('AppComponent view initialized');
  }
}