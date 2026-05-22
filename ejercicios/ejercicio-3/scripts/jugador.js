// Clase Jugador: controla al personaje principal (movimiento, salto y animaciones).
export default class Jugador extends Phaser.Physics.Arcade.Sprite {
  /**
   * Crea un jugador con físicas Arcade y animaciones basadas en el atlas del tema 8.
   * @param {Phaser.Scene} scene Escena donde se instancia el jugador.
   * @param {number} x Posición X inicial.
   * @param {number} y Posición Y inicial.
   */
  constructor(scene, x, y) {
    super(scene, x, y, "spr_player", "spr_depie1");

    this.scene = scene;

    // Registro del sprite en escena y en físicas.
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configuración física y visual básica del personaje.
    this.setCollideWorldBounds(true);
    this.setBounce(0.03);
    this.setScale(0.8);
    this.body.setSize(36, 58).setOffset(14, 6);

    // Mirada inicial hacia la derecha.
    this.setFlipX(false);

    // Entrada de teclado y parámetros de movimiento.
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.speed = 240;
    this.jumpSpeed = -430;

    // Fuerza de vuelo aplicada mientras se mantenga flecha arriba.
    this.flyAcceleration = 24;

    // Registro de animaciones locales.
    this.createAnimations();
  }

  /**
   * Crea las animaciones del jugador si todavía no existen en el gestor global.
   * Evita recrearlas en cada reinicio de escena.
   */
  createAnimations() {
    if (!this.scene.anims.exists("spr_andando")) {
      this.scene.anims.create({
        key: "spr_andando",
        frames: this.scene.anims.generateFrameNames("spr_player", {
          prefix: "spr_andando",
          start: 1,
          end: 2,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists("spr_depie")) {
      this.scene.anims.create({
        key: "spr_depie",
        frames: this.scene.anims.generateFrameNames("spr_player", {
          prefix: "spr_depie",
          start: 1,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!this.scene.anims.exists("spr_salto")) {
      this.scene.anims.create({
        key: "spr_salto",
        frames: this.scene.anims.generateFrameNames("spr_player", {
          prefix: "spr_salto",
          start: 1,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  /**
   * Bucle de actualización del jugador (se llama en cada frame desde la escena).
   * Gestiona movimiento horizontal, salto y modo "volar" al mantener flecha arriba.
   */
  update() {
    const onFloor = this.body.blocked.down || this.body.touching.down;

    // Movimiento horizontal y orientación visual.
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
      if (onFloor) {
        this.play("spr_andando", true);
      }
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
      if (onFloor) {
        this.play("spr_andando", true);
      }
    } else {
      this.setVelocityX(0);
      if (onFloor) {
        this.play("spr_depie", true);
      }
    }

    // Salto inicial al tocar suelo.
    if (this.cursors.up.isDown && onFloor) {
      this.setVelocityY(this.jumpSpeed);
      this.play("spr_salto", true);
    }

    // Modo vuelo: mientras se mantenga arriba pulsado, reducimos velocidad vertical.
    if (this.cursors.up.isDown) {
      const boostedVelocityY = this.body.velocity.y - this.flyAcceleration;
      this.setVelocityY(Math.max(boostedVelocityY, this.jumpSpeed));
      this.play("spr_salto", true);
    }

    // Si está en el aire, mantiene la animación de salto.
    if (!onFloor) {
      this.play("spr_salto", true);
    }
  }
}

