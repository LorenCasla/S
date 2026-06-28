// Acá van TODAS las preguntas del juego, en orden.
// Cada nivel tiene: el tipo de mini-juego, la pregunta, y los datos que ese mini-juego necesita.
 
const levels = [
  {
    type: "escape-button", // tipo de mini-juego
    question: "¿Te gustaría tener una salida?",
    data: {
      yesText: "Sí",
      noText: "No"
    }
  },
 
  {
    type: "dropdown-select",
    question: "¿Con quién queres ir?",
    data: {
      options: ["Channing Tatum", "Conrad", "Niall Horan", "Zac Efron","Michael Clifford", "Dylan O'Brien", "Justin Bieber", "Anakin Skywalker", "Lorenzo Abecian", "Adam Sandler", "Andy Black", "Jeremiah", "Lit Killah", "Logan de BTR", "Logan Lerman", "Machine Gun Kelly", "Yungblud", "Alex Andersen", "Alexander Ludwig", "Guido Sardelli", "Belmont Cameli", "Nicholas Galitzine", "Jacob Elordi"], // <-- esta lista es la que aparece en el desplegable
      correctAnswer: "Lorenzo Abecian", // <-- tiene que decir EXACTAMENTE igual a una de las opciones de arriba
      errorText: "No puede, se esta cogiendo a otra y no te ama.",
      correctText: "Si puede, te ama demasiado."
    }
  },
 

  {
    type: "map-select",
    question: "¿A dónde te gustaría ir?",
    data: {
      imageSrc: "assets/mapa-mundo.jpg",
      imageWidth: 1500,   // ancho real del archivo .jpg actual
      imageHeight: 995,   // alto real del archivo .jpg actual
      destX: 450,         // posición X del pin de destino, en píxeles sobre esa imagen
      destY: 855,         // posición Y del pin de destino, en píxeles sobre esa imagen
      destinoNombre: "Valeria del Mar, Argentina"
    }
  },

  {
    type: "double-slot",
    question: "¿Cuánto tiempo te vas a ir?",
    data: {
      resultNumber: 1,
      resultUnit: "semanas"
    }
  },

  {
    type: "date-cards",
    question: "¿Cuándo querés ir?",
    data: {
      options: ["Del 10/07 al 19/07", "Del 17/07 al 26/07", "Del 24/07 al 02/08"]
    }
  },

  {
  type: "word-search",
  question: "¿Qué vamos a hacer?",
  data: {
    words: ["Pasear", "Playa", "Coger", "Comer", "Peliculas", "Jugar", "Cucharita", "Siesta"],
    gridSize: 12,
    summaryTitle: "¡Muy bien! Vamos a hacer todas estas cosas:"
  }
},

{
  type: "hangman-chain",
  question: "¿Qué hay para comer?",
  data: {
    rounds: [
      { word: "SUSHI CASERO" },
    ]
  }
},

{
  type: "riddle-clues",
  question: "¿Qué vamos a ir comer?",
  data: {
    riddle: "Empiezo salada pero termino dulce, estoy lleno sabor y alegría. ¿Qué soy?",
    clues: [
      "Cuando termino, paso tanto el dedo que acabo",
      "Pincho pero siempre termina cayendo",
      "Soy francesa pero nunca se como escribirla"
    ],
    answer: "Fondue"
  }
},

{
  type: "transform-button",
  question: "Conclusion",
  data: {
    longText: "Necesitamos esto, además de tiempo pero no mucho, necesitamos estar solos, este año ni todo el año pasado no estuvimos solos ni un dia, disfrutar el uno del otro en paz, con tu novio que te ama y te extraña demasiado, que piensa en vos esperando que sea viernes y cada vez que veo un golden siento que es una seniat que estoy haciendo las cosas bien con vos ademas de ver una sonrisa en vos; que su única motivación es llenar de besos y amor al amor de mi vida, dormir la siesta y hacer cucharita, cocinar juntos, etc. pero para que todo eso pase necesito a una mujer que me apoye y me valore, una mujer que cada vez que le muestro los músculos lo festeje, que acompañe a construir mi futuro asi como yo quiero acompañar el tuyo, construir un futuro juntos. Necesito una mujer que me de un regalito aunque sea un caramelo, no puede ser que la única “sorpresa” que tuve en 5 años fueron figuritas, Victoria muchas veces nos trae algún chocolate, aunque yo no lo coma esta la intención de hacerlo. Necesito que me hagas sentir acompañado, que no quede solo en decir un “te extraño” y con besos ya alcanza, que me hagas sentir amado, las únicas veces que siento eso es cuando me mostraste tu dibujo o las fotos de chicos. Una relación no depende del apoyo de uno solo, depende de que los dos, cada uno está poniendo su 30%, necesitamos poner un poco más de cada uno para llegar al 100%. Necesito que me ayudes, no que lo hagas como si fueras “mamá”, que lo hagas como cualquier persona, sino como te voy a buscar a todos lados tengo que ser tu papá, lo hago para cuidarte. Vos sabes que te ayudo en todo y yo se que vos también lo haces. Al final yo siempre voy a querer tus labios junto a los míos, y los míos junto a los tuyos.\n\nEntonces aceptas 1 semana juntos en un ambiente relajado y lindo para disfrutar de una relación amorosa y hermosa en la playa cagados de frio?",
    yesText: "Sí",
    noText: "No",
    closeWarningText: "Si de verdad es un no, cerrar la página.\n\nNo puedo mas, vamos a tener una charla mala para los dos."
  }
}
];