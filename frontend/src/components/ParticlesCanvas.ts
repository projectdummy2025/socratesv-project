// Canvas particle animation system for warm ambient background
export class ParticlesCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Array<{ x: number; y: number; size: number; alpha: number; vx: number; vy: number }> = [];
  private animationId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d')!;
    this.init();
  }

  private init(): void {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  private resize(): void {
    this.canvas.width = this.canvas.parentElement?.clientWidth || window.innerWidth;
    this.canvas.height = this.canvas.parentElement?.clientHeight || window.innerHeight;
  }

  private createParticles(): void {
    this.particles = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  }

  private animate = (): void => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.x = (p.x + p.vx + this.canvas.width) % this.canvas.width;
      p.y = (p.y + p.vy + this.canvas.height) % this.canvas.height;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(204, 120, 92, ${p.alpha})`;
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
