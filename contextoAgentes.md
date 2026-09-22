Actúa como desarrollador senior especializado en React, Vite y JavaScript.

Desarrolla un videojuego académico frontend llamado **“CosmoShift: Misión Gravedad”**. El objetivo principal es demostrar correctamente los conceptos de React solicitados en la asignación: componentes, props, estados, hooks, React Router, consumo de datos mediante `db.json` y comunicación posterior con n8n.

NO utilices APIs externas. Utiliza únicamente `db.json` servido mediante `json-server`.

## 1. Estilo y concepto

CosmoShift es un videojuego 2D de plataformas con estética **pixel-art retro**, ambientado en una estación espacial dañada.

El jugador controla un astronauta que debe escapar utilizando como mecánica principal la inversión de gravedad.

Crear un astronauta original con apariencia pixel-art. No utilizar personajes ni recursos externos con copyright.

El juego debe sentirse como un videojuego funcional, no como una maqueta.

## 2. Motor de renderizado

NO utilizar HTML5 Canvas.

Utilizar elementos HTML/React con `position: absolute` dentro de un contenedor principal del juego.

El mapa debe construirse dinámicamente a partir de los datos obtenidos desde `db.json`.

Cada elemento del escenario debe ser un componente React reutilizable:

* Player
* Platform
* Crystal
* Trap
* Laser
* ExitPortal
* Switch

Implementar las colisiones mediante coordenadas, dimensiones y hitboxes sencillas.

La lógica debe ser estable y suficientemente fluida para un proyecto académico. No crear un motor físico innecesariamente complejo.

## 3. Controles

Implementar:

* `←` mover izquierda
* `→` mover derecha
* `↑` saltar
* `ESPACIO` invertir gravedad
* `P` pausar

El movimiento debe incluir:

* velocidad;
* aceleración básica;
* gravedad;
* salto;
* caída;
* colisiones;
* detección de suelo/techo.

El personaje debe poder desplazarse por el suelo y, al invertir la gravedad, por el techo.

Cuando se invierta la gravedad, el personaje debe girar visualmente 180°.

## 4. Flujo del juego

El flujo obligatorio es:

Inicio → Simulacro/Tutorial → Nivel 1 → Nivel 2 → Nivel 3 → Victoria

No permitir saltar niveles.

### Inicio

Mostrar:

* título CosmoShift: Misión Gravedad;
* astronauta pixel-art;
* botón Jugar;
* botón Instrucciones;
* campo para introducir nombre del jugador.

### Simulacro/Tutorial

Crear un pequeño escenario jugable que enseñe:

1. movimiento;
2. salto;
3. inversión de gravedad;
4. recolección de cristales;
5. portal de salida.

El tutorial debe ser interactivo, no únicamente texto.

### Nivel 1 — Primer Contacto

Introducir:

* movimiento;
* salto;
* gravedad;
* plataformas;
* pequeños abismos;
* 3 cristales;
* portal.

### Nivel 2 — Zona Inestable

Introducir:

* plataformas flotantes;
* láseres;
* obstáculos;
* saltos que requieran invertir gravedad;
* cristales en lugares más difíciles.

### Nivel 3 — El Desafío

Combinar:

* picos;
* láseres;
* plataformas;
* interruptores;
* puertas;
* cristales;
* zonas temporizadas;
* cambios consecutivos de gravedad.

## 5. Cristales

Cada nivel debe contener exactamente 3 cristales.

Los 3 cristales son obligatorios.

El portal debe permanecer bloqueado hasta obtener:

`3/3`

Mostrar el progreso en el HUD.

Al conseguir los tres, el portal cambia visualmente a estado desbloqueado.

## 6. Vidas

Cada nivel comienza con 3 vidas.

Mostrar en el HUD:

`❤️ ❤️ ❤️`

Las trampas, láseres y caída fuera del mapa hacen perder una vida.

Al llegar a 0 vidas mostrar Game Over con:

* causa;
* puntaje;
* tiempo;
* cristales;
* botón Reintentar;
* botón Menú.

## 7. Energía gravitacional

Crear una barra de energía.

Al invertir gravedad:

`100% → 0%`

La energía se recupera automáticamente después de 1.5 segundos.

También puede recuperarse al tocar una superficie sólida.

No permitir invertir gravedad cuando la energía esté agotada.

## 8. Colisiones

Implementar colisiones entre jugador y:

* paredes;
* suelo;
* techo;
* plataformas;
* picos;
* láseres;
* cristales;
* interruptores;
* portal.

En gravedad normal detectar apoyo sobre la parte superior.

En gravedad invertida detectar apoyo sobre la parte inferior.

Evitar que el personaje atraviese paredes o plataformas.

Utilizar hitboxes ligeramente menores para trampas cuando sea necesario para evitar muertes injustas.

## 9. Componentes

Crear componentes reutilizables como mínimo:

`Navbar.jsx`
`Player.jsx`
`GameMap.jsx`
`Platform.jsx`
`Crystal.jsx`
`Trap.jsx`
`Laser.jsx`
`ExitPortal.jsx`
`GameHUD.jsx`
`TutorialMessage.jsx`

Utilizar props correctamente.

Las listas deben utilizar `key` única y estable.

No colocar toda la lógica en `App.jsx`.

## 10. Estados y Hooks

Utilizar `useState` para:

* posición;
* velocidad;
* gravedad;
* vidas;
* cristales;
* energía;
* puntaje;
* tiempo;
* nivel;
* estado de partida;
* nombre.

Utilizar `useEffect` para:

* temporizador;
* movimiento/física;
* regeneración de energía;
* carga de niveles;
* detección de victoria;
* Game Over.

Utilizar `useRef` para referencias del jugador y cálculos de movimiento/colisión que no necesiten provocar renders innecesarios.

Nunca mutar directamente el estado. Utilizar siempre los setters.

## 11. React Router

Utilizar `react-router-dom`.

Crear:

`/`
`/tutorial`
`/nivel/:num`
`/victoria`
`/game-over`
`/puntajes`

Utilizar navegación mediante `Link` o navegación programática.

La ruta `/nivel/:num` debe determinar qué nivel cargar.

No permitir acceder directamente a un nivel bloqueado.

## 12. db.json

Crear un `db.json` compatible con `json-server`.

Utilizar esta estructura base:

{
"niveles": [
{
"id": 1,
"nombre": "Primer Contacto",
"descripcion": "Primer entrenamiento de gravedad",
"jugadorInicial": {
"x": 80,
"y": 300
},
"plataformas": [],
"cristales": [],
"trampas": [],
"lasers": [],
"interruptores": [],
"portal": {
"x": 820,
"y": 340
}
}
],
"puntajes": []
}

Crear los tres niveles completos dentro de `niveles`.

Agregar IDs únicos a plataformas, cristales, trampas, láseres e interruptores.

Los datos del escenario deben estar en `db.json`, no escritos directamente en los componentes.

El frontend debe utilizar:

`GET /niveles/:id`

para cargar un nivel.

Al finalizar una partida utilizar:

`POST /puntajes`

para guardar el resultado.

Crear:

`src/services/gameService.js`

para centralizar las peticiones.

Manejar estados de:

* loading;
* error;
* éxito.

Mostrar mensajes claros si `json-server` no está disponible.

IMPORTANTE: `db.json` debe contener únicamente datos/configuración. La lógica de movimiento, gravedad, colisiones, vidas, puntuación y reglas debe permanecer en React.

## 13. Puntuación

Calcular la puntuación considerando:

* nivel completado;
* cristales;
* vidas restantes;
* tiempo empleado.

Mostrar al finalizar:

* jugador;
* nivel;
* tiempo;
* cristales;
* vidas;
* puntuación.

Guardar el resultado mediante POST.

Crear `/puntajes` para consultar los resultados almacenados.

## 14. Diseño

Utilizar exclusivamente estética **pixel-art retro espacial**.

Crear:

* astronauta pixel-art;
* estación espacial dañada;
* fondos espaciales;
* estrellas;
* plataformas metálicas;
* cristales;
* picos;
* láseres;
* interruptores;
* puertas;
* portal;
* HUD retro;
* botones estilo arcade.

Evitar:

* glassmorphism;
* dashboards;
* tarjetas corporativas;
* diseños modernos genéricos;
* apariencia de aplicación administrativa.

El resultado debe parecer un videojuego retro.

## 15. Arquitectura

Mantener una estructura organizada:

src/
components/
pages/
routes/
services/
hooks/
assets/

Crear los archivos necesarios sin eliminar archivos funcionales existentes.

Separar responsabilidades correctamente.

## 16. Prioridad

Priorizar en este orden:

1. Juego funcional.
2. Movimiento.
3. Colisiones.
4. Inversión de gravedad.
5. Cristales y portal.
6. Vidas y Game Over.
7. Progresión de niveles.
8. GET desde db.json.
9. POST de puntajes.
10. React Router.
11. Diseño pixel-art.

No implementar todavía n8n ni webhook.

La integración con n8n se realizará posteriormente.

## 17. Regla fundamental

No crear solamente una interfaz visual.

El usuario debe poder jugar realmente:

* introducir su nombre;
* iniciar el tutorial;
* moverse;
* saltar;
* invertir gravedad;
* interactuar con el escenario;
* recoger los 3 cristales;
* evitar obstáculos;
* perder vidas;
* morir;
* reiniciar;
* completar niveles;
* desbloquear progresivamente los siguientes niveles;
* obtener puntuación;
* guardar el resultado en `db.json`.

Implementar primero una versión funcional completa y posteriormente mejorar detalles visuales sin romper la lógica existente.
