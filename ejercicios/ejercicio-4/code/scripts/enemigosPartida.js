import Enemigo from "./Enemigo.js";
import { terminarJuego } from "./estadoPartida.js";
import { actualizarTextoVidas } from "./uiPartida.js";

/**
 * Crea los enemigos del nivel y registra sus colisiones.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function crearEnemigos(scene) {
  scene.enemigos = scene.physics.add.group();

  const configuracionesEnemigos = [
    { x: 240, y: 120, textura: "roca_mala" },
    { x: 460, y: 100, textura: "roca_mala" },
    { x: 620, y: 120, textura: "bomba_mala" },
    { x: 320, y: 40, textura: "bomba_mala" },
  ];

  configuracionesEnemigos.forEach((configuracion) => {
    const enemigo = new Enemigo(scene, configuracion.x, configuracion.y, configuracion.textura);
    scene.enemigos.add(enemigo);
  });

  scene.physics.add.collider(scene.enemigos, scene.terreno);
  scene.physics.add.overlap(scene.jugador, scene.enemigos, () => tocarEnemigo(scene), null, scene);
}

/**
 * Actualiza el comportamiento autónomo de todos los enemigos.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function actualizarEnemigos(scene) {
  scene.enemigos.children.iterate((enemigo) => {
    if (enemigo && enemigo.update) {
      enemigo.update();
    }
  });
}

/**
 * Resta una vida al jugador cuando un enemigo lo toca.
 * @param {Phaser.Scene} scene Escena actual.
 */
export function tocarEnemigo(scene) {
  if (scene.juegoTerminado || scene.juegoGanado) {
    return;
  }

  if (scene.time.now - scene.tiempoUltimoGolpe < scene.inmunidadGolpeMs) {
    return;
  }

  scene.tiempoUltimoGolpe = scene.time.now;
  scene.vidas -= 1;
  actualizarTextoVidas(scene);

  scene.jugador.setTint(0xff8c8c);
  scene.time.delayedCall(180, () => {
    if (!scene.juegoTerminado && !scene.juegoGanado) {
      scene.jugador.clearTint();
    }
  });

  if (scene.vidas <= 0) {
    terminarJuego(scene);
  }
}
