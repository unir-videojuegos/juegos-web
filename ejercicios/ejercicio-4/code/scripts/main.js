import EscenaNivel1 from "./EscenaNivel1.js";

// Configuración global de Phaser para este ejercicio.
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#1d2330",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [EscenaNivel1],
};

// Punto de entrada: crea la instancia del juego.
new Phaser.Game(config);
