// 32-bar audio spectrum waveform visualizer
export class WaveformVisualizer {
  private container: HTMLDivElement;
  private bars: HTMLDivElement[] = [];
  private intervalId: number | null = null;

  constructor(containerElement: HTMLDivElement) {
    this.container = containerElement;
    this.init();
  }

  private init(): void {
    this.container.innerHTML = '';
    this.container.className = 'flex items-center justify-center space-x-1 h-14 my-3';

    for (let i = 0; i < 28; i++) {
      const bar = document.createElement('div');
      bar.className = 'w-1 bg-[#cc785c]/40 rounded-full transition-all duration-100 h-2';
      this.container.appendChild(bar);
      this.bars.push(bar);
    }
  }

  public startAnimating(isSpeaking: boolean = false): void {
    this.stopAnimating();
    this.intervalId = window.setInterval(() => {
      this.bars.forEach((bar) => {
        const randomHeight = Math.floor(Math.random() * (isSpeaking ? 48 : 36)) + 6;
        bar.style.height = `${randomHeight}px`;
        bar.className = isSpeaking
          ? 'w-1 bg-emerald-500 rounded-full transition-all duration-100'
          : 'w-1 bg-[#cc785c] rounded-full transition-all duration-100';
      });
    }, 90);
  }

  public stopAnimating(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.bars.forEach((bar) => {
      bar.style.height = '6px';
      bar.className = 'w-1 bg-[#cc785c]/30 rounded-full transition-all duration-100';
    });
  }
}
