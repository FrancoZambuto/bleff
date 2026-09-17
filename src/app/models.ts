export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Word {
  palabra: string;
  definicion: string;
}

/**
 * setup   -> carga de jugadores y sorteo del lector
 * ready   -> el lector ve la palabra, todavía no corre el reloj
 * writing -> corre el contador, los jugadores escriben
 * scoring -> se asignan los puntos de la ronda
 */
export type Phase = 'setup' | 'ready' | 'writing' | 'scoring';

export interface GameState {
  phase: Phase;
  readerId: string | null;
  word: Word | null;
  usedWords: string[];
  round: number;
  endsAt: number | null;
}
