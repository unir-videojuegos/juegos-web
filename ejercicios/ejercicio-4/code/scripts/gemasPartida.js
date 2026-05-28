import Gema from "./Gema.js";
import { ganarPartida } from "./estadoPartida.js";
import { actualizarTextoPuntos } from "./uiPartida.js";

/**
 * Crea las gemas del nivel y registra su solapamiento con el jugador.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function crearGemas(scene) {
  scene.gemas = scene.add.group();

  const posicionesGemas = [
    [160, 80],
    [290, 80],
    [410, 80],
    [530, 80],
    [650, 80],
  ];

  posicionesGemas.forEach(([x, y]) => {
    const gema = new Gema(scene, x, y);
    scene.gemas.add(gema);
  });

  scene.physics.add.overlap(scene.jugador, scene.gemas, (jugador, gema) => recogerGema(scene, gema), null, scene);
}

/**
 * Gestiona la recogida de una gema y actualiza puntuación.
 * @param {Phaser.Scene} scene Escena actual.
 * @param {Phaser.Physics.Arcade.Sprite} gema Gema recogida.
 */
export function recogerGema(scene, gema) {
  if (!gema.active || scene.juegoTerminado || scene.juegoGanado) {
    return;
  }

  gema.disableBody(true, true);
  scene.puntos += 2;
  actualizarTextoPuntos(scene);

  if (scene.puntos >= scene.puntosParaGanar) {
    ganarPartida(scene);
  }
}
