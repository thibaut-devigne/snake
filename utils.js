//COLORS
export const defaultGreen = "#2ecc71"

export const keyName_keyCode = {
  "KEY_SPACE": 32,
  "ARROW_LEFT": 37,
  "ARROW_DOWN": 38,
  "ARROW_RIGHT": 39,
  "ARROW_BOTTOM": 40,
  "KEY_D": 68,
  "KEY_Q": 81,
  "KEY_R": 82,
  "KEY_S": 83,
  "KEY_Z": 90,
}

// export const flip = (data) => {
//   return Object.fromEntries(
//     Object
//       .entries(data)
//       .map(([key, value]) => [value, key])
//   );
// }

export const isDirectionKey = keyCode => {
  const { 
    ARROW_LEFT: LEFT,
    ARROW_DOWN: DOWN,
    ARROW_RIGHT: RIGHT,
    ARROW_BOTTOM: BOTTOM,
    KEY_Z: Z,
    KEY_Q: Q,
    KEY_S: S,
    KEY_D: D,
  } = keyName_keyCode
  return [LEFT, DOWN, RIGHT, BOTTOM, Z, Q, S, D].includes(keyCode)
}

export const isRestartKey = keycode => keyName_keyCode.KEY_R === keycode

export const isSpaceKey = keycode => keyName_keyCode.KEY_SPACE === keycode

export const mappingKeyCode_Value = {
  '38': "Bottom_To_Up",
  '40': "Up_To_Bottom",
  '37': "Right_To_Left",
  '39': "Left_To_Right",
  '90': "Bottom_To_Up",
  '83': "Up_To_Bottom",
  '81': "Right_To_Left",
  '68': "Left_To_Right",
}

export const oppositeDirection = {
  "Bottom_To_Up": "Up_To_Bottom",
  "Up_To_Bottom": "Bottom_To_Up",
  "Right_To_Left": "Left_To_Right",
  "Left_To_Right": "Right_To_Left",
}

export const getDirectionFormKeyPress = (keyCode) => {
  return mappingKeyCode_Value[keyCode]
}

export const isOppositeDirection = (previousDirection, expectedNewDirection) => {
  return oppositeDirection[previousDirection] === expectedNewDirection
}

export const getNewDirection = (previousDirection, keyCode, params) => {
  const newDirection = getDirectionFormKeyPress(keyCode)
  if (!newDirection) return previousDirection

  if (isOppositeDirection(previousDirection, newDirection)) {
    return previousDirection
  }
  
  const { snake, columnMax, rowMax } = params
  if(willComeBackOnItself(snake, newDirection, columnMax, rowMax)) {
    return previousDirection
  }

  return newDirection
}

export const isSamePosition = (pos1, pos2) => {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1]
}

export const positionBelongTo = (listOfPositions, position) => {
  if(!Array.isArray(listOfPositions)) return false
  return listOfPositions.some(pos1 => isSamePosition(pos1, position))
}

export const isSnakeCell = (snake, cellPosition) => {
  return positionBelongTo(snake, cellPosition)
}

export const isObstacleCell = (obstacles, cellPosition) => {
  return positionBelongTo(obstacles, cellPosition)
}

export const getHeadPosition = snake => {
  const snakeLength = snake.length
  return snake[snakeLength-1]
}

export const getNeckPosition = snake => {
  const snakeLength = snake.length
  return snake[snakeLength-2]
}

export const getTailPosition = snake => snake[0]


export const getNewHeadPosition = (previousHead, direction, columnMax = 16, rowMax = 8) => {
  const [prevX, prevY] = previousHead
  if(direction === "Left_To_Right") {
    let newX = (prevX + 1) > columnMax ? 1 : (prevX + 1)
    return [newX, prevY]
  } else if(direction === "Right_To_Left") {
    let newX = (prevX - 1) === 0 ? columnMax : (prevX - 1)
    return [newX, prevY]
  } else if(direction === "Bottom_To_Up") {
    let newY = prevY - 1 === 0 ? rowMax : (prevY - 1)
    return [prevX, newY]
  } else if(direction === "Up_To_Bottom") {
    let newY = (prevY + 1) > rowMax ? 1 : (prevY + 1)
    return [prevX, newY]
  }
  return previousHead
}

export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

export const getPositionFromStringPosition = (strPos) => {
  return strPos.split("_").map(val => parseInt(val))
}

export const getEmptyCells = (snake, obstacles, columnMax, rowMax) => {
  let allCells = []
  for (let i = 1; i <= columnMax; i++) {
    for (let j = 1; j <= rowMax; j++) {
      allCells.push(`${i}_${j}`)
    }
  }
  const snakeWithStrPosition = snake.map(bodyPositon => `${bodyPositon[0]}_${bodyPositon[1]}`)
  const obstaclesWithStrPosition = obstacles.map(bodyPositon => `${bodyPositon[0]}_${bodyPositon[1]}`)

  const occupiedPosition = snakeWithStrPosition.concat(obstaclesWithStrPosition);

  let availableCells = allCells.filter(cellStr => !occupiedPosition.includes(cellStr))
  return availableCells
}

export const getNewApplePosition = (snake, obstacles, columnMax = 16, rowMax = 8) => {
  const availableCells = getEmptyCells(snake, obstacles, columnMax, rowMax)
  const availableLength = availableCells.length
  let newApplePositionStr = availableCells[getRandomInt(availableLength)]
  let newApplePosition = getPositionFromStringPosition(newApplePositionStr)
  return newApplePosition
}

export const hasCollideItself = (snake, newHeadPosition) => {
  // return positionBelongTo(snake, newHeadPosition)
  return snake.some(snakeBodyPosition => {
    return isSamePosition(snakeBodyPosition, newHeadPosition)
  })
}

export const hasCollideWithObstacle = (obstacles, newHeadPosition) => {
  return positionBelongTo(obstacles, newHeadPosition)
}


export const snakeHasCollide = (snake, obstacles, newHeadPosition) => {
  return hasCollideItself(snake, newHeadPosition) || hasCollideWithObstacle(obstacles, newHeadPosition)
}


export const willComeBackOnItself = (snake, direction, columnMax, rowMax) => {
  let head = getHeadPosition(snake)
  let neck = getNeckPosition(snake)
  let newHead = getNewHeadPosition(head, direction, columnMax, rowMax)
  return isSamePosition(newHead, neck)
}

export const aboYellow = "#efe908"
export const aboViolet = "#796bae"

export const snakeStyles = {
  abo: { 
    start: [aboViolet, aboYellow], 
    mainPattern: [aboViolet], 
    end: [aboYellow]
  },
  onix: { 
    start: [], 
    mainPattern: ["gray"], 
    end: []
  },
  bobMarley: { 
    start: [], 
    mainPattern: ["green", "yellow", "red"], 
    end: []
  },
  france: { 
    start: [], 
    mainPattern: ["blue", "white", "red"], 
    end: []
  },
  christmas: { 
    start: [], 
    mainPattern: ["green", "red"], 
    end: [] 
  }
}


export const generateSnakeColors = (snakeSize = 100, style) => {
  if(style === "default") {
    return Array.from(Array(5)).fill(defaultGreen)
  }
  const snakeStyle = snakeStyles[style]
  const { start, mainPattern, end } = snakeStyle
  const mainPatternLength = mainPattern.length
  let snakeColors = [...start]
  let count = 0
  while (snakeColors.length < (snakeSize - end.length)) {
    let colorIndex = count%mainPatternLength
    snakeColors.push(mainPattern[colorIndex])
    count++
  }
  snakeColors.push(...end)
  return snakeColors
}

export const getMiddleInt = (aLength) => {
  return aLength >>> 1
}

const getSortedIndex = (arr, newScoreValue) => {
  var current = 0
  var arrLength = arr.length
  var middleIndex = getMiddleInt(current + arrLength);
  while (current < arrLength) {
    if (arr[middleIndex].value > newScoreValue) current = middleIndex + 1;
    else arrLength = middleIndex;
    middleIndex = getMiddleInt(current + arrLength);
  } 
  return current;
}

export const getNewHighScores = (previousHighScores, newScoreParams) => {
  const { value, name, date = new Date().toISOString() } = newScoreParams
  const newScore = { value, name, date }
  const scorePosition = getSortedIndex(previousHighScores, value)
  const newHighScores = [ ...previousHighScores]
  newHighScores.splice(scorePosition, 0, newScore);
  return newHighScores
}