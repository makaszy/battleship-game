import createCoordinate from "./createCoordinate/createCoordinate"
import direction from "./direction/direction";

class ShipInfo {
  constructor(length) {
    this.length = length;
    this.direction = direction();
    this.tileNum = createCoordinate(this.length, this.direction);
  }
}

export default ShipInfo;
