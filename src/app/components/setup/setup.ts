import { Component, inject, signal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { PlayersService } from '../../services/players.service';

const MIN_PLAYERS = 3;

@Component({
  selector: 'app-setup',
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
})
export class Setup {
  protected readonly playersService = inject(PlayersService);
  protected readonly game = inject(GameService);
  protected readonly minPlayers = MIN_PLAYERS;

  protected readonly newName = signal('');
  protected readonly error = signal('');
  protected readonly drawing = signal(false);
  protected readonly highlightId = signal<string | null>(null);

  protected addPlayer(): void {
    const name = this.newName().trim();
    if (!name) return;
    if (this.playersService.add(name)) {
      this.newName.set('');
      this.error.set('');
    } else {
      this.error.set(`"${name}" ya está en la lista.`);
    }
  }

  protected removePlayer(id: string): void {
    this.playersService.remove(id);
    if (this.game.state().readerId === id) this.game.setReader(null);
  }

  protected canDraw(): boolean {
    return this.playersService.players().length >= MIN_PLAYERS && !this.drawing();
  }

  /** Sorteo con una pequeña animación que va saltando entre jugadores. */
  protected drawReader(): void {
    const players = this.playersService.players();
    if (players.length < MIN_PLAYERS) return;

    this.drawing.set(true);
    const winner = players[Math.floor(Math.random() * players.length)];
    const steps = 18 + Math.floor(Math.random() * players.length);
    let i = 0;

    const spin = () => {
      const current = i < steps ? players[i % players.length] : winner;
      this.highlightId.set(current.id);
      if (i >= steps) {
        this.game.setReader(winner.id);
        this.drawing.set(false);
        return;
      }
      i++;
      setTimeout(spin, 60 + i * 12);
    };
    spin();
  }

  protected isReader(id: string): boolean {
    return this.drawing() ? this.highlightId() === id : this.game.state().readerId === id;
  }
}
