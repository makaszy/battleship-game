import GameBoard from "../../common/gameboard/gameboard";
import Ship from "../../common/ship/ship";
import ShipInfo from "./ship-info/ship-info"

class ComputerGameBoard extends GameBoard {

  /* Recreates a random ship, until its coordinates are not taken. */

  placeShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.isTaken(ship.coordinates)) {
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    };
    this.ships = ship;
  }

}


export default ComputerGameBoard;

