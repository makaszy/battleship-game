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
