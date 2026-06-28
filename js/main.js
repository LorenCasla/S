// Motor principal: controla qué nivel se muestra y el paso al siguiente.
 
// Guarda datos elegidos durante el juego, para poder usarlos después en
// otros niveles (por ejemplo, la fecha elegida en "date-cards" se usa
// en la pantalla final de "¡Completaste el juego!").
const gameState = {
  fechaElegida: null
};
 
let currentLevelIndex = 0;
 
const questionText = document.getElementById("question-text");
const minigameArea = document.getElementById("minigame-area");
const welcomeScreen = document.getElementById("welcome-screen");
const levelScreen = document.getElementById("level-screen");
const btnEmpezar = document.getElementById("btn-empezar");
const finalScreen = document.getElementById("final-screen");
const finalText = document.getElementById("final-text");
 
function loadLevel(index) {
  const level = levels[index];
 
  if (!level) {
    // No hay más niveles: fin del juego. Ocultamos level-screen del todo
    // y mostramos la pantalla final independiente.
    levelScreen.classList.add("hidden");
    finalText.textContent = "¡Felicidades, te vas con el amor de tu vida, 1 semana a Valeria del Mar " + (gameState.fechaElegida || "...") + "! 🎉";
    finalScreen.classList.remove("hidden");
    return;
  }
 
  questionText.textContent = level.question;
 
  // Le ponemos una clase con el "type" del nivel actual (ej: "titulo-escape-button",
  // "titulo-dropdown-select", etc.), así en el CSS se puede personalizar el título
  // de cada tipo de mini-juego por separado, sin afectar a los demás.
  questionText.className = "titulo-" + level.type;

  // Acá se decide qué función de mini-juego usar según el "type" del nivel.
  // A medida que agreguemos más mini-juegos, sumamos un "case" más.
  switch (level.type) {
    case "escape-button":
      renderEscapeButton(level.data, minigameArea, onLevelComplete);
      break;
 
    case "dropdown-select":
      renderDropdownSelect(level.data, minigameArea, onLevelComplete);
      break;
 
    case "map-select":
      renderMapSelect(level.data, minigameArea, onLevelComplete);
      break;
 
    case "double-slot":
      renderDoubleSlot(level.data, minigameArea, onLevelComplete);
      break;
 
    case "date-cards":
      renderDateCards(level.data, minigameArea, onLevelComplete);
      break;
 
    case "word-search":
      renderWordSearch(level.data, minigameArea, onLevelComplete);
      break;
 
    case "hangman-chain":
      renderHangmanChain(level.data, minigameArea, onLevelComplete);
      break;
 
    case "riddle-clues":
      renderRiddleClues(level.data, minigameArea, onLevelComplete);
      break;
 
    case "transform-button":
      renderTransformButton(level.data, minigameArea, onLevelComplete);
      break;
 
    default:
      minigameArea.innerHTML = "<p>Tipo de mini-juego no reconocido: " + level.type + "</p>";
  }
}
 
function onLevelComplete() {
  currentLevelIndex++;
  loadLevel(currentLevelIndex);
}
 
btnEmpezar.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  levelScreen.classList.remove("hidden");
  loadLevel(currentLevelIndex);
});
   // questionText.textContent = "¡Felicidades, te vas con el amor de tu vida, 1 semana a Valeria del Mar " + (gameState.fechaElegida || "...") + "! 🎉";
