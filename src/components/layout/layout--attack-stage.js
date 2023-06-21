import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import publishDataId from "../common/publish-data-id/get-data-id";
import UserPlayer from "../views/player--user/player--user";
import { userClick, receiveUserAttack} from "../gameplay/attack--user";
import ComputerGameBoard from "../views/gameboard--computer/gameboard--computer";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer")


const player = new UserPlayer(receiveUserAttack)
const computerBoard = new ComputerGameBoard();

userClick.subscribe(player.attack)

receiveUserAttack.subscribe(computerBoard.receiveAttack)


createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId)


