// Mini-juego: "date-cards"
// Muestra 3 tarjetas con rangos de fecha. El jugador elige UNA sola
// (puede cambiar de elección mientras no haya aceptado). Cualquiera que
// elija es válida: al tocar "Aceptar" simplemente avanza al siguiente nivel.
 
function renderDateCards(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const wrapper = document.createElement("div");
  wrapper.className = "fechas-container";
 
  const tarjetasDiv = document.createElement("div");
  tarjetasDiv.className = "fechas-tarjetas";
 
  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
 
  const btnAceptar = document.createElement("button");
  btnAceptar.id = "btn-aceptar-fecha";
  btnAceptar.textContent = "Aceptar";
 
  let opcionSeleccionada = null;
  const tarjetas = [];
 
  levelData.options.forEach((opcion) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "fecha-tarjeta";
    tarjeta.textContent = opcion;
 
    tarjeta.addEventListener("click", () => {
      // Deselecciona la anterior (si había otra elegida) y marca la nueva
      tarjetas.forEach((t) => t.classList.remove("seleccionada"));
      tarjeta.classList.add("seleccionada");
      opcionSeleccionada = opcion;
      errorMessage.textContent = "";
    });
 
    tarjetas.push(tarjeta);
    tarjetasDiv.appendChild(tarjeta);
  });
 
  wrapper.appendChild(tarjetasDiv);
  wrapper.appendChild(btnAceptar);
  wrapper.appendChild(errorMessage);
  container.appendChild(wrapper);
 
btnAceptar.addEventListener("click", () => {
  if (!opcionSeleccionada) {
    errorMessage.textContent = "Elegí una fecha antes de aceptar.";
    return;
  }

  gameState.fechaElegida = opcionSeleccionada;
  onComplete();
});
}
