// Mini-juego: "map-select"
// El jugador hace click en cualquier parte de la imagen del mapa: aparece un pin ahí.
// El botón "Aceptar" está visible desde el principio.
// Si toca "Aceptar" sin haber elegido un punto, se le avisa que falta elegir.
// Al aceptar (con un punto elegido), ese pin se desliza hacia el destino FIJO definido
// en levelData (sin importar dónde haya clickeado), y se muestra el nombre del lugar real.

function renderMapSelect(levelData, container, onComplete) {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "map-wrapper";

  const img = document.createElement("img");
  img.src = levelData.imageSrc;
  img.alt = "Mapa del mundo";

  wrapper.appendChild(img);
  container.appendChild(wrapper);

  const btnAceptar = document.createElement("button");
  btnAceptar.id = "btn-aceptar-mapa";
  btnAceptar.textContent = "Aceptar";
  container.appendChild(btnAceptar);

  const errorMessage = document.createElement("p");
  errorMessage.id = "error-message";
  container.appendChild(errorMessage);

  let pinElegido = null;
  let yaElegido = false;

  // Calcula la posición del pin en % sobre el WRAPPER, a partir de un punto
  // que está en % sobre la IMAGEN (que puede ser más chica que el wrapper
  // si queda espacio vacío a los costados).
  function posicionEnWrapper(percentXSobreImg, percentYSobreImg) {
    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    const pixelXSobreImg = (percentXSobreImg / 100) * imgRect.width;
    const pixelYSobreImg = (percentYSobreImg / 100) * imgRect.height;

    const offsetX = imgRect.left - wrapperRect.left;
    const offsetY = imgRect.top - wrapperRect.top;

    const percentXFinal = ((offsetX + pixelXSobreImg) / wrapperRect.width) * 100;
    const percentYFinal = ((offsetY + pixelYSobreImg) / wrapperRect.height) * 100;

    return { x: percentXFinal, y: percentYFinal };
  }

  // Click en la imagen: coloca (o reubica) el pin elegido por el jugador.
  // Solo cambia la posición del pin, nunca mueve la imagen ni el contenedor.
  img.addEventListener("click", (e) => {
    if (yaElegido) return; // una vez aceptado, no se puede seguir clickeando

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const percentXSobreImg = (clickX / rect.width) * 100;
    const percentYSobreImg = (clickY / rect.height) * 100;
    const pos = posicionEnWrapper(percentXSobreImg, percentYSobreImg);

    if (!pinElegido) {
      pinElegido = document.createElement("div");
      pinElegido.className = "map-pin pin-elegido";
      wrapper.appendChild(pinElegido);
    }

    errorMessage.textContent = "";
    pinElegido.style.left = pos.x + "%";
    pinElegido.style.top = pos.y + "%";
  });

  btnAceptar.addEventListener("click", () => {
    if (yaElegido) return;

    if (!pinElegido) {
      errorMessage.textContent = "Elegí un lugar en el mapa antes de aceptar.";
      return;
    }

    yaElegido = true;
    errorMessage.textContent = "";
    moverPinADestino(levelData, pinElegido, wrapper, img, btnAceptar, onComplete);
  });
}

function moverPinADestino(levelData, pinElegido, wrapper, img, btnAceptar, onComplete) {
  btnAceptar.disabled = true;

  // Las coordenadas FIJAS de destino están en píxeles sobre la imagen ORIGINAL del archivo.
  // Las convertimos primero a % sobre la imagen, y de ahí a % sobre el wrapper.
  const percentXSobreImg = (levelData.destX / levelData.imageWidth) * 100;
  const percentYSobreImg = (levelData.destY / levelData.imageHeight) * 100;

  const wrapperRect = wrapper.getBoundingClientRect();
  const imgRect = img.getBoundingClientRect();

  const pixelXSobreImg = (percentXSobreImg / 100) * imgRect.width;
  const pixelYSobreImg = (percentYSobreImg / 100) * imgRect.height;

  const offsetX = imgRect.left - wrapperRect.left;
  const offsetY = imgRect.top - wrapperRect.top;

  const percentX = ((offsetX + pixelXSobreImg) / wrapperRect.width) * 100;
  const percentY = ((offsetY + pixelYSobreImg) / wrapperRect.height) * 100;

  // Pequeña espera para que se note el "viaje" desde donde clickeó hasta el destino real
  setTimeout(() => {
    pinElegido.classList.remove("pin-elegido");
    pinElegido.classList.add("pin-destino");
    pinElegido.style.left = percentX + "%";
    pinElegido.style.top = percentY + "%";
  }, 200);

  // Cuando termina la animación (coincide con la transición CSS de 1.2s), mostramos el texto
  // flotando sobre el mapa, sin agregar espacio nuevo abajo (así no se mueve el layout)
  setTimeout(() => {
    const destinoTexto = document.createElement("p");
    destinoTexto.className = "destino-texto";
    destinoTexto.textContent = "¡Buena eleccion! Elegiste " + levelData.destinoNombre + "!";
    wrapper.appendChild(destinoTexto);

    // Esperamos un poco más mostrando el resultado, y recién ahí avanzamos
    setTimeout(() => {
      onComplete();
    }, 3000);
  }, 1600);
}
