// Mini-juego: "escape-button"
// El botón "No" se desliza lejos del mouse cuando este se acerca.
// El botón "Sí" es fijo y al hacer click avanza de nivel.

function renderEscapeButton(levelData, container, onComplete) {
  container.innerHTML = "";

  const btnSi = document.createElement("button");
  btnSi.id = "btn-si";
  btnSi.className = "answer-btn";
  btnSi.textContent = levelData.yesText;

  const btnNo = document.createElement("button");
  btnNo.id = "btn-no";
  btnNo.className = "answer-btn";
  btnNo.textContent = levelData.noText;

  container.appendChild(btnSi);
  container.appendChild(btnNo);

  // Posición inicial del botón "No": cerca del centro, al lado del "Sí"
  let noX = container.clientWidth / 2 + 100;
  let noY = container.clientHeight / 2;
  positionButton(btnNo, noX, noY);

  const DISTANCIA_ESCAPE = 80; // radio (px) en el que el mouse "asusta" al botón
  const VELOCIDAD_ESCAPE = 120; // qué tan lejos salta cuando escapa

  function positionButton(btn, x, y) {
    // Centramos el botón en (x, y), respetando los límites del contenedor
    const w = btn.offsetWidth || 100;
    const h = btn.offsetHeight || 50;

    const maxX = container.clientWidth - w;
    const maxY = container.clientHeight - h;

    const clampedX = Math.max(0, Math.min(maxX, x - w / 2));
    const clampedY = Math.max(0, Math.min(maxY, y - h / 2));

    btn.style.left = clampedX + "px";
    btn.style.top = clampedY + "px";
  }

  function handleMouseMove(e) {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const btnRect = btnNo.getBoundingClientRect();
    const btnCenterX = btnRect.left - rect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top - rect.top + btnRect.height / 2;

    const dx = btnCenterX - mouseX;
    const dy = btnCenterY - mouseY;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia < DISTANCIA_ESCAPE) {
      // Dirección opuesta al mouse, normalizada
      let dirX = dx / (distancia || 1);
      let dirY = dy / (distancia || 1);

      let nuevoX = btnCenterX + dirX * VELOCIDAD_ESCAPE;
      let nuevoY = btnCenterY + dirY * VELOCIDAD_ESCAPE;

      // Si se va a ir muy afuera del contenedor, le damos una posición aleatoria válida
      const w = btnNo.offsetWidth;
      const h = btnNo.offsetHeight;
      if (nuevoX < w / 2 || nuevoX > container.clientWidth - w / 2 ||
          nuevoY < h / 2 || nuevoY > container.clientHeight - h / 2) {
        nuevoX = Math.random() * (container.clientWidth - w) + w / 2;
        nuevoY = Math.random() * (container.clientHeight - h) + h / 2;
      }

      positionButton(btnNo, nuevoX, nuevoY);
    }
  }

  container.addEventListener("mousemove", handleMouseMove);

  btnSi.addEventListener("click", () => {
    container.removeEventListener("mousemove", handleMouseMove);
    onComplete();
  });

  // Por si igual lo logran tocar (ej. con un click muy rápido), igual no avanza nada raro:
  btnNo.addEventListener("click", (e) => {
    e.preventDefault();
  });
}
