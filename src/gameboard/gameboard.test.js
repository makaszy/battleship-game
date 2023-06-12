import GameBoard from "./gameboard";
import Ship from "./ship/ship";

test("Check if taken check finds illegal moves", () => {
  const gameBoard = new GameBoard();
  const ship1 = new Ship({ tileNum: 1, length: 3, direction: "horizontal" });

  gameBoard.ships = ship1;
  
  const ship2 = new Ship({ tileNum: 1, length: 3, direction: "horizontal" });

  const ship3 = new Ship({ tileNum: 66, length: 4, direction: "horizontal" });

  expect(gameBoard.checkIfCoorTaken(ship2.coordinates)).toBe(true);

  expect(gameBoard.checkIfCoorTaken(ship3.coordinates)).toBe(false);
});
