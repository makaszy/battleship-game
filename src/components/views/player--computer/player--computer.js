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

  foundShip = {
    found: false,
    hit: false,
    coordinates: [],
    difference: null,
    endFound: false,
    end: null,
  };

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
      console.log("endFound");
      this.foundShip.hit = false;
      this.foundShip.endFound = true;
      this.foundShip.end =
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
    } else if (obj.hit === false && this.foundShip.found === true) {
      this.foundShip.hit = false;
    }
  };

  attack = () => {
    console.log(this.foundShip);
    let num;
    if (this.foundShip.coordinates.length === 1) {
      const sides = [1, 10];
      const operators = [
        {
          sign: "+",
          method (a, b) {
            return a + b;
          },
        },
        {
          sign: "-",
          method (a, b) {
            return a - b;
          },
        },
      ];

      num = operators[Math.floor(Math.random() * operators.length)].method(
        this.foundShip.coordinates[0],
        sides[Math.floor(Math.random() * sides.length)]
      );
      console.log(num);
      /* num = this.foundShip.coordinates[0]+1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10; */ //need to refactor this
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = operators[Math.floor(Math.random() * operators.length)].method(
          this.foundShip.coordinates[0],
          sides[Math.floor(Math.random() * sides.length)]
        );
        console.log(num);
        /*  num = this.foundShip.coordinates[0] +1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10; */
      }
    } else if (
      this.foundShip.coordinates.length > 1 &&
      this.foundShip.hit === true
    ) {
      if (this.foundShip.endFound === false) {
        if (
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] >
          this.foundShip.coordinates[this.foundShip.coordinates.length - 2]
        ) {
          num =
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
            this.foundShip.difference;
        } else if (
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] <
          this.foundShip.coordinates[this.foundShip.coordinates.length - 2]
        ) {
          num =
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1] -
            this.foundShip.difference;
        }
        if (num > 100 || num < 1 || !super.isNew(num)) {
          // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true;
          this.foundShip.end =
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
          this.foundShip.coordinates = this.foundShip.coordinates.sort();
          if (this.foundShip.end === this.foundShip.coordinates[0]) {
            num =
              this.foundShip.coordinates[
                this.foundShip.coordinates.length - 1
              ] + this.foundShip.difference;
          } else {
            num = this.foundShip.coordinates[0] - this.foundShip.difference;
          }
        }
      } else if (this.foundShip.endFound === true) {
        /* console.log num */
        if (this.foundShip.end === this.foundShip.coordinates[0]) {
          num =
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
            this.foundShip.difference;
        } else {
          num = this.foundShip.coordinates[0] - this.foundShip.difference;
        }
      }
    } else if (
      this.foundShip.coordinates.length > 1 &&
      this.foundShip.hit === false
    ) {
      this.foundShip.endFound = true;
      this.foundShip.end =
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
      this.foundShip.coordinates = this.foundShip.coordinates.sort();
      if (this.foundShip.end === this.foundShip.coordinates[0]) {
        num =
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
          this.foundShip.difference;
      } else {
        num = this.foundShip.coordinates[0] - this.foundShip.difference;
      }
    }
    if (this.foundShip.found === false) {
      num = getRandomNum(101);
      while (!super.isNew(num)) {
        num = getRandomNum(101);
      }
    }
    super.attackArr = num;
    this.pubSub.publish(num);
    console.log(num);
    return num;
  };
}

function initCompPlayer() {
  const computerPlayer = new ComputerPlayer(computerAttack);
  userAttack.subscribe(computerPlayer.attack);
  handleComputerAttack.subscribe(computerPlayer.wasAttackSuccess);
}

init.attackStage.subscribe(initCompPlayer);
