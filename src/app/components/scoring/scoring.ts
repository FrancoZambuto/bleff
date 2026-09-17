import { Component, computed, inject, signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayersService } from '../../services/players.service';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.html',
  styleUrl: './scoring.scss',
})
export class Scoring {
  protected readonly game = inject(GameService);
  protected readonly playersService = inject(PlayersService);

  /** Puntos de esta ronda por id de jugador. */
  protected readonly points = signal<Record<string, number>>({});
  protected readonly showDefinition = signal(false);

  protected readonly hasChanges = computed(() => Object.values(this.points()).some((v) => v !== 0));

  protected roundPoints(id: string): number {
    return this.points()[id] ?? 0;
  }

  protected change(id: string, delta: number): void {
    if (id === this.game.reader()?.id) return;
    this.points.update((pts) => ({ ...pts, [id]: (pts[id] ?? 0) + delta }));
  }

  protected saveRound(): void {
    if (!this.hasChanges() && !confirm('No se sumó ningún punto. ¿Pasar a la siguiente ronda igual?')) return;
    this.game.confirmRound(this.points());
    this.points.set({});
    this.showDefinition.set(false);
  }
}
