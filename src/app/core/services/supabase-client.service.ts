import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  private supabase: SupabaseClient;

  constructor() {
    const options = {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
      realtime: { params: { eventsPerSecond: 10 } }
    };
    const { url, anonKey } = environment.supabase;
    this.supabase = createClient(url, anonKey, options);
  }

  get auth() {
    return this.supabase.auth;
  }

  get storage() {
    return this.supabase.storage;
  }

  get functions() {
    return this.supabase.functions;
  }

  get realtime() {
    return this.supabase.realtime;
  }

  get client() {
    return this.supabase;
  }

  /**
   * Exécute une requête sur une table
   * @param table Nom de la table
   */
  from(table: string) {
    return this.supabase.from(table);
  }

  /**
   * Exécute une procédure stockée
   * @param fn Nom de la fonction
   * @param params Paramètres de la fonction
   */
  rpc(fn: string, params?: Record<string, unknown>) {
    return this.supabase.rpc(fn, params);
  }
}