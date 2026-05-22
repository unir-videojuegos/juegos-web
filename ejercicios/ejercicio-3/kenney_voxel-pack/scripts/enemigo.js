export default class Enemigo extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, minX, maxX) {
    super(scene, x, y, "chars", "boar_body.png");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.02);
    this.setScale(0.9);
    this.body.setSize(72, 56).setOffset(7, 16);

    this.speed = 85;
    this.minX = minX;
    this.maxX = maxX;

    this.setVelocityX(this.speed);
  }

  update() {
    if (this.x <= this.minX) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    } else if (this.x >= this.maxX) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    }
  }
}
