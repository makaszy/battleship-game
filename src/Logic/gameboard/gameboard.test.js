import GameBoard from "./gameboard";

test("Check if placeShip fails if coordinates for the ship are already taken", ()=> {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({length: 2, tileNum: 3, direction: "horizontal",})
  expect(gameBoard.placeShip({length: 2, tileNum: 3, direction: "horizontal",})).toStrictEqual(Error("Ship couldn't be placed there"))
  expect(gameBoard.placeShip({length: 2, tileNum: 32, direction: "horizontal",})).toBe("Ship Placed")  
})

test("Check if placeShip fails if ship is too big to fit on gameBoard properly", () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip({length: 9, tileNum: 39, direction: "horizontal",})).toStrictEqual(Error("Ship couldn't be placed there"))
  expect(gameBoard.placeShip({length: 2, tileNum: 91, direction: "vertical",})).toStrictEqual(Error("Ship couldn't be placed there"))
})

test("GameBoard receives Attack", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 3, direction: "horizontal"});
  expect(gameBoard.receiveAttack(2)).toMatchObject({hit: true, tile: 2});
  expect(gameBoard.receiveAttack(50)).toMatchObject({hit: false});

})

test("GameBoard announces game over when ships are sunk ex.1", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  expect(gameBoard.receiveAttack(1)).toMatchObject({gameover: true});
})

test("GameBoard announces game over when ships are sunk ex. 2", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  gameBoard.placeShip({tileNum: 10, length: 1, direction: "horizontal"});
  gameBoard.receiveAttack(10)
  expect(gameBoard.receiveAttack(1)).toMatchObject({gameover: true});
})


test("GameBoard announces sunk when ship is sunk", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  gameBoard.placeShip({tileNum: 10, length: 1, direction: "horizontal"});
  expect(gameBoard.receiveAttack(1)).toMatchObject({sunk: true});
})


