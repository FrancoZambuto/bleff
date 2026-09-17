import { Injectable, computed, effect, inject, signal } from '@angular/core';
import palabras from '../data/palabras.json';
import { GameState, Word } from '../models';
import { PlayersService } from './players.service';
import { loadJson, saveJson } from './storage';

const STORAGE_KEY = 'bleff.game';
export const ROUND_SECONDS = 120;

const INITIAL_STATE: GameState = {
  phase: 'setup',
  readerId: null,
  word: null,
  usedWords: [],
  round: 0,
  endsAt: null,
};

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly playersService = inject(PlayersService);
  private readonly words: Word[] = palabras;
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly state = signal<GameState>(loadJson(STORAGE_KEY, INITIAL_STATE));
  readonly secondsLeft = signal(ROUND_SECONDS);

  readonly phase = computed(() => this.state().phase);
  readonly word = computed(() => this.state().word);
  readonly round = computed(() => this.state().round);
  readonly reader = computed(
    () => this.playersService.players().find((p) => p.id === this.state().readerId) ?? null,
  );

  constructor() {
    effect(() => saveJson(STORAGE_KEY, this.state()));

    // Si se recargó la página en medio de una ronda, retomamos el contador.
    if (this.state().phase === 'writing') this.runTimer();
  }

  setReader(id: string | null): void {
    this.patch({ readerId: id });
  }

  startGame(): void {
    if (!this.reader()) return;
    this.patch({ phase: 'ready', round: 1, usedWords: [], word: this.pickWord([]) });
  }

  changeWord(): void {
    this.patch({ word: this.pickWord(this.state().usedWords) });
  }

  startTimer(): void {
    const word = this.state().word;
    this.patch({
      phase: 'writing',
      endsAt: Date.now() + ROUND_SECONDS * 1000,
      usedWords: word ? [...this.state().usedWords, word.palabra] : this.state().usedWords,
    });
    this.runTimer();
  }

  finishWriting(): void {
    this.stopTimer();
    this.secondsLeft.set(0);
    this.patch({ phase: 'scoring', endsAt: null });
  }

  confirmRound(points: Record<string, number>): void {
    // El lector no suma puntos en su propia ronda.
    const { [this.state().readerId ?? '']: _ignored, ...playerPoints } = points;
    this.playersService.addPoints(playerPoints);
    this.patch({
      phase: 'ready',
      round: this.state().round + 1,
      readerId: this.nextReaderId(),
      word: this.pickWord(this.state().usedWords),
    });
    this.secondsLeft.set(ROUND_SECONDS);
  }

  endGame(): void {
    this.stopTimer();
    this.secondsLeft.set(ROUND_SECONDS);
    this.state.set({ ...INITIAL_STATE });
  }

  private runTimer(): void {
    this.stopTimer();
    const tick = () => {
      const endsAt = this.state().endsAt ?? Date.now();
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      this.secondsLeft.set(left);
      if (left === 0) {
        playAlarm();
        this.finishWriting();
      }
    };
    tick();
    this.timerId = setInterval(tick, 250);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private nextReaderId(): string | null {
    const players = this.playersService.players();
    if (!players.length) return null;
    const idx = players.findIndex((p) => p.id === this.state().readerId);
    return players[(idx + 1) % players.length].id;
  }

  private pickWord(used: string[]): Word {
    const current = this.state().word?.palabra;
    let pool = this.words.filter((w) => !used.includes(w.palabra) && w.palabra !== current);
    // Si se agotaron las palabras, volvemos a usar todas.
    if (!pool.length) pool = this.words.filter((w) => w.palabra !== current);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private patch(partial: Partial<GameState>): void {
    this.state.update((s) => ({ ...s, ...partial }));
  }
}

function playAlarm(): void {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);
    });
  } catch {
    // Sin soporte de audio: no pasa nada.
  }
}
