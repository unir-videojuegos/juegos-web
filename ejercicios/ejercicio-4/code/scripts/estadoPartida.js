// Utilidades de estado global de la partida.

/**
 * Inicializa las variables de estado de la partida en la escena.
 * @param {Phaser.Scene} scene Escena que almacena el estado.
 */
export function inicializarEstadoPartida(scene) {
  scene.juegoTerminado = false;
  scene.juegoGanado = false;

  scene.puntos = 0;
  scene.puntosParaGanar = 10;

  scene.vidas = 5;
  scene.tiempoUltimoGolpe = -1000;
  scene.inmunidadGolpeMs = 800;
}

/**
 * Verifica si la escena está en estado final y debe permitir reinicio con R.
 * @param {Phaser.Scene} scene Escena actual.
 * @returns {boolean} true si la lógica normal debe detenerse.
 */
export function procesarReinicioSiCorresponde(scene) {
  if (!scene.juegoTerminado && !scene.juegoGanado) {
    return false;
  }

  if (Phaser.Input.Keyboard.JustDown(scene.teclaReiniciar)) {
    scene.scene.restart();
  }

  return true;
}

/**
 * Activa el estado de victoria.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function ganarPartida(scene) {
  if (scene.juegoGanado || scene.juegoTerminado) {
    return;
  }

  scene.juegoGanado = true;
  scene.physics.pause();
  scene.jugador.setTint(0x88ff88);
  scene.uiEstado.setText("Has ganado: alcanzaste 10 puntos. Pulsa R para reiniciar.");
}

/**
 * Activa el estado de derrota.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function terminarJuego(scene) {
  if (scene.juegoTerminado || scene.juegoGanado) {
    return;
  }

  scene.juegoTerminado = true;
  scene.physics.pause();
  scene.jugador.setTint(0xff4d4d);
  scene.uiEstado.setText("Juego terminado: te quedaste sin vidas. Pulsa R para reiniciar.");
}
