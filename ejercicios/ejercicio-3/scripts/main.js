import EscenaBase from "./escenaBase.js";

// Configuración global del juego Phaser.
// Aquí se define el tamaño del canvas, el motor de físicas y la escena inicial.
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: "#ffb27a",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false,
    },
  },
  scene: [EscenaBase],
};

// Punto de arranque de la aplicación: crea la instancia del juego.
new Phaser.Game(config);


