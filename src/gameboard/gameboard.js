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

  placeRandomShip(length) {
    let shipInfo = new ShipInfo(length);
    let ship = new Ship(shipInfo);
    while (this.isTaken(ship.coordinatesArr)) {
      shipInfo = new ShipInfo(length);
      ship = new Ship(shipInfo);
    }
    this.ships = ship;
  }

  // eslint-disable-next-line consistent-return
  placeShip(obj) {
    const ship = new Ship(obj);
    if (this.isTaken(ship)) {
      return false;
    }
    this.ships = ship;
  }


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
  
  isOver() {
    return (this.ships.every(ship => ship.sunk === true)) ? "GAME OVER" : false; 
  }
}

export default GameBoard;
