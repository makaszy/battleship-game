import getRandomTileNum from "./getRandomTileNum/getRandomTileNum";
import direction from "./direction/direction";

class ShipInfo {
  constructor(length) {
    this.length = length;
    this.direction = direction();
    this.tileNum = getRandomTileNum(this.length, this.direction);
  }
}

export default ShipInfo;
