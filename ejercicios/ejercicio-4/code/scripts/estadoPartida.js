// Utilidades de estado global de la partida.

export function inicializarEstadoPartida(scene) {
  scene.juegoTerminado = false;
  scene.juegoGanado = false;

  scene.puntos = 0;
  scene.puntosParaGanar = 10;

  scene.vidas = 5;
  scene.tiempoUltimoGolpe = -1000;
  scene.inmunidadGolpeMs = 800;
}

export function procesarReinicioSiCorresponde(scene) {
  if (!scene.juegoTerminado && !scene.juegoGanado) {
    return false;
  }

  if (Phaser.Input.Keyboard.JustDown(scene.teclaReiniciar)) {
    scene.scene.restart();
  }

  return true;
}

export function ganarPartida(scene) {
  if (scene.juegoGanado || scene.juegoTerminado) {
    return;
  }

  scene.juegoGanado = true;
  scene.physics.pause();
  scene.jugador.setTint(0x88ff88);
}

export function terminarJuego(scene) {
  if (scene.juegoTerminado || scene.juegoGanado) {
    return;
  }

  scene.juegoTerminado = true;
  scene.physics.pause();
  scene.jugador.setTint(0xff4d4d);
}
