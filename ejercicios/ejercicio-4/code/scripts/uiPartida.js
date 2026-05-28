// Utilidades de interfaz de la partida.

/**
 * Crea textos de puntos y vidas, y los guarda en la escena.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function crearUI(scene) {
  scene.txtPuntos = scene.add.text(20, 20, "Puntos: 0", {
    fontSize: "20px",
    fill: "#fff",
  });
  scene.txtPuntos.setScrollFactor(0).setDepth(10000);

  scene.txtVidas = scene.add.text(20, 45, "Vidas: 5", {
    fontSize: "20px",
    fill: "#fff",
  });
  scene.txtVidas.setScrollFactor(0).setDepth(10000);
}

/**
 * Actualiza el texto de puntos.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function actualizarTextoPuntos(scene) {
  if (!scene.txtPuntos) {
    return;
  }

  scene.txtPuntos.setText(`Puntos: ${scene.puntos}`);
}

/**
 * Actualiza el texto de vidas.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function actualizarTextoVidas(scene) {
  if (!scene.txtVidas) {
    return;
  }

  scene.txtVidas.setText(`Vidas: ${scene.vidas}`);
}
