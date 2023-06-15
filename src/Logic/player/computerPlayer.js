import Player from "./player";
import getRandomNum from "../gameboard/randomNum";

class ComputerPlayer extends Player {
  attack() {
    let num = getRandomNum(101);
    while(!this.isNew(num)) {
      num = getRandomNum(101)
    }
    this.attackArr = num;
    return num;
  }
};

export default ComputerPlayer;