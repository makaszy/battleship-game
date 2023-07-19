import "../views/gameboard--computer/gameboard__views--computer";
import "../views/gameboard--user/gameboard-views--user";
import "../views/gameboard--computer/gameboard--computer";
import "../views/player--user/player--user";
import "../views/player--computer/player--computer";
import "../views/gameboard--user/gameboard--user";
import createTiles from "../common/create-tiles/create-tiles";
import { attackStage as initAttackStage, gameover as initGameover } from "../pub-subs/initialize";
import { attack as userClickAttack } from "../pub-subs/events"; 

const gameBoardDivComputer = document.querySelector(".gameboard--computer");

/* hides the placement form */

function hideForm() {
  const form = document.querySelector(".div--placement-form");
  form.classList.add("hidden");
}

/* show's the computer's board */

function showCompBoard() {
  const compBoard = document.querySelector(".div--computer");
  compBoard.classList.remove("hidden");
}

/* publish the tile's data-id */

function publishDataId() {
  const {id} = this.dataset;
  userClickAttack.publish(id)
}

/* creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */

function initAttackStageTiles() {
  createTiles(gameBoardDivComputer, publishDataId);
}

/* creates gameover notification and new game btn */

function createNewGameBtn() {
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.textContent = "New Game";
  btn.classList.add("game-over-notification__btn")
  btn.addEventListener("click", () => {
    window.location.reload();
  });
  return btn;
}

function createGameOverAlert(string) {
  const div = document.createElement("div"); 
  const h1 = document.createElement("h1");
  h1.classList.add("game-over-notification__heading")
  h1.textContent = "GAME OVER";
  const h3 = document.createElement("h3");
  h3.classList.add("game-over-notification__sub-heading");
  /* const image = document.createElement("img")
  image.setAttribute("alt", "game over notification") */
  if (string === "user") {
    h3.textContent = "YOU LOST";/* 
    image.setAttribute("src", "../src/images/game-over--loss.png") */
    div.classList.add("game-over-notification--loss");/* 
    image.classList.add("game-over-notification__image--loss"); */
  } else {
    h3.textContent = "YOU WON"/* 
    image.setAttribute("src", "../src/images/game-over--win.png") */
    div.classList.add("game-over-notification--win");/* 
    image.classList.add("game-over-notification__image--win"); */
  }
  div.appendChild(h1);
  div.appendChild(h3);
  
  div.appendChild(createNewGameBtn());
  /* div.appendChild(image); */
  return div;
}

function showGameOver(string) {
  const main = document.querySelector("main");
  const notification = createGameOverAlert(string);
  main.appendChild(notification);
}

/* Subscribe to initializing pub-subs */

initAttackStage.subscribe(showCompBoard);
initAttackStage.subscribe(initAttackStageTiles);
initAttackStage.subscribe(hideForm);
initGameover.subscribe(showGameOver);
