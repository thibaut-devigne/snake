import { 
  isDirectionKey,
  isRestartKey,
  isSpaceKey,
  getNewDirection,
  isSamePosition,
  isSnakeCell,
  isObstacleCell,
  getHeadPosition,
  getTailPosition,
  getNewHeadPosition,
  getNewApplePosition,
  snakeHasCollide,
  generateSnakeColors,
  getNewHighScores
} from "./utils.js"

//GAME

const initialSnake = [[2,2], [3,2], [4,2]]
const initialDirection = "Left_To_Right"
const initialApplePosition = [10,4]
const obstacles = [[3,6]]
const nbColumns = 16
const nbRows = 8
const intervalTime = 200
const isRunningOnStart = true

//STYLE
const initialCellSize = "30px"
let snakeColors = generateSnakeColors(100, "default")

//"ALL_BORDER" "EXTERNAL_BORDER" "NO_BORDER" 
const gridDisplayMode = "EXTERNAL_BORDER"

let direction = initialDirection
let snake = initialSnake
let applePosition = initialApplePosition
let isRunning = isRunningOnStart
let cellSize = initialCellSize

let lastFrameTS, elapsed;

const displayResultModal = () => {
  document.getElementById("result_modal").style.display = "block"
}

const hideResultModal = () => {
  document.getElementById("result_modal").style.display = "none"
}

const onCloseModal = () => {
  hideResultModal()
}

export const onSelectSnakeStyle = (styleSelected) => {
  snakeColors = generateSnakeColors(100, styleSelected)
}

const repaintSnake = () => {
  snake.forEach(([X, Y], index) => {
    document.getElementById(`cell_${X}_${Y}`).style.backgroundColor = snakeColors[index]
  });
}

const getHighScoreHTMLLine = (highScore, index) => {
  let oneHighScoreHTML = document.createElement('div');
  oneHighScoreHTML.className = "oneLineScore"

  let positionAndName = document.createElement('div');
  positionAndName.className = "highScorePositionAndName"

  //POSTION
  let highScorePosition = document.createElement('div');
  highScorePosition.className = "highScorePosition"
  highScorePosition.innerHTML = `${index+1}.`
  positionAndName.appendChild(highScorePosition)

  //NAME
  let highScoreName = document.createElement('div');
  highScoreName.className = "highScoreName"
  highScoreName.innerHTML = `${highScore.name}`
  positionAndName.appendChild(highScoreName)

  oneHighScoreHTML.appendChild(positionAndName)
  
  //NAME
  let highScoreValue = document.createElement('span');
  highScoreValue.className = "highScoreValue"
  highScoreValue.innerHTML = `${highScore.value}`
  oneHighScoreHTML.appendChild(highScoreValue)

  return oneHighScoreHTML
}

const getNextSnake = (previousSnake, direction) => {
  let newSnake = JSON.parse(JSON.stringify(previousSnake))
  let previousHead = getHeadPosition(previousSnake)
  let tail = getTailPosition(previousSnake)
  let newHead = getNewHeadPosition(previousHead, direction, nbColumns, nbRows)

  const newSnakeHeadElt = document.getElementById(`cell_${newHead[0]}_${newHead[1]}`);
  
  if(snakeHasCollide(previousSnake, obstacles, newHead)) {
    // COLLISTION - SCORE MANAGEMENT
    newSnakeHeadElt.classList.add("collisionCell");
    onPauseClick()

    const scoreValue = snake.length
    const highScoresStringified = localStorage.getItem("highScores") || "[]";
    const highScores = JSON.parse(highScoresStringified)
    const newScore = { name: "Player_1", value: scoreValue }
    const newHighScores = getNewHighScores(highScores, newScore)
    localStorage.setItem("highScores", JSON.stringify(newHighScores));

    let yourScoreHTML = document.getElementById("yourScore");
    yourScoreHTML.innerHTML = `Your score: ${scoreValue}`
    
    let highScoresHTML = document.getElementById("highScores");
    highScoresHTML.innerHTML = ""
    newHighScores.forEach((highScore, index) => {
      if(index >= 10) return;
      let oneHighScoreHTML = getHighScoreHTMLLine(highScore, index)
      highScoresHTML.appendChild(oneHighScoreHTML)
    })

    displayResultModal()
  } else {
    //HEAD FORWARD
    newSnakeHeadElt.classList.add("cellSelected");
    newSnake.push(newHead)
  }

  //EAT APPLE
  const snakeHasEatApple = isSamePosition(applePosition, newHead)
  if(snakeHasEatApple) {
    newSnakeHeadElt.classList.remove("appleCell");
    applePosition = getNewApplePosition(snake, obstacles, nbColumns, nbRows)
    const appleElt = document.getElementById(`cell_${applePosition[0]}_${applePosition[1]}`);
    appleElt.classList.add("appleCell");
  }

  //TAIL
  const shouldHideTail = !snakeHasEatApple
  if(shouldHideTail) {
    const snakeTailElt = document.getElementById(`cell_${tail[0]}_${tail[1]}`);
    snakeTailElt.classList.remove("cellSelected");
    snakeTailElt.style.backgroundColor = ""

    newSnake.shift()
  }

  return newSnake
}

const generateSnakeGrid = () => {
  const snakeGrid = document.getElementById("snakeGrid");
  snakeGrid.innerHTML = "";

  for (let rowIndex = 1; rowIndex < nbRows + 1; rowIndex++) {
    let row = document.createElement('div');
    row.className = "row";

    for (let colIndex = 1; colIndex < nbColumns + 1; colIndex++) {
      let cell = document.createElement('div');
      cell.id = `cell_${colIndex}_${rowIndex}`;
      cell.className = "cell";
      cell.style.width = cellSize
      cell.style.height = cellSize
      if(gridDisplayMode === "EXTERNAL_BORDER") {
        if(colIndex === 1) {
          cell.style.borderLeft = "1px solid gray"
        }
        if(colIndex === nbColumns) {
          cell.style.borderRight = "1px solid gray"
        }
        if(rowIndex === 1) {
          cell.style.borderTop = "1px solid gray"
        }
        if(rowIndex === nbRows) {
          cell.style.borderBottom = "1px solid gray"
        }
      } else if(gridDisplayMode === "ALL_BORDER") {
        cell.style.border = "1px solid gray"
      }

      const cellPosistion = [colIndex, rowIndex]
      let isApple = isSamePosition(applePosition, cellPosistion)
      let isSelected = isSnakeCell(initialSnake, cellPosistion)
      let isObstacle = isObstacleCell(obstacles, cellPosistion)
      if(isSelected) cell.classList.add("cellSelected")
      else if(isObstacle) {
        // cell.innerHTML = "X"
        let skull = document.createElement('img');
        skull.src = "skull.svg"
        skull.style.width = cellSize
        skull.style.height = cellSize
        cell.appendChild(skull);
      } else if(isApple) cell.classList.add("appleCell");
      
      row.appendChild(cell);
    }
    snakeGrid.appendChild(row);
  }
}


document.onkeydown = checkKey;

function checkKey(e) {
  let keyCode = e.keyCode
  if(isDirectionKey(keyCode)) {
    const params = { snake, columnMax: nbColumns, rowMax: nbRows }
    direction = getNewDirection(direction, keyCode, params)
  } else if(isRestartKey(keyCode)) {
    onRestartGame()
  } else if(isSpaceKey(keyCode)) {
    isRunning ? pauseGame() : playGame()
  } else {
    // console.log("another touch === ", keyCode)
  }
}

function gameLoop() {
  const newSnake = getNextSnake(snake, direction)
  snake = newSnake
  repaintSnake()
}

function animate(newtime) {
  if (!isRunning) return;
  requestAnimationFrame(animate);
  elapsed = newtime - lastFrameTS;
  if (elapsed > intervalTime) {
    lastFrameTS = newtime - (elapsed % intervalTime)
    gameLoop()
  }
}

function startGame(){
  generateSnakeGrid()
  lastFrameTS = window.performance.now();
  animate();
}

function onPauseClick() {
  pauseGame()
}

function pauseGame() {
  isRunning = false
}

function onPlayClick() {
  playGame()
}

function playGame() {
  isRunning = true
  animate()
}

function onRestartGame() {
  onCloseModal()

  isRunning = false
  direction = initialDirection
  snake = initialSnake
  applePosition = initialApplePosition
  isRunning = isRunningOnStart

  startGame()
}

export function onRestartClick() {
  onRestartGame()
}


startGame()

window.onCloseModal=onCloseModal
window.onPauseClick=onPauseClick
window.onPlayClick=onPlayClick
window.onRestartClick=onRestartClick
window.onSelectSnakeStyle=onSelectSnakeStyle



