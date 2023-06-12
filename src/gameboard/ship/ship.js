import createCoorArr from "../createCoorArr/createCoorArr";

class Ship {
  
  constructor(obj) {
    this.length = obj.length
    this.coordinatesArr = createCoorArr(obj)
  }

  timesHit = 0;

  sunk = false;

  hit() {
    this.timesHit += 1
  }

  isSunk() {
    return this.timesHit === this.length;
  }

}

export default Ship