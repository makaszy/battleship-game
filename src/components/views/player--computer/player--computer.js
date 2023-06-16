import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";

class ComputerPlayer extends Player {
  attack() {
    let num = getRandomNum(101);
    while (!this.isNew(num)) {
      num = getRandomNum(101);
    }
    this.attackArr = num;
    return num;
  }
}

export default ComputerPlayer;
