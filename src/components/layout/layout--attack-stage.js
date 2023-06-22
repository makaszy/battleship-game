import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";

import * as init from "../pub-subs/initialize";

import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import publishDataId from "../common/publish-data-id/get-data-id";
import "../views/player--user/player--user";
import { userClick, userAttack } from "../pub-subs/attack--user";
import "../views/player--computer/player--computer";
import {
  computerAttack,
  handleComputerAttack,
} from "../pub-subs/attack--computer";
import "../views/gameboard--user/gameboard--user";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");

createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId);




init.userPlayer.publish();
init.computerGameboard.publish(true);
init.computerPlayer.publish();
init.userGameBoard.publish();
