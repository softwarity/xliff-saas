export class SelectItem extends HTMLElement {
  static get observedAttributes() {
    return ['items', 'selected', 'color-scheme-attribute', 'label-key'];
  }

  private select?: HTMLSelectElement;
  private items: any[] = [];
  private labelKey: string | ((item: any) => string) = (item: any) => 
    typeof item === 'string' ? item : item.toString();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Create select element
    this.select = document.createElement('select');
    this.select.addEventListener('change', this.handleChange.bind(this));

    // Add styles and select to shadow DOM
    const style = document.createElement('style');
    const colorSchemeAttr = this.getAttribute('color-scheme-attribute') || 'class';
    
    style.textContent = `
      :host {
        display: block;
      }

      select {
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.375rem;
        border-width: 1px;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
      }

      /* Light theme */
      :host([${colorSchemeAttr}="light"]) select {
        background-color: white;
        border-color: #d1d5db;
        color: #374151;
      }

      :host([${colorSchemeAttr}="light"]) select:focus {
        border-color: #3b82f6;
        ring: 1px #3b82f6;
      }

      /* Dark theme */
      :host([${colorSchemeAttr}="dark"]) select {
        background-color: #1f2937;
        border-color: #374151;
        color: #e5e7eb;
      }

      :host([${colorSchemeAttr}="dark"]) select:focus {
        border-color: #3b82f6;
        ring: 1px #3b82f6;
      }

      select:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    this.shadowRoot?.appendChild(style);
    this.shadowRoot?.appendChild(this.select);

    // Initial render of options
    if (this.getAttribute('items')) {
      try {
        this.items = JSON.parse(this.getAttribute('items') || '[]');
        this.updateOptions();
      } catch (e) {
        console.error('Invalid items format:', e);
      }
    }
  }

  private handleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('change', {
      detail: selectedValue,
      bubbles: true,
      composed: true
    }));
  }

  private updateOptions() {
    if (!this.select) return;
    // Clear existing options
    this.select.innerHTML = '';
    
    // Add default empty option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an option';
    this.select?.appendChild(defaultOption);
    
    // Add options from items
    this.items.forEach(item => {
      const option = document.createElement('option');
      option.value = typeof item === 'string' ? item : item.id || item.value || item;
      option.textContent = typeof this.labelKey === 'function' 
        ? this.labelKey(item)
        : item[this.labelKey];
      this.select?.appendChild(option);
    });

    // Set selected value if exists
    if (this.getAttribute('selected')) {
      this.select.value = this.getAttribute('selected') || '';
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (!this.select || !this.shadowRoot) return;
    if (oldValue === newValue) return;

    switch (name) {
      case 'items':
        try {
          this.items = JSON.parse(newValue);
          this.updateOptions();
        } catch (e) {
          console.error('Invalid items format:', e);
        }
        break;
      case 'selected':
        if (this.select) {
          this.select.value = newValue || '';
        }
        break;
      case 'label-key':
        if (typeof newValue === 'string') {
          this.labelKey = (item: any) => item[newValue];
          this.updateOptions();
        }
        break;
      case 'color-scheme-attribute':
        // Force re-render to update styles with new attribute
        if (this.isConnected) {
          const oldSelect = this.select;
          this.shadowRoot.innerHTML = '';
          this.connectedCallback();
          this.select.value = oldSelect?.value || '';
        }
        break;
    }
  }
}

// Register the web component
customElements.define('select-item', SelectItem); 