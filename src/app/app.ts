import { Component, inject, signal } from '@angular/core';
import { Intro } from './components/intro/intro';
import { Round } from './components/round/round';
import { Scoreboard } from './components/scoreboard/scoreboard';
import { Scoring } from './components/scoring/scoring';
import { Setup } from './components/setup/setup';
import { Splash } from './components/splash/splash';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  imports: [Splash, Intro, Setup, Round, Scoring, Scoreboard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly game = inject(GameService);
  protected readonly showSplash = signal(true);

  /** Las instrucciones se muestran al entrar, salvo que haya una partida en curso. */
  protected readonly showIntro = signal(this.game.phase() === 'setup');
}
