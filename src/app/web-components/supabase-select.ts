import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseSelect extends SelectItem {
  private supabase: SupabaseClient;
  private subscription: any;

  static get observedAttributes() {
    return [...super.observedAttributes, 'table', 'query'];
  }

  constructor() {
    super();
    // Initialisez votre client Supabase ici
    this.supabase = createClient(
      'VOTRE_URL_SUPABASE',
      'VOTRE_CLE_PUBLIQUE'
    );
  }

  private async setupRealtimeSubscription() {
    const table = this.getAttribute('table');
    const query = this.getAttribute('query');

    if (!table) return;

    // Annuler l'ancienne souscription si elle existe
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // Créer la nouvelle souscription
    this.subscription = this.supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        async (payload) => {
          // Rafraîchir les données à chaque changement
          await this.fetchAndUpdateData();
        }
      )
      .subscribe();

    // Charger les données initiales
    await this.fetchAndUpdateData();
  }

  private async fetchAndUpdateData() {
    const table = this.getAttribute('table');
    const query = this.getAttribute('query');

    if (!table) return;

    let supabaseQuery = this.supabase
      .from(table)
      .select('*');

    if (query) {
      try {
        const queryObj = JSON.parse(query);
        // Appliquer les conditions de la requête
        Object.entries(queryObj).forEach(([key, value]) => {
          supabaseQuery = supabaseQuery.eq(key, value);
        });
      } catch (e) {
        console.error('Invalid query format:', e);
      }
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Supabase query error:', error);
      return;
    }

    // Mettre à jour les items du select
    this.setAttribute('items', JSON.stringify(data));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    if (name === 'table' || name === 'query') {
      this.setupRealtimeSubscription();
    }
  }

  disconnectedCallback() {
    // Nettoyer la souscription quand le composant est détruit
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

// Register the web component
customElements.define('supabase-select', SupabaseSelect); 