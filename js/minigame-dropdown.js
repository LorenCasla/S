// Mini-juego: "dropdown-select"
// Muestra una lista desplegable de nombres. Solo uno es correcto.
// Si elige mal: mensaje de error genérico, puede reintentar.
// Si elige bien: pantalla de "¡Correcto!" y después de unos segundos avanza solo.
 
function renderDropdownSelect(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const wrapper = document.createElement("div");
  wrapper.className = "dropdown-container";
 
  const select = document.createElement("select");
 
  // Opción inicial vacía, para que no arranque con un nombre ya seleccionado
  const optionDefault = document.createElement("option");
  optionDefault.value = "";
  optionDefault.textContent = "-- Seleccionar --";
  optionDefault.disabled = true;
  optionDefault.selected = true;
  select.appendChild(optionDefault);
 
  levelData.options.forEach((nombre) => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    select.appendChild(option);
  });
 
  const btnAceptar = document.createElement("button");
  btnAceptar.id = "btn-aceptar";
  btnAceptar.textContent = "Aceptar";
 
  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
 
  wrapper.appendChild(select);
  wrapper.appendChild(btnAceptar);
  wrapper.appendChild(errorMessage);
  container.appendChild(wrapper);
 
  btnAceptar.addEventListener("click", () => {
    if (!select.value) {
      errorMessage.textContent = "Tenés que elegir a alguien primero.";
      return;
    }
 
    if (select.value === levelData.correctAnswer) {
      showCorrectScreen(levelData, container, onComplete);
    } else {
      errorMessage.textContent = levelData.errorText || "Esa no es, intentá de nuevo.";
    }
  });
}
 
function showCorrectScreen(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const correctScreen = document.createElement("div");
  correctScreen.className = "correct-screen";
  correctScreen.innerHTML = "<h2>" + (levelData.correctText || "¡Correcto!") + "</h2>";
 
  container.appendChild(correctScreen);
 
  // Espera unos segundos y avanza sola al siguiente mini-juego
  setTimeout(() => {
    onComplete();
  }, 3000); // 2000ms = 2 segundos. Cambiá este número si querés más o menos espera.
}