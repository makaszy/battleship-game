class Ship {
  
  constructor(length) {
    this.length = length
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