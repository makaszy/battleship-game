import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";
import {
  computerAttack,
  handleComputerAttack,
} from "../../pub-subs/attack--computer";
import { userAttack } from "../../pub-subs/attack--user";
import * as init from "../../pub-subs/initialize";

class ComputerPlayer extends Player {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }

  foundShip = {found: false, hit: false, coordinates: [], difference: null, endFound: false,}

  wasAttackSuccess = (obj) => {
    if (obj.sunk) {
      this.foundShip = {found: false, hit: false, coordinates: [], difference: null, endFound: false,};
    } else if (obj.hit && this.foundShip.found === false) {
      this.foundShip.coordinates.push(obj.tile);
      this.foundShip.hit = true;
      this.foundShip.found = true;
    } else if (obj.hit && this.foundShip.found === true) {
      this.foundShip.hit = true;
      this.foundShip.coordinates.push(obj.tile);
      if (this.foundShip.difference === null) {
        this.foundShip.difference = Math.abs(this.foundShip.coordinates[0] - obj.tile)
      } 
    } else if (obj.hit === false && this.foundShip.found === true) {
      console.log("endFound")
      this.foundShip.hit = false;
      this.foundShip.endFound = true;
    }
  }

  attack = () => {
    console.log(this.foundShip)
    let num;
    if (this.foundShip.coordinates.length === 1) {
      num = this.foundShip.coordinates[0]+1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10;
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = this.foundShip.coordinates[0] +1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10;
      }
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === true) {
      if (this.foundShip.endFound === false) {
        num = this.foundShip.coordinates[this.foundShip.coordinates.length -1] + this.foundShip.difference
        if (num > 100) {
          num = this.foundShip.coordinates[0] - this.foundShip.difference
        }
        
      } else if (this.foundShip.endFound === true) {
        num = this.foundShip.coordinates[0] - this.foundShip.difference
      } 

    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === false) {
      this.foundShip.endFound = true;
      num = this.foundShip.coordinates[0] - this.foundShip.difference
    }
   if (this.foundShip.found === false) {
      num = getRandomNum(101);
      while (!super.isNew(num)) {
        num = getRandomNum(101);
      }
    }
    super.attackArr = num;
    this.pubSub.publish(num);
    return num;
  };
}

function initCompPlayer() {
  const computerPlayer = new ComputerPlayer(computerAttack);
  userAttack.subscribe(computerPlayer.attack);
  handleComputerAttack.subscribe(computerPlayer.wasAttackSuccess);
}

init.attackStage.subscribe(initCompPlayer);
