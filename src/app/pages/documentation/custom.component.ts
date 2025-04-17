import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <!-- Diamond Feature Banner -->
      <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8">
        <div class="flex items-start">
          <div class="mr-4 flex-shrink-0">
            <img src="assets/membership/diamond.svg" width="40" height="40" alt="Diamond icon" class="text-purple-600 dark:text-purple-400">
          </div>
          <div>
            <h2 class="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2" i18n="@@DIAMOND_EXCLUSIVE_FEATURE">Diamond Exclusive Feature</h2>
            <p class="text-purple-700 dark:text-purple-300" i18n="@@DIAMOND_EXCLUSIVE_DESCRIPTION">
              Custom AI instructions are a premium feature exclusive to Diamond membership subscribers. Enhance translation quality by providing specific domain context, terminology requirements, and language preferences.
            </p>
            <div class="mt-4 flex">
              <a routerLink="/pricing" class="button flat-primary !bg-purple-600 hover:!bg-purple-700 dark:!bg-purple-700 dark:hover:!bg-purple-800" i18n="@@UPGRADE_TO_DIAMOND_BUTTON">Upgrade to Diamond</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Instructions -->
      <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@CUSTOM_INSTRUCTIONS_TITLE">Custom AI Translation Instructions</h2>
        
        <div class="space-y-6">
          <div>
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2" i18n="@@CUSTOM_INSTRUCTIONS_FILENAME">Configuration File</h3>
              <p class="text-blue-700 dark:text-blue-300" i18n="@@CUSTOM_INSTRUCTIONS_FILENAME_DESC">Create a file named <code class="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-900 dark:text-blue-100">xliff-instructions.md</code> at the root of your Git repository to provide custom translation instructions.</p>
            </div>

            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@CUSTOM_INSTRUCTIONS_SUBTITLE">Enhancing Translation Context</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@CUSTOM_INSTRUCTIONS_DESCRIPTION">
              Our AI translation system can leverage detailed context about your application to produce more accurate and consistent translations. By providing custom instructions, you can help the AI understand industry-specific terminology, maintain brand voice, and respect language-specific requirements.
            </p>
            
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-4" i18n="@@CUSTOM_INSTRUCTIONS_EXAMPLE_TITLE">Example: Financial Application</h4>
              <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@CUSTOM_INSTRUCTIONS_EXAMPLE_DESCRIPTION">Below is an example of custom instructions for a financial application that help ensure accurate translation of domain-specific terms:</p>
              
              <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700 text-sm text-gray-300"><code>Instructions in English:

# Financial Application Context

## Application Overview
This application is a comprehensive banking platform that manages:
- Inter-account money transfers
- Account balance tracking
- Interest calculations and payments
- Transaction history and reporting
- Account status management

## Terminology and Context
- "Balance" refers to the current amount of money in a bank account, not physical balance or equilibrium
- "Transfer" specifically means moving money between two bank accounts within the same institution
- "APR" (Annual Percentage Rate) is a financial term that should not be translated, keep as "APR" in all languages
- "Interest" refers to the amount charged for borrowing money or earned on deposits, not general interest or curiosity
- "Pending" indicates a transaction that has been initiated but not yet completed or cleared
- "Cleared" means a transaction has been fully processed and the funds are available
- "Overdraft" refers to a negative balance in a bank account when withdrawals exceed available funds

## Special Cases
- Account numbers and transaction IDs should remain in their original format
- Currency codes (USD, EUR, etc.) should not be translated
- Financial terms with specific meanings in banking context:
  * "Credit" refers to money added to an account, not general trustworthiness
  * "Debit" refers to money withdrawn from an account, not a payment card type
  * "Statement" refers to a periodic summary of account activity
  * "Reconciliation" refers to matching transactions with bank records

## Language-Specific Considerations
- In French: "Crédit" should be used for money added to an account, not "confiance"
- In Spanish: "Transferencia" should be used for money transfers, not "traslado"
- In German: "Überweisung" should be used for transfers, not "Transfer"</code></pre>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-4" i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINES_TITLE">Best Practices</h4>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_1">Focus on application-specific terminology and provide clear context for ambiguous terms</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_2">Specify terms that should remain untranslated (technical terms, brand names, acronyms)</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_3">Provide preferred translations for key terms to maintain consistency</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_4">Include domain-specific rules, conventions, and tone requirements</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_5">Instructions can be written in any language, though English is recommended for maximum compatibility</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_6">Update your instructions file as your application terminology evolves</li>
              </ul>
            </div>
            
            <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p class="text-yellow-800 dark:text-yellow-300 flex items-center" i18n="@@CUSTOM_INSTRUCTIONS_TIP">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>For the best results, keep your instructions focused and relevant. Overly lengthy instructions may dilute the impact of the most important context.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomComponent {} 