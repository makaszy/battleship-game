import createEventTiles from "../common/create-tiles/create-event-tiles";
import createTiles from "../common/create-tiles/create-tiles";
import getDataId from "../common/get-data-id/get-data-id";

const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer")


createTiles(gameBoardDivUser);

createEventTiles(gameBoardDivComputer, getDataId)


