import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";
import { computerAttack } from "../../pub-subs/attack--computer";
import { userAttack } from "../../pub-subs/attack--user";
import * as init from "../../pub-subs/initialize"

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

function initCompPlayer () {
  const computerPlayer = new ComputerPlayer(computerAttack);
  userAttack.subscribe(computerPlayer.attack);
}

init.attackStage.subscribe(initCompPlayer)

