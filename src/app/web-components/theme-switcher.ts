(() => {
  /**
   * @element theme-switcher
   * @description A web component that allows the user to switch between dark and light mode.
   * @property {string} attribute - The attribute to use to switch between dark and light mode. Default is 'class'.
   * @property {string} title-dark - The title for the dark mode button. Default is 'Dark mode'.
   * @property {string} title-light - The title for the light mode button. Default is 'Light mode'.
   * @property {string} title-system - The title for the system preference button. Default is 'System preference'.
   */
  class ThemeSwitcher extends HTMLElement {

    private _root: ShadowRoot;
    private attribute: string;
    private vertical: boolean = false;
    private titleDark: string;
    private titleLight: string;
    private titleSystem: string;

    constructor() {
      super();
      this._root = this.attachShadow({ mode: 'closed' });
      this.attribute = 'class';
      this.vertical = false;
      this.titleDark = 'Dark mode';
      this.titleLight = 'Light mode';
      this.titleSystem = 'System preference';
    }
  
    static get observedAttributes() {
      return []; // on observe rien
      // return ['attribute', 'title-dark', 'title-light', 'title-system'];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      // if (name === 'attribute' || name === 'title-dark' || name === 'title-light' || name === 'title-system') {
      //   if (name === 'title-dark') {
      //     this.titleDark = newValue;
      //   } else if (name === 'title-light') {
      //     this.titleLight = newValue;
      //   } else if (name === 'title-system') {
      //     this.titleSystem = newValue;
      //   } else if (name === 'attribute') {
      //     this.attribute = newValue;
      //   }
      //   this.render();
      // }
    }

    connectedCallback() {
      this.titleDark = this.getAttribute('title-dark') || this.titleDark;
      this.titleLight = this.getAttribute('title-light') || this.titleLight;
      this.titleSystem = this.getAttribute('title-system') || this.titleSystem;
      this.attribute = this.getAttribute('attribute') || this.attribute;
      this.vertical = this.getAttribute('vertical') === 'true';
      this.render();
      this.initializeTheme();
      this.setupSystemThemeListener();
    }
  
    render() {
      const style: string = `
        :host {
          display: ${this.vertical ? 'block' : 'flex'};
          gap: 0.25rem;
          padding: 0.25rem;
          border-radius: 0.5rem;
          background-color: rgb(229 231 235);
        }

        :host-context(.dark) {
          background-color: rgb(55 65 81);
        }

        .button {
          padding: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          color: rgb(75 85 99);
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        :host-context(.dark) .button {
          color: rgb(209 213 219);
        }

        .button:hover {
          background-color: rgb(209 213 219);
        }

        :host-context(.dark) .button:hover {
          background-color: rgb(75 85 99);
        }
        ${this.attribute === 'class' ? `
          :host-context([color-scheme="user"].dark) .button[data-scheme="dark"],
          :host-context([color-scheme="system"]) .button[data-scheme="system"],
          :host-context([color-scheme="user"]:not(.dark)) .button[data-scheme="light"] {
            background-color: rgb(209 213 219);
            color: rgb(17 24 39);
          }
        ` : `
          :host-context([color-scheme="user"][${this.attribute}="dark"]) .button[data-scheme="dark"],
          :host-context([color-scheme="system"]) .button[data-scheme="system"],
          :host-context([color-scheme="user"]:not([${this.attribute}="dark"])) .button[data-scheme="light"] {
            background-color: rgb(209 213 219);
            color: rgb(17 24 39);
          }
        `}
        :host-context(.dark) .button[data-active="true"] {
          background-color: rgb(75 85 99);
          color: rgb(255 255 255);
        }

        svg {
          width: 1.25rem;
          height: 1.25rem;
          display: block;
        }
      `;
      const html: string = `
        <button class="button" data-scheme="dark" title="${this.titleDark}" onclick="this.getRootNode().host.setColorScheme('dark')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>
        <button class="button" data-scheme="system" title="${this.titleSystem}" onclick="this.getRootNode().host.setColorScheme('system')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </button>
        <button class="button" data-scheme="light" title="${this.titleLight}" onclick="this.getRootNode().host.setColorScheme('light')">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </button>
      `;
      this._root.innerHTML = html;
      const styleElement = document.createElement('style');
      styleElement.textContent = style;
      this._root.appendChild(styleElement);
    }
  
    setColorScheme(scheme: string) {
      const root = document.documentElement;
      
      root.removeAttribute('system-scheme');
      if (this.attribute === 'class') {
        root.classList.toggle('dark', false)
      } else {
        root.removeAttribute(this.attribute);
      }
      
      if (scheme === 'system') {
        const color = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        this.setColor(color);
        root.setAttribute('color-scheme', 'system');
        localStorage.setItem('color-scheme', 'system');
      } else {
        this.setColor(scheme);
        root.setAttribute('color-scheme', 'user');
        localStorage.setItem('color-scheme', scheme);
      }
    }

    setColor(color: string) {
      const root = document.documentElement;
      if (this.attribute === 'class') {
        root.classList.toggle('dark', color === 'dark');
      } else {
        root.setAttribute(this.attribute, color);
      }      
    }
  
    initializeTheme() {
      const savedScheme = localStorage.getItem('color-scheme') || 'system';
      this.setColorScheme(savedScheme);
    }
  
    setupSystemThemeListener() {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentScheme = localStorage.getItem('color-scheme') || 'system';
        if (currentScheme === 'system') {
          this.setColorScheme('system');
        }
      });
    }
  }
  if (typeof window !== 'undefined' && window.customElements) {
    customElements.define('theme-switcher', ThemeSwitcher);
  }
})();