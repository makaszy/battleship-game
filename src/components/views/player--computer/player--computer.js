import Player from "../../common/player/player";
import getRandomNum from "../../../utils/get-random-num";
import { userAttack } from "../../pub-subs/attack--user";
import {attackStage as initAttackStage} from "../../pub-subs/initialize";
import {
  computerAttack,
  handleComputerAttack,
} from "../../pub-subs/attack--computer";

class ComputerPlayer extends Player {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }

  /* holds information on any ship that was found */

  foundShip = {
    found: false,
    hit: false,
    coordinates: [],
    difference: null,
    endFound: false,
    end: null,
  };

  /* receives information on the last attack and adjusts the foundShip object accordingly */

  wasAttackSuccess = (obj) => {
    if (obj.sunk) {
      this.foundShip = {
        found: false,
        hit: false,
        coordinates: [],
        difference: null,
        endFound: false,
      };
    } else if (obj.hit && this.foundShip.found === false) {
      this.foundShip.coordinates.push(obj.tile);
      this.foundShip.hit = true;
      this.foundShip.found = true;
    } else if (obj.hit && this.foundShip.found === true) {
      this.foundShip.hit = true;
      this.foundShip.coordinates.push(obj.tile);
      if (this.foundShip.difference === null) {
        this.foundShip.difference = Math.abs(
          this.foundShip.coordinates[0] - obj.tile
        );
      }
    } else if (
      obj.hit === false &&
      this.foundShip.found === true &&
      this.foundShip.coordinates.length > 1
    ) {
      this.foundShip.hit = false;
      this.foundShip.endFound = true;

      this.foundShip.end =
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
    } else if (obj.hit === false && this.foundShip.found === true) {
      this.foundShip.hit = false;
    }
  };

  /* generates a coordinate (either top, btm, left, or right) that is next to the coordinate passed */

  static randomSideAttack(coordinate) {
    const sides = [1, 10]; // data difference for vertical sides is 10, and horizontal sides is 1
    const operators = [
      // array of operators (+, -) which are used to generate a random operator
      {
        sign: "+",
        method(a, b) {
          return a + b;
        },
      },
      {
        sign: "-",
        method(a, b) {
          return a - b;
        },
      },
    ];
    return operators[Math.floor(Math.random() * operators.length)].method(
      coordinate,
      sides[Math.floor(Math.random() * sides.length)]
    ); // generates the data num of a random side (horizontal left = hit coordinate - 1 / vertical bottom = hit coordinate +10 etc.)
  }

  /* computer attack logic */

  attack = () => {
    let num;
    /* A) if a ship was found, but was only hit once, so it is unknown whether its horizontal or vertical */
    if (this.foundShip.coordinates.length === 1) {
      num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]);
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]); // if the generated num was already attacked, or it's too big or too small to be on the board, it generates the num again
      }
    /* B) if a ship was found, and was hit more than once, with the last attack also being a hit */  
    } else if (
      this.foundShip.coordinates.length > 1 &&
      this.foundShip.hit === true
    ) {
      /* B)1. if the end of the ship was not found */
      if (this.foundShip.endFound === false) {
        const newCoor =
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
        const prevCoor =
          this.foundShip.coordinates[this.foundShip.coordinates.length - 2];
        const coorDiff = this.foundShip.difference;
        if (newCoor > prevCoor) {
          num = newCoor + coorDiff;
        } else if (newCoor < prevCoor) {
          num = newCoor - coorDiff;
        }
        if (num > 100 || num < 1 || !super.isNew(num)) { // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true;
          this.foundShip.end = newCoor;
          this.foundShip.coordinates = this.foundShip.coordinates.sort(
            (a, b) => a - b
          );
          if (this.foundShip.end === this.foundShip.coordinates[0]) { 
            num =
              this.foundShip.coordinates[
                this.foundShip.coordinates.length - 1
              ] + coorDiff;
          } else {
            num = this.foundShip.coordinates[0] - coorDiff;
          }
        }
      /* B)2. if the end of the ship was found */  
      } else if (this.foundShip.endFound === true) {
        const coorDiff = this.foundShip.difference;
        this.foundShip.coordinates = this.foundShip.coordinates.sort(
          (a, b) => a - b
        );
        if (this.foundShip.end === this.foundShip.coordinates[0]) {
          num =
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
            coorDiff;
        } else {
          num = this.foundShip.coordinates[0] - coorDiff;
        }
      }
    /* C) if a ship was found, and was hit more than once, with the last attack being a miss */  
    } else if (
      this.foundShip.coordinates.length > 1 &&
      this.foundShip.hit === false
    ) {
      this.foundShip.endFound = true;
      this.foundShip.end =
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
      this.foundShip.coordinates = this.foundShip.coordinates.sort(
        (a, b) => a - b
      );
      if (this.foundShip.end === this.foundShip.coordinates[0]) {
        num =
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
          this.foundShip.difference;
      } else {
        num = this.foundShip.coordinates[0] - this.foundShip.difference;
      }
    /* D) ship was not found */  
    } else {
      num = getRandomNum(101);
      while (!super.isNew(num) || num < 70) {
        num = getRandomNum(101);
      }
    }
    /* Publish and Add to arr */
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

initAttackStage.subscribe(initCompPlayer);

export default ComputerPlayer;