import createEventTiles from "../common/create-tiles/create-event-tiles";
import "../views/gameboard--user/ship-info__views--user";
import * as publishDomData from "../common/publish-dom-data/publish-dom-data";

const gameBoardDivUser = document.querySelector(".gameboard--user");

const inputs = document.querySelectorAll(".placement-form__input");

inputs.forEach((input) => {
  input.addEventListener("click", publishDomData.alertShipInfoChanges);
});

createEventTiles(gameBoardDivUser, publishDomData.pickPlacement);
