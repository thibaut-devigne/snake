import { 
  getEmptyCells, 
  snakeHasCollide, 
  generateSnakeColors, 
  aboYellow,
  aboViolet,
  getNewHighScores
} from "./utils.js"

describe("Utils function", () => {
  test("It should get free cell (without snake or obstacle)", () => {
    /* 
      |empty|empty|empty|
      |  O  |  S  |empty|
      |  O  |  S  |empty|
    */
    const colMax = 3
    const rowMax = 3
    const snake = [[2,2], [2,3]]
    const obstacles = [[1,2], [1,3]]
    const emptyCells = getEmptyCells(snake, obstacles, colMax, rowMax)
    const expectedResult = ['1_1', '2_1', '3_1', '3_2', '3_3']
    expect(emptyCells).toEqual(expectedResult)
  })

  test("It should detect if snake collide on itself", () => {
    const snake = [[1,1], [2,1], [2,2], [1,2]]
    const obstacles = []
    const newHeadPosition = [1,1]
    expect(snakeHasCollide(snake, obstacles, newHeadPosition)).toBe(true)
  })

  test("It should detect if snake collide on obstacle", () => {
    const snake = [[1,1], [2,1], [3,1]]
    const obstacles = [[4,1]]
    const newHeadPosition = [4,1]
    expect(snakeHasCollide(snake, obstacles, newHeadPosition)).toBe(true)
  })

  test("It should generate snake with specific style (france)", () => {
    const snakeSize = 100
    const snakeStyle = "france"
    const result = generateSnakeColors(snakeSize, snakeStyle)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(snakeSize)
    expect(result[0]).toBe("blue")
    expect(result[1]).toBe("white")
    expect(result[2]).toBe("red")
    expect(result[3]).toBe("blue")
    expect(result[4]).toBe("white")
    expect(result[5]).toBe("red")
  })

  test("It should generate snake with specific style (abo)", () => {
    const snakeSize = 100
    const snakeStyle = "abo"
    const result = generateSnakeColors(snakeSize, snakeStyle)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(snakeSize)
    expect(result[0]).toBe(aboViolet)
    expect(result[1]).toBe(aboYellow)
    expect(result[2]).toBe(aboViolet)
    expect(result[3]).toBe(aboViolet)
    expect(result[4]).toBe(aboViolet)
    expect(result[99]).toBe(aboYellow)
  })

  describe("It should get new high scores when a new score is added", () => {
    test("Case adding score 15 when score 12 already there", () => {
      const previousHighScores = [{ name: "John", value: 12, date: "2024-07-07T15:31:50.574Z" }]
      const name = "Thib"
      const fakeTestingDate = "1995-12-25T10:00:00.000Z"
      const newScore = { value: 25, name, date: fakeTestingDate }
      const result = getNewHighScores(previousHighScores, newScore )
      const expectedResult = [
        { name: name, value: newScore.value, date: fakeTestingDate },
        { name: "John", value: 12, date: "2024-07-07T15:31:50.574Z" },
      ]
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(2)
      expect(result).toEqual(expectedResult)
    })
  
    test("Case adding score 15 when many other scores already there", () => {
      const previousHighScores = [
        { name: "John", value: 54, date: "2024-07-07T15:31:50.574Z" },
        { name: "John", value: 36, date: "2024-07-07T15:31:50.574Z" },
        { name: "John", value: 12, date: "2024-07-07T15:31:50.574Z" },
        { name: "John", value: 6, date: "2024-07-07T15:31:50.574Z" },
      ]
      const name = "Thib"
      const fakeTestingDate = "1995-12-25T10:00:00.000Z"
      const newScore = { value: 25, name, date: fakeTestingDate }
      const result = getNewHighScores(previousHighScores, newScore )
      expect(Array.isArray(result)).toBe(true)
      expect(result).toHaveLength(5)
      expect(result[2]).toEqual({ name: name, value: newScore.value, date: fakeTestingDate })
    })
  })
})