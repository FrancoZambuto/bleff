import { Component, computed, inject, signal } from '@angular/core';
import { GameService, ROUND_SECONDS } from '../../services/game.service';

@Component({
  selector: 'app-round',
  templateUrl: './round.html',
  styleUrl: './round.scss',
})
export class Round {
  protected readonly game = inject(GameService);

  protected readonly showWord = signal(false);
  protected readonly showDefinition = signal(false);

  protected readonly clock = computed(() => {
    const s = this.game.secondsLeft();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  /** Porcentaje restante, para el anillo del contador. */
  protected readonly progress = computed(() => this.game.secondsLeft() / ROUND_SECONDS);
  protected readonly urgent = computed(() => this.game.secondsLeft() <= 15);

  protected readonly ringLength = 2 * Math.PI * 90;

  protected changeWord(): void {
    this.game.changeWord();
    this.showDefinition.set(false);
  }

  protected start(): void {
    this.showDefinition.set(false);
    this.showWord.set(true);
    this.game.startTimer();
  }

  protected finishEarly(): void {
    if (confirm('¿Terminar el tiempo ahora?')) this.game.finishWriting();
  }
}
