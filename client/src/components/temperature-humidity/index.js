class TempHumidityComponent extends HTMLElement {
  connectedCallback() {
    this.stream = new Worker('./stream.worker.js');
    this.stream.addEventListener('message', ({ data }) => this.render(data));
  }

  render({temperature, humidity}) {
    this.innerHTML = `
      <div>${temperature}°</div>
      <div>${humidity}%</div>`;
  }
}

customElements.define('temperature-humidity', TempHumidityComponent);
