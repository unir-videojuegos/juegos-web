// Clase Jugador: encapsula movimiento, salto y animación del protagonista.
export default class Jugador extends Phaser.Physics.Arcade.Sprite {
  /**
   * Crea el protagonista y prepara su configuración básica.
   * @param {Phaser.Scene} scene Escena donde se instancia el jugador.
   * @param {number} x Posición inicial en X.
   * @param {number} y Posición inicial en Y.
   */
  constructor(scene, x, y) {
    super(scene, x, y, "jugador_1");

    this.scene = scene;

    // Registramos el sprite en la escena y en el sistema de físicas.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración física del protagonista.
    this.setCollideWorldBounds(true);
    this.setBounce(0.02);

    // Entrada de teclado.
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.teclaEspacio = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Parámetros de movimiento horizontal y salto.
    this.velocidad = 160;
    this.fuerzaSalto = -360;

    // Creamos la animación local del protagonista.
    this.crearAnimaciones();
  }

  /**
   * Crea la animación de caminar solo si todavía no existe.
   */
  crearAnimaciones() {
    if (!this.scene.anims.exists("jugador_andando")) {
      this.scene.anims.create({
        key: "jugador_andando",
        frames: [{ key: "jugador_1" }, { key: "jugador_2" }],
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  /**
   * Bucle de actualización del protagonista.
   * Gestiona desplazamiento, orientación y salto.
   */
  update() {
    // Detectamos si está en contacto con el suelo.
    const enSuelo = this.body.blocked.down || this.body.touching.down;

    // Movimiento hacia la izquierda.
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.velocidad);
      this.setFlipX(false);

      // Reproducimos la animación solo cuando camina sobre el suelo.
      if (enSuelo) {
        this.play("jugador_andando", true);
      }
    }
    // Movimiento hacia la derecha.
    else if (this.cursors.right.isDown) {
      this.setVelocityX(this.velocidad);
      this.setFlipX(true);

      // Reproducimos la animación solo cuando camina sobre el suelo.
      if (enSuelo) {
        this.play("jugador_andando", true);
      }
    }
    // Sin entrada horizontal: detenemos al protagonista y dejamos su sprite base.
    else {
      this.setVelocityX(0);
      this.setTexture("jugador_1");
      this.anims.stop();
    }

    // Salto con flecha arriba o barra espaciadora, únicamente si está en el suelo.
    const quiereSaltar = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.teclaEspacio);
    if (quiereSaltar && enSuelo) {
      this.setVelocityY(this.fuerzaSalto);
    }
  }
}
