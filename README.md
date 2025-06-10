# 🔍 Red Interactiva de Sentencias del TDLC

Este proyecto es una herramienta web interactiva para visualizar la red de citas entre sentencias del Tribunal de Defensa de la Libre Competencia (TDLC) de Chile. Permite explorar conexiones entre fallos, identificar los más citados, y filtrar por diversas características como año, conducta, mercado y resultado.

## 📁 Estructura del Proyecto

```
RED_SENTENCIAS_TDLC/
│
├── app.js               # Lógica JavaScript de la red y filtros
├── index.html           # Interfaz web con estructura Bootstrap y vis.js
└── red_sentencias.json  # Fuente de datos con relaciones entre sentencias
```

## 🛠️ Tecnologías Usadas

- **HTML5 + Bootstrap 5**: Para el diseño responsivo y estructuración de la interfaz.
- **JavaScript**: Para la lógica de interacción, visualización y filtros.
- **[vis-network.js](https://visjs.github.io/vis-network/)**: Para renderizar la red de nodos y aristas.
- **JSON**: Fuente de datos con información de sentencias.

## 🎯 Funcionalidades Principales

- Visualización dinámica de la red de sentencias.
- Filtros por:
  - Conducta
  - Mercado
  - Resultado del fallo
  - Número de sentencia
  - Año
- Ajustes interactivos:
  - Gravedad entre nodos
  - Distancia entre nodos
- Simbología de formas para conductas y colores según mercado.
- Botón para ver el **Top 10 de sentencias más citadas**.
- Información detallada al hacer clic sobre un nodo.

## ▶️ Disponibilidad

https://red-sentencias-tdlc.vercel.app/

## 🧠 Datos

El archivo `red_sentencias.json` contiene objetos con relaciones del tipo:

```json
{
  "Sentencia A": "XXX",
  "Sentencia B": "YYY",
  "Frecuencia": 1,
  "anio": 2020,
  "conducta1": "Colusión",
  "mercado": "Telecomunicaciones",
  "tdlc_sentencia": "Acoge",
  "caratula_tdlc": "Caso relevante",
  "permalink": "https://..."
}
```

## 📌 Consideraciones

- El proyecto extrajo citas de 203 sentencias dictadas en causas contenciosas por el TDLC hasta el 09 de junio de 2025.

## 📄 Autores

- Juan Pablo Iglesias: https://www.linkedin.com/in/juan-pablo-iglesias-mujica-020b4a203/
- Antonia Fernández: https://www.linkedin.com/in/antofdz/
- Daniel Albornoz: https://www.linkedin.com/in/daniel-albornoz-mu%C3%B1oz-73a4182ba/
