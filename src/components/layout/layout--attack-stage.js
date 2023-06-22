import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";

import initComputerGameboard from "../pub-subs/initialize";

import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import publishDataId from "../common/publish-data-id/get-data-id";
import UserPlayer from "../views/player--user/player--user";
import { userClick, userAttack } from "../pub-subs/attack--user";
import ComputerPlayer from "../views/player--computer/player--computer";
import {
  computerAttack,
  handleComputerAttack,
} from "../pub-subs/attack--computer";
import UserGameBoard from "../views/gameboard--user/gameboard--user";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");

createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId);

const player = new UserPlayer(userAttack);
userClick.subscribe(player.attack);

const computerPlayer = new ComputerPlayer(computerAttack);
userAttack.subscribe(computerPlayer.attack);

const userBoard = new UserGameBoard(handleComputerAttack);
computerAttack.subscribe(userBoard.handleAttack);

initComputerGameboard.publish(true);
