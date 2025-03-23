import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private supabase: SupabaseClient;

  constructor() {
    const { url, anonKey } = environment.supabase;
    this.supabase = createClient(url, anonKey);
  }

  translate(text: string, sourceLang: string, targetLang: string): Observable<TranslationResponse> {
    return from(
      this.supabase.functions.invoke<TranslationResponse>('translate', {
        body: { text, sourceLang, targetLang }
      }).then(response => {
        if (response.error) throw response.error;
        return response.data;
      })
    );
  }
}