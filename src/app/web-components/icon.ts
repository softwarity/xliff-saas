(() => {
  class Icon extends HTMLElement {
    private _root: ShadowRoot;
    private _svg: SVGElement | null = null;

    static get observedAttributes() {
      return ['name', 'size', 'fill', 'stroke'];
    }

    constructor() {
      super();
      this._root = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    private getIconPath(name: string): string {
      const icons: { [key: string]: string[] } = {
        'check': ['<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>'],
        'branch': ['<path d="M4.76 5.64a.89.89 90 100-1.78.89.89 90 100 1.78zm2.96-.89c0 1.22-.73 2.26-1.78 2.71v3.25c.7-.4 1.5-.63 2.37-.63h3.55c1.3 0 2.37-1.06 2.37-2.37v-.25c-1.05-.46-1.78-1.5-1.78-2.71 0-1.63 1.32-2.96 2.96-2.96s2.96 1.32 2.96 2.96c0 1.22-.73 2.26-1.78 2.71v.25c0 2.62-2.12 4.73-4.73 4.73h-3.55c-1.3 0-2.37 1.06-2.37 2.37v.25c1.05.46 1.78 1.5 1.78 2.71 0 1.63-1.32 2.96-2.96 2.96s-2.96-1.32-2.96-2.96c0-1.22.73-2.26 1.78-2.71v-.25-7.34c-1.05-.46-1.78-1.5-1.78-2.71 0-1.63 1.32-2.96 2.96-2.96s2.96 1.32 2.96 2.96zm8.58 0a.89.89 90 10-1.78 0 .89.89 90 101.78 0zm-11.53 13.9a.89.89 90 100-1.78.89.89 90 100 1.78z"></path>'],
        'github': [
          '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>'
        ],
        'gitlab': [
          '<path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 00-.867 0L16.418 9.45H7.582L4.918 1.263a.455.455 0 00-.867 0L1.386 9.45.044 13.587a.924.924 0 00.331 1.03L12 23.054l11.625-8.436a.92.92 0 00.33-1.031"/>'
        ],
        'bitbucket': [
          '<path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891L.778 1.213zM14.52 15.53H9.522L8.17 8.466h7.561l-1.211 7.064z"/>'
        ],
        'git': ['<path d="M90.156 41.965 50.036 1.848a5.918 5.918 0 0 0-8.372 0l-8.328 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.034 7.034 0 0 1 1.669 7.277l10.187 10.184a7.028 7.028 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.05 7.05 0 0 1-9.965 0 7.044 7.044 0 0 1-1.528-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.06 7.06 0 0 1 2.304-1.539V33.926a7.049 7.049 0 0 1-3.82-9.234L29.242 14.272 1.73 41.777a5.925 5.925 0 0 0 0 8.371L41.852 90.27a5.925 5.925 0 0 0 8.37 0l39.934-39.934a5.925 5.925 0 0 0 0-8.371"/>'],
        'task': ['<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />'],
        'refresh': ['<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />'],
        'chevron-down': ['<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16L6 10H18L12 16Z"></path>'],
        'close': ['<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>'],
        'plus': ['<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>'],
        'minus': ['<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>'],
        'search': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6"></path>',
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"></path>'
        ],
        'settings': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>',
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>'
        ],
        'user': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>'
        ],
        'logout': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7"></path>',
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>'
        ],
      };

      return icons[name]?.join('') || '';
    }

    private getSize(): string {
      const size = this.getAttribute('size') || '24';
      return `${size}px`;
    }

    private getFill(): string {
      return this.getAttribute('fill') || 'currentColor';
    }

    private getStroke(): string {
      return this.getAttribute('stroke') || 'none';
    }

    render() {
      const name = this.getAttribute('name') || '';
      const size = this.getSize();
      const fill = this.getFill();
      const stroke = this.getStroke();
      const paths = this.getIconPath(name);

      const style = `
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${size};
          height: ${size};
        }
        svg {
          width: 100%;
          height: 100%;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `;

      this._root.innerHTML = `
        <style>${style}</style>
        <svg viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}">
          ${paths}
        </svg>
      `;
    }
  }

  customElements.define('app-icon', Icon);
})(); 