import createEventTiles from "../common/create-tiles/create-event-tiles";
import "../views/gameboard--user/ship-info__views--user";
import * as publishDomData from "../common/publish-data-id/get-data-id";


const gameBoardDivUser = document.querySelector(".gameboard--user");

const inputs = document.querySelectorAll(".placement-form__input");

inputs.forEach((input) => {
  input.addEventListener("click", publishDomData.alertShipInfoChanges);
});

createEventTiles(gameBoardDivUser, publishDomData.pickPlacement);
