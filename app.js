let data = [];
// 🎨 Colores por mercado
const colores_mercado = {
    "Otros": "gray", "Obras Sanitarias": "blue", "Portuario": "cyan", "Editorial": "orange",
    "Retail": "green", "Alimentos": "sienna", "Farmacéutico": "purple", "Concesiones": "navy",
    "Alimento mascotas": "olive", "Telecomunicaciones": "red", "Financiero": "gold",
    "Entretenimiento": "pink", "Combustibles": "turquoise", "Educación": "lightblue",
    "Ropa y calzado": "chocolate", "Tabaco": "teal", "Juegos de Azar": "magenta",
    "Residuos": "brown", "Salud": "orchid", "Eléctrico": "deepskyblue",
    "Materiales de construcción": "coral", "Electrónica": "limegreen", "Transporte": "darkorange",
    "Juguetes": "indigo", "Vehículos Motorizados": "darkgreen", "Aeroportuario": "cadetblue",
    "Previsión Social": "mediumslateblue", "Computación": "tomato", "Bebidas": "mediumvioletred"
};

function capitalizar(texto) {
    if (!texto || typeof texto !== "string") return "";
    return texto
        .toLowerCase()
        .split(" ")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

function generarLeyendaColores() {
    const contenedor = document.querySelector("#leyenda-colores div");
    for (const [mercado, color] of Object.entries(colores_mercado)) {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.gap = "6px";
        item.style.padding = "4px 8px";
        item.style.border = "1px solid #ddd";
        item.style.borderRadius = "6px";
        item.style.background = "#f9f9f9";

        const cuadrado = document.createElement("div");
        cuadrado.style.width = "16px";
        cuadrado.style.height = "16px";
        cuadrado.style.backgroundColor = color;
        cuadrado.style.border = "1px solid #aaa";

        const texto = document.createElement("span");
        texto.textContent = mercado;

        item.appendChild(cuadrado);
        item.appendChild(texto);
        contenedor.appendChild(item);
    }
}


let top10Sentencias = [];

function calcularTop10() {
    const counts = {};
    data.forEach(d => {
        const b = d["Sentencia B"];
        counts[b] = (counts[b] || 0) + 1;
    });
    top10Sentencias = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([key]) => key);
}

document.getElementById("resetFiltersButton").addEventListener("click", () => {
    // Reiniciar selects a "Todos"
    document.getElementById("conductaFilter").value = "Todos";
    document.getElementById("mercadoFilter").value = "Todos";
    document.getElementById("tdlcFilter").value = "Todos";
    document.getElementById("anioFilter").value = "Todos";
    document.getElementById("sentenciaFilter").value = "Todos";

    // Reiniciar controles de física
    document.getElementById("gravityRange").value = -3000;
    document.getElementById("gravityValue").innerText = -3000;

    document.getElementById("springLengthRange").value = 150;
    document.getElementById("springLengthValue").innerText = 150;

    // Limpiar info del nodo
    document.getElementById("nodeInfoBox").innerHTML = "<em>Haz clic en un nodo para ver detalles.</em>";

    // Recalcular los filtros posibles y redibujar red
    actualizarFiltros();
    renderizarRed();
});


let allNodes = [], allEdges = [];
let network = null;

function cargarDatos() {
    fetch("red_sentencias.json")
        .then(res => res.json())
        .then(json => {
            data = json;
            calcularTop10();
            inicializarFiltros();
            renderizarRed();
        });
}


function inicializarFiltros() {
    const conductaSet = new Set();
    const mercadoSet = new Set();
    const tdlcSet = new Set();
    const anioSet = new Set();
    const sentenciaSet = new Set();


    data.forEach(d => {
        conductaSet.add(d["conducta1"]);
        mercadoSet.add(d["mercado"]);
        tdlcSet.add(d["tdlc_sentencia"]);
        anioSet.add(d["anio"]);
        sentenciaSet.add(d["Sentencia A"]);
    });

    llenarSelect("conductaFilter", ["Todos", ...Array.from(conductaSet).sort()]);
    llenarSelect("mercadoFilter", ["Todos", ...Array.from(mercadoSet).sort()]);
    llenarSelect("tdlcFilter", ["Todos", ...Array.from(tdlcSet).sort()]);
    llenarSelect("anioFilter", ["Todos", ...Array.from(anioSet).sort((a, b) => a - b)]);
    llenarSelect("sentenciaFilter", ["Todos", ...Array.from(sentenciaSet).sort((a, b) => a - b)]);
}

const filtros = ["conductaFilter", "mercadoFilter", "tdlcFilter", "anioFilter", "sentenciaFilter"];
filtros.forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
        actualizarFiltros();
        renderizarRed();
    });
});

function actualizarFiltros() {
    const cf = document.getElementById("conductaFilter").value;
    const mf = document.getElementById("mercadoFilter").value;
    const tf = document.getElementById("tdlcFilter").value;
    const af = document.getElementById("anioFilter").value;
    const sf = document.getElementById("sentenciaFilter").value;

    const baseFiltro = d =>
        (cf === "Todos" || d["conducta1"] === cf) &&
        (mf === "Todos" || d["mercado"] === mf) &&
        (tf === "Todos" || d["tdlc_sentencia"] === tf) &&
        (af === "Todos" || d["anio"].toString() === af.toString()) &&
        (sf === "Todos" || d["Sentencia A"] === sf);

    const filtrados = data.filter(baseFiltro);

    const nuevaConducta = new Set();
    const nuevoMercado = new Set();
    const nuevoTDLC = new Set();
    const nuevoAnio = new Set();
    const nuevaSentencia = new Set();

    filtrados.forEach(d => {
        nuevaConducta.add(d["conducta1"]);
        nuevoMercado.add(d["mercado"]);
        nuevoTDLC.add(d["tdlc_sentencia"]);
        nuevoAnio.add(d["anio"]);
        nuevaSentencia.add(d["Sentencia A"]);
    });

    // No activamos eventos onchange para evitar doble render
    llenarSelect("conductaFilter", ["Todos", ...Array.from(nuevaConducta).sort()]);
    llenarSelect("mercadoFilter", ["Todos", ...Array.from(nuevoMercado).sort()]);
    llenarSelect("tdlcFilter", ["Todos", ...Array.from(nuevoTDLC).sort()]);
    llenarSelect("anioFilter", ["Todos", ...Array.from(nuevoAnio).sort((a, b) => a - b)]);
    llenarSelect("sentenciaFilter", ["Todos", ...Array.from(nuevaSentencia).sort((a, b) => a - b)]);

    // Restaurar los valores seleccionados previamente
    document.getElementById("conductaFilter").value = cf;
    document.getElementById("mercadoFilter").value = mf;
    document.getElementById("tdlcFilter").value = tf;
    document.getElementById("anioFilter").value = af;
    document.getElementById("sentenciaFilter").value = sf;
}


function llenarSelect(id, valores) {
    const select = document.getElementById(id);
    select.innerHTML = "";

    const esAnio = id === "anioFilter";

    valores.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v;
        opt.textContent = esAnio ? v : capitalizar(v);
        if (v === "Todos") opt.selected = true;
        select.appendChild(opt);
    });

    select.onchange = renderizarRed;
}



function renderizarRed() {
    // Mostrar loader
    document.getElementById("loader").style.display = "block";

    // Hacer que la interfaz se actualice antes del procesamiento pesado
    setTimeout(() => {
        const cf = document.getElementById("conductaFilter").value;
        const mf = document.getElementById("mercadoFilter").value;
        const tf = document.getElementById("tdlcFilter").value;
        const af = document.getElementById("anioFilter").value;
        const sf = document.getElementById("sentenciaFilter").value;

        const filtro = d =>
            (cf === "Todos" || d["conducta1"] === cf) &&
            (mf === "Todos" || d["mercado"] === mf) &&
            (tf === "Todos" || d["tdlc_sentencia"] === tf) &&
            (af === "Todos" || d["anio"].toString() === af.toString()) &&
            (sf === "Todos" || d["Sentencia A"] === sf) &&
            (!top10Active || top10Sentencias.includes(d["Sentencia B"]));

        const filtrados = data.filter(filtro);

        const nodosSet = new Set();
        const edges = filtrados.map(d => {
            const from = d["Sentencia A"].toString();
            const to = d["Sentencia B"].toString();
            const freq = d["Frecuencia"] || 1;

            nodosSet.add(from);
            nodosSet.add(to);

            return {
                from: from,
                to: to,
                width: Math.min(Math.max(1, freq), 10),
                title: `N° de citas: ${freq}`,
                color: { color: `rgba(180, 180, 180, ${Math.min(0.2 + freq * 0.08, 0.8)})` }
            };
        });

        const nodes = Array.from(nodosSet).map(id => {
            const registro = data.find(d =>
                d["Sentencia A"].toString() === id || d["Sentencia B"].toString() === id
            );

            const mercado = registro?.mercado || "Otros";
            const color = colores_mercado[mercado] || "gray";

            const conducta = registro?.conducta1?.toLowerCase() || "";
            let shape = "ellipse";
            if (conducta.includes("abuso")) shape = "dot";
            else if (conducta.includes("colusión")) shape = "triangle";
            else if (conducta.includes("incumplimiento")) shape = "square";
            else shape = "diamond";

            return {
                id,
                label: id,
                color,
                shape,
                title: `Sentencia: ${id}\nConducta: ${registro?.conducta1 || "N/D"}\nMercado: ${mercado}`
            };
        });

        const container = document.getElementById("network");
        const gravity = parseInt(document.getElementById("gravityRange").value);
        const springLength = parseInt(document.getElementById("springLengthRange").value);

        const options = {
            nodes: { shape: "dot", size: 16, font: { size: 14 } },
            edges: { arrows: { to: { enabled: true } }, smooth: { type: "continuous" } },
            interaction: { hover: true },
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: gravity,
                    springLength: springLength
                }
            }
        };


        const dataRed = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges)
        };

        if (network) {
            network.setData(dataRed);
        } else {
            network = new vis.Network(container, dataRed, options);

            network.on("click", function (params) {
                const clickedNodeId = params.nodes[0];
                if (!clickedNodeId) return;

                // Mostrar info en el panel lateral
                const registro = data.find(
                    d => d["Sentencia A"].toString() === clickedNodeId || d["Sentencia B"].toString() === clickedNodeId
                );

                const infoBox = document.getElementById("nodeInfoBox");
                if (registro && infoBox) {
                    infoBox.innerHTML = `
  <strong>Sentencia:</strong> ${clickedNodeId}<br>
  <strong>Año:</strong> ${registro.anio || "No definido"}<br>
  <strong>Carátula:</strong> ${capitalizar(registro.caratula_tdlc) || "No disponible"}<br>
  <strong>Conducta:</strong> ${capitalizar(registro.conducta1) || "No definida"}<br>
  <strong>Mercado:</strong> ${capitalizar(registro.mercado) || "No definido"}<br>
  <strong>Resultado:</strong> ${capitalizar(registro.tdlc_sentencia) || "No definido"}<br>
  <strong>Ver sentencia:</strong>
  <a href="${registro.permalink}" target="_blank" class="link-primary">Enlace</a>
`;

                }


                // Opcional: aplicar filtro por sentencia si hace clic
                const tieneCitas = data.some(d => d["Sentencia A"].toString() === clickedNodeId);
                if (tieneCitas) {
                    const select = document.getElementById("sentenciaFilter");
                    select.value = clickedNodeId;
                    renderizarRed();
                }
            });

        }

        const infoBox = document.getElementById("info");
        if (infoBox) {
            infoBox.innerText = `Mostrando: ${nodes.length} nodos y ${edges.length} conexiones`;
        }

        // Ocultar loader al terminar
        document.getElementById("loader").style.display = "none";
    }, 50); // pequeño delay para asegurar que el loader aparezca
}

const controles = [
    { inputId: "gravityRange", valueId: "gravityValue" },
    { inputId: "springLengthRange", valueId: "springLengthValue" }
];

controles.forEach(({ inputId, valueId }) => {
    document.getElementById(inputId).addEventListener("input", () => {
        const value = document.getElementById(inputId).value;
        document.getElementById(valueId).innerText = value;

        if (network) {
            const gravity = parseInt(document.getElementById("gravityRange").value);
            const springLength = parseInt(document.getElementById("springLengthRange").value);

            network.setOptions({
                physics: {
                    barnesHut: {
                        gravitationalConstant: gravity,
                        springLength: springLength
                    }
                }
            });

            network.stabilize();
        }
    });
});



let top10Active = false;
document.getElementById("top10Button").addEventListener("click", () => {
    top10Active = !top10Active;
    const btn = document.getElementById("top10Button");
    btn.classList.toggle("active", top10Active);
    btn.innerText = top10Active ? "🔁 Ver todas las sentencias" : "⭐ Top 10 sentencias citadas";
    renderizarRed();
});

generarLeyendaColores();

cargarDatos();
