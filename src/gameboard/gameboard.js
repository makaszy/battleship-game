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

  checkIfCoorTaken(coordinates) {
    for (let i = 0; i < coordinates.length; i += 1) {
      for (let y = 0; y < this.ships.length; y += 1) {
        if (this.ships[y].coordinates.includes(coordinates[i])) {
          return true;
        }
      }
    }
    return false;
  }

  generateShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.checkIfCoorTaken(ship.coordinatesArr)) { 
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    }
    this.ships = ship
  }

  // eslint-disable-next-line consistent-return
  placeShip(obj) {
    const ship = new Ship(obj);
    if (this.checkIfCoorTaken(ship)) {
      return false;
    } 
    this.ships = ship;
  }
}

export default GameBoard;
