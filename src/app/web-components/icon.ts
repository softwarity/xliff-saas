(() => {
  class Icon extends HTMLElement {
    private _root: ShadowRoot;
    private _svg: SVGElement | null = null;

    static get observedAttributes() {
      return ['name', 'size', 'color'];
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
        'branch': ['<path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3l0 87.8c18.8-10.9 40.7-17.1 64-17.1l96 0c35.3 0 64-28.7 64-64l0-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 6.7c0 70.7-57.3 128-128 128l-96 0c-35.3 0-64 28.7-64 64l0 6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3l0-6.7 0-198.7C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path>'],
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
        'github': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>'
        ],
        'gitlab': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51a.42.42 0 0 1 .82 0l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 21 2.82l2.44 7.51 1.22 3.78a.84.84 0 0 1-.31.94z"></path>'
        ],
        'bitbucket': [
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.65 3C2.3 3 2 3.3 2 3.65v.12l2.73 16.5c.07.42.43.73.85.73h13.05c.31 0 .59-.22.64-.53L22 3.77v-.12C22 3.3 21.7 3 21.35 3H2.65z"></path>',
          '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.9 14H9.1l-1.2-6h8.2l-1.2 6z"></path>'
        ]
      };

      return icons[name]?.join('') || '';
    }

    private getSize(): string {
      const size = this.getAttribute('size') || '24';
      return `${size}px`;
    }

    private getColor(): string {
      return this.getAttribute('color') || 'currentColor';
    }

    render() {
      const name = this.getAttribute('name') || '';
      const size = this.getSize();
      const color = this.getColor();
      const paths = this.getIconPath(name);

      const style = `
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${size};
          height: ${size};
          color: ${color};
        }
        svg {
          width: 100%;
          height: 100%;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }
      `;

      this._root.innerHTML = `
        <style>${style}</style>
        <svg viewBox="${name === 'branch' ? '0 0 448 512' : '0 0 24 24'}">
          ${paths}
        </svg>
      `;
    }
  }

  customElements.define('app-icon', Icon);
})(); 