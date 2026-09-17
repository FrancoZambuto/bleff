import { Component, OnInit, output, signal } from '@angular/core';

const VISIBLE_MS = 3100;
const FADE_MS = 500;

@Component({
  selector: 'app-splash',
  template: `
    <div class="splash" [class.leaving]="leaving()" (click)="close()" aria-hidden="true">
      <h1>Bleff</h1>
      <span class="tagline">el juego del diccionario</span>
    </div>
  `,
  styles: `
    .splash {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: var(--bg);
      transition: opacity ${FADE_MS}ms ease;
      cursor: pointer;
    }
    .splash.leaving {
      opacity: 0;
      pointer-events: none;
    }
    h1 {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(4rem, 20vw, 8rem);
      color: var(--accent);
      animation: pop 700ms cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
    }
    .tagline {
      color: var(--muted);
      font-size: clamp(1rem, 4vw, 1.4rem);
      animation: rise 500ms ease 350ms both;
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: scale(0.6);
      }
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      h1,
      .tagline {
        animation: none;
      }
    }
  `,
})
export class Splash implements OnInit {
  readonly done = output<void>();
  protected readonly leaving = signal(false);

  ngOnInit(): void {
    setTimeout(() => this.close(), VISIBLE_MS);
  }

  /** Un toque sobre el splash lo saltea. */
  protected close(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    setTimeout(() => this.done.emit(), FADE_MS);
  }
}
