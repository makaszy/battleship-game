import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";
import "../views/player--user/player--user";
import "../views/player--computer/player--computer";
import "../views/gameboard--user/gameboard--user";

import * as init from "../pub-subs/initialize";

import createTiles from "../common/create-tiles/create-tiles";
import * as userClick from "../pub-subs/events"

const gameBoardDivComputer = document.querySelector(".gameboard--computer");

/* hides the form */
function hideForm() {
  const form = document.querySelector(".placement-form");
  form.classList.add("hidden");
}

function showCompBoard() {
  const compBoard = document.querySelector(".div--computer");
  compBoard.classList.remove("hidden");
}

init.attackStage.subscribe(showCompBoard);

/* publish the tile's data-id */
function publishDataId() {
  const {id} = this.dataset;
  userClick.attack.publish(id)
}

/* Creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */
function initAttackStageTiles() {
  createTiles(gameBoardDivComputer, publishDataId);
}

/* Creates gameover notification and new game btn */

function createNewGameBtn() {
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.textContent = "Start New Game";
  btn.addEventListener("click", () => {
    window.location.reload();
  });
  return btn;
}

function createGameOverAlert(string) {
  const div = document.createElement("div");
  div.classList.add("game-over-notification");

  const h1 = document.createElement("h1");
  h1.classList.add("game-over-notification__heading");
  h1.textContent = "GAME OVER";
  div.appendChild(h1);

  const h3 = document.createElement("h3");
  h3.classList.add("game-over-notification__sub-heading");
  string === "user"
    ? (h3.textContent = "YOU LOST")
    : (h3.textContent = "YOU WON");
  div.appendChild(h3);
  div.appendChild(createNewGameBtn());
  return div;
}

function showGameOver(string) {
  const main = document.querySelector("main");
  const notification = createGameOverAlert(string);
  main.appendChild(notification);
}

init.attackStage.subscribe(initAttackStageTiles);
init.attackStage.subscribe(hideForm);
init.gameover.subscribe(showGameOver);
