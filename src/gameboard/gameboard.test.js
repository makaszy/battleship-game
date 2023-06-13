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

test("GameBoard receives Attack", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 3, direction: "horizontal"});
  expect(gameBoard.receiveAttack(2)).toBe(true);
  expect(gameBoard.receiveAttack(50)).toBe(false);

})

test("GameBoard announces game over when ships are sunk", () => {
  const gameBoard = new GameBoard();
  gameBoard.placeShip({tileNum: 1, length: 1, direction: "horizontal"});
  expect(gameBoard.receiveAttack(1)).toBe("GAME OVER");
})