import getRandomTileNum from "./getRandomTileNum/getRandomTileNum";
import getRandomDirection from "./getRandomDirection/getRandomDirection";

class ShipInfo {
  constructor(length) {
    this.length = length;
    this.direction = getRandomDirection();
    this.tileNum = getRandomTileNum(this.length, this.direction);
  }
}

export default ShipInfo;
