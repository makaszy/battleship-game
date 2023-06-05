import GameBoard from "./gameboard";

/*  test("Gameboard.placeShip() adds ship to ships property", ()=> {
  const gameBoard = new GameBoard();
  gameBoard.placeShip(3);
  expect(gameBoard.ships).toHaveLength(1);
  expect(gameBoard.ships).toBe(3)
}) 
 */
test("Check if legal check finds illegal moves", () => {
  const gameBoard = new GameBoard();
  gameBoard.ships = [
    { ship: {}, coordinates: [1, 2, 3] },
    { ship: {}, coordinates: [1, 2, 3] },
    { ship: {}, coordinates: [1, 8, 3] },
  ];

  expect(gameBoard.checkIfCoorFree([12, 2, 24])).toBe(false);

  expect(gameBoard.checkIfCoorFree([12, 5, 24])).toBe(true);

  expect(gameBoard.checkIfCoorFree([12, 8, 24])).toBe(false);
});
