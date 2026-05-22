export default class Jugador extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "chars", "male_head.png");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0.03);
    this.setScale(1.1);
    this.body.setSize(48, 56).setOffset(8, 6);

    this.speed = 240;
    this.jumpSpeed = -430;
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(this.jumpSpeed);
    }
  }
}
