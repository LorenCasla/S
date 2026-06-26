// Mini-juego: "word-search"
// Sopa de letras: arrastrar con el mouse para seleccionar palabras.
// Direcciones permitidas: horizontal, vertical y diagonal, siempre "hacia adelante"
// (izquierda→derecha, arriba→abajo), nunca invertidas.
// Al encontrar todas, se muestra una pantalla de resumen tipo lista y se avanza.

function renderWordSearch(levelData, container, onComplete) {
  container.innerHTML = "";

  const GRID_SIZE = levelData.gridSize || 12;
  const palabras = levelData.words.map((p) => p.toUpperCase());

  const grid = generarGrilla(palabras, GRID_SIZE);

  const wrapper = document.createElement("div");
  wrapper.className = "sopa-container";

  const contador = document.createElement("p");
  contador.className = "sopa-contador";

  let palabrasRestantes = palabras.length;
  function actualizarContador() {
    contador.textContent = "Busca " + palabrasRestantes + (palabrasRestantes === 1 ? " palabra" : " palabras");
  }
  actualizarContador();

  // --- Resumen por cantidad de letras (ej: "2x de 9 letras", "4x de 5 letras") ---
  // Se calcula automáticamente según las palabras reales del nivel, agrupando
  // por su longitud (sin contar espacios, por si alguna palabra tiene espacio).
  const gruposPorLargo = {}; // { 9: ["PELICULAS", "CUCHARITA"], 6: [...], ... }
  palabras.forEach((palabra) => {
    const largoSinEspacios = palabra.replace(/ /g, "").length;
    if (!gruposPorLargo[largoSinEspacios]) {
      gruposPorLargo[largoSinEspacios] = [];
    }
    gruposPorLargo[largoSinEspacios].push(palabra);
  });

  // Ordenamos los largos de mayor a menor, para mostrar primero las palabras más largas
  const largosOrdenados = Object.keys(gruposPorLargo)
    .map(Number)
    .sort((a, b) => b - a);

  const resumenLargosDiv = document.createElement("div");
  resumenLargosDiv.className = "sopa-resumen-largos";

  // Guardamos una referencia a cada línea de texto y a qué palabras corresponde,
  // así podemos tacharla cuando se encuentren TODAS las de ese grupo.
  const lineasPorLargo = []; // [{ largo, palabrasDelGrupo, elemento }]

  largosOrdenados.forEach((largo) => {
    const palabrasDelGrupo = gruposPorLargo[largo];
    const linea = document.createElement("p");
    linea.className = "sopa-linea-largo";
    linea.textContent = palabrasDelGrupo.length + "x de " + largo + " letras";
    resumenLargosDiv.appendChild(linea);
    lineasPorLargo.push({ largo: largo, palabrasDelGrupo: palabrasDelGrupo, elemento: linea });
  });

  function actualizarResumenLargos() {
    lineasPorLargo.forEach((grupo) => {
      const restantesDelGrupo = grupo.palabrasDelGrupo.filter((palabra) => {
        const entrada = grid.palabrasColocadas.find((p) => p.palabra === palabra);
        return !(entrada && entrada.encontrada);
      });

      if (restantesDelGrupo.length === 0) {
        // Ya se encontraron todas las de este largo: se tacha, manteniendo el último número (0)
        grupo.elemento.textContent = "0x de " + grupo.largo + " letras";
        grupo.elemento.classList.add("tachado");
      } else {
        // Actualiza el número a la cantidad que falta encontrar de este largo
        grupo.elemento.textContent = restantesDelGrupo.length + "x de " + grupo.largo + " letras";
      }
    });
  }

  const gridDiv = document.createElement("div");
  gridDiv.className = "sopa-grid";
  gridDiv.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 32px)`;

  // Guardamos cada celda con su posición, para poder consultarlas durante el arrastre
  const celdas = [];
  for (let fila = 0; fila < GRID_SIZE; fila++) {
    const filaCeldas = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const celda = document.createElement("div");
      celda.className = "sopa-celda";
      celda.textContent = grid.letras[fila][col];
      celda.dataset.fila = fila;
      celda.dataset.col = col;
      gridDiv.appendChild(celda);
      filaCeldas.push(celda);
    }
    celdas.push(filaCeldas);
  }

  wrapper.appendChild(contador);
  wrapper.appendChild(resumenLargosDiv);
  wrapper.appendChild(gridDiv);
  container.appendChild(wrapper);

  // --- Lógica de selección por arrastre ---
  let arrastrando = false;
  let inicioFila = null;
  let inicioCol = null;
  let celdasSeleccionadasActualmente = [];

  function limpiarSeleccionTemporal() {
    celdasSeleccionadasActualmente.forEach((c) => c.classList.remove("seleccionando"));
    celdasSeleccionadasActualmente = [];
  }

  // Devuelve la lista de celdas en línea recta entre (f1,c1) y (f2,c2),
  // solo si están alineadas en horizontal, vertical o diagonal exacta.
  function celdasEnLinea(f1, c1, f2, c2) {
    const deltaFila = f2 - f1;
    const deltaCol = c2 - c1;

    const esHorizontal = deltaFila === 0 && deltaCol !== 0;
    const esVertical = deltaCol === 0 && deltaFila !== 0;
    const esDiagonal = Math.abs(deltaFila) === Math.abs(deltaCol) && deltaFila !== 0;

    if (!esHorizontal && !esVertical && !esDiagonal) return [];

    const pasos = Math.max(Math.abs(deltaFila), Math.abs(deltaCol));
    const pasoFila = deltaFila === 0 ? 0 : deltaFila / Math.abs(deltaFila);
    const pasoCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);

    const resultado = [];
    for (let i = 0; i <= pasos; i++) {
      resultado.push({ fila: f1 + pasoFila * i, col: c1 + pasoCol * i });
    }
    return resultado;
  }

  function manejarInicio(fila, col) {
    arrastrando = true;
    inicioFila = fila;
    inicioCol = col;
    limpiarSeleccionTemporal();
    const celda = celdas[fila][col];
    celda.classList.add("seleccionando");
    celdasSeleccionadasActualmente = [celda];
  }

  function manejarMovimiento(fila, col) {
    if (!arrastrando) return;

    limpiarSeleccionTemporal();
    const linea = celdasEnLinea(inicioFila, inicioCol, fila, col);

    linea.forEach((pos) => {
      const celda = celdas[pos.fila][pos.col];
      celda.classList.add("seleccionando");
      celdasSeleccionadasActualmente.push(celda);
    });
  }

  function manejarFin() {
    if (!arrastrando) return;
    arrastrando = false;

    // Construimos la palabra formada por la selección actual
    const letrasSeleccionadas = celdasSeleccionadasActualmente
      .map((c) => c.textContent)
      .join("");

    const posiciones = celdasSeleccionadasActualmente.map((c) => ({
      fila: parseInt(c.dataset.fila),
      col: parseInt(c.dataset.col)
    }));

    verificarPalabra(letrasSeleccionadas, posiciones);
    limpiarSeleccionTemporal();
  }

  function verificarPalabra(letras, posiciones) {
    const palabraEncontrada = grid.palabrasColocadas.find((p) => {
      if (p.encontrada) return false;
      return p.palabra === letras;
    });

    if (palabraEncontrada) {
      palabraEncontrada.encontrada = true;
      posiciones.forEach((pos) => {
        celdas[pos.fila][pos.col].classList.add("encontrada");
      });

      palabrasRestantes--;
      actualizarContador();
      actualizarResumenLargos();

      if (palabrasRestantes === 0) {
        setTimeout(() => {
          mostrarResumenFinal(levelData, container, onComplete);
        }, 800);
      }
    }
  }

  // Eventos de mouse sobre cada celda
  for (let fila = 0; fila < GRID_SIZE; fila++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const celda = celdas[fila][col];

      celda.addEventListener("mousedown", (e) => {
        e.preventDefault();
        manejarInicio(fila, col);
      });

      celda.addEventListener("mouseenter", () => {
        manejarMovimiento(fila, col);
      });
    }
  }

  // El "soltar" se escucha en todo el documento, por si el mouse se suelta
  // fuera de una celda exacta.
  document.addEventListener("mouseup", manejarFin);

  // Limpieza: si este nivel se reemplaza por otro, dejamos de escuchar el mouseup global
  const observer = new MutationObserver(() => {
    if (!document.body.contains(gridDiv)) {
      document.removeEventListener("mouseup", manejarFin);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Genera una grilla de letras de GRID_SIZE x GRID_SIZE, colocando cada palabra
// en una posición y dirección aleatoria (horizontal, vertical o diagonal,
// siempre "hacia adelante"), reintentando si no entra sin pisar otra palabra.
function generarGrilla(palabras, GRID_SIZE) {
  const letras = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    letras.push(new Array(GRID_SIZE).fill(null));
  }

  // Direcciones agrupadas por categoría, para poder garantizar un mínimo de
  // palabras en cada una (horizontal, vertical, diagonal).
  const direccionesHorizontal = [{ df: 0, dc: 1 }];
  const direccionesVertical = [{ df: 1, dc: 0 }];
  const direccionesDiagonal = [
    { df: 1, dc: 1 },   // diagonal hacia abajo
    { df: -1, dc: 1 }   // diagonal hacia arriba
  ];

  const MIN_HORIZONTAL = 2;
  const MIN_VERTICAL = 2;
  const MIN_DIAGONAL = 3;

  const palabrasColocadas = [];

  // Ordenamos de la más larga a la más corta: las largas son más difíciles
  // de ubicar, conviene colocarlas primero cuando hay más espacio libre.
  const palabrasOrdenadas = [...palabras].sort((a, b) => b.length - a.length);

  // Armamos una lista de categorías, una por cada palabra, garantizando los
  // mínimos pedidos. Si hay más palabras que la suma de mínimos, el resto
  // se completa al azar entre las 3 categorías.
  const categorias = [];
  for (let i = 0; i < MIN_HORIZONTAL && categorias.length < palabrasOrdenadas.length; i++) {
    categorias.push("horizontal");
  }
  for (let i = 0; i < MIN_VERTICAL && categorias.length < palabrasOrdenadas.length; i++) {
    categorias.push("vertical");
  }
  for (let i = 0; i < MIN_DIAGONAL && categorias.length < palabrasOrdenadas.length; i++) {
    categorias.push("diagonal");
  }
  const categoriasPosibles = ["horizontal", "vertical", "diagonal"];
  while (categorias.length < palabrasOrdenadas.length) {
    categorias.push(categoriasPosibles[Math.floor(Math.random() * categoriasPosibles.length)]);
  }

  // Mezclamos el ORDEN de las categorías (no las palabras), así no son
  // siempre las palabras más largas las que terminan en horizontal, etc.
  for (let i = categorias.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categorias[i], categorias[j]] = [categorias[j], categorias[i]];
  }

  function direccionesDeCategoria(categoria) {
    if (categoria === "horizontal") return direccionesHorizontal;
    if (categoria === "vertical") return direccionesVertical;
    return direccionesDiagonal;
  }

  palabrasOrdenadas.forEach((palabra, indicePalabra) => {
    let colocada = false;
    let intentos = 0;
    const direccionesDeEstaPalabra = direccionesDeCategoria(categorias[indicePalabra]);

    while (!colocada && intentos < 200) {
      intentos++;
      const dir = direccionesDeEstaPalabra[Math.floor(Math.random() * direccionesDeEstaPalabra.length)];

      // Rango válido de fila de inicio, según si la palabra "baja", "sube" o se queda igual.
      let filaMin, filaMax;
      if (dir.df > 0) {
        // Baja: tiene que arrancar lo bastante arriba para no salirse por abajo
        filaMin = 0;
        filaMax = GRID_SIZE - dir.df * (palabra.length - 1);
      } else if (dir.df < 0) {
        // Sube: tiene que arrancar lo bastante abajo para no salirse por arriba
        filaMin = (palabra.length - 1) * Math.abs(dir.df);
        filaMax = GRID_SIZE;
      } else {
        // No cambia de fila (horizontal)
        filaMin = 0;
        filaMax = GRID_SIZE;
      }

      const colMax = GRID_SIZE - dir.dc * (palabra.length - 1);

      if (filaMax - filaMin <= 0 || colMax <= 0) continue;

      const filaInicio = filaMin + Math.floor(Math.random() * (filaMax - filaMin));
      const colInicio = Math.floor(Math.random() * colMax);

      // Verificamos que cada celda esté libre o tenga la misma letra que ya necesitamos
      let entra = true;
      for (let i = 0; i < palabra.length; i++) {
        const f = filaInicio + dir.df * i;
        const c = colInicio + dir.dc * i;
        const actual = letras[f][c];
        if (actual !== null && actual !== palabra[i]) {
          entra = false;
          break;
        }
      }

      if (entra) {
        for (let i = 0; i < palabra.length; i++) {
          const f = filaInicio + dir.df * i;
          const c = colInicio + dir.dc * i;
          letras[f][c] = palabra[i];
        }
        palabrasColocadas.push({ palabra: palabra, encontrada: false });
        colocada = true;
      }
    }

    // Si después de 200 intentos no entró en su categoría asignada (puede pasar
    // con palabras largas en grillas chicas), reintentamos sin esa restricción,
    // probando con cualquier dirección disponible, para no perder la palabra.
    if (!colocada) {
      const todasLasDirecciones = [...direccionesHorizontal, ...direccionesVertical, ...direccionesDiagonal];
      let intentosRespaldo = 0;

      while (!colocada && intentosRespaldo < 200) {
        intentosRespaldo++;
        const dir = todasLasDirecciones[Math.floor(Math.random() * todasLasDirecciones.length)];

        let filaMin, filaMax;
        if (dir.df > 0) {
          filaMin = 0;
          filaMax = GRID_SIZE - dir.df * (palabra.length - 1);
        } else if (dir.df < 0) {
          filaMin = (palabra.length - 1) * Math.abs(dir.df);
          filaMax = GRID_SIZE;
        } else {
          filaMin = 0;
          filaMax = GRID_SIZE;
        }

        const colMax = GRID_SIZE - dir.dc * (palabra.length - 1);
        if (filaMax - filaMin <= 0 || colMax <= 0) continue;

        const filaInicio = filaMin + Math.floor(Math.random() * (filaMax - filaMin));
        const colInicio = Math.floor(Math.random() * colMax);

        let entra = true;
        for (let i = 0; i < palabra.length; i++) {
          const f = filaInicio + dir.df * i;
          const c = colInicio + dir.dc * i;
          const actual = letras[f][c];
          if (actual !== null && actual !== palabra[i]) {
            entra = false;
            break;
          }
        }

        if (entra) {
          for (let i = 0; i < palabra.length; i++) {
            const f = filaInicio + dir.df * i;
            const c = colInicio + dir.dc * i;
            letras[f][c] = palabra[i];
          }
          palabrasColocadas.push({ palabra: palabra, encontrada: false });
          colocada = true;
        }
      }
    }

    // Si después de todos los intentos (con y sin restricción de categoría) no
    // entró, se omite. Esto sería muy improbable con una grilla de tamaño normal.
    if (!colocada) {
      console.warn("No se pudo colocar la palabra:", palabra);
    }
  });

  // Rellenamos las celdas vacías con letras aleatorias
  const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let f = 0; f < GRID_SIZE; f++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (letras[f][c] === null) {
        letras[f][c] = ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
      }
    }
  }

  return { letras: letras, palabrasColocadas: palabrasColocadas };
}

// Pantalla final del nivel: resumen tipo lista de todas las actividades.
function mostrarResumenFinal(levelData, container, onComplete) {
  container.innerHTML = "";

  const resumen = document.createElement("div");
  resumen.className = "resumen-actividades";

  const titulo = document.createElement("h2");
  titulo.textContent = levelData.summaryTitle || "¡Muy bien! Vamos a hacer todas estas cosas:";

  const lista = document.createElement("ul");
  levelData.words.forEach((palabra) => {
    const item = document.createElement("li");
    item.textContent = palabra;
    lista.appendChild(item);
  });

  resumen.appendChild(titulo);
  resumen.appendChild(lista);
  container.appendChild(resumen);

  setTimeout(() => {
    onComplete();
  }, 4000);
}