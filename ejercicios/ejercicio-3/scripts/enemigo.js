// Clase Enemigo: IA sencilla para enemigos con movimiento y salto aleatorios.
export default class Enemigo extends Phaser.Physics.Arcade.Sprite {
  /**
   * Crea un enemigo con rango de patrulla y comportamiento estocástico.
   * @param {Phaser.Scene} scene Escena donde se crea el enemigo.
   * @param {number} x Posición X inicial.
   * @param {number} y Posición Y inicial.
   * @param {number} minX Límite horizontal izquierdo del rango.
   * @param {number} maxX Límite horizontal derecho del rango.
   * @param {string} frame Frame del atlas de personajes a usar como sprite.
   * @param {number} [baseSpeed=85] Velocidad base para el movimiento horizontal.
   */
  constructor(scene, x, y, minX, maxX, frame, baseSpeed = 85) {
    super(scene, x, y, "chars", frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Ajustes físicos comunes.
    this.setCollideWorldBounds(true);
    this.setBounce(0.02);

    // Los enemigos ahora usan solo sprites tipo "head", así que unificamos escala/hitbox.
    this.setScale(0.9);
    this.body.setSize(54, 54).setOffset(5, 5);

    // Parámetros de navegación y estado.
    this.minX = minX;
    this.maxX = maxX;
    this.baseSpeed = baseSpeed;
    this.currentDirection = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    this.itemsCollected = 0;

    // Parámetros de salto aleatorio.
    this.jumpChancePerDecision = 0.22;
    this.minJumpSpeed = 260;
    this.maxJumpSpeed = 360;

    // Temporizador interno para decisiones periódicas.
    this.nextDecisionTime = 0;

    // Aplica movimiento inicial.
    this.applyRandomMovement();

    // Tween visual para reforzar sensación de movimiento.
    this.walkTween = scene.tweens.add({
      targets: this,
      y: this.y + 3,
      duration: 150,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /**
   * Calcula y aplica una nueva velocidad horizontal aleatoria dentro de un factor.
   * También programa el instante de la próxima decisión de IA.
   */
  applyRandomMovement() {
    const speedFactor = Phaser.Math.FloatBetween(0.65, 1.25);
    const randomSpeed = Math.round(this.baseSpeed * speedFactor);

    this.setVelocityX(this.currentDirection * randomSpeed);
    this.setFlipX(this.currentDirection < 0);

    this.nextDecisionTime = this.scene.time.now + Phaser.Math.Between(700, 1800);
  }

  /**
   * Intenta ejecutar un salto aleatorio.
   * Solo puede saltar si está en contacto con el suelo.
   */
  tryRandomJump() {
    const onFloor = this.body.blocked.down || this.body.touching.down;

    if (!onFloor) {
      return;
    }

    if (Math.random() < this.jumpChancePerDecision) {
      const jumpSpeed = Phaser.Math.Between(this.minJumpSpeed, this.maxJumpSpeed);
      this.setVelocityY(-jumpSpeed);
    }
  }

  /**
   * Bucle de IA del enemigo.
   * Gestiona rebote en límites y decisiones aleatorias de dirección/ritmo/salto.
   */
  update() {
    if (this.x <= this.minX) {
      this.currentDirection = 1;
      this.applyRandomMovement();
      this.tryRandomJump();
      return;
    }

    if (this.x >= this.maxX) {
      this.currentDirection = -1;
      this.applyRandomMovement();
      this.tryRandomJump();
      return;
    }

    if (this.scene.time.now >= this.nextDecisionTime) {
      if (Math.random() < 0.45) {
        this.currentDirection *= -1;
      }

      this.applyRandomMovement();
      this.tryRandomJump();
    }
  }
}

