import Ship from "./ship/ship";
import createCoorArr from "./createCoorArr/createCoorArr";
import direction from "./direction/direction";

class GameBoard {
  ships = [];

  checkIfCoorTaken(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      for (let y = 0; y < this.ships.length; y += 1) {
        if (this.ships[y].coordinates.includes(arr[i])) {
          return false;
        }
      }
    }
    return true;
  }

  /* 


  placeShip(length) {
    let coordinates = createCoorArr(length, direction())
    if



    return  {
      ship: new Ship(length),
      coordinates: createCoorArr(length, direction())
    }
  }
 */
}

export default GameBoard;
