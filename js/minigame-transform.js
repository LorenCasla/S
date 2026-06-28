// Mini-juego: "transform-button"
// Variante del botón que escapa: en vez de huir del mouse, el botón "No"
// se TRANSFORMA en "Sí" cuando el mouse está cerca, y vuelve a "No" cuando
// el mouse se aleja. El click solo avanza si en ese momento dice "Sí".
// Incluye un texto largo arriba (la propuesta/reflexión) y un aviso fijo abajo.
 
function renderTransformButton(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "1.5rem";
  wrapper.style.height = "100%";
  wrapper.style.width = "100%";
  wrapper.style.justifyContent = "center";
 
  const textoLargo = document.createElement("div");
  textoLargo.className = "texto-largo-final";
  textoLargo.textContent = levelData.longText;
 
  const botonesRow = document.createElement("div");
  botonesRow.style.position = "relative";
  botonesRow.style.display = "flex";
  botonesRow.style.gap = "1rem";
  botonesRow.style.height = "70px";
  botonesRow.style.alignItems = "center";
 
  const btnSi = document.createElement("button");
  btnSi.id = "btn-si";
  btnSi.className = "answer-btn";
  btnSi.textContent = levelData.yesText || "Sí";
 
  const btnNo = document.createElement("button");
  btnNo.id = "btn-no-transform";
  btnNo.className = "answer-btn";
  btnNo.textContent = levelData.noText || "No";
  btnNo.style.position = "static"; // a diferencia del escape-button, este NO se mueve por la pantalla
  btnNo.style.backgroundColor = "#e74c3c";
  btnNo.style.color = "white";
 
  botonesRow.appendChild(btnSi);
  botonesRow.appendChild(btnNo);
 
  const avisoCerrar = document.createElement("p");
  avisoCerrar.className = "aviso-cerrar-pagina";
  // Arranca vacío: este texto solo aparece si clickeás "No" mientras todavía dice "No"
  avisoCerrar.textContent = "";
 
  wrapper.appendChild(textoLargo);
  wrapper.appendChild(botonesRow);
  wrapper.appendChild(avisoCerrar);
  container.appendChild(wrapper);
 
  let transformadoEnSi = false;
 
  function activarSi() {
    transformadoEnSi = true;
    btnNo.textContent = levelData.yesText || "Sí";
    btnNo.style.backgroundColor = "#4CAF50";
  }
 
  function volverANo() {
    transformadoEnSi = false;
    btnNo.textContent = levelData.noText || "No";
    btnNo.style.backgroundColor = "#e74c3c";
  }
 
  // mouseenter/mouseleave detectan exactamente cuando el mouse entra o sale
  // del área real del botón (sus bordes), no una distancia aproximada.
  btnNo.addEventListener("mouseenter", activarSi);
  btnNo.addEventListener("mouseleave", volverANo);
 
  function avanzar() {
    btnNo.removeEventListener("mouseenter", activarSi);
    btnNo.removeEventListener("mouseleave", volverANo);
    onComplete();
  }
 
  btnSi.addEventListener("click", avanzar);
 
  btnNo.addEventListener("click", () => {
    // El botón "No" NUNCA avanza, sin importar si visualmente se ve como "Sí"
    // (eso es solo una transformación de apariencia, no cambia su función real).
    avisoCerrar.textContent = levelData.closeWarningText || "Si de verdad es un no, cerrar la página.";
  });
}