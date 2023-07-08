
import getRandomDirection from "./get-random-direction/get-random-direction";
import getRandomTileNum from "./get-random-tile-num/get-random-tile-num";

class ShipInfo {
  
  constructor(length) {
    this.length = length;
    this.direction = getRandomDirection();
    this.tileNum = getRandomTileNum(this.length, this.direction);
  }
}

export default ShipInfo;
