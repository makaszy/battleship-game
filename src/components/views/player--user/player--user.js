import Player from "../../common/player/player";


class UserPlayer extends Player {
  
  attack = (value) => {
    if (super.isNew(value)) {
      super.attackArr = value;
      return value;
    }
    return Error("Tile has already been attacked");
  }
}


export default UserPlayer;
