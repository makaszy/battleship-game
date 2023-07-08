import createTiles from "../common/create-tiles/create-tiles";
import "../views/gameboard--user/ship-info__views--user";
import "../views/gameboard--user/gameboard--user";
import "../views/gameboard--user/gameboard-views--user";
import * as userClick from "../pub-subs/events"
import "./layout--attack-stage";
import * as init from "../pub-subs/initialize";

function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}

init.placementStage.subscribe(hideCompBoard);

function addInputListeners() {
  const formInputs = document.querySelectorAll(".placement-form__input");
  formInputs.forEach((input) => {
    input.addEventListener("click", () => { userClick.input.publish();});
  });
}

init.placementStage.subscribe(addInputListeners);

function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", () => { userClick.shipPlaceBtn.publish();});
}

init.placementStage.subscribe(addBtnListener);

function publishDataId() {
  const {id} = this.dataset; 
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

init.placementStage.subscribe(createPlacementTiles);
init.attackStage.subscribe(removeEventListeners)
