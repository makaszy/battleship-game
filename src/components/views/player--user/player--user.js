import Player from "../../common/player/player";

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


export default UserPlayer;
