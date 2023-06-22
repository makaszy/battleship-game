import Player from "../../common/player/player";
import * as init from "../../pub-subs/initialize";
import { userClick, userAttack } from "../../pub-subs/attack--user";

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
  userClick.subscribe(player.attack);
}

init.userPlayer.subscribe(initPlayer)

export default UserPlayer;
