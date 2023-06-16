import createCoorArr from "./create-coordinates-arr/create-coor-arr";

/* Creates ship object from shipInfo object */

class Ship {
  constructor(obj) {
    this.length = obj.length;
    this.coordinates = createCoorArr(obj);
  }

  timesHit = 0;

  sunk = false;

  hit() {
    this.timesHit += 1;
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}

export default Ship;
