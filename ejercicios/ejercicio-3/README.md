# Ejercicio 3 - Juego de plataformas con Phaser

Este proyecto contiene un juego de plataformas creado con **Phaser 3** usando assets [del paquete `kenney_voxel-pack`](https://www.kenney.nl/assets/voxel-pack).

## Descripción general

El jugador controla un personaje que puede moverse y volar por un escenario con plataformas.
En el mapa hay **5 enemigos diferentes** que patrullan zonas concretas con comportamiento aleatorio.
También aparecen objetos coleccionables repartidos por el nivel.

- Si el jugador recoge **10 objetos**, gana la partida.
- Si un enemigo toca al jugador, se pierde.
- Si el jugador cae fuera del escenario, también se pierde.

## Mecánicas principales

- Movimiento lateral y vuelo al mantener pulsada la flecha arriba.
- Recolección de objetos con contador de progreso.
- Enemigos con IA sencilla: movimiento horizontal aleatorio, cambios de ritmo y saltos aleatorios de baja probabilidad.
- Los enemigos también pueden recoger objetos del mapa.
- Condiciones de victoria/derrota con reinicio de escena.

## Marcadores en pantalla (HUD)

Durante la partida se muestran tres bloques de información:

- **Instrucciones** de control.
- **Marcador del jugador**: `Recolectados: X / 10`.
- **Marcador de enemigos**: lista en tiempo real con cuántos objetos ha recogido cada enemigo.

Además, aparece un mensaje de estado al ganar o perder.

## Fondo degradado (atardecer)

El fondo de la escena se construye programáticamente en `scripts/escenaBase.js` con estos pasos:

1. Se crea un objeto `Graphics` temporal.
2. Se dibuja un rectángulo con `fillGradientStyle(...)` usando colores de atardecer (naranja arriba y morado abajo).
3. Se convierte ese dibujo en textura con `generateTexture("sunsetGradient", width, height)`.
4. Se añade al mundo como imagen de fondo (`this.add.image(...)`) y con `setDepth(-10)` para que quede detrás de todos los elementos jugables.
5. Se destruye el `Graphics` temporal porque ya no hace falta una vez creada la textura.

Este enfoque permite crear fondos personalizados sin depender de una imagen externa.

## Objetivo didáctico

Este ejercicio está pensado para practicar:

- Estructura modular de un juego en Phaser (`main`, escena, clases de entidades).
- Físicas Arcade (`gravity`, `collider`, `overlap`).
- Gestión de entrada por teclado.
- Cámara que sigue al jugador.
- Estado global del juego (jugando, ganado, perdido).
- IA básica de enemigos con decisiones aleatorias controladas.
- UI/HUD para mostrar información en tiempo real.
- Animaciones del jugador con atlas (`spr_player`) y animaciones de enemigos con tween.

## Controles

- `Flecha izquierda / derecha`: mover jugador.
- `Mantener flecha arriba`: volar.
- `R`: reiniciar la escena cuando hay victoria o derrota.

## Estructura del directorio

- `index.html`: punto de entrada web.
- `scripts/main.js`: configuración global de Phaser.
- `scripts/escenaBase.js`: lógica principal de la escena.
- `scripts/jugador.js`: clase del jugador (movimiento y animaciones del tema 8).
- `scripts/enemigo.js`: clase de enemigos (movimiento aleatorio, salto aleatorio y recolección).
- `assets/`: recursos usados por el juego.
- `kenney_voxel-pack/`: copia de respaldo del pack original (sin modificar).

## Ejecución

1. Abrir la carpeta `ejercicio-3` en VS Code.
2. Levantar un servidor local (por ejemplo, con Live Server).
3. Abrir `index.html` en el navegador.
