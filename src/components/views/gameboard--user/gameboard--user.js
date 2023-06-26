import GameBoard from "../../common/gameboard/gameboard";
import Ship from "../../common/ship/ship";
import { handleComputerAttack, computerAttack } from "../../pub-subs/attack--computer";
import * as init from "../../pub-subs/initialize"
import * as userClick from "../../pub-subs/events"

class UserGameBoard extends GameBoard {
  /* Calculates the max acceptable tile for a ship depending on its start (tileNum).
  for ex. If a ship is placed horizontally on tile 21 max would be 30  */

  static calcMax(obj) {
    if (obj.direction === "horizontal" && obj.tileNum > 10) {
      const max = +`${obj.tileNum.toString().charAt(0)}0` + 10;
      return max;
    }
    const max = obj.direction === "horizontal" ? 10 : 100;
    return max;
  }

  /* Calculates the length of the ship in tile numbers. The minus -1 accounts for the tileNum that is added in the isTooBig func */

  static calcLength(obj) {
    return obj.direction === "horizontal"
      ? obj.length - 1
      : (obj.length - 1) * 10;
  }

  /* Checks if the ship placement would be legal, or if the ship is too big to be placed on the tile */

  static isTooBig(obj) {
    const max = UserGameBoard.calcMax(obj);
    const shipLength = UserGameBoard.calcLength(obj);
    if (obj.tileNum + shipLength <= max) {
      return false;
    }
    return true;
  }

  isValid = (obj) => {
    const ship = new Ship(obj);
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {
      return { valid: false, coordinates: ship.coordinates} 
    }
    return { valid: true, coordinates: ship.coordinates }
  }

  publishValidity = (obj) => {
    console.log("yeaah")
    console.log(this.isValid(obj))
    userClick.validityViews.publish(this.isValid(obj))
  }

  /* places ship in shipsArr */

  placeShip = (obj) => {
    const ship = new Ship(obj);
    this.ships = ship;
    return ship;
  }

  publishPlaceShip = (obj) => {
    const ship = this.placeShip(obj)
    userClick.createShipView.publish({coordinates: ship.coordinates})
  }
}


function initUserBoard() {
  const userBoard = new UserGameBoard(handleComputerAttack);
  computerAttack.subscribe(userBoard.handleAttack);
}

function initPlacementBoard() {
  const userPlacementBoard = new UserGameBoard(handleComputerAttack);

  userClick.shipInfo.subscribe(userPlacementBoard.publishValidity); 
  userClick.createShip.subscribe(userPlacementBoard.publishPlaceShip);
}
initPlacementBoard();
init.userGameBoard.subscribe(initUserBoard)

