import createEventTiles from "../common/create-tiles/create-event-tiles";
import * as publishDataId from "../pub-subs/events"


const gameBoardDivUser = document.querySelector(".gameboard--user");

createEventTiles(gameBoardDivUser, publishDataId.pickPlacement)





