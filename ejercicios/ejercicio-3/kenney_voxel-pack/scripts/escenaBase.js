import Jugador from "./jugador.js";
import Enemigo from "./enemigo.js";

export default class EscenaBase extends Phaser.Scene {
  constructor() {
    super({ key: "EscenaBase" });
  }

  preload() {
    this.load.atlasXML(
      "chars",
      "Spritesheets/spritesheet_characters.png",
      "Spritesheets/spritesheet_characters.xml"
    );

    this.load.atlasXML(
      "tiles",
      "Spritesheets/spritesheet_tiles.png",
      "Spritesheets/spritesheet_tiles.xml"
    );

    this.load.image("clouds", "PNG/Other/clouds.png");
    this.load.image("sun", "PNG/Other/sun.png");
  }

  create() {
    this.physics.world.setBounds(0, 0, 2600, 1500);

    this.add.rectangle(1300, 750, 2600, 1500, 0xc7e6ff);
    this.add.image(220, 120, "sun").setScale(0.55).setScrollFactor(0.1);

    for (let i = 0; i < 8; i += 1) {
      this.add
        .image(220 + i * 360, 170 + (i % 2) * 30, "clouds")
        .setScale(0.75)
        .setAlpha(0.7)
        .setScrollFactor(0.25);
    }

    this.plataformas = this.physics.add.staticGroup();

    for (let i = 0; i < 21; i += 1) {
      this.plataformas.create(i * 128 + 64, 1436, "tiles", "dirt_grass.png");
      this.plataformas.create(i * 128 + 64, 1564, "tiles", "dirt.png");
    }

    const posiciones = [
      [380, 1210],
      [510, 1080],
      [640, 950],
      [830, 1080],
      [960, 1210],
      [1180, 1020],
      [1310, 890],
      [1680, 1150],
      [1810, 1020],
      [2030, 940],
      [2160, 810],
      [2280, 680],
    ];

    posiciones.forEach(([x, y]) => {
      this.plataformas.create(x, y, "tiles", "stone_grass.png");
    });

    this.jugador = new Jugador(this, 160, 1200);
    this.enemigo = new Enemigo(this, 1180, 965, 1100, 1450);

    this.physics.add.collider(this.jugador, this.plataformas);
    this.physics.add.collider(this.enemigo, this.plataformas);
    this.physics.add.overlap(this.jugador, this.enemigo, this.tocarEnemigo, null, this);

    this.reiniciar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.cameras.main.setBounds(0, 0, 2600, 1500);
    this.cameras.main.startFollow(this.jugador);
    this.cameras.main.setZoom(0.95);

    this.gameOver = false;

    this.uiTexto = this.add
      .text(16, 16, "Cursores: mover | Arriba: saltar | R: reiniciar", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);

    this.uiEstado = this.add
      .text(16, 52, "", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffef65",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);
  }

  update() {
    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.reiniciar)) {
        this.scene.restart();
      }
      return;
    }

    this.jugador.update();
    this.enemigo.update();

    if (this.jugador.y > 1560) {
      this.tocarEnemigo();
    }
  }

  tocarEnemigo() {
    if (this.gameOver) {
      return;
    }

    this.gameOver = true;
    this.physics.pause();
    this.jugador.setTint(0xff5d5d);
    this.uiEstado.setText("Has perdido. Pulsa R para reiniciar.");
  }
}
