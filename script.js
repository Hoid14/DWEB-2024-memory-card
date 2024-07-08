const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval; // consultar el uso de setInterval
let firstCard = null;
let secondCard = null;

//Items array
const items = [
  { name: "bee", image: "assets/bee.png" },
  { name: "crocodile", image: "assets/crocodile.png" },
  { name: "macaw", image: "assets/macaw.png" },
  { name: "gorilla", image: "assets/gorilla.png" },
  { name: "tiger", image: "assets/tiger.png" },
  { name: "monkey", image: "assets/monkey.png" },
  { name: "chameleon", image: "assets/chameleon.png" },
  { name: "piranha", image: "assets/piranha.png" },
  { name: "anaconda", image: "assets/anaconda.png" },
  { name: "sloth", image: "assets/sloth.png" },
  { name: "cockatoo", image: "assets/cockatoo.png" },
  { name: "toucan", image: "assets/toucan.png" },
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//Function for timer generator
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Tiempo:</span>${minutesValue}:${secondsValue}`;
};

//Function for counting moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Pasos:</span>${movesCount}`;
};

//Function for counting winCount
const movesWinCounter = () => {
  winCount += 1;
};

//YOUR CODE STARTS HERE
//Function to choose eight random cards
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    //elimina un elemento desde el indice randomIndex
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};
// Funcion para barajar el array
const shuffleArray = (array) => {
  let arrayCopy = [...array]
  let maxIndex = arrayCopy.length-1
  while(maxIndex!=0){
    //siempre va a dar un numero menor que el del maxindex, nunca uno igual
    randomIndex = Math.floor(Math.random()*maxIndex)
    //intercambia el contenido de un indice a otro
    temp = arrayCopy[maxIndex]
    arrayCopy[maxIndex] = arrayCopy[randomIndex]
    arrayCopy[randomIndex] = temp
    maxIndex--;
  }
  return arrayCopy
}

// Function to generate matrix for the game

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  //duplica las cartas en un solo array
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle, DO IT YOURSELF
  //Your code here
  cardValues = shuffleArray(cardValues)

  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // Establece el número de columnas en el contenedor del juego basándose en el valor de 'size'.
  // Cada columna tiene un tamaño automático para adaptarse al contenido.
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  
  //Cards
  cards = document.querySelectorAll(".card-container");
  
  let cardOne=null
  let cardTwo=null
  //bandera para prevenir otros click
  let lockBoard=false
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //Your code starts here... This is the hard part of this code
      //Logic Needed:
      //1. We need to check if the first card is not already matched. We can do that with the class "matched"
      //si esta carta tiene matched, lockboard o flipped no hacemos nada
      if(lockBoard){
        return
      }
      if(card.classList.contains('flipped')){
        return
      }
      if(card.classList.contains('matched')){
        return
      }
      //si es falsa en todas las anteriores
      else {
        //3 If there is a first card flipped, it should flipped the second card after anohter click and ALSO move the counter
        //revisamos si ya hay una tarjeta asignada
        //si ya hay una cardOne entonces se asigna una cardTwo
        if(cardOne){
          //obtiene el nombre de la tarjeta
          cardTwo = card.getAttribute('data-card-value')
          //busca la carta con matched
          cardMatched = document.querySelector('.matched')
          //volte la tarjeta seleccionada
          card.classList.add("flipped");
          //bloquea el tablero
          lockBoard=true
          //4. If two cards are flipped, code should compare their value
          //4.1 If both cards have the same value, they're a match so the code should assign one winCount
          //si son iguales se establece cardOne y cardTwo en null y se desbloquea el tablero
          //aumenta el contador
          movesCounter();
          if(cardOne===cardTwo){
            cardOne = null
            cardTwo = null
            lockBoard = false
            movesWinCounter()
            if(winCount===8){
              result.innerHTML=`
              <h2>Ganaste SIIIUUUU</h2>
              <br>
              <h1>Pasos: ${movesCount}</h1>
              <br>`
              gameContainer.innerHTML = "";
              controls.classList.remove("hide");
              startButton.classList.remove("hide")
              stopButton.classList.add("hide");
            }
          }
          //sino aciertan se establece cardOne y cardTwo en null
          else{
            cardOne = null
            cardTwo = null
            //despues de un segundo, se vuelven a voltear la card con Matched y la segunda card volteada y se desbloquea el tablero
            setTimeout(()=>{
              cardMatched.classList.remove('flipped');
              card.classList.remove('flipped');
              lockBoard = false
            },1000)
          }
          //en cualquier caso se quita el matched de la tarjeta
          cardMatched.classList.remove('matched')
        }
        //2. flip the card. If there are no first ones, asign that card as first card and get the value of the card
        //HINT: The value is on the attribute data-card-value
        //si card one es null se le agrega matched, se guarda su nombre en cardOne y se voltea
        else{
          card.classList.add('matched');
          cardOne = card.getAttribute('data-card-value');
          card.classList.add("flipped");
        }
      }

      

      
      
      
      //HINT: A card is match if it has the class matched
      //HINT # 2: User wins if and only if It matches all the cards, how can you check that using the cardValues array?
      //HINT # 3: If user wins, game must stop. Don't worry, you already have a named function for that below ;) ;)

      //If the cards don't match, you should flipped them again. Do you see the class flipped ? Well after this you can't see it (like JOHN CEEENAAAA)

      //Note: It would be nice if the flipped process would be 'delayed'
    });
  });
};
let idInterval=null;
//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls and buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Function to to start the timer. Again, check setInterval
  //Hint: You already have a function that checks the time each second, use it wisely
  //YOUR CODE HERE
  moves.innerHTML = `<span>Pasos:</span> ${movesCount}`;
  timeGenerator()
  idInterval = setInterval(timeGenerator,1000)
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    // timer created with setInterVal needs to be cleared
    //YOUR CODE HERE
    seconds = 0;
    minutes = 0;
    clearInterval(idInterval)
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};