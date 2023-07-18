import GameBoard from "../../common/gameboard/gameboard";
import Ship from "../../common/ship/ship";
import { handleComputerAttack, computerAttack } from "../../pub-subs/attack--computer";
import { attackStage as initAttackStage, placementStage as initPlacementStage } from "../../pub-subs/initialize";
import * as userClick from "../../pub-subs/events";

class UserGameBoard extends GameBoard {

  /* checks ship validity */

  isValid = (obj) => {
    const ship = new Ship(obj);
    if (super.isTaken(ship.coordinates) || GameBoard.isTooBig(obj) || super.isNeighboring(ship.coordinates, obj.direction)) {
      return { valid: false, coordinates: ship.coordinates} 
    }
    return { valid: true, coordinates: ship.coordinates }
  }

  publishValidity = (obj) => {
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
    userClick.createShipView.publish({coordinates: ship.coordinates, length: ship.length})
  }
}

/* initialize user game board */

function initUserGB() {
  const userBoard = new UserGameBoard(handleComputerAttack);
  userClick.shipInfo.subscribe(userBoard.publishValidity); 
  userClick.createShip.subscribe(userBoard.publishPlaceShip);
  function initHandleAttack() {
    computerAttack.subscribe(userBoard.handleAttack);
  }
  initAttackStage.subscribe(initHandleAttack)
}

initPlacementStage.subscribe(initUserGB)


