import "../views/gameboard--computer/gameboard__views--computer"
import "../views/gameboard--user/gameboard-views--user"

import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import publishDataId from "../common/publish-data-id/get-data-id";
import UserPlayer from "../views/player--user/player--user";
import {
  userClick,
  userAttack,
  handleUserAttack,
} from "../gameplay/attack--user";
import ComputerGameBoard from "../views/gameboard--computer/gameboard--computer";
import ComputerPlayer from "../views/player--computer/player--computer";
import { computerAttack, handleComputerAttack } from "../gameplay/attack--computer";
import UserGameBoard from "../views/gameboard--user/gameboard--user";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");


createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId);




const player = new UserPlayer(userAttack);








const computerBoard = new ComputerGameBoard(handleUserAttack);
computerBoard.placeShip(1)
computerBoard.placeShip(1)
computerBoard.placeShip(1)
computerBoard.placeShip(1)
console.log(computerBoard.ships)

userClick.subscribe(player.attack);

userAttack.subscribe(computerBoard.handleAttack);





const computerPlayer = new ComputerPlayer(computerAttack)

const userBoard = new UserGameBoard(handleComputerAttack)

userAttack.subscribe(computerPlayer.attack);

computerAttack.subscribe(userBoard.handleAttack)
