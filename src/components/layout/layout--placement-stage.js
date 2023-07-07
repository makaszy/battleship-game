import createTiles from "../common/create-tiles/create-tiles";
import "../views/gameboard--user/ship-info__views--user";
import "../views/gameboard--user/gameboard--user";
import "../views/gameboard--user/gameboard-views--user";
import * as publishDomData from "../common/publish-dom-data/publish-dom-data";
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
    input.addEventListener("click", publishDomData.alertShipInfoChanges);
  });
}

init.placementStage.subscribe(addInputListeners);

function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", publishDomData.placeShipBtn);
}

init.placementStage.subscribe(addBtnListener);

function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  createTiles(gameBoardDivUser, publishDomData.pickPlacement);
}

init.placementStage.subscribe(createPlacementTiles);
