import Jugador from "./jugador.js";
import Enemigo from "./enemigo.js";

// Escena principal: gestiona carga de recursos, creación del nivel y reglas del juego.
export default class EscenaBase extends Phaser.Scene {
  /**
   * Constructor de la escena Phaser.
   * Define la key con la que Phaser identifica esta escena.
   */
  constructor() {
    super({ key: "EscenaBase" });
  }

  /**
   * Precarga de assets.
   * Se ejecuta una vez antes de create() y deja recursos listos en caché.
   */
  preload() {
    // Atlas de personajes de Kenney (enemigos).
    this.load.atlasXML(
      "chars",
      "assets/spritesheets/spritesheet_characters.png",
      "assets/spritesheets/spritesheet_characters.xml"
    );

    // Atlas de tiles para terreno y coleccionables.
    this.load.atlasXML(
      "tiles",
      "assets/spritesheets/spritesheet_tiles.png",
      "assets/spritesheets/spritesheet_tiles.xml"
    );

    // Atlas del jugador del tema 8.
    this.load.atlas("spr_player", "assets/player/spr_player.png", "assets/player/spr_player_atlas.json");

    // Elementos de decoración del fondo.
    this.load.image("clouds", "assets/other/clouds.png");
    this.load.image("sun", "assets/other/sun.png");
  }

  /**
   * Construcción de la escena.
   * Crea mundo, plataformas, jugador, enemigos, coleccionables, UI y colisiones.
   */
  create() {
    this.physics.world.setBounds(0, 0, 2600, 1500);

    // ----- Fondo de atardecer con degradado -----
    // Phaser no trae un "rectangle gradient" directo en esta API, así que:
    // 1) dibujamos un gradient en un objeto Graphics,
    // 2) lo convertimos a textura con generateTexture,
    // 3) lo usamos como Image gigante de fondo del mundo.
    const gradientGraphics = this.make.graphics({ x: 0, y: 0, add: false });

    // Relleno degradado vertical: arriba más claro (naranja) y abajo más profundo (morado).
    gradientGraphics.fillGradientStyle(
      0xffd089, // top-left
      0xffd089, // top-right
      0x8f4b7a, // bottom-left
      0x8f4b7a, // bottom-right
      1
    );
    gradientGraphics.fillRect(0, 0, 2600, 1500);

    // Guardamos el gradient en caché de texturas para reutilizarlo como sprite.
    gradientGraphics.generateTexture("sunsetGradient", 2600, 1500);
    gradientGraphics.destroy();

    // Colocamos el gradient como fondo y con profundidad baja para que quede detrás de todo.
    this.add.image(1300, 750, "sunsetGradient").setDepth(-10);

    // Sol con parallax suave (se mueve más lento que el mundo al desplazarse la cámara).
    this.add.image(220, 120, "sun").setScale(0.55).setScrollFactor(0.1);

    for (let i = 0; i < 8; i += 1) {
      this.add
        .image(220 + i * 360, 170 + (i % 2) * 30, "clouds")
        .setScale(0.75)
        .setAlpha(0.7)
        .setScrollFactor(0.25);
    }

    // Grupo estático de plataformas.
    this.plataformas = this.physics.add.staticGroup();

    // Suelo principal en dos capas.
    for (let i = 0; i < 21; i += 1) {
      this.plataformas.create(i * 128 + 64, 1436, "tiles", "dirt_grass.png");
      this.plataformas.create(i * 128 + 64, 1564, "tiles", "dirt.png");
    }

    // Posiciones de plataformas elevadas.
    const posiciones = [
      [380, 1210], [510, 1080], [640, 950], [830, 1080], [960, 1210],
      [1180, 1020], [1310, 890], [1680, 1150], [1810, 1020], [2030, 940],
      [2160, 810], [2280, 680],
    ];

    posiciones.forEach(([x, y]) => {
      this.plataformas.create(x, y, "tiles", "stone_grass.png");
    });

    // Jugador y colisión contra terreno.
    this.jugador = new Jugador(this, 160, 1200);
    this.physics.add.collider(this.jugador, this.plataformas);

    // Configuración de 5 enemigos distintos.
    const enemyConfigs = [
      { x: 1180, y: 965, minX: 1080, maxX: 1460, frame: "boar_head.png", speed: 85, name: "Boar" },
      { x: 560, y: 1010, minX: 400, maxX: 730, frame: "zombie_head.png", speed: 70, name: "Zombie" },
      { x: 1760, y: 970, minX: 1660, maxX: 1930, frame: "skeleton_head.png", speed: 80, name: "Skeleton" },
      { x: 2220, y: 620, minX: 2120, maxX: 2380, frame: "alien_head.png", speed: 75, name: "Alien" },
      { x: 910, y: 1160, minX: 760, maxX: 1020, frame: "gnome_head.png", speed: 65, name: "Hedgehog" },
    ];

    this.enemigos = this.add.group();
    this.enemySprites = [];

    // Instanciación de enemigos y colisiones asociadas.
    enemyConfigs.forEach((config) => {
      const enemigo = new Enemigo(
        this,
        config.x,
        config.y,
        config.minX,
        config.maxX,
        config.frame,
        config.speed
      );

      enemigo.enemyName = config.name;

      this.enemigos.add(enemigo);
      this.enemySprites.push(enemigo);

      this.physics.add.collider(enemigo, this.plataformas);
      this.physics.add.overlap(this.jugador, enemigo, this.tocarEnemigo, null, this);
    });

    // Objetivo de colección del jugador.
    this.playerCollected = 0;
    this.playerGoal = 10;

    // Grupo de objetos coleccionables sin gravedad.
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const collectibleFrames = [
      "mushroom_red.png",
      "mushroom_tan.png",
      "wheat_stage4.png",
      "rock_moss.png",
      "grass4.png",
    ];

    const collectiblePositions = [
      [280, 1320], [410, 1150], [550, 1020], [680, 890], [840, 1020],
      [980, 1150], [1120, 960], [1260, 830], [1400, 960], [1540, 1090],
      [1680, 1020], [1820, 890], [1960, 810], [2100, 680], [2240, 550],
      [2380, 1320], [2460, 1320], [1320, 1320], [900, 1320], [700, 1320],
      [500, 1320], [300, 960], [1600, 1320], [1900, 1320], [2200, 1320],
      [2300, 760], [1750, 1120], [1200, 1120], [1020, 820], [580, 1260],
    ];

    // Creación de coleccionables con animación flotante.
    collectiblePositions.forEach(([x, y], index) => {
      const frame = collectibleFrames[index % collectibleFrames.length];
      const item = this.collectibles.create(x, y, "tiles", frame);
      item.setScale(0.35);
      item.setData("collector", null);

      this.tweens.add({
        targets: item,
        y: y - 8,
        duration: 900 + (index % 5) * 80,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // Overlap para colección (jugador y enemigos).
    this.physics.add.overlap(this.jugador, this.collectibles, this.collectPlayerItem, null, this);

    this.enemySprites.forEach((enemigo) => {
      this.physics.add.overlap(enemigo, this.collectibles, this.collectEnemyItem, null, this);
    });

    // Entrada para reinicio de partida.
    this.reiniciar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // Cámara siguiendo al jugador.
    this.cameras.main.setBounds(0, 0, 2600, 1500);
    this.cameras.main.startFollow(this.jugador);
    this.cameras.main.setZoom(0.95);

    // Estado global de partida.
    this.gameOver = false;
    this.gameWon = false;

    // HUD: instrucciones.
    this.uiTexto = this.add
      .text(16, 16, "Cursores: mover | Mantener Arriba: volar | R: reiniciar", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);

    // HUD: progreso del jugador.
    this.uiRecolecta = this.add
      .text(16, 52, `Recolectados: 0 / ${this.playerGoal}`, {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#8fffa3",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);

    // HUD: marcador de enemigos.
    this.uiEnemigos = this.add
      .text(16, 88, this.getEnemyScoreboardText(), {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffd787",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);

    // HUD: mensajes de victoria/derrota.
    this.uiEstado = this.add
      .text(16, 165, "", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#ffef65",
        backgroundColor: "#00000099",
        padding: { x: 10, y: 6 },
      })
      .setScrollFactor(0);
  }

  /**
   * Bucle principal de la escena.
   * Actualiza jugador y enemigos mientras la partida esté activa.
   */
  update() {
    if (this.gameOver || this.gameWon) {
      if (Phaser.Input.Keyboard.JustDown(this.reiniciar)) {
        this.scene.restart();
      }
      return;
    }

    this.jugador.update();
    this.enemySprites.forEach((enemigo) => enemigo.update());

    if (this.jugador.y > 1560) {
      this.tocarEnemigo();
    }
  }

  /**
   * Construye el texto del marcador de enemigos para el HUD.
   * @returns {string} Texto con nombre y contador por enemigo.
   */
  getEnemyScoreboardText() {
    const lines = ["Enemigos (objetos recogidos):"];

    this.enemySprites.forEach((enemigo, index) => {
      lines.push(`${index + 1}. ${enemigo.enemyName}: ${enemigo.itemsCollected}`);
    });

    return lines.join("\n");
  }

  /**
   * Refresca el texto del marcador de enemigos en pantalla.
   */
  refreshEnemyScoreboard() {
    this.uiEnemigos.setText(this.getEnemyScoreboardText());
  }

  /**
   * Callback de overlap jugador-objeto.
   * Incrementa el contador del jugador y evalúa condición de victoria.
   * @param {Phaser.GameObjects.GameObject} player Referencia al jugador (no usada directamente).
   * @param {Phaser.Physics.Arcade.Sprite} item Objeto recolectable tocado.
   */
  collectPlayerItem(player, item) {
    if (!item.active || this.gameOver || this.gameWon) {
      return;
    }

    item.disableBody(true, true);
    item.setData("collector", "player");

    this.playerCollected += 1;
    this.uiRecolecta.setText(`Recolectados: ${this.playerCollected} / ${this.playerGoal}`);

    if (this.playerCollected >= this.playerGoal) {
      this.winGame();
    }
  }

  /**
   * Callback de overlap enemigo-objeto.
   * Suma al contador individual del enemigo y actualiza el marcador.
   * @param {Enemigo} enemy Enemigo que recoge el objeto.
   * @param {Phaser.Physics.Arcade.Sprite} item Objeto recolectable tocado.
   */
  collectEnemyItem(enemy, item) {
    if (!item.active || this.gameOver || this.gameWon) {
      return;
    }

    item.disableBody(true, true);
    item.setData("collector", "enemy");
    enemy.itemsCollected += 1;

    this.refreshEnemyScoreboard();
  }

  /**
   * Activa estado de victoria y congela físicas.
   */
  winGame() {
    if (this.gameWon || this.gameOver) {
      return;
    }

    this.gameWon = true;
    this.physics.pause();
    this.jugador.setTint(0x88ff88);
    this.uiEstado.setText("Has ganado: llegaste a 10 objetos. Pulsa R para reiniciar.");
  }

  /**
   * Activa estado de derrota y congela físicas.
   * Se llama cuando un enemigo toca al jugador o si cae del mapa.
   */
  tocarEnemigo() {
    if (this.gameOver || this.gameWon) {
      return;
    }

    this.gameOver = true;
    this.physics.pause();
    this.jugador.setTint(0xff5d5d);
    this.uiEstado.setText("Has perdido: un enemigo te tocó. Pulsa R para reiniciar.");
  }
}


