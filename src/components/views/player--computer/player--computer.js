import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";

class ComputerPlayer extends Player {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }

  attack = () => {
    let num = getRandomNum(101);
    while (!super.isNew(num)) {
      num = getRandomNum(101);
    }
    super.attackArr = num;
    this.pubSub.publish(num)
    return num
  }
}

export default ComputerPlayer;
