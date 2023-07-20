import "../views/gameboard--user/ship-info/ship-info__views--user";
import "../views/gameboard--user/gameboard--user";
import "../views/gameboard--user/gameboard-views--user";
import "./layout--attack-stage";
import createTiles from "../common/create-tiles/create-tiles";
import {
  placementStage as initPlacementStage,
  attackStage as initAttackStage,
} from "../pub-subs/initialize";
import * as userClick from "../pub-subs/events";

function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}

function addInputListeners() {
  const formInputs = document.querySelectorAll(".placement-form__input");
  formInputs.forEach((input) => {
    input.addEventListener("click", () => {
      userClick.input.publish();
    });
  });
}

function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", () => {
    userClick.shipPlaceBtn.publish();
  });
}

function publishDataId() {
  const { id } = this.dataset;
  userClick.pickPlacement.publish(id);
}

function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  createTiles(gameBoardDivUser, publishDataId);
}

/* Removes event listeners from the user gameboard */

function removeEventListeners() {
  const tiles = document.querySelectorAll(".gameboard--user .gameboard__tile");
  tiles.forEach((tile) => {
    tile.removeEventListener("click", publishDataId);
  });
}

/* removes anchor cursor from user gameboard */
function removeAnchor() {
  const gameboard = document.querySelector(".gameboard--user");
  gameboard.setAttribute("style", "cursor: auto");
}



/* initialization subscriptions */

initPlacementStage.subscribe(addBtnListener);
initPlacementStage.subscribe(addInputListeners);
initPlacementStage.subscribe(hideCompBoard);
initPlacementStage.subscribe(createPlacementTiles);
initAttackStage.subscribe(removeEventListeners);
initAttackStage.subscribe(removeAnchor);
