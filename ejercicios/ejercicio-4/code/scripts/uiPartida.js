// Utilidades de interfaz para la partida.

/**
 * Crea textos básicos de interfaz en la escena.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function crearUI(scene) {
  scene.uiPuntos = scene.add.text(10, 10, "", {
    fontSize: "24px",
    fill: "#fff",
  });
  scene.uiPuntos.setScrollFactor(0);

  scene.uiVidas = scene.add.text(10, 40, "", {
    fontSize: "24px",
    fill: "#fff",
  });
  scene.uiVidas.setScrollFactor(0);

  scene.uiEstado = scene.add.text(10, 70, "", {
    fontSize: "22px",
    fill: "#fff",
  });
  scene.uiEstado.setScrollFactor(0);

  actualizarTextoPuntos(scene);
  actualizarTextoVidas(scene);
}

/**
 * Refresca el contador de puntos.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function actualizarTextoPuntos(scene) {
  scene.uiPuntos.setText(`Puntos: ${scene.puntos} / ${scene.puntosParaGanar}`);
}

/**
 * Refresca el contador de vidas.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function actualizarTextoVidas(scene) {
  scene.uiVidas.setText(`Vidas: ${scene.vidas}`);
}
