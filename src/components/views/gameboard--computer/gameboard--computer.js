import GameBoard from "../../common/gameboard/gameboard";
import Ship from "../../common/ship/ship";
import ShipInfo from "./ship-info/ship-info";
import { userAttack, handleUserAttack } from "../../pub-subs/attack--user";
import * as init from "../../pub-subs/initialize";


class ComputerGameBoard extends GameBoard {

/* recreates a random ship, until its coordinates are not taken, neighboring other ships, or too big */

  placeShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.isTaken(ship.coordinates) || this.isNeighboring(ship.coordinates, ship.direction) || GameBoard.isTooBig(shipInfo) ) {
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    }
    this.ships = ship;
  }
}

/* initialize computer game board */


function initCompGB() {
    const computerBoard = new ComputerGameBoard(handleUserAttack);
    const shipsArr = [5, 4, 3, 2]

    shipsArr.forEach((ship) => {
      computerBoard.placeShip(ship)
    });
    

    userAttack.subscribe(computerBoard.handleAttack); 
}

init.attackStage.subscribe(initCompGB);

