import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";

class ComputerPlayer extends Player {
  attack = () => {
    let num = getRandomNum(101);
    while (!super.isNew(num)) {
      num = getRandomNum(101);
    }
    super.attackArr = num;
    return num;
  }
}

export default ComputerPlayer;
