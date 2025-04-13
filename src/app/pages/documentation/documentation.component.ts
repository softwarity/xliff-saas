import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  // templateUrl: './documentation.component.html',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-700">
        <h1 class="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400" i18n="@@DOCUMENTATION_TITLE">Documentation</h1>
        <nav class="border-b border-gray-200 dark:border-gray-700 mb-8">
          <div class="flex space-x-8">
            <a routerLink="usage" 
              routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-400" 
              class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-10 border-b-2 border-transparent"
              i18n="@@USAGE_TAB">
              Usage
            </a>
            <a routerLink="custom" 
              routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-400" 
              class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-10 border-b-2 border-transparent"
              i18n="@@CUSTOM_TAB">
              Custom
            </a>
            <a routerLink="setup" 
              routerLinkActive="text-blue-600 dark:text-blue-400 border-b-2 border-blue-400" 
              class="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 py-4 px-10 border-b-2 border-transparent"
              i18n="@@SETUP_TAB">
              Setup
            </a>
          </div>
        </nav>

        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class DocumentationComponent {
  activeTab: string = 'usage';
}