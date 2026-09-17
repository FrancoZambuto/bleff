import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-scoreboard',
  template: `
    <aside class="card">
      <h3>🏆 Tabla</h3>
      <ol>
        @for (p of playersService.ranking(); track p.id; let i = $index) {
          <li [class.reader]="p.id === game.reader()?.id">
            <span class="pos">{{ i + 1 }}</span>
            <span class="name">{{ p.name }}</span>
            <span class="pts">{{ p.score }}</span>
          </li>
        }
      </ol>
      <button class="link danger" (click)="end()">Terminar partida</button>
    </aside>
  `,
  styles: `
    h3 {
      margin: 0 0 0.75rem;
    }
    ol {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem;
      display: grid;
      gap: 0.35rem;
    }
    li {
      display: flex;
      gap: 0.6rem;
      padding: 0.35rem 0.5rem;
      border-radius: 8px;
    }
    li.reader {
      background: var(--accent-soft);
    }
    .pos {
      color: var(--muted);
      width: 1.5ch;
    }
    .name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pts {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
  `,
})
export class Scoreboard {
  protected readonly game = inject(GameService);
  protected readonly playersService = inject(PlayersService);

  protected end(): void {
    if (confirm('¿Terminar la partida? Los puntajes quedan guardados.')) this.game.endGame();
  }
}
