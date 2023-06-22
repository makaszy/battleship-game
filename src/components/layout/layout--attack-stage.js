import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";
import "../views/player--user/player--user";
import "../views/player--computer/player--computer";
import "../views/gameboard--user/gameboard--user";

import * as init from "../pub-subs/initialize";

import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import * as publishDataId from "../common/publish-data-id/get-data-id";


const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");

createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId.attack);




init.userPlayer.publish();
init.computerGameboard.publish(true);
init.computerPlayer.publish();
init.userGameBoard.publish();
