import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
<div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@INITIAL_SETUP_TITLE">Initial Setup</h2>
      
      <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@INITIAL_SETUP_DESCRIPTION">Start by adding Angular's localization package to your project:</p>
      
      <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">ng add</span> <span class="text-yellow-400">&#64;angular/localize</span></code></pre>

      <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@INITIAL_SETUP_CHANGES">This command will make the following changes:</p>
      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
        <li i18n="@@INITIAL_SETUP_CHANGE_1">Add the &#64;angular/localize package to your dependencies</li>
        <li i18n="@@INITIAL_SETUP_CHANGE_2">Add "&#64;angular/localize/init" to the polyfills array in angular.json</li>
        <li i18n="@@INITIAL_SETUP_CHANGE_3">Add the following reference to your main.ts:</li>
      </ul>

      <pre class="bg-gray-900 rounded-lg p-4 mt-4 overflow-x-auto border border-gray-700"><code><span class="text-gray-400">///</span> <span class="text-blue-400">&lt;reference</span> <span class="text-yellow-400">types="&#64;angular/localize"</span> <span class="text-blue-400">/&gt;</span></code></pre>

      <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@INITIAL_SETUP_CONFIG">It will also add the extract-i18n configuration to angular.json:</p>

      <pre class="bg-gray-900 rounded-lg p-4 mt-4 overflow-x-auto border border-gray-700"><code><span class="text-yellow-400">"extract-i18n"</span>: <span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">"builder"</span>: <span class="text-green-400">"ng-extract-i18n-merge:ng-extract-i18n-merge"</span>,
  <span class="text-yellow-400">"options"</span>: <span class="text-blue-400">&#123;</span>
    <span class="text-yellow-400">"buildTarget"</span>: <span class="text-green-400">"your-app:build"</span>,
    <span class="text-yellow-400">"format"</span>: <span class="text-green-400">"xlf"</span>,
    <span class="text-yellow-400">"outputPath"</span>: <span class="text-green-400">"src/locale"</span>,
    <span class="text-yellow-400">"includeContext"</span>: <span class="text-green-400">true</span>,
    <span class="text-yellow-400">"resetTranslationState"</span>: <span class="text-green-400">true</span>,
    <span class="text-yellow-400">"targetFiles"</span>: <span class="text-blue-400">[</span>
      <span class="text-green-400">"messages.fr.xlf"</span>,
      <span class="text-green-400">"messages.vi.xlf"</span>
    <span class="text-blue-400">]</span>
  <span class="text-blue-400">&#125;</span>
<span class="text-blue-400">&#125;</span></code></pre>

      <p class="text-gray-700 dark:text-gray-300 mt-2" i18n="@@INITIAL_SETUP_NOTE">Note: We'll modify the outputPath later in the configuration to match our workflow.</p>
    </div>

    <!-- Install ng-extract-i18n-merge -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@EXTRACT_TOOL_TITLE">Install Translation Tool</h2>
      
      <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@EXTRACT_TOOL_DESCRIPTION">For managing translation files, we'll use ng-extract-i18n-merge which simplifies the process of extracting and merging translations:</p>
      
      <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">npm install</span> <span class="text-yellow-400">--save-dev ng-extract-i18n-merge</span></code></pre>

      <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@EXTRACT_TOOL_BENEFITS">This tool offers several advantages:</p>
      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-2">
        <li i18n="@@EXTRACT_TOOL_BENEFIT_1">Automatically extracts translatable strings from your application</li>
        <li i18n="@@EXTRACT_TOOL_BENEFIT_2">Merges new translations with existing ones in a single step</li>
        <li i18n="@@EXTRACT_TOOL_BENEFIT_3">Preserves existing translations during updates</li>
        <li i18n="@@EXTRACT_TOOL_BENEFIT_4">Supports multiple target languages</li>
      </ul>
    </div>

    <!-- Configuration Files -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@CONFIG_FILES_TITLE">Configuration Files</h2>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">package.json</h3>
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-yellow-400">"scripts"</span>: <span class="text-blue-400">&#123;</span>
  ...
  <span class="text-yellow-400">"extract-i18n"</span>: <span class="text-green-400">"ng extract-i18n"</span>,
  <span class="text-yellow-400">"build"</span>: <span class="text-green-400">"ng build --localize"</span>
  ...
<span class="text-blue-400">&#125;</span></code></pre>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">angular.json</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@ANGULAR_JSON_DESCRIPTION">Update the i18n configuration in angular.json:</p>
        
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-yellow-400">"i18n"</span>: <span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">"sourceLocale"</span>: <span class="text-green-400">"en"</span>,
  <span class="text-yellow-400">"locales"</span>: <span class="text-blue-400">&#123;</span>
    <span class="text-yellow-400">"fr"</span>: <span class="text-blue-400">&#123;</span>
      <span class="text-yellow-400">"translation"</span>: <span class="text-green-400">"src/locale/messages.fr.xlf"</span>
    <span class="text-blue-400">&#125;</span>,
    <span class="text-yellow-400">"vi"</span>: <span class="text-blue-400">&#123;</span>
      <span class="text-yellow-400">"translation"</span>: <span class="text-green-400">"src/locale/messages.vi.xlf"</span>
    <span class="text-blue-400">&#125;</span>
  <span class="text-blue-400">&#125;</span>
<span class="text-blue-400">&#125;</span>,</code></pre>

        <p class="text-gray-700 dark:text-gray-300 mt-6 mb-4" i18n="@@EXTRACT_I18N_CONFIG_TITLE">Then replace the standard extract-i18n configuration with ng-extract-i18n-merge:</p>

        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-yellow-400">"extract-i18n"</span>: <span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">"builder"</span>: <span class="text-green-400">"ng-extract-i18n-merge:ng-extract-i18n-merge"</span>,
  <span class="text-yellow-400">"options"</span>: <span class="text-blue-400">&#123;</span>
    <span class="text-yellow-400">"buildTarget"</span>: <span class="text-green-400">"your-app:build"</span>,
    <span class="text-yellow-400">"format"</span>: <span class="text-green-400">"xlf"</span>,
    <span class="text-yellow-400">"outputPath"</span>: <span class="text-green-400">"src/locale"</span>,
    <span class="text-yellow-400">"includeContext"</span>: <span class="text-green-400">true</span>,
    <span class="text-yellow-400">"resetTranslationState"</span>: <span class="text-green-400">true</span>,
    <span class="text-yellow-400">"targetFiles"</span>: <span class="text-blue-400">[</span>
      <span class="text-green-400">"messages.fr.xlf"</span>,
      <span class="text-green-400">"messages.vi.xlf"</span>
    <span class="text-blue-400">]</span>
  <span class="text-blue-400">&#125;</span>
<span class="text-blue-400">&#125;</span></code></pre>

        <div class="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2" i18n="@@EXTRACT_I18N_OPTIONS_TITLE">Important Configuration Options:</h4>
          <ul class="list-disc list-inside text-yellow-700 dark:text-yellow-300 ml-4 space-y-2">
            <li i18n="@@EXTRACT_I18N_OPTION_1"><strong>buildTarget</strong>: Your application's build target name</li>
            <li i18n="@@EXTRACT_I18N_OPTION_2"><strong>outputPath</strong>: Directory where translation files will be stored</li>
            <li i18n="@@EXTRACT_I18N_OPTION_3"><strong>includeContext</strong>: Includes source file information in the XLIFF files</li>
            <li i18n="@@EXTRACT_I18N_OPTION_4"><strong>resetTranslationState</strong>: Marks all translations as needing review on changes</li>
            <li i18n="@@EXTRACT_I18N_OPTION_5"><strong>targetFiles</strong>: List of translation files to generate/update</li>
          </ul>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Build configurations</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@BUILD_CONFIG_DESCRIPTION">Add configurations for each language in the build section:</p>
        
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-yellow-400">"architect"</span>: <span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">"build"</span>: <span class="text-blue-400">&#123;</span>
    <span class="text-yellow-400">"configurations"</span>: <span class="text-blue-400">&#123;</span>
      <span class="text-yellow-400">"fr"</span>: <span class="text-blue-400">&#123;</span>
        <span class="text-yellow-400">"localize"</span>: <span class="text-blue-400">[</span><span class="text-green-400">"fr"</span><span class="text-blue-400">]</span>
      <span class="text-blue-400">&#125;</span>,
      <span class="text-yellow-400">"vi"</span>: <span class="text-blue-400">&#123;</span>
        <span class="text-yellow-400">"localize"</span>: <span class="text-blue-400">[</span><span class="text-green-400">"vi"</span><span class="text-blue-400">]</span>
      <span class="text-blue-400">&#125;</span>
    <span class="text-blue-400">&#125;</span>
  <span class="text-blue-400">&#125;</span>
<span class="text-blue-400">&#125;</span></code></pre>
      </div>
    </div>

    <!-- Prepare Components for Translation -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@PREPARE_COMPONENTS_TITLE">Prepare Components for Translation</h2>

      <div class="mb-6">
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@PREPARE_COMPONENTS_DESCRIPTION">To make your components ready for translation, you need to mark the text that should be translated. Angular provides two ways to do this:</p>
        
        <a href="https://angular.dev/guide/i18n/prepare" class="flex items-start p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 mt-2">
          <div class="mr-4 text-blue-600 dark:text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white" i18n="@@SEE_MORE_DOCUMENTATION">Angular Documentation: Marking Text for Translation</h3>
            <p class="text-gray-700 dark:text-gray-300 text-sm" i18n="@@SEE_MORE_DOCUMENTATION_DESC">Learn more about how to prepare your application for translation.</p>
          </div>
        </a>
      </div>

      <div class="space-y-8">
        <!-- Template Translation -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@TEMPLATE_TRANSLATION_TITLE">Template Translation</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@TEMPLATE_TRANSLATION_DESCRIPTION">Use the i18n attribute in your templates to mark text for translation:</p>

          <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">&lt;tag</span> <span class="text-yellow-400">attribute="This is a sample attribute text that needs translation."</span> 
  <span class="text-yellow-400">i18n-attribute="&#64;&#64;ATTRIBUTE_TEXT"</span>
  <span class="text-yellow-400">i18n="&#64;&#64;TAG_TEXT"</span><span class="text-blue-400">&gt;</span><span class="text-gray-100">This is a sample text that needs translation.</span><span class="text-blue-400">&lt;/tag&gt;</span>
<span class="text-gray-400">// EXAMPLE</span>
<span class="text-blue-400">&lt;button</span> <span class="text-yellow-400">title="Title button"</span> <span class="text-yellow-400">i18n-title="&#64;&#64;TITLE_BUTTON"</span><span class="text-yellow-400">i18n="&#64;&#64;LABEL_BUTTON"</span><span class="text-blue-400">&gt;</span><span class="text-gray-100">label button</span><span class="text-blue-400">&lt;/button&gt;</span></code></pre>

          <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@TEMPLATE_TRANSLATION_NOTE">The &#64;&#64;prefix defines a custom ID for the translation. Using SNAKE_CASE is recommended for consistency.</p>
        </div>

        <!-- Component Translation -->
        <div>
          <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@COMPONENT_TRANSLATION_TITLE">Component Translation</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@COMPONENT_TRANSLATION_DESCRIPTION">For text in your component code, use the $localize template tag:</p>

          <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">import</span> <span class="text-blue-400">&#123;</span> <span class="text-yellow-400">Component</span> <span class="text-blue-400">&#125;</span> <span class="text-blue-400">from</span> <span class="text-green-400">'&#64;angular/core'</span>;

<span class="text-blue-400">&#64;Component</span>(<span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">selector</span>: <span class="text-green-400">'app-example'</span>,
  <span class="text-yellow-400">template</span>: <span class="text-green-400">'...'</span>
<span class="text-blue-400">&#125;</span>)
<span class="text-blue-400">export class</span> <span class="text-yellow-400">ExampleComponent</span> <span class="text-blue-400">&#123;</span>
  <span class="text-yellow-400">title</span> = <span class="text-blue-400">$localize</span><span class="text-gray-400">&#96;:&#64;&#64;PAGE_TITLE:Welcome to our application&#96;</span>;
  <span class="text-yellow-400">errorMessage</span> = <span class="text-blue-400">$localize</span><span class="text-gray-400">&#96;:&#64;&#64;ERROR_MESSAGE:An error occurred while processing your request&#96;</span>;
<span class="text-blue-400">&#125;</span></code></pre>
        </div>
      </div>
    </div>

    <!-- Building and Serving -->
    <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@BUILDING_SERVING_TITLE">Building and Serving</h2>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@BUILD_TRANSLATIONS_TITLE">Build with Translations</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@BUILD_TRANSLATIONS_DESCRIPTION">Build your application with all translations:</p>
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">npm run</span> <span class="text-yellow-400">build</span></code></pre>
        
        <p class="text-gray-700 dark:text-gray-300 mt-4" i18n="@@BUILD_SPECIFIC_LANGUAGE_DESCRIPTION">Or build for a specific language (using French as example):</p>
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">ng build</span> <span class="text-yellow-400">--configuration=fr</span></code></pre>
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@DEV_SERVER_TITLE">Development Server</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@DEV_SERVER_DESCRIPTION">Serve your application with translations during development:</p>
        <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700"><code><span class="text-blue-400">ng serve</span> <span class="text-yellow-400">--configuration=fr</span></code></pre>
      </div>
    </div>

    <!-- Important Note -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300" i18n="@@IMPORTANT_NOTE_TITLE">⚠️ Important Note</h2>
      <p class="text-blue-700 dark:text-blue-300" i18n="@@IMPORTANT_NOTE_DESCRIPTION">After adding new translatable content or modifying existing translations:</p>
      <ol class="list-decimal list-inside mt-4 text-blue-700 dark:text-blue-300 space-y-2">
        <li><code class="bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded">ng extract-i18n</code> - <span i18n="@@IMPORTANT_NOTE_COMMAND_1">to extract and update all translation files in one step</span></li>
      </ol>
      <p class="text-blue-700 dark:text-blue-300 mt-4" i18n="@@WORKFLOW_BENEFITS">This simplified workflow ensures your translation files are always up-to-date with source content, making the internationalization process more efficient and error-free.</p>
    </div>
  </div>
  `
})
export class SetupComponent {} 