import Player from "../../common/player/player";
import * as init from "../../pub-subs/initialize";
import { userAttack } from "../../pub-subs/attack--user";
import * as userClick from "../../pub-subs/events"

class UserPlayer extends Player {
 constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }
  
  attack = (value) => {
    if (super.isNew(value)) {
      super.attackArr = value;
      this.pubSub.publish(value);
      return value;
    }
    throw new Error("Tile has already been attacked");
  }
}

function initPlayer() {
  const player = new UserPlayer(userAttack);
  userClick.attack.subscribe(player.attack);
}

init.attackStage.subscribe(initPlayer)

export default UserPlayer;
