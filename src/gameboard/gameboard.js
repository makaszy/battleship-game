import Ship from "./ship/ship";
import ShipInfo from "./shipInfo/shipInfo";

class GameBoard {
  shipsArr = [];

  get ships() {
    return this.shipsArr;
  }

  set ships(value) {
    if (Array.isArray(value)) {
      this.shipsArr = this.shipsArr.concat(value);
    } else {
      this.shipsArr.push(value);
    }
  }

  /* Checks if coordinates already have a ship on them */

  isTaken(coordinates) {
    for (let i = 0; i < coordinates.length; i += 1) {
      for (let y = 0; y < this.ships.length; y += 1) {
        if (this.ships[y].coordinates.includes(coordinates[i])) {
          return true;
        }
      }
    }
    return false;
  }

  /* Recreates a random ship, until its coordinates are not taken */

  placeRandomShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.isTaken(ship.coordinates)) {
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    }
    this.ships = ship;
  }

  /* Checks if a ships coordinates are taken, if not places ship in shipsArr, otherwise returns false */

  // eslint-disable-next-line consistent-return
  placeShip(obj) {
    const ship = new Ship(obj);
    if (this.isTaken(ship.coordinates)) {
      return false;
    }
    this.ships = ship;
  }

  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  receiveAttack(num) {
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(num)) {
        this.ships[y].hit()
        if (this.ships[y].isSunk()) {
          return this.isOver()
        }
        return true;
      }
    }
    return false  
  }
  
  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

  isOver() {
    return (this.ships.every(ship => ship.sunk === true)) ? "GAME OVER" : "SUNK"; 
  }
}

export default GameBoard;
