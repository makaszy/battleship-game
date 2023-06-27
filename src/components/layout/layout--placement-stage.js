import createEventTiles from "../common/create-tiles/create-event-tiles";
import "../views/gameboard--user/ship-info__views--user";
import "../views/gameboard--user/gameboard--user";
import "../views/gameboard--user/gameboard-views--user"
import * as publishDomData from "../common/publish-dom-data/publish-dom-data";
import "../layout/layout--attack-stage";

const gameBoardDivUser = document.querySelector(".gameboard--user");

const inputs = document.querySelectorAll(".placement-form__input");

inputs.forEach((input) => {
  input.addEventListener("click", publishDomData.alertShipInfoChanges);
});

const placeShipBtn = document.querySelector(".placement-form__place-btn")

placeShipBtn.addEventListener("click", publishDomData.placeShipBtn)

createEventTiles(gameBoardDivUser, publishDomData.pickPlacement);
