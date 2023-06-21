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
import GameBoardViewUpdater from "../common/gameboard-view-updater/gameboard-view-updater";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");



const computer = "computer";

const computerViewUpdater = new GameBoardViewUpdater(computer);

handleUserAttack.subscribe(computerViewUpdater.handleAttackView)

const player = new UserPlayer(userAttack);
const computerBoard = new ComputerGameBoard(handleUserAttack);

userClick.subscribe(player.attack);

userAttack.subscribe(computerBoard.handleAttack);

createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId);
