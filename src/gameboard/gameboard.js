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

  missedArr = [];
  
  /* Calculates the max acceptable tile for a ship depending on its start (tileNum).
  for ex. If a ship is placed horizontally on tile 21 max would be 30  */
  
  static calcMax(obj) {
    if (obj.direction === "horizontal" && obj.tileNum > 10) {
     const max = +(`${obj.tileNum.toString().charAt(0)}0`)+ 10; 
     return max;
    } 
    const max = (obj.direction==="horizontal") ? 10 : 100;
    return max;
  }
  
  /* Calculates the length of the ship in tile numbers. The minus -1 accounts for the tileNum that is added in the isTooBig func */

  static calcLength(obj) {
    return (obj.direction === "horizontal") ? (obj.length -1) : ((obj.length - 1) * 10)
  }

  /* Checks if the ship placement would be legal, or if the ship is too big to be placed on the tile */

  static isTooBig(obj) {
    const max = GameBoard.calcMax(obj);
    const shipLength = this.calcLength(obj)
    if ((obj.tileNum + shipLength <= max)) {
      return false
    }
    return true;
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
  

  /* Recreates a random ship, until its coordinates are not taken. Does not need to make the isTooBig check since getRandomTile creates only tiles that fit */

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

  placeShip(obj) {
    const ship = new Ship(obj);
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {
      return Error("Ship couldn't be placed there");
    }
    this.ships = ship;
    return "Ship Placed"
  }

  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  receiveAttack(num) {
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(num)) {
        this.ships[y].hit()
        if (this.ships[y].isSunk()) {
          return this.isOver()
        }
        return {tile: num, hit: true, sunk: false, };
      }
    }
    this.missedArr.push(num);
    return false  
  }
  
  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

  isOver() {
    return (this.ships.every(ship => ship.sunk === true)) ? "GAME OVER" : "SUNK"; 
  }
}

export default GameBoard;
