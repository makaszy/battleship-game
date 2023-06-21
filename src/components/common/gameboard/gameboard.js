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
  
  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  receiveAttack(num) {
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(num)) {
        this.ships[y].hit()
        if (this.ships[y].isSunk()) {
          return Object.assign(this.isOver(), {tiles: this.ships[y].coordinates})
        }
        return {tile: num, hit: true, sunk: false, };
      }
    }
    this.missedArr.push(num);
    return {tile: num, hit: false, sunk: false, };
  }
  
  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

  isOver() {
    return (this.ships.every(ship => ship.sunk === true)) ? {hit: true, sunk: true, gameover: true} : {hit: true, sunk: true,}; 
  }
}



export default GameBoard;
