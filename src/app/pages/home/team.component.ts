import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [],
  template: `
    <section class="py-12 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2" i18n="@@TEAM_TITLE">Our Team</h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" i18n="@@TEAM_SUBTITLE">
            Meet the passionate people behind XLIFF Translator who work every day to simplify your translations.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (member of teamMembers; track member.name) {
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div class="relative h-64 overflow-hidden">
                <img 
                  [src]="member.imageUrl" 
                  [alt]="member.name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">{{ member.name }}</h3>
                <p class="text-primary dark:text-blue-400 mb-4">{{ member.role }}</p>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ member.bio }}</p>
                
                @if (member.socialLinks) {
                  <div class="flex space-x-4">
                    @if (member.socialLinks.linkedin) {
                      <a [href]="member.socialLinks.linkedin" target="_blank" class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    }
                    @if (member.socialLinks.twitter) {
                      <a [href]="member.socialLinks.twitter" target="_blank" class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    }
                    @if (member.socialLinks.github) {
                      <a [href]="member.socialLinks.github" target="_blank" class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-blue-400">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                        </svg>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hover\\:transform {
      transition: transform 0.3s ease-in-out;
    }
  `]
})
export class TeamComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'François Durand',
      role: $localize`Founder & Lead Developer`,
      bio: 'Passionate about AI and web technologies. François created XLIFF Translator to solve the translation challenges he encountered in his international projects.',
      imageUrl: 'assets/team/francois.jpg', // Replace with the actual image path
      socialLinks: {
        linkedin: 'https://linkedin.com/in/francoisdurand',
        github: 'https://github.com/francoisdurand'
      }
    },
    {
      name: 'Sophie Martin',
      role: 'AI & Natural Language Processing Expert',
      bio: 'With expertise in NLP and computational linguistics, Sophie ensures that our translations respect technical context while remaining natural.',
      imageUrl: 'assets/team/sophie.jpg', // Replace with the actual image path
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sophiemartin',
        twitter: 'https://twitter.com/sophiemartin'
      }
    },
    {
      name: 'Alexandre Chen',
      role: 'DevOps Engineer',
      bio: 'Alexandre optimizes our cloud infrastructure to ensure performance and reliability at every step of the translation process.',
      imageUrl: 'assets/team/alexandre.jpg', // Replace with the actual image path
      socialLinks: {
        github: 'https://github.com/alexandrechen',
        linkedin: 'https://linkedin.com/in/alexandrechen'
      }
    }
  ];
}
