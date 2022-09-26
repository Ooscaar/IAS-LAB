class Page extends HTMLElement {
    // Aquí iría el código del elemento
    // Eventos, funciones, etc...

    constructor() {
        super();
    }

    connectedCallback() {
        this.style.display = "none";
        this.style.color = "white";
    }
  }
  
  window.customElements.define("web-page", Page);