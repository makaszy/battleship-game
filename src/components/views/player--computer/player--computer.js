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
      this.foundShip.hit = false;
      this.foundShip.endFound = true;
      
      this.foundShip.end =
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
     
    } else if (obj.hit === false && this.foundShip.found === true) {
      this.foundShip.hit = false;
    }
  };

  static randomSideAttack(coordinate) {
    const sides = [1, 10]; // data difference for vertical sides is 10, and horizontal sides is 1  
      const operators = [ // array of operators (+, -) which are used to generate a random operator
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
      return operators[Math.floor(Math.random() * operators.length)].method(
        coordinate/* this.foundShip.coordinates[0] */,
        sides[Math.floor(Math.random() * sides.length)] 
      ); // generates the data num of a random side (horizontal left = hit coordinate - 1 / vertical bottom = hit coordinate +10 etc.)
  }

  attack = () => {
    let num;
    if (this.foundShip.coordinates.length === 1) { // if a ship was found, but was only hit once, so it is unknown whether its horizontal or vertical
      num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0])
      while (!super.isNew(num) || num > 100 || num < 1) {
       num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]) // if the generated num was already attacked, or it's too big or too small to be on the board, it generates the num again
      }
    } else if (
      this.foundShip.coordinates.length > 1 &&
      this.foundShip.hit === true
    ) {
      if (this.foundShip.endFound === false) {
    /*     let newCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
        let prevCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 2];
        let coorDiff = this.foundShip.difference; */
        if (
         /*  newCoor > prevCoor */
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] >
          this.foundShip.coordinates[this.foundShip.coordinates.length - 2] 
        ) {
          num =/*  newCoor + coorDiff; */
            this.foundShip.coordinates[this.foundShip.coordinates.length - 1] +
            this.foundShip.difference; 
        } else if (
         /*  newCoor < prevCoor */
          
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] <
          this.foundShip.coordinates[this.foundShip.coordinates.length - 2] 
        ) {
          /* num = newCoor - coorDiff/*  */
          num =  this.foundShip.coordinates[this.foundShip.coordinates.length - 1] -
            this.foundShip.difference; 
        }
        if (num > 100 || num < 1 || !super.isNew(num)) {
          // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true; 
          this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
            console.log(`foundshipcoor ${this.foundShip.coordinates[this.foundShip.coordinates.length - 1]}`)
            
          this.foundShip.coordinates = this.foundShip.coordinates.sort((a,b) => a - b);
          console.log(`sorted ${this.foundShip.coordinates}`) //issue is sort not smallest to largest but largest to smallest
          if (this.foundShip.end === this.foundShip.coordinates[0]) {
            num =
              this.foundShip.coordinates[
                this.foundShip.coordinates.length - 1
              ] + this.foundShip.difference;
          } else {
            num = this.foundShip.coordinates[0] - this.foundShip.difference;
            console.log(`highest number is end ${num}`)
          }
        }
      } else if (this.foundShip.endFound === true) {
        /* console.log num */

        this.foundShip.coordinates = this.foundShip.coordinates.sort((a,b) => a - b);
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
      this.foundShip.coordinates = this.foundShip.coordinates.sort((a,b) => a - b);
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
      while (!super.isNew(num) || num < 1 ) {
        num = getRandomNum(101);
      }
    }
    super.attackArr = num;

    console.log(`published ${num}`);
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
