import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import publishDataId from "../common/publish-data-id/get-data-id";
import UserPlayer from "../views/player--user/player--user";
import { userClick } from "../gameplay/attack--user";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer")


const player = new UserPlayer()
userClick.subscribe(player.attack)

createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, publishDataId)


