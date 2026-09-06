# Concurrente · Una ciudad, seis juegos

Abrí **landing.html** con doble clic. Es el entregable completo: imágenes, estilos, sonidos sintetizados y código están incorporados en un único archivo de aproximadamente 10 MB. Funciona por `file://`, sin internet, servidor, instalación ni librerías externas.

Si tenías abierta la primera versión, recargá la pestaña para ver el rediseño.

## Los juegos

| Juego | Qué hacés | Qué representa |
| --- | --- | --- |
| El barbero dormilón | Arrastrás clientes desde la calle al sillón o a una de tres sillas; cortás al ritmo con Espacio. A activa la coordinación automática. | Un servidor exclusivo, cola limitada, espera y despertar. |
| La cena que no empieza | Arrastrás tenedores hasta los filósofos vecinos. Cada uno come con dos y después los devuelve. | Recursos exclusivos, retención, espera circular y orden de adquisición. |
| La fábrica de datos | Conducís una carretilla con WASD/flechas; E carga en el muelle y entrega en la cinta. También podés tocar destinos. | Productor, consumidor, búfer circular y semáforos llenos/vacíos. |
| El puente bloqueado | Seleccionás un auto bloqueado y usás R para retroceder; controlás la entrada con el semáforo. | Interbloqueo, reversión y prevención mediante admisión. |
| La bóveda del mutex | Observás la actualización perdida, activás M y entregás la llave a cada cajero arrastrándola o con 1/2. | Protección de toda la secuencia leer–sumar–escribir y dueño del mutex. |
| Parking con permisos | Arrastrás el primer auto a una plaza libre o abrís la barrera con Espacio. A activa el semáforo automático. | Capacidad de tres permisos, wait, signal y cola FIFO. |

Todos tienen una misión, tiempo restante, estados visibles, devolución de eventos, pausa y reinicio. El sonido es opcional y empieza apagado. La simulación se pausa al cambiar de pestaña. «Ampliar» solicita pantalla completa al navegador. El progreso guarda solamente misiones ganadas y funciona también cuando no hay almacenamiento disponible, aunque en ese caso no persiste.

En pantallas táctiles se puede arrastrar o tocar origen y destino. En la fábrica hay navegación por toques y botones de destino. Para exponer, una pantalla amplia permite ver mejor el escenario y los estados laterales.

## Recorrido sugerido para defender el trabajo

1. Dejá entrar clientes en la barbería y mostrales al grupo cómo se despierta el barbero y se ocupan las sillas. Activá la coordinación y compará con la asignación manual. Espacio en la franja verde acelera los cortes.
2. En la cena, pulsá «Todos toman el izquierdo». Nadie podrá comer. Retirá los tenedores o activá el orden seguro y repartí de menor a mayor ID. Explicá por qué se rompe la espera circular.
3. En la fábrica, dejá al robot sin cajas: espera. Después abastecé la cinta. Cada inserción y extracción actualiza los contadores visibles.
4. En el puente, esperá el encuentro de los autos. Hacé retroceder uno y explicá qué recurso devuelve. El semáforo previene los siguientes encuentros, pero no revierte un bloqueo ya formado.
5. En la bóveda, dejá correr la primera ronda sin mutex. Ambos cajeros leen el mismo valor y una escritura pisa a la otra. Activá M, entregá la llave a uno y esperá su devolución antes de entregarla al otro.
6. En el parking, llená los tres lugares y observá la espera del cuarto auto. Una salida permite admitir al siguiente. Las plazas reservadas por autos que maniobran también consumen permisos.
7. Terminá con el desafío de seis preguntas. La terminal y el planificador son actividades adicionales.

## Alcance conceptual

Son simulaciones educativas animadas, no hilos reales del sistema operativo. La fábrica representa inserciones y extracciones atómicas protegidas. La coordinación automática de la barbería representa la política de admisión y las señales que atienden la cola. Los permisos del parking se muestran como cantidad disponible no negativa.

Basado en **Clase 4.pptx**. Se corrigió el ejemplo SRTF de la diapositiva 12: en t = 4 a P2 le queda 1 unidad y P3 requiere 2. P2 continúa hasta 5; después P3 ejecuta de 5 a 7 y P1 de 7 a 11.

Los comandos de la terminal son ejemplos habituales de Linux y no se ejecutan en la computadora. La presentación no enumera los comandos exactos del documento del práctico. El planificador compara el ejemplo FCFS/SJF y los apuntes también explican monitores y estados de procesos.

## Arte y archivos fuente

Arte generado mediante la herramienta integrada `image_gen`, guardado localmente e incorporado al HTML:

- `assets/characters.png`: hoja de 24 personajes y objetos; incluye al barbero, cinco clientes, cinco filósofos, mozo, sillas, carretilla, robot, cajas, autos, llave, tenedor y plato.
- `assets/poses.png`: hoja de 18 poses adicionales: clientes sentados, cuadros de caminata y barbero cortando.
- `assets/city.png`: ilustración de la ciudad para la portada.
- `assets/PROMPTS.md`: prompts completos y referencia visual utilizada.
- `src/game.js`: lógica, animación e interacción de los seis juegos.
- `src/style.css` y `src/template.html`: presentación y estructura.
- `build.py`: recompone el HTML autónomo usando solamente la biblioteca estándar de Python.

Para reconstruir después de editar los fuentes:

```sh
python3 build.py
```

## Validación

Se probaron las seis misiones completas en Chrome mediante Playwright, con el contexto del navegador sin conexión. Se comprobó arrastrar un cliente con el mouse, bloqueo y recuperación, actualizaciones perdidas y rondas protegidas, progreso persistente, pausa, quiz, terminal y diseño a 390 px. No hubo errores JavaScript ni solicitudes HTTP/HTTPS.

`tests/browser.cjs` requiere Playwright solo para desarrollo; la página no lo necesita. Se puede indicar una instalación existente con `PLAYWRIGHT_PATH` y un navegador con `CHROME_PATH`. Las capturas de prueba se escriben en `/tmp/concurrente-*.png`.
