import createEventTiles from "../common/create-tiles/create-event-tiles";
import "../views/gameboard--user/ship-info__views--user"
import * as publishDataId from "../common/publish-data-id/get-data-id"
import * as userClick from "../pub-subs/events"


const gameBoardDivUser = document.querySelector(".gameboard--user");

const inputs = document.querySelectorAll(".placement-form__input")

function userClicked () {
  userClick.input.publish()
}

inputs.forEach((input) => {
  input.addEventListener("click", userClicked)
  
});


createEventTiles(gameBoardDivUser, publishDataId.pickPlacement)





