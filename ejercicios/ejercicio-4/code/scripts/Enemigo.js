// Clase Enemigo: representa un enemigo con movimiento autónomo horizontal.
export default class Enemigo extends Phaser.Physics.Arcade.Sprite {
  /**
   * Crea un enemigo y configura su comportamiento base.
   * @param {Phaser.Scene} scene Escena donde se instancia el enemigo.
   * @param {number} x Posición inicial en X.
   * @param {number} y Posición inicial en Y.
   * @param {string} textura Clave de textura del enemigo.
   */
  constructor(scene, x, y, textura) {
    super(scene, x, y, textura);

    this.scene = scene;

    // Registramos el sprite en escena y en físicas.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Ajustes físicos para desplazamiento por el nivel.
    this.setCollideWorldBounds(true);
    this.setBounce(1, 0);

    // Parámetros de movimiento autónomo.
    this.velocidadBase = 90;
    this.proximoCambioDireccion = scene.time.now + Phaser.Math.Between(1200, 2400);

    // Aplicamos una dirección inicial aleatoria.
    const direccionInicial = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    this.setVelocityX(this.velocidadBase * direccionInicial);
    this.setFlipX(direccionInicial > 0);
  }

  /**
   * Actualiza el movimiento del enemigo para simular desplazamiento "a voluntad".
   */
  update() {
    // Si llega el momento, cambiamos dirección de forma aleatoria.
    if (this.scene.time.now >= this.proximoCambioDireccion) {
      const nuevaDireccion = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
      this.setVelocityX(this.velocidadBase * nuevaDireccion);
      this.setFlipX(nuevaDireccion > 0);

      // Programamos el próximo instante de cambio.
      this.proximoCambioDireccion = this.scene.time.now + Phaser.Math.Between(900, 2100);
    }
  }
}
