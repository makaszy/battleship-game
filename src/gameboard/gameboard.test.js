import GameBoard from "./gameboard";
import Ship from "./ship/ship";

test("Check if isTaken check finds illegal moves", () => {
  const gameBoard = new GameBoard();
  const ship1 = new Ship({ tileNum: 1, length: 3, direction: "horizontal" });

  gameBoard.ships = ship1;

  const ship2 = new Ship({ tileNum: 1, length: 3, direction: "horizontal" });

  const ship3 = new Ship({ tileNum: 66, length: 4, direction: "horizontal" });

  expect(gameBoard.isTaken(ship2.coordinates)).toBe(true);

  expect(gameBoard.isTaken(ship3.coordinates)).toBe(false);
});

test("Check if placeShip fails if ship is too big to fit on gameBoard properly", () => {
  const gameBoard = new GameBoard();
  expect(gameBoard.placeShip({length: 9, tileNum: 39, direction: "horizontal",})).toBe(false)
  expect(gameBoard.placeShip({length: 2, tileNum: 91, direction: "vertical",})).toBe(false)
})

test("GameBoard receives Attack", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 3, direction: "horizontal"});
  expect(gameBoard.receiveAttack(2)).toBe(true);
  expect(gameBoard.receiveAttack(50)).toBe(false);

})

test("GameBoard announces game over when ships are sunk ex.1", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  expect(gameBoard.receiveAttack(1)).toBe("GAME OVER");
})

test("GameBoard announces game over when ships are sunk ex. 2", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  gameBoard.placeShip({tileNum: 10, length: 1, direction: "horizontal"});
  gameBoard.receiveAttack(10)
  
  expect(gameBoard.receiveAttack(1)).toBe("GAME OVER");
})


test("GameBoard announces sunk when ship is sunk", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  gameBoard.placeShip({tileNum: 10, length: 1, direction: "horizontal"});
  expect(gameBoard.receiveAttack(1)).toBe("SUNK");
})


