import Jugador from "./Jugador.js";
import { inicializarEstadoPartida, procesarReinicioSiCorresponde } from "./estadoPartida.js";
import { crearEnemigos, actualizarEnemigos } from "./enemigosPartida.js";
import { crearGemas } from "./gemasPartida.js";
import { crearUI } from "./uiPartida.js";

// Escena del primer nivel: coordina el mapa y los sistemas de partida.
export default class EscenaNivel1 extends Phaser.Scene {
  /**
   * Constructor de la escena.
   * Registramos la clave para que Phaser pueda iniciarla.
   */
  constructor() {
    super("EscenaNivel1");
  }

  /**
   * Precarga de recursos.
   */
  preload() {
    this.load.image("tiles", "assets/tilemap_packed.png");
    this.load.tilemapTiledJSON("nivel1", "assets/nivel1.json");
    this.load.image("jugador_1", "assets/jugador_1.png");
    this.load.image("jugador_2", "assets/jugador_2.png");
    this.load.image("roca_mala", "assets/roca_mala.png");
    this.load.image("bomba_mala", "assets/bomba_mala.png");
    this.load.image("gema", "assets/gema.png");
    this.load.image("vida", "assets/vida.png");
  }

  /**
   * Creación de la escena.
   */
  create() {
    const mapa = this.make.tilemap({ key: "nivel1" });
    const tileset = mapa.addTilesetImage("tilemap_packed", "tiles", 18, 18, 1, 2);

    // Capa decorativa opcional sin colisiones.
    this.escenografia = mapa.createLayer("escenografia", tileset, 0, 0);

    // Capa jugable con colisión.
    this.terreno = mapa.createLayer("nivel1", tileset, 0, 0);
    this.terreno.setCollisionByExclusion([-1]);

    this.physics.world.gravity.y = 900;
    inicializarEstadoPartida(this);

    this.jugador = new Jugador(this, 60, 120);
    this.physics.add.collider(this.jugador, this.terreno);

    crearEnemigos(this);
    crearGemas(this);

    this.physics.world.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
    this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
    this.cameras.main.setZoom(3);
    this.cameras.main.setDeadzone(120, 60);
    this.cameras.main.startFollow(this.jugador, true, 0.08, 0.08);

    this.teclaReiniciar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    crearUI(this);
  }

  /**
   * Bucle principal de la escena.
   */
  update() {
    if (procesarReinicioSiCorresponde(this)) {
      return;
    }

    this.jugador.update();
    actualizarEnemigos(this);
  }
}
