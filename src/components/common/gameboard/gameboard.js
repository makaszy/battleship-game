class GameBoard {

  constructor(pubSub) {
    this.pubSub = pubSub;
  }

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

    /* Checks if ship would be neighboring a different ship */
    isNeighboring(coordinates, direction) {
      let coordinatesAllNeighbors = [];
      if (direction === "horizontal") {
        coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 10), coordinates.map(coor => coor - 10) ); // top and bottom neighbors
        if (coordinates[0] === 1 || +(String(coordinates[0]).slice(0, -1)) === 1) {
          coordinatesAllNeighbors.push(coordinates[-1] + 1); // right neighbor
        } else if (coordinates[-1] % 10 === 0) {
          coordinatesAllNeighbors.push(coordinates[0] -1); // left neighbor
        } else {
          coordinatesAllNeighbors.push(coordinates[coordinates.length -1] + 1, coordinates[0] -1) // left and right neighbors
        }
      } else {
        coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 1), coordinates.map(coor => coor - 1) ); // left and right neighbors
        if (coordinates[0] < 11) {
          coordinatesAllNeighbors.push(coordinates[-1] + 10); // btm neighbor
        } else if (coordinates[coordinates.length -1] > 90) {
          coordinatesAllNeighbors.push(coordinates[0] -10); // top neighbor
        } else {
          coordinatesAllNeighbors.push(coordinates[coordinates.length -10] + 1, coordinates[0] -10) // top and btm neighbors
        }
      }
      if (this.isTaken(coordinatesAllNeighbors)) {
        return true
      } 
      return false;
      
    }

  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  handleAttack = (num) => {
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(+num)) {
        this.ships[y].hit();
        if (this.ships[y].isSunk()) {
          const obj = {hit: true, sunk: true, tiles: this.ships[y].coordinates }
          return (this.isOver()) ? this.pubSub.publish({...obj, ...{gameover: true}}) : this.pubSub.publish(obj)
        }
        return this.pubSub.publish({ tile: num, hit: true, sunk: false });
      }
    }
    this.missedArr.push(num);

    return this.pubSub.publish({ tile: num, hit: false, sunk: false });
  };

  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

  isOver = () => { 
    const check = this.ships.every((ship) => ship.sunk === true);
    return check
  } 
  
}

export default GameBoard;
