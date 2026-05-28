// Clase Gema: representa una gema coleccionable con animación flotante.
export default class Gema extends Phaser.Physics.Arcade.Sprite {
  /**
   * Crea una gema y configura su comportamiento visual.
   * @param {Phaser.Scene} scene Escena donde se instancia la gema.
   * @param {number} x Posición inicial en X.
   * @param {number} y Posición inicial en Y.
   */
  constructor(scene, x, y) {
    super(scene, x, y, "gema");

    this.scene = scene;

    // Registramos la gema en la escena y en físicas.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // La gema no debe verse afectada por gravedad ni desplazarse por colisiones.
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);

    // Escala visual para que el sprite se vea equilibrado en pantalla.
    this.setScale(0.75);

    // Animación de flotación para mejorar la legibilidad del coleccionable.
    scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 900 + Phaser.Math.Between(0, 220),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
}
