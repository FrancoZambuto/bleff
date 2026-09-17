import { Component, output } from '@angular/core';

@Component({
  selector: 'app-intro',
  template: `
    <section class="card">
      <h2>¿Cómo se juega?</h2>
      <p class="muted">
        Bleff es el juego del diccionario: gana quien mejor engaña… y quien mejor detecta el engaño.
      </p>

      <ol class="steps">
        <li>
          <strong>Armen la ronda.</strong> Carguen a todos los jugadores (mínimo 3) y sorteen quién es el
          primer lector.
        </li>
        <li>
          <strong>El lector elige la palabra.</strong> Solo él mira la palabra y su definición real, y la
          anota en un papel. Si alguien ya la conoce, puede pedir otra.
        </li>
        <li>
          <strong>A escribir.</strong> El lector dice la palabra en voz alta y arranca el reloj: todos tienen
          <strong>2 minutos</strong> para inventar una definición creíble en su papel.
        </li>
        <li>
          <strong>Lectura y votación.</strong> El lector junta los papeles, los mezcla con la definición real y
          los lee todos. Cada jugador vota la que cree verdadera.
        </li>
        <li>
          <strong>Puntos.</strong> Con los botones <span class="chip">+</span> y <span class="chip">−</span>
          se asignan los puntos de la ronda. <strong>El lector no suma puntos</strong> en su turno.
        </li>
        <li>
          <strong>Siguiente lector.</strong> El rol de lector pasa al siguiente jugador y se juega otra ronda.
          Gana quien tenga más puntos al terminar.
        </li>
      </ol>

      <div class="scoring">
        <h3>Puntaje sugerido</h3>
        <ul>
          <li><strong>+1</strong> por acertar la definición real.</li>
          <li><strong>+1</strong> por cada jugador que votó tu definición inventada.</li>
          <li><strong>+2</strong> si escribiste una definición correcta sin conocer la palabra.</li>
        </ul>
      </div>

      <button class="btn primary big full" (click)="continue.emit()">¡Entendido, a jugar! ➜</button>
    </section>
  `,
  styles: `
    .steps {
      padding-left: 1.25rem;
      display: grid;
      gap: 0.75rem;
      line-height: 1.5;
    }
    .steps li::marker {
      color: var(--accent);
      font-weight: 700;
    }
    .chip {
      display: inline-grid;
      place-items: center;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 1px solid var(--border);
      font-weight: 700;
    }
    .scoring {
      background: var(--surface-2);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin: 1.25rem 0;
    }
    .scoring h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    .scoring ul {
      margin: 0;
      padding-left: 1.25rem;
      line-height: 1.6;
    }
    .full {
      width: 100%;
    }
  `,
})
export class Intro {
  readonly continue = output<void>();
}
