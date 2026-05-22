# Ejercicio 2 - Juego de memoria con Phaser

Este ejercicio implementa un juego de memoria (parejas) usando **Phaser 3**.

## Descripcion general

El juego carga un mazo de **10 cartas** (5 parejas), las mezcla aleatoriamente y las coloca en una cuadricula.
El jugador debe descubrir cartas de dos en dos para encontrar todas las parejas.

## Mecanicas principales

- Cada carta comienza mostrando el reverso.
- Al hacer clic, la carta se revela.
- Si hay dos cartas abiertas:
- Si coinciden, quedan marcadas como pareja.
- Si no coinciden, se ocultan de nuevo tras 1 segundo.
- La logica evita volver a abrir cartas ya pareadas.

## Objetivo didactico

Este ejercicio esta pensado para practicar:

- Estructura modular en Phaser (`main`, escena y clase de entidad).
- Carga de assets con `preload`.
- Creacion de objetos interactivos con eventos de puntero.
- Gestion de estado simple del juego (cartas abiertas y cartas pareadas).
- Uso de temporizadores con `time.delayedCall`.

## Controles

- `Click izquierdo`: revelar carta.

## Estructura del directorio

- `code/index.html`: punto de entrada web.
- `code/scripts/main.js`: configuracion global de Phaser.
- `code/scripts/EscenaMemoria.js`: logica principal del juego.
- `code/scripts/Carta.js`: clase de carta (revelar, ocultar y marcar pareja).
- `code/assets/`: imagenes de cartas y reverso.

## Ejecucion

1. Abrir la carpeta `ejercicio-2` en VS Code.
2. Levantar un servidor local en la carpeta `code` (por ejemplo, con Live Server).
3. Abrir `code/index.html` en el navegador.
