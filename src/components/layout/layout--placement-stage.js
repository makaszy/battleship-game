import createEventTiles from "../common/create-tiles/create-event-tiles";
import "../views/gameboard--user/ship-info__views--user";
import "../views/gameboard--user/gameboard--user";
import "../views/gameboard--user/gameboard-views--user";
import * as publishDomData from "../common/publish-dom-data/publish-dom-data";
import "./layout--attack-stage";
import * as init from "../pub-subs/initialize";

/* remove existing tiles */

function removeTiles(playerString) {
  if (
    typeof playerString !== "string" &&
    (playerString === "user" || playerString === "computer")
  ) {
    throw new Error(
      "Function argument has to be a string with the value user or computer"
    );
  }
  const gameboard = document.querySelector(`.gameboard--${playerString}`);
  while (gameboard.firstChild) {
    gameboard.removeChild(gameboard.lastChild);
  }
}

/* removes existing tiles from gameboard--computer and gameboard--user */

function resetBoards() {
  removeTiles("user");
  removeTiles("computer");
}


function showAllHidden(nodes) {
  const nodesArr = Array.from(nodes);
  nodesArr.forEach((node) => {
    if (node.classList.contains("hidden")) {
      node.classList.remove("hidden");
    }
  });
}

function resetForm() {
  const form = document.querySelector(".placement-form")
  form.classList.remove("hidden");
  const formInputs = document.querySelectorAll(".placement-form__input");
  const formLabels = document.querySelectorAll("label");
  showAllHidden(formInputs);
  showAllHidden(formLabels);
}

function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}

init.placementStage.subscribe(hideCompBoard)

function addInputListeners() {
  const formInputs = document.querySelectorAll(".placement-form__input");
  formInputs.forEach((input) => {
    input.addEventListener("click", publishDomData.alertShipInfoChanges);
  });
}

init.placementStage.subscribe(addInputListeners)

function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", publishDomData.placeShipBtn);
}

init.placementStage.subscribe(addBtnListener)

function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  createEventTiles(gameBoardDivUser, publishDomData.pickPlacement);
}

init.placementStage.subscribe(createPlacementTiles)



