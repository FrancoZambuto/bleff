import { Injectable, computed, effect, signal } from '@angular/core';
import { Player } from '../models';
import { loadJson, saveJson } from './storage';

const STORAGE_KEY = 'bleff.players';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  readonly players = signal<Player[]>(loadJson<Player[]>(STORAGE_KEY, []));
  readonly ranking = computed(() => [...this.players()].sort((a, b) => b.score - a.score));

  constructor() {
    effect(() => saveJson(STORAGE_KEY, this.players()));
  }

  add(name: string): boolean {
    const clean = name.trim();
    if (!clean) return false;
    const exists = this.players().some((p) => p.name.toLowerCase() === clean.toLowerCase());
    if (exists) return false;
    this.players.update((list) => [...list, { id: crypto.randomUUID(), name: clean, score: 0 }]);
    return true;
  }

  remove(id: string): void {
    this.players.update((list) => list.filter((p) => p.id !== id));
  }

  addPoints(points: Record<string, number>): void {
    this.players.update((list) => list.map((p) => ({ ...p, score: p.score + (points[p.id] ?? 0) })));
  }

  resetScores(): void {
    this.players.update((list) => list.map((p) => ({ ...p, score: 0 })));
  }

  clear(): void {
    this.players.set([]);
  }
}
