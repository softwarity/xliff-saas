export interface TranslationDoneMessage extends Omit<ProcessingContext, 'initialCredits' | 'remainingCredits'>{
  type: 'translation-done';
}

export interface EstimationDoneMessage extends Omit<ProcessingContext, 'initialCredits' | 'remainingCredits' | 'completed' | 'translated' | 'errors' | 'inputFiles'> {
  type: 'estimation-done';
  inputFiles: (Omit<InputFileContext, 'completed' | 'translated' | 'errors'>)[];
}

export interface ProgressMessage extends Omit<ProcessingContext, 'inputFiles' | 'initialCredits' | 'remainingCredits' | 'duration'> {
  type: 'progress';
}  

export interface ErrorMessage extends Partial<Omit<ProgressMessage, 'type'>> {
  type: 'error';
  errorCause: string;
  stackTrace?: string;
}  

export interface ProcessingContext {
  inputFiles: InputFileContext[];
  state: string;
  stateProcessed: string;
  toTranslate: number;
  translated: number;
  completed: number;
  errors: number;
  initialCredits: number;
  remainingCredits: number
  duration: number;
}

export interface InputFileContext {
  inputFile: string, 
  sourceLanguage: string, 
  targetLanguage: string, 
  toTranslate: number,
  translated: number, 
  completed: number,
  errors: number,
  duration: number
}