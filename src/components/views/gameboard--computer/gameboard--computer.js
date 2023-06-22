import GameBoard from "../../common/gameboard/gameboard";
import Ship from "../../common/ship/ship";
import ShipInfo from "./ship-info/ship-info";
import { userAttack, handleUserAttack } from "../../pub-subs/attack--user";
import {initComputerGameboard, }from "../../pub-subs/initialize";


class ComputerGameBoard extends GameBoard {
  /* Recreates a random ship, until its coordinates are not taken. */

  placeShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.isTaken(ship.coordinates)) {
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    }
    this.ships = ship;
  }
}

function initCompGB(value) {
  if (value === true) {
    const computerBoard = new ComputerGameBoard(handleUserAttack);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    userAttack.subscribe(computerBoard.handleAttack);
  }
}

initComputerGameboard.subscribe(initCompGB);

