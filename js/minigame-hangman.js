// Mini-juego: "hangman-chain"
// Encadena varias palabras de ahorcado, una después de la otra, en la misma
// pantalla. Se juega con el teclado. 6 errores permitidos por palabra: si se
// agotan, esa palabra se reinicia (vuelve a empezar desde cero, sin avanzar).
// Cuando termina la última palabra, se avanza al siguiente nivel del juego.
 
const HANGMAN_MAX_ERRORES = 6;
 
function renderHangmanChain(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const rondas = levelData.rounds; // [{ question: "...", word: "SUSHI" }, { ... }]
  let rondaActual = 0;
 
  function cargarRonda(index) {
    if (index >= rondas.length) {
      // Se completaron todas las palabras encadenadas: fin del nivel
      document.removeEventListener("keydown", manejarTecla);
      onComplete();
      return;
    }
 
    const ronda = rondas[index];
    const palabra = ronda.word.toUpperCase();
    const letrasAdivinadas = new Set();
    letrasAdivinadas.add(" "); // el espacio en blanco no se "adivina", ya cuenta como resuelto desde el inicio
    let errores = 0;
    let rondaTerminada = false;
 
    container.innerHTML = "";
 
    const wrapper = document.createElement("div");
    wrapper.className = "ahorcado-container";
 
    const preguntaEl = document.createElement("p");
    preguntaEl.className = "ahorcado-pregunta";
    preguntaEl.textContent = ronda.question;
 
    const dibujoEl = crearSVGAhorcado();
 
    const palabraEl = document.createElement("div");
    palabraEl.className = "ahorcado-palabra";
 
    const intentosEl = document.createElement("p");
    intentosEl.className = "ahorcado-intentos";
 
    wrapper.appendChild(preguntaEl);
    wrapper.appendChild(dibujoEl.svg);
    wrapper.appendChild(palabraEl);
    wrapper.appendChild(intentosEl);
    container.appendChild(wrapper);
 
    function actualizarPalabraEnPantalla() {
      palabraEl.innerHTML = "";
      palabra.split("").forEach((letra) => {
        const casillero = document.createElement("div");
 
        if (letra === " ") {
          // El espacio se muestra como un hueco vacío, sin el subrayado de "letra por adivinar"
          casillero.className = "ahorcado-espacio";
        } else {
          casillero.className = "ahorcado-letra-casillero";
          casillero.textContent = letrasAdivinadas.has(letra) ? letra : "";
        }
 
        palabraEl.appendChild(casillero);
      });
    }
 
    function actualizarIntentos() {
      intentosEl.textContent = "Errores: " + errores + " / " + HANGMAN_MAX_ERRORES;
    }
 
    function palabraCompleta() {
      return palabra.split("").every((letra) => letrasAdivinadas.has(letra));
    }
 
    function mostrarBienYContinuar() {
      rondaTerminada = true;
      const mensajeBien = document.createElement("p");
      mensajeBien.className = "ahorcado-mensaje-bien";
      mensajeBien.textContent = "¡Bien!";
      wrapper.appendChild(mensajeBien);
 
      setTimeout(() => {
        rondaActual++;
        cargarRonda(rondaActual);
      }, 1500);
    }
 
    function reiniciarRonda() {
      // Pequeña pausa para que se note el dibujo completo del ahorcado antes de reiniciar
      rondaTerminada = true;
      setTimeout(() => {
        cargarRonda(index); // recarga la MISMA ronda desde cero
      }, 1200);
    }
 
    function procesarLetra(letra) {
      if (rondaTerminada) return;
 
      letra = letra.toUpperCase();
      if (letra < "A" || letra > "Z") return; // ignoramos teclas que no sean letras
      if (letrasAdivinadas.has(letra)) return; // ya la había probado
 
      if (palabra.includes(letra)) {
        letrasAdivinadas.add(letra);
        actualizarPalabraEnPantalla();
 
        if (palabraCompleta()) {
          mostrarBienYContinuar();
        }
      } else {
        errores++;
        actualizarIntentos();
        dibujoEl.dibujarError(errores);
 
        if (errores >= HANGMAN_MAX_ERRORES) {
          reiniciarRonda();
        }
      }
    }
 
    // Guardamos la función de esta ronda en una variable accesible desde el listener global
    manejarTeclaActual = procesarLetra;
 
    actualizarPalabraEnPantalla();
    actualizarIntentos();
  }
 
  // Listener de teclado único, redirige siempre a la función de la ronda activa
  let manejarTeclaActual = () => {};
  function manejarTecla(e) {
    manejarTeclaActual(e.key);
  }
  document.addEventListener("keydown", manejarTecla);
 
  cargarRonda(rondaActual);
}
 
// Crea el dibujo SVG del ahorcado y devuelve funciones para ir revelando
// cada parte a medida que se cometen errores (1 a 6).
function crearSVGAhorcado() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 160 180");
  svg.classList.add("ahorcado-dibujo");
 
  // Soporte (horca) - siempre visible, no cuenta como error
  const soporte = `
    <line x1="20" y1="170" x2="100" y2="170" />
    <line x1="40" y1="170" x2="40" y2="20" />
    <line x1="40" y1="20" x2="110" y2="20" />
    <line x1="110" y1="20" x2="110" y2="40" />
  `;
  svg.innerHTML = soporte;
 
  // Partes que se van agregando con cada error, en orden
  const partes = [
    `<circle cx="110" cy="55" r="15" />`,                     // 1. cabeza
    `<line x1="110" y1="70" x2="110" y2="115" />`,             // 2. cuerpo
    `<line x1="110" y1="80" x2="90" y2="100" />`,              // 3. brazo izquierdo
    `<line x1="110" y1="80" x2="130" y2="100" />`,             // 4. brazo derecho
    `<line x1="110" y1="115" x2="95" y2="145" />`,             // 5. pierna izquierda
    `<line x1="110" y1="115" x2="125" y2="145" />`             // 6. pierna derecha
  ];
 
  function dibujarError(numeroError) {
    const parte = partes[numeroError - 1];
    if (parte) {
      svg.innerHTML += parte;
    }
  }
 
  return { svg, dibujarError };
}