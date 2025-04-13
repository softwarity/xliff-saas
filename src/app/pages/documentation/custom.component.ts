import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <!-- Custom Instructions -->
      <div class="bg-white dark:bg-dark-700 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400" i18n="@@CUSTOM_INSTRUCTIONS_TITLE">Custom Instructions</h2>
        
        <div class="space-y-6">
          <div>
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2" i18n="@@CUSTOM_INSTRUCTIONS_FILENAME">File to Create</h3>
              <p class="text-blue-700 dark:text-blue-300" i18n="@@CUSTOM_INSTRUCTIONS_FILENAME_DESC">Create a file named <code class="bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-900 dark:text-blue-100">xliff-instructions.md</code> at the root of your Git repository.</p>
            </div>

            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white" i18n="@@CUSTOM_INSTRUCTIONS_SUBTITLE">Adding Context to Translations</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@CUSTOM_INSTRUCTIONS_DESCRIPTION">You can provide additional context for translations by creating a <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-900 dark:text-gray-100">xliff-instructions.md</code> file at the root of your Git repository. This helps the translation assistant better understand your application's specific terminology and context.</p>
            
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-4" i18n="@@CUSTOM_INSTRUCTIONS_EXAMPLE_TITLE">Example for a Financial Application</h4>
              <p class="text-gray-700 dark:text-gray-300 mb-4" i18n="@@CUSTOM_INSTRUCTIONS_EXAMPLE_DESCRIPTION">Here's an example of custom instructions for a financial application:</p>
              
              <pre class="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-700 text-gray-600"><code>Instructions in English:

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
              <h4 class="font-semibold text-gray-900 dark:text-white mb-4" i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINES_TITLE">Guidelines</h4>
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_1">Focus on application-specific terminology and context</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_2">Specify terms that should not be translated</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_3">Provide specific translation preferences for key terms</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_4">Include any domain-specific rules or conventions</li>
                <li i18n="@@CUSTOM_INSTRUCTIONS_GUIDELINE_5">You can write instructions in any language, but it's recommended to use English or specify the language at the beginning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomComponent {} 