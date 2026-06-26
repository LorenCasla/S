// Mini-juego: "riddle-clues"
// Muestra una adivinanza (sin pistas). El jugador escribe la respuesta.
// Si falla, ahí sí se revela la primera pista; si vuelve a fallar, la
// siguiente, y así hasta agotar las pistas disponibles.
// La validación ignora mayúsculas/minúsculas y tildes.

function renderRiddleClues(levelData, container, onComplete) {
  container.innerHTML = "";

  const adivinanza = levelData.riddle; // el enunciado principal, sin pistas
  const pistas = levelData.clues; // array de pistas, se revelan de a una con cada fallo
  const respuestaCorrecta = normalizarTexto(levelData.answer);

  let pistasMostradas = 0; // cuántas pistas se llevan reveladas hasta ahora

  const wrapper = document.createElement("div");
  wrapper.className = "adivinanza-container";

  const pistaEl = document.createElement("p");
  pistaEl.className = "adivinanza-pista";

  const inputRow = document.createElement("div");
  inputRow.className = "adivinanza-input-row";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "adivinanza-input";
  input.placeholder = "Escribí tu respuesta";

  const btnAceptar = document.createElement("button");
  btnAceptar.id = "btn-adivinanza-aceptar";
  btnAceptar.textContent = "Aceptar";

  const errorEl = document.createElement("p");
  errorEl.className = "adivinanza-error";

  inputRow.appendChild(input);
  inputRow.appendChild(btnAceptar);

  wrapper.appendChild(pistaEl);
  wrapper.appendChild(inputRow);
  wrapper.appendChild(errorEl);
  container.appendChild(wrapper);

  // Arma el texto que se ve arriba: primero solo la adivinanza, y a medida
  // que se revelan pistas, se van agregando debajo (sin tapar la adivinanza).
  function actualizarTextoEnPantalla() {
    let texto = adivinanza;
    for (let i = 0; i < pistasMostradas; i++) {
      texto += "\n\nPista " + (i + 1) + ": " + pistas[i];
    }
    pistaEl.textContent = texto;
    pistaEl.style.whiteSpace = "pre-line"; // para que los \n se vean como salto de línea real
  }

  function intentarRespuesta() {
    const valor = normalizarTexto(input.value);

    if (!valor) {
      errorEl.textContent = "Escribí una respuesta antes de aceptar.";
      return;
    }

    if (valor === respuestaCorrecta) {
      mostrarCorrecto();
    } else {
      input.value = "";

      if (pistasMostradas < pistas.length) {
        pistasMostradas++;
        errorEl.textContent = "No es esa, acá va una pista.";
        actualizarTextoEnPantalla();
      } else {
        // Ya se mostraron todas las pistas disponibles: sigue intentando sin pistas nuevas
        errorEl.textContent = "No es esa, intentá de nuevo.";
      }
    }
  }

  btnAceptar.addEventListener("click", intentarRespuesta);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") intentarRespuesta();
  });

  function mostrarCorrecto() {
    wrapper.innerHTML = "";
    const correctoEl = document.createElement("p");
    correctoEl.className = "adivinanza-correcto";
    correctoEl.textContent = "¡Correcto!";
    wrapper.appendChild(correctoEl);

    setTimeout(() => {
      onComplete();
    }, 1800);
  }

  actualizarTextoEnPantalla();
}

// Pasa el texto a mayúsculas y le quita los acentos, para comparar sin
// importar tildes ni mayúsculas/minúsculas.
function normalizarTexto(texto) {
  return texto
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // elimina las marcas de acento
}
