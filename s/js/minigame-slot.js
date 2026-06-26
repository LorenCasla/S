// Mini-juego: "double-slot"
// Dos columnas tipo "tragamonedas" que giran juntas con un solo botón.
// Cada columna gira por un tiempo fijo y se frena SIEMPRE en el resultado
// definido en levelData (resultNumber y resultUnit), sin importar el azar visual.
 
function renderDoubleSlot(levelData, container, onComplete) {
  container.innerHTML = "";
 
  const wrapper = document.createElement("div");
  wrapper.className = "ruleta-container";
 
  const ruletasWrapper = document.createElement("div");
  ruletasWrapper.className = "ruletas-wrapper";
 
  // Construimos la lista de valores que se van a "ver" girando en cada columna.
  // Se repite varias veces para que al girar se vea continuo y largo.
  const numeros = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const unidades = ["horas", "días", "semanas"];
 
  const columnaNumeros = crearColumna(numeros, "4", levelData.resultNumber.toString());
  const columnaUnidades = crearColumna(unidades, "horas", levelData.resultUnit);
 
  ruletasWrapper.appendChild(columnaNumeros.elemento);
  ruletasWrapper.appendChild(columnaUnidades.elemento);
 
  const btnGirar = document.createElement("button");
  btnGirar.id = "btn-girar-ruleta";
  btnGirar.textContent = "Girar";
 
  wrapper.appendChild(ruletasWrapper);
  wrapper.appendChild(btnGirar);
  container.appendChild(wrapper);
 
  btnGirar.addEventListener("click", () => {
    btnGirar.disabled = true;
    btnGirar.textContent = "Girando...";
 
    girarColumna(columnaNumeros, 2200);
    girarColumna(columnaUnidades, 2700); // un poco más de tiempo, para que no frenen exactamente juntas
 
    // Esperamos a que termine el giro más largo, y ahí mostramos el resultado final
    setTimeout(() => {
      mostrarResultado(levelData, wrapper, onComplete);
    }, 2900);
  });
}
 
// Crea una columna de la ruleta: repite la lista de valores varias veces,
// y la deja posicionada de forma que el valor de INICIO quede en el centro
// al cargar, y el valor de RESULTADO quede en el centro al terminar de girar.
function crearColumna(valores, valorInicio, valorResultado) {
  const ITEM_HEIGHT = 56; // tiene que coincidir con .ruleta-item { height: 56px; } del CSS
  const REPETICIONES = 8; // cuántas veces se repite la lista completa, para que la tira sea larga
 
  const columnaDiv = document.createElement("div");
  columnaDiv.className = "ruleta-columna";
 
  const tira = document.createElement("div");
  tira.className = "ruleta-tira";
 
  const listaCompleta = [];
  for (let i = 0; i < REPETICIONES; i++) {
    valores.forEach((v) => listaCompleta.push(v));
  }
 
  listaCompleta.forEach((valor) => {
    const item = document.createElement("div");
    item.className = "ruleta-item";
    item.textContent = valor;
    tira.appendChild(item);
  });
 
  columnaDiv.appendChild(tira);
 
  // Índice de inicio: la primera aparición del valor de inicio en la lista.
  const indexInicio = valores.indexOf(valorInicio);
 
  // Índice final: una repetición "tardía" donde aparece el valor de resultado,
  // así la tira recorre un buen trecho antes de llegar (se ve como que gira en serio).
  const indexEnUnaVuelta = valores.indexOf(valorResultado);
  const repeticionObjetivo = REPETICIONES - 2;
  const indexFinal = repeticionObjetivo * valores.length + indexEnUnaVuelta;
 
  tira.style.transform = `translateY(${-indexInicio * ITEM_HEIGHT}px)`;
 
  return {
    elemento: columnaDiv,
    tira: tira,
    itemHeight: ITEM_HEIGHT,
    indexFinal: indexFinal
  };
}
 
// Anima la tira para que se desplace hasta el índice final calculado en crearColumna,
// donde el valor de resultado queda exactamente debajo del marcador central.
function girarColumna(columna, duracionMs) {
  const offsetFinal = -columna.indexFinal * columna.itemHeight;
 
  columna.tira.style.transition = `transform ${duracionMs}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
  columna.tira.style.transform = `translateY(${offsetFinal}px)`;
}
 
function mostrarResultado(levelData, wrapper, onComplete) {
  const resultadoTexto = document.createElement("p");
  resultadoTexto.className = "resultado-ruleta-texto";
  resultadoTexto.textContent = "¡Te vas " + levelData.resultNumber + " " + levelData.resultUnit + "!";
  wrapper.appendChild(resultadoTexto);
 
  setTimeout(() => {
    onComplete();
  }, 3000);
}