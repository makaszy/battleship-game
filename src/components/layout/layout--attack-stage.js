import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";
import "../views/player--user/player--user";
import "../views/player--computer/player--computer";
import "../views/gameboard--user/gameboard--user";

import * as init from "../pub-subs/initialize";

import createEventTiles from "../common/create-tiles/create-event-tiles";
import * as publishDomData from "../common/publish-dom-data/publish-dom-data";


const gameBoardDivComputer = document.querySelector(".gameboard--computer");


/* Removes event listeners from the user gameboard */
function removeEventListeners( ) {
  const tiles = document.querySelectorAll(".gameboard--user .gameboard__tile")
  tiles.forEach((tile) => {
    tile.removeEventListener("click", publishDomData.pickPlacement)
  })
}

/* Creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */
function initAttackStageTiles() {
  removeEventListeners()
  createEventTiles(gameBoardDivComputer, publishDomData.attack);
}

init.attackStage.subscribe(initAttackStageTiles)