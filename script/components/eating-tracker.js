export default class EatingTracker extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<et-foods />`;
  }
}

customElements.define("eating-tracker", EatingTracker);
