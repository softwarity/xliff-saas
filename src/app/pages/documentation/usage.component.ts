import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Usage Tab Content -->
    <div class="space-y-8">
      <!-- Setup Reminder -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold text-yellow-800 dark:text-yellow-300" i18n="@@SETUP_REMINDER_TITLE">Initial Setup Required</h3>
            <p class="text-yellow-700 dark:text-yellow-300 mt-2" i18n="@@SETUP_REMINDER_DESCRIPTION">
              Before using XLIFF Translator, you need to configure your Angular application for internationalization.
            </p>
          </div>
          <a routerLink="../setup" class="stroke-primary pointer-events-auto whitespace-nowrap" i18n="@@GO_TO_SETUP">Go to Setup</a>
      </div>
    </div>
    
    <!-- Getting Started with XLIFF Translator -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@GETTING_STARTED_TITLE">Getting Started with XLIFF Translator</h2>
      
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@REPOSITORY_SELECTION_TITLE">Selecting Repositories</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@REPOSITORY_SELECTION_DESCRIPTION">After connecting to a Git provider:</p>
          
          <!-- Example repository selection widget -->
          <div class="flex justify-center mb-6">
            <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg" style="max-width: 400px;">
              <div class="p-6 bg-gray-900 text-white">
                <div class="mb-5 flex items-start">
                  <svg viewBox="0 0 16 16" version="1.1" width="30" height="30" aria-hidden="true" class="mr-2">
                    <path fill="white" d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                  </svg>
                  <span class="text-2xl font-semibold">GitHub</span>
                  <span class="ml-auto text-red-500" i18n="@@NOT_CONNECTED_STATUS">Not Connected</span>
                </div>
                <p class="mb-4" i18n="@@GITHUB_TOKEN_INSTRUCTION">To connect, generate a Personal Access Token with the following scopes:</p>
                <ul class="list-disc list-inside mb-4 ml-2">
                  <li>repo</li>
                  <li>read:org</li>
                </ul>
                <p class="mb-4"><span i18n="@@GET_YOUR_TOKEN_HERE">Get your token here</span>: Settings > Developer settings > Personal access tokens > Tokens (classic) > Generate new token</p>
                <div class="mb-2" i18n="@@TOKEN_LABEL">Token</div>
                <div class="mb-4">
                  <div class="bg-gray-800 border border-gray-700 rounded p-2 mb-4" i18n="@@TOKEN_PLACEHOLDER">Enter your access token</div>
                </div>
                <button class="w-full flat-primary pointer-events-none" i18n="@@CONNECT_BUTTON">Connect</button>
              </div>
              <div class="p-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50" i18n="@@GITHUB_WIDGET_CAPTION">GitHub provider configuration form</div>
            </div>
          </div>
          
          <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-4">
            <li><strong i18n="@@CONNECT_STEP_1_TITLE">Select a provider</strong>: <span i18n="@@CONNECT_STEP_1_DESCRIPTION">Choose from GitHub, GitLab, or Bitbucket</span></li>
            <li><strong i18n="@@CONNECT_STEP_2_TITLE">Configure access</strong>: <span i18n="@@CONNECT_STEP_2_DESCRIPTION">Create and provide the appropriate tokens</span></li>
            <li><strong i18n="@@CONNECT_STEP_3_TITLE">Save your configuration</strong>: <span i18n="@@CONNECT_STEP_3_DESCRIPTION">Enter your token and save the connection</span></li>
          </ol>
          
          <div class="mt-4 space-y-4">
            <div class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
              <div class="mr-4 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Github</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@GITHUB_DESC">Create a Personal Access Token with <b>repo</b>, and <b>repo:org</b> scopes.</p>
              </div>
            </div>

            <div class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
              <div class="mr-4 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">GitLab</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@GITLAB_DESC">Create a Personal Access Token with <b>api</b>, <b>read_repository</b>, and <b>write_repository</b> scopes.</p>
              </div>
            </div>
            
            <div class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
              <div class="mr-4 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">Bitbucket</h4>
                <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@BITBUCKET_DESC">Create an App Password with <b>repository:read</b> and <b>repository:write</b> permissions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Repository Management -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@REPOSITORY_MANAGEMENT_TITLE">Repository Management</h2>
      
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@REPOSITORY_SELECTION_TITLE">Selecting Repositories</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@REPOSITORY_SELECTION_DESCRIPTION">After connecting to a Git provider:</p>
        
        <!-- Example repository selection widget -->
        <div class="flex justify-center mb-6">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg" style="width: 450px;">
            <div class="p-6 bg-gray-900 text-white">
              <div class="mb-5 flex items-start">
                <svg class="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="white" stroke-width="1.5"/>
                  <path d="M7 10C7 8.34315 8.34315 7 10 7H14C15.6569 7 17 8.34315 17 10V14C17 15.6569 15.6569 17 14 17H10C8.34315 17 7 15.6569 7 14V10Z" fill="white"/>
                </svg>
                <div>
                  <div class="text-sm text-gray-400">Organization</div>
                  <div class="font-semibold">Repository</div>
                </div>
              </div>
              <div class="text-sm text-gray-400">Updated Apr 8, 2025</div>
              <div class="mt-5 py-3 border-t border-gray-700">
                <div class="flex justify-between items-center mb-3">
                  <div class="text-green-400" i18n="@@UNITS_DETECTED">90 translation units detected</div>
                  <button class="flat-primary pointer-events-none" i18n="@@ESTIMATE_BUTTON">Estimate</button>
                </div>
              </div>
              <div class="py-3 border-t border-gray-700">
                <div class="flex justify-between items-center">
                  <div class="text-red-400" i18n="@@NO_TRANSLATION">No translation available...</div>
                  <button class="flat-primary pointer-events-none" i18n="@@TRANSLATE_BUTTON">Translate</button>
                </div>
              </div>
            </div>
            <div class="p-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50" i18n="@@TRANSLATION_WIDGET_CAPTION">Repository selection with translation options</div>
          </div>
        </div>
        
        <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2 mb-6">
          <li i18n="@@REPOSITORY_STEP_1">Navigate to the provider's page where your repositories are listed</li>
          <li i18n="@@REPOSITORY_STEP_2">Browse and select the repository containing your Angular project with XLIFF files</li>
          <li i18n="@@REPOSITORY_STEP_3">Specify the branch to work with (default is usually the main branch)</li>
        </ol>
        
        <!-- Translation options modal visualization -->
        <div class="mt-6 mb-6 flex justify-center">
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg" style="width: 450px;">
            <div class="p-6 bg-gray-900 text-white">
              <div class="mb-5">
                <h3 class="font-semibold text-xl" i18n="@@TRANSLATION_OPTIONS_TITLE">Translation Options</h3>
              </div>
              <div class="mb-5">
                <div class="text-sm text-gray-400 mb-1" i18n="@@SELECT_BRANCH_LABEL">Select Branch</div>
                <div class="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between cursor-default">
                  <span i18n="@@MAIN_BRANCH">main</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="mb-5">
                <div class="text-sm text-gray-400 mb-1" i18n="@@XLIFF_EXTENSION_LABEL">Xliff Extension</div>
                <div class="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between cursor-default">
                  <span i18n="@@XLF_EXTENSION">xlf</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="mb-5">
                <div class="text-sm text-gray-400 mb-1" i18n="@@TRANSUNIT_STATE_LABEL">TransUnit State</div>
                <div class="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between cursor-default">
                  <span i18n="@@NEW_STATE">new</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="mb-5">
                <div class="text-sm text-gray-400 mb-1" i18n="@@PROCEEDED_STATE_LABEL">Proceeded TransUnit State</div>
                <div class="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between cursor-default">
                  <span i18n="@@TRANSLATED_STATE">translated</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div class="flex justify-end space-x-3 mt-6">
                <button class="border border-gray-700 rounded text-gray-300 px-4 py-2 pointer-events-none" i18n="@@CANCEL_BUTTON">Cancel</button>
                <button class="flat-primary pointer-events-none" i18n="@@TRANSLATE_CONFIRM_BUTTON">Translate</button>
              </div>
            </div>
            <div class="p-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50" i18n="@@TRANSLATION_OPTIONS_CAPTION">
              Translation options configuration modal
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviewing and Finalizing -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@REVIEW_FINALIZE_TITLE">Reviewing and Finalizing</h2>
      
      <div>
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@REVIEW_PR_TITLE">Pull Request Review</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@REVIEW_PR_DESCRIPTION">After the translation process completes:</p>
        
        <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
          <li i18n="@@REVIEW_STEP_1">Review the created pull request in your Git provider</li>
          <li i18n="@@REVIEW_STEP_2">Check the translated content for accuracy</li>
          <li i18n="@@REVIEW_STEP_3">Make any necessary adjustments directly in the XLIFF files</li>
          <li i18n="@@REVIEW_STEP_4">Merge the pull request to update your main codebase with the translations</li>
        </ol>
        
        <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@REVIEW_BENEFITS">This workflow allows you to keep translations in your version control system and follow standard code review practices for translation updates.</p>
      </div>
    </div>

    <!-- Tips and Best Practices -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300" i18n="@@TIPS_TITLE">Tips for Effective Translation</h2>
      
      <ul class="list-disc list-inside mt-2 text-blue-700 dark:text-blue-300 space-y-2">
        <li i18n="@@TIP_REGULAR">Run translations regularly as you develop to avoid large batches of untranslated content</li>
        <li i18n="@@TIP_BRANCH">Create a dedicated branch for translations to keep them separate from feature development</li>
        <li i18n="@@TIP_CONTEXT">Ensure your source code has clear context for translation units to improve AI translation quality</li>
        <li i18n="@@TIP_REVIEW">Always review AI-generated translations, especially for critical user-facing content</li>
        <li i18n="@@TIP_PATTERN">Use specific file patterns to target translations for one language at a time</li>
      </ul>
    </div>

    <!-- Resources -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@RESOURCES_TITLE">Additional Resources</h2>
      
      <ul class="space-y-4">
        <li>
          <a href="https://angular.dev/guide/i18n" class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div class="mr-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white" i18n="@@RESOURCE_ANGULAR_DOCS">Angular i18n Documentation</h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@RESOURCE_ANGULAR_DOCS_DESC">Official Angular documentation for internationalization.</p>
            </div>
          </a>
        </li>
        
        <li>
          <a href="https://github.com/daniel-sc/ng-extract-i18n-merge" class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div class="mr-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white" i18n="@@RESOURCE_NG_EXTRACT_I18N_MERGE">ng-extract-i18n-merge</h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@RESOURCE_NG_EXTRACT_I18N_MERGE_DESC">Tool for extracting and merging i18n translations in a single step.</p>
            </div>
          </a>
        </li>
        
        <li>
          <a href="https://github.com/softwarity/angular-i18n-cli" class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div class="mr-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white" i18n="@@RESOURCE_ANGULAR_I18N_CLI">Angular i18n CLI</h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@RESOURCE_ANGULAR_I18N_CLI_DESC">CLI tool to simplify Angular i18n configuration and locale management.</p>
            </div>
          </a>
        </li>
        
        <li>
          <a href="https://angular.dev/guide/i18n/manage-marked-text" class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
            <div class="mr-4 text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white" i18n="@@RESOURCE_MARKED_TEXT">Working with Marked Text</h3>
              <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@RESOURCE_MARKED_TEXT_DESC">Learn about advanced i18n features like pluralization and selection.</p>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- Translation Workflow -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@TRANSLATION_WORKFLOW_APP_TITLE">Translation Workflow</h2>

      <div class="mb-8">
        <div class="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-blue-500 dark:text-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white" i18n="@@ESTIMATE_TITLE">Estimation</h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@ESTIMATE_DESCRIPTION">Before running a translation, you can estimate the scope and complexity of the task:</p>
        
        <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
          <li i18n="@@ESTIMATE_STEP_1">Select the repository you want to work with</li>
          <li i18n="@@ESTIMATE_STEP_2">Click on "Estimate" to analyze your XLIFF files</li>
          <li>
            <strong i18n="@@ESTIMATE_STEP_3">Configure the estimate options:</strong>
            <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
              <li i18n="@@ESTIMATE_STEP_31"><strong>Branch</strong>: Select the branch containing your XLIFF files</li>
              <li i18n="@@ESTIMATE_STEP_32"><strong>File Pattern</strong>: By default "xlf" to search all XLIFF files. Use specific patterns like "ru.xlf" to target only Russian files</li>
              <li i18n="@@ESTIMATE_STEP_33"><strong>Translation State</strong>: Choose which translation units to include (default is "new" to focus on untranslated content)</li>
            </ul>
          </li>
          <li i18n="@@ESTIMATE_STEP_4">Review the estimate results showing the number of translation units to process</li>
        </ol>

        <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2" i18n="@@ESTIMATE_PURPOSE_TITLE">Why Estimate?</h4>
          <p class="text-yellow-700 dark:text-yellow-300" i18n="@@ESTIMATE_PURPOSE_DESCRIPTION">The estimation process helps you understand:</p>
          <ul class="list-disc list-inside mt-2 text-yellow-700 dark:text-yellow-300 space-y-2">
            <li i18n="@@ESTIMATE_PURPOSE_1">The exact number of translation units that need processing</li>
            <li i18n="@@ESTIMATE_PURPOSE_2">How many credits will be required (1 translation unit = 1 credit)</li>
            <li i18n="@@ESTIMATE_PURPOSE_3">Approximate time required (each translation unit takes 10-20 seconds to process)</li>
          </ul>
          <p class="text-yellow-700 dark:text-yellow-300 mt-4 font-medium" i18n="@@ESTIMATE_PURPOSE_CREDIT_NOTE">Important: Large translation projects with hundreds of translation units can take significant time. Plan accordingly.</p>
        </div>
      </div>

      <div>
        <div class="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-3 text-blue-500 dark:text-blue-400" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white" i18n="@@TRANSLATE_TITLE">Translation</h3>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@TRANSLATE_DESCRIPTION">Running an AI-powered translation is a separate process from estimation:</p>
        
        <ol class="list-decimal list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-4">
          <li i18n="@@TRANSLATE_STEP_1">Select the repository containing your XLIFF files</li>
          <li i18n="@@TRANSLATE_STEP_2">Click on "Translate" to begin the process</li>
          <li>
            <strong i18n="@@TRANSLATE_STEP_3">Configure the translation options:</strong>
            <ul class="list-disc list-inside ml-6 mt-2 space-y-1">
              <li><strong>Branch</strong>: <span i18n="@@TRANSLATE_STEP_3_BRANCH">Select the source branch</span></li>
              <li><strong>File Pattern</strong>: <span i18n="@@TRANSLATE_STEP_3_FILE_PATTERN">Specify which XLIFF files to translate</span></li>
              <li><strong>Translation State</strong>: <span i18n="@@TRANSLATE_STEP_3_TRANSLATION_STATE">Select which translation units to process (e.g., "new", "needs-translation")</span></li>
              <li><strong>Target State</strong>: <span i18n="@@TRANSLATE_STEP_3_TARGET_STATE">Define the state to set for translated units (e.g., "translated", "final")</span></li>
            </ul>
          </li>
          <li i18n="@@TRANSLATE_STEP_4">Start the translation process</li>
        </ol>

        <p class="mt-6 text-gray-600 dark:text-gray-400 italic" i18n="@@TRANSLATION_OPTIONS_REF">
          You'll be prompted with the translation options modal as shown earlier in the "Selecting Repositories" section.
        </p>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2" i18n="@@TRANSLATION_PROCESS_TITLE">Translation Process</h4>
          <p class="text-blue-700 dark:text-blue-300" i18n="@@TRANSLATION_PROCESS_DESCRIPTION">During the translation process, XLIFF Translator:</p>
          <ol class="list-decimal list-inside mt-2 text-blue-700 dark:text-blue-300 space-y-2">
            <li i18n="@@PROCESS_STEP_1">Clones your project repository</li>
            <li i18n="@@PROCESS_STEP_2">Identifies XLIFF files matching your pattern</li>
            <li i18n="@@PROCESS_STEP_3">Analyzes each translation unit and its context in the source code</li>
            <li i18n="@@PROCESS_STEP_4">Sends translation instructions to the AI engine with relevant context</li>
            <li i18n="@@PROCESS_STEP_5">Updates the XLIFF files with the translations</li>
            <li i18n="@@PROCESS_STEP_6">Creates a pull request with the changes (if configured)</li>
          </ol>
        </div>
      </div>
    </div>
  `
})
export class UsageComponent {} 