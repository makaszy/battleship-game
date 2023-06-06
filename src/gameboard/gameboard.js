import Ship from "./ship/ship";
import createCoorArr from "./createCoorArr/createCoorArr";
import direction from "./direction/direction";

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

  checkIfCoorTaken(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      for (let y = 0; y < this.ships.length; y += 1) {
        if (this.ships[y].coordinates.includes(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  placeShip(length) {
    let coor = createCoorArr.random(length, direction());
    while (this.checkIfCoorTaken(coor)) {
      coor = createCoorArr.random(length, direction());
    }
    this.ships = {
      ship: new Ship(length),
      coordinates: coor,
    };
  }
}

export default GameBoard;
