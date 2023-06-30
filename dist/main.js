/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/common/create-tiles/create-event-tiles.js":
/*!******************************************************************!*\
  !*** ./src/components/common/create-tiles/create-event-tiles.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_tile_create_single_event_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-tile/create-single-event-tile */ "./src/components/common/create-tiles/create-tile/create-single-event-tile.js");

function createEventTiles(div, callback) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild((0,_create_tile_create_single_event_tile__WEBPACK_IMPORTED_MODULE_0__["default"])(i, callback));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (createEventTiles);

/***/ }),

/***/ "./src/components/common/create-tiles/create-tile/create-single-event-tile.js":
/*!************************************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tile/create-single-event-tile.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_single_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-single-tile */ "./src/components/common/create-tiles/create-tile/create-single-tile.js");

function createSingleEventTile(id, callback) {
  const tile = (0,_create_single_tile__WEBPACK_IMPORTED_MODULE_0__["default"])(id);
  tile.addEventListener("click", callback);
  return tile;
}
/* harmony default export */ __webpack_exports__["default"] = (createSingleEventTile);

/***/ }),

/***/ "./src/components/common/create-tiles/create-tile/create-single-tile.js":
/*!******************************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tile/create-single-tile.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function createSingleTile(id) {
  const tile = document.createElement("div");
  tile.classList.add("gameboard__tile");
  tile.setAttribute("data-id", id);
  return tile;
}
/* harmony default export */ __webpack_exports__["default"] = (createSingleTile);

/***/ }),

/***/ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js":
/*!********************************************************************************!*\
  !*** ./src/components/common/gameboard-view-updater/gameboard-view-updater.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");

class GameBoardViewUpdater {
  constructor(string) {
    this.string = string;
  }
  static updateSunk(tile) {
    if (tile.classList.contains("hit")) {
      tile.classList.replace("hit", "sunk");
    } else {
      tile.classList.add("sunk");
    }
  }
  static getStatus(obj) {
    return obj.hit ? "hit" : "miss";
  }
  updateSunkTiles(obj) {
    obj.tiles.forEach(element => {
      const tile = document.querySelector(`.gameboard--${this.string} [data-id="${element}"]`);
      GameBoardViewUpdater.updateSunk(tile);
    });
  }
  handleAttackView = obj => {
    if (obj.sunk) {
      this.updateSunkTiles(obj);
      if (obj.gameover) {
        _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_0__.gameover.publish(this.string);
      }
    } else {
      const tile = document.querySelector(`.gameboard--${this.string} [data-id="${obj.tile}"]`);
      tile.classList.add(GameBoardViewUpdater.getStatus(obj));
    }
  };
}
/* harmony default export */ __webpack_exports__["default"] = (GameBoardViewUpdater);

/***/ }),

/***/ "./src/components/common/gameboard/gameboard.js":
/*!******************************************************!*\
  !*** ./src/components/common/gameboard/gameboard.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class GameBoard {
  constructor(pubSub) {
    this.pubSub = pubSub;
  }
  shipsArr = [];
  get ships() {
    return this.shipsArr;
  }
  set ships(value) {
    if (Array.isArray(value)) {
      this.shipsArr = this.shipsArr.concat(value);
    } else {
      this.shipsArr.push(value);
    }
  }
  missedArr = [];

  /* Checks if coordinates already have a ship on them */

  isTaken(coordinates) {
    for (let i = 0; i < coordinates.length; i += 1) {
      for (let y = 0; y < this.ships.length; y += 1) {
        if (this.ships[y].coordinates.includes(coordinates[i])) {
          return true;
        }
      }
    }
    return false;
  }

  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  handleAttack = num => {
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(+num)) {
        this.ships[y].hit();
        if (this.ships[y].isSunk()) {
          const obj = {
            hit: true,
            sunk: true,
            tiles: this.ships[y].coordinates
          };
          return this.isOver() ? this.pubSub.publish({
            ...obj,
            ...{
              gameover: true
            }
          }) : this.pubSub.publish(obj);
        }
        return this.pubSub.publish({
          tile: num,
          hit: true,
          sunk: false
        });
      }
    }
    this.missedArr.push(num);
    return this.pubSub.publish({
      tile: num,
      hit: false,
      sunk: false
    });
  };

  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

  isOver = () => {
    const check = this.ships.every(ship => ship.sunk === true);
    return check;
  };
}
/* harmony default export */ __webpack_exports__["default"] = (GameBoard);

/***/ }),

/***/ "./src/components/common/player/player.js":
/*!************************************************!*\
  !*** ./src/components/common/player/player.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Player {
  previousAttacks = [];
  get attackArr() {
    return this.previousAttacks;
  }
  set attackArr(value) {
    this.previousAttacks.push(value);
  }
  isNew(value) {
    return !this.attackArr.includes(value);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (Player);

/***/ }),

/***/ "./src/components/common/pub-sub/pub-sub.js":
/*!**************************************************!*\
  !*** ./src/components/common/pub-sub/pub-sub.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class PubSub {
  constructor() {
    this.subscribers = [];
  }
  subscribe(subscriber) {
    if (typeof subscriber !== 'function') {
      throw new Error(`${typeof subscriber} is not a valid argument, provide a function instead`);
    }
    this.subscribers.push(subscriber);
  }
  unsubscribe(subscriber) {
    if (typeof subscriber !== 'function') {
      throw new Error(`${typeof subscriber} is not a valid argument, provide a function instead`);
    }
    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);
  }
  publish(payload) {
    this.subscribers.forEach(subscriber => subscriber(payload));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (PubSub);

/***/ }),

/***/ "./src/components/common/publish-dom-data/publish-dom-data.js":
/*!********************************************************************!*\
  !*** ./src/components/common/publish-dom-data/publish-dom-data.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   alertShipInfoChanges: function() { return /* binding */ alertShipInfoChanges; },
/* harmony export */   attack: function() { return /* binding */ attack; },
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; },
/* harmony export */   placeShipBtn: function() { return /* binding */ placeShipBtn; }
/* harmony export */ });
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");


/* triggers when a user picks a coordinate to attack */

function attack() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.attack.publish(this.dataset.id);
}

/* triggers shipPlacement.updateNum in ship-info__views--user which stores the user's current ship placement pick. Once updated userClick.input.publish() is run */

function pickPlacement() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.pickPlacement.publish(this.dataset.id);
}

/* triggers createShipInfo func in ship-info__views--user when user clicked an input */

function alertShipInfoChanges() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.input.publish();
}
function placeShipBtn() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.shipPlaceBtn.publish();
}

/* Files are imported * as publishDomData */



/***/ }),

/***/ "./src/components/common/ship/create-coordinates-arr/create-coor-arr.js":
/*!******************************************************************************!*\
  !*** ./src/components/common/ship/create-coordinates-arr/create-coor-arr.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* Creates a coordinate arr for a ship object's coordinates property from shipInfo object */

function createCoorArr(obj) {
  const arr = [+obj.tileNum];
  for (let i = 1; i < obj.length; i += 1) {
    if (obj.direction === "horizontal") {
      arr.push(arr[i - 1] + 1);
    } else {
      arr.push(arr[i - 1] + 10);
    }
  }
  return arr;
}
/* harmony default export */ __webpack_exports__["default"] = (createCoorArr);

/***/ }),

/***/ "./src/components/common/ship/ship.js":
/*!********************************************!*\
  !*** ./src/components/common/ship/ship.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_coordinates_arr_create_coor_arr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-coordinates-arr/create-coor-arr */ "./src/components/common/ship/create-coordinates-arr/create-coor-arr.js");


/* Creates ship object from shipInfo object */

class Ship {
  constructor(obj) {
    this.length = +obj.length;
    this.coordinates = (0,_create_coordinates_arr_create_coor_arr__WEBPACK_IMPORTED_MODULE_0__["default"])(obj);
  }
  timesHit = 0;
  sunk = false;
  hit() {
    this.timesHit += 1;
  }
  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
/* harmony default export */ __webpack_exports__["default"] = (Ship);

/***/ }),

/***/ "./src/components/layout/layout--attack-stage.js":
/*!*******************************************************!*\
  !*** ./src/components/layout/layout--attack-stage.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_gameboard_computer_gameboard_views_computer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/gameboard--computer/gameboard__views--computer */ "./src/components/views/gameboard--computer/gameboard__views--computer.js");
/* harmony import */ var _views_gameboard_user_gameboard_views_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/gameboard-views--user */ "./src/components/views/gameboard--user/gameboard-views--user.js");
/* harmony import */ var _views_gameboard_computer_gameboard_computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/gameboard--computer/gameboard--computer */ "./src/components/views/gameboard--computer/gameboard--computer.js");
/* harmony import */ var _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/player--user/player--user */ "./src/components/views/player--user/player--user.js");
/* harmony import */ var _views_player_computer_player_computer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../views/player--computer/player--computer */ "./src/components/views/player--computer/player--computer.js");
/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ "./src/components/views/gameboard--user/gameboard--user.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ "./src/components/common/create-tiles/create-event-tiles.js");
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");









const gameBoardDivComputer = document.querySelector(".gameboard--computer");

/* Removes event listeners from the user gameboard */
function removeEventListeners() {
  const tiles = document.querySelectorAll(".gameboard--user .gameboard__tile");
  tiles.forEach(tile => {
    tile.removeEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_8__.pickPlacement);
  });
}

/* hides the form */
function hideForm() {
  const form = document.querySelector(".placement-form");
  form.classList.add("hidden");
}
function showCompBoard() {
  const compBoard = document.querySelector(".div--computer");
  compBoard.classList.remove("hidden");
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.attackStage.subscribe(showCompBoard);

/* Creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */
function initAttackStageTiles() {
  removeEventListeners();
  (0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_7__["default"])(gameBoardDivComputer, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_8__.attack);
}

/* Creates gameover notification and new game btn */

function createNewGameBtn() {
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.textContent = "Start New Game";
  btn.addEventListener("click", () => {
    _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.publish();
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
  string === "user" ? h3.textContent = "YOU LOST" : h3.textContent = "YOU WON";
  div.appendChild(h3);
  div.appendChild(createNewGameBtn());
  return div;
}
function showGameOver(string) {
  const main = document.querySelector("main");
  const notification = createGameOverAlert(string);
  main.appendChild(notification);
}

/* removes gameover notification */
function removeGameOver() {
  const div = document.querySelector(".game-over-notification");
  div.remove();
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.subscribe(removeGameOver);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.attackStage.subscribe(initAttackStageTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.attackStage.subscribe(hideForm);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.gameover.subscribe(showGameOver);

/***/ }),

/***/ "./src/components/layout/layout--placement-stage.js":
/*!**********************************************************!*\
  !*** ./src/components/layout/layout--placement-stage.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ "./src/components/common/create-tiles/create-event-tiles.js");
/* harmony import */ var _views_gameboard_user_ship_info_views_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/ship-info__views--user */ "./src/components/views/gameboard--user/ship-info__views--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ "./src/components/views/gameboard--user/gameboard--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_views_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/gameboard--user/gameboard-views--user */ "./src/components/views/gameboard--user/gameboard-views--user.js");
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");
/* harmony import */ var _layout_attack_stage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layout--attack-stage */ "./src/components/layout/layout--attack-stage.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");








/* remove existing tiles */

function removeTiles(playerString) {
  if (typeof playerString !== "string" && (playerString === "user" || playerString === "computer")) {
    throw new Error("Function argument has to be a string with the value user or computer");
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
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.subscribe(resetBoards);
function showAllHidden(nodes) {
  const nodesArr = Array.from(nodes);
  nodesArr.forEach(node => {
    if (node.classList.contains("hidden")) {
      node.classList.remove("hidden");
    }
  });
}
function resetForm() {
  const form = document.querySelector(".placement-form");
  form.classList.remove("hidden");
  const formInputs = document.querySelectorAll(".placement-form__input");
  const formLabels = document.querySelectorAll("label");
  showAllHidden(formInputs);
  showAllHidden(formLabels);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.subscribe(resetForm);
function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.subscribe(hideCompBoard);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(hideCompBoard);
function addInputListeners() {
  const formInputs = document.querySelectorAll(".placement-form__input");
  formInputs.forEach(input => {
    input.addEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.alertShipInfoChanges);
  });
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(addInputListeners);
function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.placeShipBtn);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(addBtnListener);
function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  (0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.pickPlacement);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(createPlacementTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.newGame.subscribe(createPlacementTiles);

/***/ }),

/***/ "./src/components/pub-subs/attack--computer.js":
/*!*****************************************************!*\
  !*** ./src/components/pub-subs/attack--computer.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerAttack: function() { return /* binding */ computerAttack; },
/* harmony export */   handleComputerAttack: function() { return /* binding */ handleComputerAttack; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const computerAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const handleComputerAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ }),

/***/ "./src/components/pub-subs/attack--user.js":
/*!*************************************************!*\
  !*** ./src/components/pub-subs/attack--user.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleUserAttack: function() { return /* binding */ handleUserAttack; },
/* harmony export */   userAttack: function() { return /* binding */ userAttack; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const userAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const handleUserAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ }),

/***/ "./src/components/pub-subs/events.js":
/*!*******************************************!*\
  !*** ./src/components/pub-subs/events.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attack: function() { return /* binding */ attack; },
/* harmony export */   createShip: function() { return /* binding */ createShip; },
/* harmony export */   createShipView: function() { return /* binding */ createShipView; },
/* harmony export */   input: function() { return /* binding */ input; },
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; },
/* harmony export */   shipInfo: function() { return /* binding */ shipInfo; },
/* harmony export */   shipPlaceBtn: function() { return /* binding */ shipPlaceBtn; },
/* harmony export */   validityViews: function() { return /* binding */ validityViews; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const attack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const pickPlacement = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const input = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* createShipInfo() publishes a shipInfo obj. gameboard.publishValidity is subscribed and checks whether a ship can be placed there */
const shipInfo = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* gameboard.publishValidity publishes an obj with a boo. valid property and a list of coordinates.   */
const validityViews = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* When place ship btn is pressed publishShipInfoCreate() will create shipInfo  */
const shipPlaceBtn = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* When  publishShipInfoCreate() creates the shipInfo. The gameboard.placeShip  */
const createShip = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* UserGameBoard.publishPlaceShip publishes ship coordinates. GameBoardUserViewUpdater.handlePlacementView adds placement-ship class to tiles  */
const createShipView = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* Files are imported * as userClick */



/***/ }),

/***/ "./src/components/pub-subs/initialize.js":
/*!***********************************************!*\
  !*** ./src/components/pub-subs/initialize.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attackStage: function() { return /* binding */ attackStage; },
/* harmony export */   gameover: function() { return /* binding */ gameover; },
/* harmony export */   newGame: function() { return /* binding */ newGame; },
/* harmony export */   placementStage: function() { return /* binding */ placementStage; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");


/* initializes the placement stage */

const placementStage = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* initializes the attack stage */

const attackStage = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* initializes game over div */

const gameover = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* initializes a new game */

const newGame = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ }),

/***/ "./src/components/views/gameboard--computer/gameboard--computer.js":
/*!*************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/gameboard--computer.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard */ "./src/components/common/gameboard/gameboard.js");
/* harmony import */ var _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/ship/ship */ "./src/components/common/ship/ship.js");
/* harmony import */ var _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship-info/ship-info */ "./src/components/views/gameboard--computer/ship-info/ship-info.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");





class ComputerGameBoard extends _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /* Recreates a random ship, until its coordinates are not taken. */

  placeShip(length) {
    let shipInfo = new _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__["default"](length);
    let ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](shipInfo);
    while (this.isTaken(ship.coordinates)) {
      shipInfo = new _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__["default"](length);
      ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](shipInfo);
    }
    this.ships = ship;
  }
}
function initCompGB() {
  const computerBoard = new ComputerGameBoard(_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.handleUserAttack);
  computerBoard.placeShip(7);
  /*  computerBoard.placeShip(5);
   computerBoard.placeShip(4);
   computerBoard.placeShip(3);
   computerBoard.placeShip(2); */
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.userAttack.subscribe(computerBoard.handleAttack);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_4__.attackStage.subscribe(initCompGB);

/***/ }),

/***/ "./src/components/views/gameboard--computer/gameboard__views--computer.js":
/*!********************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/gameboard__views--computer.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");


const computer = "computer";
const computerViewUpdater = new _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__["default"](computer);
_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_1__.handleUserAttack.subscribe(computerViewUpdater.handleAttackView);
/* harmony default export */ __webpack_exports__["default"] = (computerViewUpdater);

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js":
/*!*********************************************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js ***!
  \*********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../utils/get-random-num */ "./src/utils/get-random-num.js");

function getRandomDirection() {
  return (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(2) === 1 ? "horizontal" : "vertical";
}
/* harmony default export */ __webpack_exports__["default"] = (getRandomDirection);

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js":
/*!*******************************************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js ***!
  \*******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../utils/get-random-num */ "./src/utils/get-random-num.js");


/* Create a random tileNum */

function getRandomTileNum(length, direction) {
  if (direction === "horizontal") {
    return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length));
  }
  return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11));
}
/* harmony default export */ __webpack_exports__["default"] = (getRandomTileNum);

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/ship-info.js":
/*!*************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/ship-info.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _get_random_direction_get_random_direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-random-direction/get-random-direction */ "./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js");
/* harmony import */ var _get_random_tile_num_get_random_tile_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-random-tile-num/get-random-tile-num */ "./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js");


class ShipInfo {
  constructor(length) {
    this.length = length;
    this.direction = (0,_get_random_direction_get_random_direction__WEBPACK_IMPORTED_MODULE_0__["default"])();
    this.tileNum = (0,_get_random_tile_num_get_random_tile_num__WEBPACK_IMPORTED_MODULE_1__["default"])(this.length, this.direction);
  }
}
/* harmony default export */ __webpack_exports__["default"] = (ShipInfo);

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard--user.js":
/*!*****************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard--user.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard */ "./src/components/common/gameboard/gameboard.js");
/* harmony import */ var _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/ship/ship */ "./src/components/common/ship/ship.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");





class UserGameBoard extends _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /* Calculates the max acceptable tile for a ship depending on its start (tileNum).
  for ex. If a ship is placed horizontally on tile 21 max would be 30  */

  static calcMax(obj) {
    if (obj.direction === "horizontal" && obj.tileNum > 10) {
      const max = +`${obj.tileNum.toString().charAt(0)}0` + 10;
      return max;
    }
    const max = obj.direction === "horizontal" ? 10 : 100;
    return max;
  }

  /* Calculates the length of the ship in tile numbers. The minus -1 accounts for the tileNum that is added in the isTooBig func */

  static calcLength(obj) {
    return obj.direction === "horizontal" ? obj.length - 1 : (obj.length - 1) * 10;
  }

  /* Checks if the ship placement would be legal, or if the ship is too big to be placed on the tile */

  static isTooBig(obj) {
    const max = UserGameBoard.calcMax(obj);
    const shipLength = UserGameBoard.calcLength(obj);
    if (obj.tileNum + shipLength <= max) {
      return false;
    }
    return true;
  }
  isValid = obj => {
    const ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](obj);
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {
      return {
        valid: false,
        coordinates: ship.coordinates
      };
    }
    return {
      valid: true,
      coordinates: ship.coordinates
    };
  };
  publishValidity = obj => {
    console.log(this.isValid(obj));
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.validityViews.publish(this.isValid(obj));
  };

  /* places ship in shipsArr */

  placeShip = obj => {
    const ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](obj);
    this.ships = ship;
    return ship;
  };
  publishPlaceShip = obj => {
    const ship = this.placeShip(obj);
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.createShipView.publish({
      coordinates: ship.coordinates,
      length: ship.length
    });
  };
}
function initUserBoard() {
  const userBoard = new UserGameBoard(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.handleComputerAttack);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.shipInfo.subscribe(userBoard.publishValidity);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.createShip.subscribe(userBoard.publishPlaceShip);
  function initHandleAttack() {
    _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.computerAttack.subscribe(userBoard.handleAttack);
  }
  _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.attackStage.subscribe(initHandleAttack);
}
initUserBoard();

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard-views--user.js":
/*!***********************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard-views--user.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");




class GameBoardUserViewUpdater extends _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__["default"] {
  btn = document.querySelector('.placement-form__place-btn');

  /* when a ship is placed the radio input for that ship is hidden */
  static hideRadio(obj) {
    const radioInput = document.querySelector(`#ship-${obj.length}`);
    radioInput.classList.add("hidden");
    const radioLabel = document.querySelector([`[for="ship-${obj.length}"]`]);
    radioLabel.classList.add("hidden");
  }

  /* when a ship is placed the next radio input is checked so that you can't place two of the same ships twice,
     when there are no more ships to place nextShipChecked will initialize the attack stage */
  static nextShipChecked() {
    const radio = document.querySelector(`:not(.hidden)[name="ship"]`);
    if (radio === null) {
      _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.attackStage.publish();
    } else {
      radio.setAttribute("checked", "");
    }
  }

  /* Clears the validity check of the previous selection from the user gameboard. If it passes the check it unlocks the place ship btn */
  clearValidityView = () => {
    const tiles = document.querySelectorAll(".gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove("placement--valid");
      tile.classList.remove("placement--invalid");
    });
    this.btn.removeAttribute("disabled");
  };

  /* adds the visual class placement--valid/or placement--invalid based on the tileNum chosen by the user, disables the submit btn if it fails placement check */

  handlePlacementValidityView = obj => {
    this.clearValidityView();
    if (!obj.valid) {
      this.btn.setAttribute("disabled", "");
    }
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(`.gameboard--${this.string} [data-id="${coordinate}"]`);
      if (obj.valid) {
        tile.classList.add("placement--valid");
      } else {
        tile.classList.add("placement--invalid");
      }
    });
  };
  handlePlacementView = obj => {
    this.clearValidityView();
    this.constructor.hideRadio(obj);
    this.constructor.nextShipChecked();
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(`.gameboard--${this.string} [data-id="${coordinate}"]`);
      tile.classList.add("placement--ship");
    });
  };
}
const user = "user";
const userViewUpdater = new GameBoardUserViewUpdater(user);
_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__.handleComputerAttack.subscribe(userViewUpdater.handleAttackView);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.validityViews.subscribe(userViewUpdater.handlePlacementValidityView);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.createShipView.subscribe(userViewUpdater.handlePlacementView);
/* harmony default export */ __webpack_exports__["default"] = (userViewUpdater);

/***/ }),

/***/ "./src/components/views/gameboard--user/ship-info--user.js":
/*!*****************************************************************!*\
  !*** ./src/components/views/gameboard--user/ship-info--user.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class ShipInfoUser {
  constructor(tileNum, length, direction) {
    this.tileNum = +tileNum;
    this.length = +length;
    this.direction = direction;
  }
}
/* harmony default export */ __webpack_exports__["default"] = (ShipInfoUser);

/***/ }),

/***/ "./src/components/views/gameboard--user/ship-info__views--user.js":
/*!************************************************************************!*\
  !*** ./src/components/views/gameboard--user/ship-info__views--user.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ship_info_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship-info--user */ "./src/components/views/gameboard--user/ship-info--user.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");
/* harmony import */ var _utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/display-radio-value */ "./src/utils/display-radio-value.js");




const shipPlacement = {
  tileNum: 0,
  updateNum(value) {
    this.tileNum = value;
    _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__.alertShipInfoChanges();
  }
};
function createShipInfo() {
  console.log("shipcreatedRun");
  const {
    tileNum
  } = shipPlacement;
  const length = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__["default"])("ship");
  const direction = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__["default"])("direction");
  const shipInfo = new _ship_info_user__WEBPACK_IMPORTED_MODULE_0__["default"](tileNum, length, direction);
  return shipInfo;
}
function publishShipInfoCheck() {
  const shipInfo = createShipInfo();
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.shipInfo.publish(shipInfo);
}
function publishShipInfoCreate() {
  const shipInfo = createShipInfo();
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.createShip.publish(shipInfo);
}
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.input.subscribe(publishShipInfoCheck);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.shipPlaceBtn.subscribe(publishShipInfoCreate);

/***/ }),

/***/ "./src/components/views/player--computer/player--computer.js":
/*!*******************************************************************!*\
  !*** ./src/components/views/player--computer/player--computer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ "./src/components/common/player/player.js");
/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/get-random-num */ "./src/utils/get-random-num.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");





class ComputerPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }
  attack = () => {
    let num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
    while (!super.isNew(num)) {
      num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
    }
    super.attackArr = num;
    this.pubSub.publish(num);
    return num;
  };
}
function initCompPlayer() {
  const computerPlayer = new ComputerPlayer(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.computerAttack);
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.userAttack.subscribe(computerPlayer.attack);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_4__.attackStage.subscribe(initCompPlayer);

/***/ }),

/***/ "./src/components/views/player--user/player--user.js":
/*!***********************************************************!*\
  !*** ./src/components/views/player--user/player--user.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ "./src/components/common/player/player.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");




class UserPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }
  attack = value => {
    if (super.isNew(value)) {
      super.attackArr = value;
      this.pubSub.publish(value);
      return value;
    }
    throw new Error("Tile has already been attacked");
  };
}
function initPlayer() {
  const player = new UserPlayer(_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_2__.userAttack);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_3__.attack.subscribe(player.attack);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_1__.attackStage.subscribe(initPlayer);
/* harmony default export */ __webpack_exports__["default"] = (UserPlayer);

/***/ }),

/***/ "./src/utils/display-radio-value.js":
/*!******************************************!*\
  !*** ./src/utils/display-radio-value.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function displayRadioValue(name) {
  if (typeof name !== "string") {
    throw new Error("Name has to be a string!");
  }
  const inputs = document.querySelectorAll(`[name="${name}"]`);
  for (let i = 0; i < inputs.length; i += 1) {
    if (inputs[i].checked) {
      return inputs[i].value;
    }
  }
}
/* harmony default export */ __webpack_exports__["default"] = (displayRadioValue);

/***/ }),

/***/ "./src/utils/get-random-num.js":
/*!*************************************!*\
  !*** ./src/utils/get-random-num.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function getRandomNum(max) {
  return Math.floor(Math.random() * max);
}
/* harmony default export */ __webpack_exports__["default"] = (getRandomNum);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_layout_layout_placement_stage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/layout/layout--placement-stage */ "./src/components/layout/layout--placement-stage.js");
/* harmony import */ var _components_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/pub-subs/initialize */ "./src/components/pub-subs/initialize.js");


_components_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_1__.placementStage.publish();
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBMkU7QUFFM0UsU0FBU0MsZ0JBQWdCQSxDQUFDQyxHQUFHLEVBQUVDLFFBQVEsRUFBRTtFQUN2QyxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsSUFBSSxHQUFHLEVBQUVBLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDaENGLEdBQUcsQ0FBQ0csV0FBVyxDQUFDTCxpRkFBcUIsQ0FBQ0ksQ0FBQyxFQUFFRCxRQUFRLENBQUMsQ0FBQztFQUNyRDtBQUNGO0FBQ0EsK0RBQWVGLGdCQUFnQjs7Ozs7Ozs7Ozs7O0FDUHFCO0FBRXBELFNBQVNELHFCQUFxQkEsQ0FBQ08sRUFBRSxFQUFFSixRQUFRLEVBQUU7RUFDM0MsTUFBTUssSUFBSSxHQUFHRiwrREFBZ0IsQ0FBQ0MsRUFBRSxDQUFDO0VBQ2pDQyxJQUFJLENBQUNDLGdCQUFnQixDQUFDLE9BQU8sRUFBRU4sUUFBUSxDQUFDO0VBQ3hDLE9BQU9LLElBQUk7QUFDYjtBQUVBLCtEQUFlUixxQkFBcUI7Ozs7Ozs7Ozs7O0FDUnBDLFNBQVNNLGdCQUFnQkEsQ0FBQ0MsRUFBRSxFQUFFO0VBQzVCLE1BQU1DLElBQUksR0FBR0UsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzFDSCxJQUFJLENBQUNJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0VBQ3JDTCxJQUFJLENBQUNNLFlBQVksQ0FBQyxTQUFTLEVBQUVQLEVBQUUsQ0FBQztFQUNoQyxPQUFPQyxJQUFJO0FBQ2I7QUFFQSwrREFBZUYsZ0JBQWdCOzs7Ozs7Ozs7Ozs7QUNQa0I7QUFFakQsTUFBTVUsb0JBQW9CLENBQUM7RUFDekJDLFdBQVdBLENBQUNDLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0QjtFQUVBLE9BQU9DLFVBQVVBLENBQUNYLElBQUksRUFBRTtJQUN0QixJQUFJQSxJQUFJLENBQUNJLFNBQVMsQ0FBQ1EsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQ2xDWixJQUFJLENBQUNJLFNBQVMsQ0FBQ1MsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7SUFDdkMsQ0FBQyxNQUFNO01BQ0xiLElBQUksQ0FBQ0ksU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzVCO0VBQ0Y7RUFFQSxPQUFPUyxTQUFTQSxDQUFDQyxHQUFHLEVBQUU7SUFDcEIsT0FBT0EsR0FBRyxDQUFDQyxHQUFHLEdBQUcsS0FBSyxHQUFHLE1BQU07RUFDakM7RUFFQUMsZUFBZUEsQ0FBQ0YsR0FBRyxFQUFFO0lBQ25CQSxHQUFHLENBQUNHLEtBQUssQ0FBQ0MsT0FBTyxDQUFFQyxPQUFPLElBQUs7TUFDN0IsTUFBTXBCLElBQUksR0FBR0UsUUFBUSxDQUFDbUIsYUFBYSxDQUNoQyxlQUFjLElBQUksQ0FBQ1gsTUFBTyxjQUFhVSxPQUFRLElBQ2xELENBQUM7TUFDRFosb0JBQW9CLENBQUNHLFVBQVUsQ0FBQ1gsSUFBSSxDQUFDO0lBQ3ZDLENBQUMsQ0FBQztFQUNKO0VBRUFzQixnQkFBZ0IsR0FBSVAsR0FBRyxJQUFLO0lBQzFCLElBQUlBLEdBQUcsQ0FBQ1EsSUFBSSxFQUFFO01BQ1osSUFBSSxDQUFDTixlQUFlLENBQUNGLEdBQUcsQ0FBQztNQUN6QixJQUFJQSxHQUFHLENBQUNTLFFBQVEsRUFBRTtRQUNoQmpCLDBEQUFhLENBQUNrQixPQUFPLENBQUMsSUFBSSxDQUFDZixNQUFNLENBQUM7TUFDcEM7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNVixJQUFJLEdBQUdFLFFBQVEsQ0FBQ21CLGFBQWEsQ0FDaEMsZUFBYyxJQUFJLENBQUNYLE1BQU8sY0FBYUssR0FBRyxDQUFDZixJQUFLLElBQ25ELENBQUM7TUFDREEsSUFBSSxDQUFDSSxTQUFTLENBQUNDLEdBQUcsQ0FBQ0csb0JBQW9CLENBQUNNLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLENBQUM7SUFDekQ7RUFDRixDQUFDO0FBQ0g7QUFFQSwrREFBZVAsb0JBQW9COzs7Ozs7Ozs7OztBQzNDbkMsTUFBTWtCLFNBQVMsQ0FBQztFQUVkakIsV0FBV0EsQ0FBQ2tCLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0QjtFQUVBQyxRQUFRLEdBQUcsRUFBRTtFQUViLElBQUlDLEtBQUtBLENBQUEsRUFBRztJQUNWLE9BQU8sSUFBSSxDQUFDRCxRQUFRO0VBQ3RCO0VBRUEsSUFBSUMsS0FBS0EsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2YsSUFBSUMsS0FBSyxDQUFDQyxPQUFPLENBQUNGLEtBQUssQ0FBQyxFQUFFO01BQ3hCLElBQUksQ0FBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQ0EsUUFBUSxDQUFDSyxNQUFNLENBQUNILEtBQUssQ0FBQztJQUM3QyxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNGLFFBQVEsQ0FBQ00sSUFBSSxDQUFDSixLQUFLLENBQUM7SUFDM0I7RUFDRjtFQUVBSyxTQUFTLEdBQUcsRUFBRTs7RUFFZDs7RUFFQUMsT0FBT0EsQ0FBQ0MsV0FBVyxFQUFFO0lBQ25CLEtBQUssSUFBSXpDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3lDLFdBQVcsQ0FBQ0MsTUFBTSxFQUFFMUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUM5QyxLQUFLLElBQUkyQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDVixLQUFLLENBQUNTLE1BQU0sRUFBRUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QyxJQUFJLElBQUksQ0FBQ1YsS0FBSyxDQUFDVSxDQUFDLENBQUMsQ0FBQ0YsV0FBVyxDQUFDRyxRQUFRLENBQUNILFdBQVcsQ0FBQ3pDLENBQUMsQ0FBQyxDQUFDLEVBQUU7VUFDdEQsT0FBTyxJQUFJO1FBQ2I7TUFDRjtJQUNGO0lBQ0EsT0FBTyxLQUFLO0VBQ2Q7O0VBRUE7O0VBRUE2QyxZQUFZLEdBQUlDLEdBQUcsSUFBSztJQUN0QixLQUFLLElBQUlILENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRyxJQUFJLENBQUNWLEtBQUssQ0FBQ1MsTUFBTSxFQUFFQyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzdDLElBQUksSUFBSSxDQUFDVixLQUFLLENBQUNVLENBQUMsQ0FBQyxDQUFDRixXQUFXLENBQUNHLFFBQVEsQ0FBQyxDQUFDRSxHQUFHLENBQUMsRUFBRTtRQUM1QyxJQUFJLENBQUNiLEtBQUssQ0FBQ1UsQ0FBQyxDQUFDLENBQUN2QixHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQ2EsS0FBSyxDQUFDVSxDQUFDLENBQUMsQ0FBQ0ksTUFBTSxDQUFDLENBQUMsRUFBRTtVQUMxQixNQUFNNUIsR0FBRyxHQUFHO1lBQUNDLEdBQUcsRUFBRSxJQUFJO1lBQUVPLElBQUksRUFBRSxJQUFJO1lBQUVMLEtBQUssRUFBRSxJQUFJLENBQUNXLEtBQUssQ0FBQ1UsQ0FBQyxDQUFDLENBQUNGO1VBQVksQ0FBQztVQUN0RSxPQUFRLElBQUksQ0FBQ08sTUFBTSxDQUFDLENBQUMsR0FBSSxJQUFJLENBQUNqQixNQUFNLENBQUNGLE9BQU8sQ0FBQztZQUFDLEdBQUdWLEdBQUc7WUFBRSxHQUFHO2NBQUNTLFFBQVEsRUFBRTtZQUFJO1VBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDRyxNQUFNLENBQUNGLE9BQU8sQ0FBQ1YsR0FBRyxDQUFDO1FBQ3hHO1FBQ0EsT0FBTyxJQUFJLENBQUNZLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO1VBQUV6QixJQUFJLEVBQUUwQyxHQUFHO1VBQUUxQixHQUFHLEVBQUUsSUFBSTtVQUFFTyxJQUFJLEVBQUU7UUFBTSxDQUFDLENBQUM7TUFDbkU7SUFDRjtJQUNBLElBQUksQ0FBQ1ksU0FBUyxDQUFDRCxJQUFJLENBQUNRLEdBQUcsQ0FBQztJQUV4QixPQUFPLElBQUksQ0FBQ2YsTUFBTSxDQUFDRixPQUFPLENBQUM7TUFBRXpCLElBQUksRUFBRTBDLEdBQUc7TUFBRTFCLEdBQUcsRUFBRSxLQUFLO01BQUVPLElBQUksRUFBRTtJQUFNLENBQUMsQ0FBQztFQUNwRSxDQUFDOztFQUVEOztFQUVBcUIsTUFBTSxHQUFHQSxDQUFBLEtBQU07SUFDYixNQUFNQyxLQUFLLEdBQUcsSUFBSSxDQUFDaEIsS0FBSyxDQUFDaUIsS0FBSyxDQUFFQyxJQUFJLElBQUtBLElBQUksQ0FBQ3hCLElBQUksS0FBSyxJQUFJLENBQUM7SUFDNUQsT0FBT3NCLEtBQUs7RUFDZCxDQUFDO0FBRUg7QUFFQSwrREFBZW5CLFNBQVM7Ozs7Ozs7Ozs7O0FDOUR4QixNQUFNc0IsTUFBTSxDQUFDO0VBRVhDLGVBQWUsR0FBRyxFQUFFO0VBRXBCLElBQUlDLFNBQVNBLENBQUEsRUFBRztJQUNkLE9BQU8sSUFBSSxDQUFDRCxlQUFlO0VBQzdCO0VBRUEsSUFBSUMsU0FBU0EsQ0FBQ3BCLEtBQUssRUFBRTtJQUNuQixJQUFJLENBQUNtQixlQUFlLENBQUNmLElBQUksQ0FBQ0osS0FBSyxDQUFDO0VBQ2xDO0VBRUFxQixLQUFLQSxDQUFDckIsS0FBSyxFQUFFO0lBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQ29CLFNBQVMsQ0FBQ1YsUUFBUSxDQUFDVixLQUFLLENBQUM7RUFDeEM7QUFDRjtBQUlBLCtEQUFla0IsTUFBTTs7Ozs7Ozs7Ozs7QUNuQnJCLE1BQU1JLE1BQU0sQ0FBQztFQUNYM0MsV0FBV0EsQ0FBQSxFQUFFO0lBQ1gsSUFBSSxDQUFDNEMsV0FBVyxHQUFHLEVBQUU7RUFDdkI7RUFFQUMsU0FBU0EsQ0FBQ0MsVUFBVSxFQUFFO0lBQ3BCLElBQUcsT0FBT0EsVUFBVSxLQUFLLFVBQVUsRUFBQztNQUNsQyxNQUFNLElBQUlDLEtBQUssQ0FBRSxHQUFFLE9BQU9ELFVBQVcsc0RBQXFELENBQUM7SUFDN0Y7SUFDQSxJQUFJLENBQUNGLFdBQVcsQ0FBQ25CLElBQUksQ0FBQ3FCLFVBQVUsQ0FBQztFQUNuQztFQUVBRSxXQUFXQSxDQUFDRixVQUFVLEVBQUU7SUFDdEIsSUFBRyxPQUFPQSxVQUFVLEtBQUssVUFBVSxFQUFDO01BQ2xDLE1BQU0sSUFBSUMsS0FBSyxDQUFFLEdBQUUsT0FBT0QsVUFBVyxzREFBcUQsQ0FBQztJQUM3RjtJQUNBLElBQUksQ0FBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQ0EsV0FBVyxDQUFDSyxNQUFNLENBQUNDLEdBQUcsSUFBSUEsR0FBRyxLQUFJSixVQUFVLENBQUM7RUFDdEU7RUFFQTlCLE9BQU9BLENBQUNtQyxPQUFPLEVBQUU7SUFDZixJQUFJLENBQUNQLFdBQVcsQ0FBQ2xDLE9BQU8sQ0FBQ29DLFVBQVUsSUFBSUEsVUFBVSxDQUFDSyxPQUFPLENBQUMsQ0FBQztFQUM3RDtBQUNGO0FBRUEsK0RBQWVSLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCOEI7O0FBRW5EOztBQUVBLFNBQVNVLE1BQU1BLENBQUEsRUFBRztFQUNoQkQsb0RBQWdCLENBQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDc0MsT0FBTyxDQUFDaEUsRUFBRSxDQUFDO0FBQzNDOztBQUVBOztBQUVBLFNBQVNpRSxhQUFhQSxDQUFBLEVBQUc7RUFDdkJILDJEQUF1QixDQUFDcEMsT0FBTyxDQUFDLElBQUksQ0FBQ3NDLE9BQU8sQ0FBQ2hFLEVBQUUsQ0FBQztBQUNsRDs7QUFFQTs7QUFFQSxTQUFTa0Usb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUJKLG1EQUFlLENBQUNwQyxPQUFPLENBQUMsQ0FBQztBQUMzQjtBQUVBLFNBQVMwQyxZQUFZQSxDQUFBLEVBQUc7RUFDdEJOLDBEQUFzQixDQUFDcEMsT0FBTyxDQUFDLENBQUM7QUFDbEM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUN2QkE7O0FBRUEsU0FBUzRDLGFBQWFBLENBQUN0RCxHQUFHLEVBQUU7RUFDMUIsTUFBTXVELEdBQUcsR0FBRyxDQUFDLENBQUN2RCxHQUFHLENBQUN3RCxPQUFPLENBQUM7RUFDMUIsS0FBSyxJQUFJM0UsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHbUIsR0FBRyxDQUFDdUIsTUFBTSxFQUFFMUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN0QyxJQUFJbUIsR0FBRyxDQUFDeUQsU0FBUyxLQUFLLFlBQVksRUFBRTtNQUNsQ0YsR0FBRyxDQUFDcEMsSUFBSSxDQUFDb0MsR0FBRyxDQUFDMUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDLE1BQU07TUFDTDBFLEdBQUcsQ0FBQ3BDLElBQUksQ0FBQ29DLEdBQUcsQ0FBQzFFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0I7RUFDRjtFQUNBLE9BQU8wRSxHQUFHO0FBQ1o7QUFFQSwrREFBZUQsYUFBYTs7Ozs7Ozs7Ozs7O0FDZnlDOztBQUVyRTs7QUFFQSxNQUFNSSxJQUFJLENBQUM7RUFDVGhFLFdBQVdBLENBQUNNLEdBQUcsRUFBRTtJQUNmLElBQUksQ0FBQ3VCLE1BQU0sR0FBRyxDQUFDdkIsR0FBRyxDQUFDdUIsTUFBTTtJQUN6QixJQUFJLENBQUNELFdBQVcsR0FBR2dDLG1GQUFhLENBQUN0RCxHQUFHLENBQUM7RUFDdkM7RUFFQTJELFFBQVEsR0FBRyxDQUFDO0VBRVpuRCxJQUFJLEdBQUcsS0FBSztFQUVaUCxHQUFHQSxDQUFBLEVBQUc7SUFDSixJQUFJLENBQUMwRCxRQUFRLElBQUksQ0FBQztFQUNwQjtFQUVBL0IsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUMrQixRQUFRLEtBQUssSUFBSSxDQUFDcEMsTUFBTSxFQUFFO01BQ2pDLElBQUksQ0FBQ2YsSUFBSSxHQUFHLElBQUk7SUFDbEI7SUFDQSxPQUFPLElBQUksQ0FBQ0EsSUFBSTtFQUNsQjtBQUNGO0FBRUEsK0RBQWVrRCxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFCOEM7QUFDVDtBQUNFO0FBQ2Q7QUFDUTtBQUNGO0FBRUg7QUFFMEI7QUFDSztBQUU5RSxNQUFNRyxvQkFBb0IsR0FBRzFFLFFBQVEsQ0FBQ21CLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFHM0U7QUFDQSxTQUFTd0Qsb0JBQW9CQSxDQUFBLEVBQUk7RUFDL0IsTUFBTTNELEtBQUssR0FBR2hCLFFBQVEsQ0FBQzRFLGdCQUFnQixDQUFDLG1DQUFtQyxDQUFDO0VBQzVFNUQsS0FBSyxDQUFDQyxPQUFPLENBQUVuQixJQUFJLElBQUs7SUFDdEJBLElBQUksQ0FBQytFLG1CQUFtQixDQUFDLE9BQU8sRUFBRUosb0ZBQTRCLENBQUM7RUFDakUsQ0FBQyxDQUFDO0FBQ0o7O0FBRUE7QUFDQSxTQUFTSyxRQUFRQSxDQUFBLEVBQUc7RUFDbEIsTUFBTUMsSUFBSSxHQUFHL0UsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLGlCQUFpQixDQUFDO0VBQ3RENEQsSUFBSSxDQUFDN0UsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO0FBRUEsU0FBUzZFLGFBQWFBLENBQUEsRUFBRztFQUN2QixNQUFNQyxTQUFTLEdBQUdqRixRQUFRLENBQUNtQixhQUFhLENBQUMsZ0JBQWdCLENBQUM7RUFDMUQ4RCxTQUFTLENBQUMvRSxTQUFTLENBQUNnRixNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3RDO0FBRUE3RSw2REFBZ0IsQ0FBQytDLFNBQVMsQ0FBQzRCLGFBQWEsQ0FBQzs7QUFFekM7QUFDQSxTQUFTSSxvQkFBb0JBLENBQUEsRUFBRztFQUM5QlQsb0JBQW9CLENBQUMsQ0FBQztFQUN0QnBGLG1GQUFnQixDQUFDbUYsb0JBQW9CLEVBQUVELDZFQUFxQixDQUFDO0FBQy9EOztBQUVBOztBQUVBLFNBQVNZLGdCQUFnQkEsQ0FBQSxFQUFHO0VBQzFCLE1BQU1DLEdBQUcsR0FBR3RGLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUM1Q3FGLEdBQUcsQ0FBQ2xGLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO0VBQ2xDa0YsR0FBRyxDQUFDQyxXQUFXLEdBQUcsZ0JBQWdCO0VBQ2xDRCxHQUFHLENBQUN2RixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNsQ00seURBQVksQ0FBQ2tCLE9BQU8sQ0FBQyxDQUFDO0VBQ3hCLENBQUMsQ0FBQztFQUNGLE9BQU8rRCxHQUFHO0FBQ1o7QUFHQSxTQUFTRyxtQkFBbUJBLENBQUNqRixNQUFNLEVBQUU7RUFDbkMsTUFBTWhCLEdBQUcsR0FBR1EsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3pDVCxHQUFHLENBQUNVLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0VBRTNDLE1BQU11RixFQUFFLEdBQUcxRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDdkN5RixFQUFFLENBQUN4RixTQUFTLENBQUNDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQztFQUNuRHVGLEVBQUUsQ0FBQ0gsV0FBVyxHQUFHLFdBQVc7RUFDNUIvRixHQUFHLENBQUNHLFdBQVcsQ0FBQytGLEVBQUUsQ0FBQztFQUVuQixNQUFNQyxFQUFFLEdBQUczRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDdkMwRixFQUFFLENBQUN6RixTQUFTLENBQUNDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQztFQUN0REssTUFBTSxLQUFLLE1BQU0sR0FBS21GLEVBQUUsQ0FBQ0osV0FBVyxHQUFHLFVBQVUsR0FBS0ksRUFBRSxDQUFDSixXQUFXLEdBQUcsU0FBVTtFQUNsRi9GLEdBQUcsQ0FBQ0csV0FBVyxDQUFDZ0csRUFBRSxDQUFDO0VBQ25CbkcsR0FBRyxDQUFDRyxXQUFXLENBQUMwRixnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7RUFDbkMsT0FBTzdGLEdBQUc7QUFDWjtBQUdBLFNBQVNvRyxZQUFZQSxDQUFDcEYsTUFBTSxFQUFFO0VBQzVCLE1BQU1xRixJQUFJLEdBQUc3RixRQUFRLENBQUNtQixhQUFhLENBQUMsTUFBTSxDQUFDO0VBQzNDLE1BQU0yRSxZQUFZLEdBQUdMLG1CQUFtQixDQUFDakYsTUFBTSxDQUFDO0VBQ2hEcUYsSUFBSSxDQUFDbEcsV0FBVyxDQUFDbUcsWUFBWSxDQUFDO0FBQ2hDOztBQUVBO0FBQ0EsU0FBU0MsY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU12RyxHQUFHLEdBQUdRLFFBQVEsQ0FBQ21CLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQztFQUM3RDNCLEdBQUcsQ0FBQzBGLE1BQU0sQ0FBQyxDQUFDO0FBQ2Q7QUFFQTdFLHlEQUFZLENBQUMrQyxTQUFTLENBQUMyQyxjQUFjLENBQUM7QUFFdEMxRiw2REFBZ0IsQ0FBQytDLFNBQVMsQ0FBQ2dDLG9CQUFvQixDQUFDO0FBQ2hEL0UsNkRBQWdCLENBQUMrQyxTQUFTLENBQUMwQixRQUFRLENBQUM7QUFDcEN6RSwwREFBYSxDQUFDK0MsU0FBUyxDQUFDd0MsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6Rm9DO0FBQ2hCO0FBQ1A7QUFDTTtBQUNzQjtBQUM5QztBQUNlOztBQUUvQzs7QUFFQSxTQUFTSSxXQUFXQSxDQUFDQyxZQUFZLEVBQUU7RUFDakMsSUFDRSxPQUFPQSxZQUFZLEtBQUssUUFBUSxLQUMvQkEsWUFBWSxLQUFLLE1BQU0sSUFBSUEsWUFBWSxLQUFLLFVBQVUsQ0FBQyxFQUN4RDtJQUNBLE1BQU0sSUFBSTNDLEtBQUssQ0FDYixzRUFDRixDQUFDO0VBQ0g7RUFDQSxNQUFNNEMsU0FBUyxHQUFHbEcsUUFBUSxDQUFDbUIsYUFBYSxDQUFFLGVBQWM4RSxZQUFhLEVBQUMsQ0FBQztFQUN2RSxPQUFPQyxTQUFTLENBQUNDLFVBQVUsRUFBRTtJQUMzQkQsU0FBUyxDQUFDRSxXQUFXLENBQUNGLFNBQVMsQ0FBQ0csU0FBUyxDQUFDO0VBQzVDO0FBQ0Y7O0FBRUE7O0FBRUEsU0FBU0MsV0FBV0EsQ0FBQSxFQUFHO0VBQ3JCTixXQUFXLENBQUMsTUFBTSxDQUFDO0VBQ25CQSxXQUFXLENBQUMsVUFBVSxDQUFDO0FBQ3pCO0FBRUEzRix5REFBWSxDQUFDK0MsU0FBUyxDQUFDa0QsV0FBVyxDQUFDO0FBRW5DLFNBQVNDLGFBQWFBLENBQUNDLEtBQUssRUFBRTtFQUM1QixNQUFNQyxRQUFRLEdBQUc1RSxLQUFLLENBQUM2RSxJQUFJLENBQUNGLEtBQUssQ0FBQztFQUNsQ0MsUUFBUSxDQUFDeEYsT0FBTyxDQUFFMEYsSUFBSSxJQUFLO0lBQ3pCLElBQUlBLElBQUksQ0FBQ3pHLFNBQVMsQ0FBQ1EsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQ3JDaUcsSUFBSSxDQUFDekcsU0FBUyxDQUFDZ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNqQztFQUNGLENBQUMsQ0FBQztBQUNKO0FBRUEsU0FBUzBCLFNBQVNBLENBQUEsRUFBRztFQUNuQixNQUFNN0IsSUFBSSxHQUFHL0UsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLGlCQUFpQixDQUFDO0VBQ3RENEQsSUFBSSxDQUFDN0UsU0FBUyxDQUFDZ0YsTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUMvQixNQUFNMkIsVUFBVSxHQUFHN0csUUFBUSxDQUFDNEUsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7RUFDdEUsTUFBTWtDLFVBQVUsR0FBRzlHLFFBQVEsQ0FBQzRFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztFQUNyRDJCLGFBQWEsQ0FBQ00sVUFBVSxDQUFDO0VBQ3pCTixhQUFhLENBQUNPLFVBQVUsQ0FBQztBQUMzQjtBQUVBekcseURBQVksQ0FBQytDLFNBQVMsQ0FBQ3dELFNBQVMsQ0FBQztBQUVqQyxTQUFTRyxhQUFhQSxDQUFBLEVBQUc7RUFDdkIsTUFBTUMsYUFBYSxHQUFHaEgsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLGdCQUFnQixDQUFDO0VBQzlENkYsYUFBYSxDQUFDOUcsU0FBUyxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3ZDO0FBRUFFLHlEQUFZLENBQUMrQyxTQUFTLENBQUMyRCxhQUFhLENBQUM7QUFDckMxRyxnRUFBbUIsQ0FBQytDLFNBQVMsQ0FBQzJELGFBQWEsQ0FBQztBQUU1QyxTQUFTRyxpQkFBaUJBLENBQUEsRUFBRztFQUMzQixNQUFNTCxVQUFVLEdBQUc3RyxRQUFRLENBQUM0RSxnQkFBZ0IsQ0FBQyx3QkFBd0IsQ0FBQztFQUN0RWlDLFVBQVUsQ0FBQzVGLE9BQU8sQ0FBRStDLEtBQUssSUFBSztJQUM1QkEsS0FBSyxDQUFDakUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFMEUsMkZBQW1DLENBQUM7RUFDdEUsQ0FBQyxDQUFDO0FBQ0o7QUFFQXBFLGdFQUFtQixDQUFDK0MsU0FBUyxDQUFDOEQsaUJBQWlCLENBQUM7QUFFaEQsU0FBU0MsY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU1sRCxZQUFZLEdBQUdqRSxRQUFRLENBQUNtQixhQUFhLENBQUMsNEJBQTRCLENBQUM7RUFDekU4QyxZQUFZLENBQUNsRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUwRSxtRkFBMkIsQ0FBQztBQUNyRTtBQUVBcEUsZ0VBQW1CLENBQUMrQyxTQUFTLENBQUMrRCxjQUFjLENBQUM7QUFFN0MsU0FBU0Msb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTUMsZ0JBQWdCLEdBQUdySCxRQUFRLENBQUNtQixhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDbkU1QixtRkFBZ0IsQ0FBQzhILGdCQUFnQixFQUFFNUMsb0ZBQTRCLENBQUM7QUFDbEU7QUFFQXBFLGdFQUFtQixDQUFDK0MsU0FBUyxDQUFDZ0Usb0JBQW9CLENBQUM7QUFDbkQvRyx5REFBWSxDQUFDK0MsU0FBUyxDQUFDZ0Usb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRkc7QUFFL0MsTUFBTUUsY0FBYyxHQUFHLElBQUlwRSwrREFBTSxDQUFDLENBQUM7QUFFbkMsTUFBTXFFLG9CQUFvQixHQUFHLElBQUlyRSwrREFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSk07QUFFL0MsTUFBTXNFLFVBQVUsR0FBRyxJQUFJdEUsK0RBQU0sQ0FBQyxDQUFDO0FBRS9CLE1BQU11RSxnQkFBZ0IsR0FBRyxJQUFJdkUsK0RBQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pVO0FBRS9DLE1BQU1VLE1BQU0sR0FBRyxJQUFJViwrREFBTSxDQUFDLENBQUM7QUFFM0IsTUFBTVksYUFBYSxHQUFHLElBQUlaLCtEQUFNLENBQUMsQ0FBQztBQUVsQyxNQUFNYyxLQUFLLEdBQUcsSUFBSWQsK0RBQU0sQ0FBQyxDQUFDOztBQUUxQjtBQUNBLE1BQU13RSxRQUFRLEdBQUcsSUFBSXhFLCtEQUFNLENBQUMsQ0FBQzs7QUFFN0I7QUFDQSxNQUFNeUUsYUFBYSxHQUFHLElBQUl6RSwrREFBTSxDQUFDLENBQUM7O0FBRWxDO0FBQ0EsTUFBTWdCLFlBQVksR0FBRyxJQUFJaEIsK0RBQU0sQ0FBQyxDQUFDOztBQUVqQztBQUNBLE1BQU0wRSxVQUFVLEdBQUcsSUFBSTFFLCtEQUFNLENBQUMsQ0FBQzs7QUFFL0I7QUFDQSxNQUFNMkUsY0FBYyxHQUFHLElBQUkzRSwrREFBTSxDQUFDLENBQUM7O0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZCK0M7O0FBRS9DOztBQUVBLE1BQU0rRCxjQUFjLEdBQUcsSUFBSS9ELCtEQUFNLENBQUMsQ0FBQzs7QUFFbkM7O0FBRUEsTUFBTWlDLFdBQVcsR0FBRyxJQUFJakMsK0RBQU0sQ0FBQyxDQUFDOztBQUVoQzs7QUFFQSxNQUFNNUIsUUFBUSxHQUFHLElBQUk0QiwrREFBTSxDQUFDLENBQUM7O0FBRTdCOztBQUVBLE1BQU1zQyxPQUFPLEdBQUcsSUFBSXRDLCtEQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQjZCO0FBQ2Y7QUFDRztBQUM4QjtBQUN6QjtBQUdsRCxNQUFNNkUsaUJBQWlCLFNBQVN2RyxtRUFBUyxDQUFDO0VBQ3hDOztFQUVBd0csU0FBU0EsQ0FBQzVGLE1BQU0sRUFBRTtJQUNoQixJQUFJc0YsUUFBUSxHQUFHLElBQUlJLDREQUFRLENBQUMxRixNQUFNLENBQUM7SUFDbkMsSUFBSVMsSUFBSSxHQUFHLElBQUkwQix5REFBSSxDQUFDbUQsUUFBUSxDQUFDO0lBQzdCLE9BQU8sSUFBSSxDQUFDeEYsT0FBTyxDQUFDVyxJQUFJLENBQUNWLFdBQVcsQ0FBQyxFQUFFO01BQ3JDdUYsUUFBUSxHQUFHLElBQUlJLDREQUFRLENBQUMxRixNQUFNLENBQUM7TUFDL0JTLElBQUksR0FBRyxJQUFJMEIseURBQUksQ0FBQ21ELFFBQVEsQ0FBQztJQUMzQjtJQUNBLElBQUksQ0FBQy9GLEtBQUssR0FBR2tCLElBQUk7RUFDbkI7QUFDRjtBQUVBLFNBQVNvRixVQUFVQSxDQUFBLEVBQUc7RUFDbEIsTUFBTWpCLGFBQWEsR0FBRyxJQUFJZSxpQkFBaUIsQ0FBQ04sbUVBQWdCLENBQUM7RUFDN0RULGFBQWEsQ0FBQ2dCLFNBQVMsQ0FBQyxDQUFDLENBQUM7RUFDM0I7QUFDSDtBQUNBO0FBQ0E7RUFDSVIsNkRBQVUsQ0FBQ3BFLFNBQVMsQ0FBQzRELGFBQWEsQ0FBQ3pFLFlBQVksQ0FBQztBQUNwRDtBQUVBbEMsNkRBQWdCLENBQUMrQyxTQUFTLENBQUM2RSxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7QUMvQndEO0FBQ2hDO0FBRTlELE1BQU1DLFFBQVEsR0FBRyxVQUFVO0FBRTNCLE1BQU1DLG1CQUFtQixHQUFHLElBQUk3SCw2RkFBb0IsQ0FBQzRILFFBQVEsQ0FBQztBQUU5RFQsbUVBQWdCLENBQUNyRSxTQUFTLENBQUMrRSxtQkFBbUIsQ0FBQy9HLGdCQUFnQixDQUFDO0FBRWhFLCtEQUFlK0csbUJBQW1COzs7Ozs7Ozs7Ozs7QUNUNkI7QUFFL0QsU0FBU0Usa0JBQWtCQSxDQUFBLEVBQUc7RUFDNUIsT0FBT0QsaUVBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsWUFBWSxHQUFHLFVBQVU7QUFDMUQ7QUFFQSwrREFBZUMsa0JBQWtCOzs7Ozs7Ozs7Ozs7QUNOOEI7O0FBRS9EOztBQUVBLFNBQVNDLGdCQUFnQkEsQ0FBQ2xHLE1BQU0sRUFBRWtDLFNBQVMsRUFBRTtFQUMzQyxJQUFJQSxTQUFTLEtBQUssWUFBWSxFQUFFO0lBQzlCLE9BQU8sRUFBRThELGlFQUFZLENBQUMsRUFBRSxDQUFDLENBQUNHLFFBQVEsQ0FBQyxDQUFDLEdBQUdILGlFQUFZLENBQUMsRUFBRSxHQUFHaEcsTUFBTSxDQUFDLENBQUM7RUFDbkU7RUFDQSxPQUFPLEVBQUVnRyxpRUFBWSxDQUFDLEVBQUUsR0FBR2hHLE1BQU0sQ0FBQyxDQUFDbUcsUUFBUSxDQUFDLENBQUMsR0FBR0gsaUVBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuRTtBQUVBLCtEQUFlRSxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7QUNWOEM7QUFDSjtBQUV6RSxNQUFNUixRQUFRLENBQUM7RUFFYnZILFdBQVdBLENBQUM2QixNQUFNLEVBQUU7SUFDbEIsSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU07SUFDcEIsSUFBSSxDQUFDa0MsU0FBUyxHQUFHK0Qsc0ZBQWtCLENBQUMsQ0FBQztJQUNyQyxJQUFJLENBQUNoRSxPQUFPLEdBQUdpRSxvRkFBZ0IsQ0FBQyxJQUFJLENBQUNsRyxNQUFNLEVBQUUsSUFBSSxDQUFDa0MsU0FBUyxDQUFDO0VBQzlEO0FBRUY7QUFFQSwrREFBZXdELFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNka0M7QUFDZjtBQUM2QztBQUN0QztBQUNDO0FBRWxELE1BQU1VLGFBQWEsU0FBU2hILG1FQUFTLENBQUM7RUFFcEM7QUFDRjs7RUFFRSxPQUFPaUgsT0FBT0EsQ0FBQzVILEdBQUcsRUFBRTtJQUNsQixJQUFJQSxHQUFHLENBQUN5RCxTQUFTLEtBQUssWUFBWSxJQUFJekQsR0FBRyxDQUFDd0QsT0FBTyxHQUFHLEVBQUUsRUFBRTtNQUN0RCxNQUFNcUUsR0FBRyxHQUFHLENBQUUsR0FBRTdILEdBQUcsQ0FBQ3dELE9BQU8sQ0FBQ2tFLFFBQVEsQ0FBQyxDQUFDLENBQUNJLE1BQU0sQ0FBQyxDQUFDLENBQUUsR0FBRSxHQUFHLEVBQUU7TUFDeEQsT0FBT0QsR0FBRztJQUNaO0lBQ0EsTUFBTUEsR0FBRyxHQUFHN0gsR0FBRyxDQUFDeUQsU0FBUyxLQUFLLFlBQVksR0FBRyxFQUFFLEdBQUcsR0FBRztJQUNyRCxPQUFPb0UsR0FBRztFQUNaOztFQUVBOztFQUVBLE9BQU9FLFVBQVVBLENBQUMvSCxHQUFHLEVBQUU7SUFDckIsT0FBT0EsR0FBRyxDQUFDeUQsU0FBUyxLQUFLLFlBQVksR0FDakN6RCxHQUFHLENBQUN1QixNQUFNLEdBQUcsQ0FBQyxHQUNkLENBQUN2QixHQUFHLENBQUN1QixNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUU7RUFDM0I7O0VBRUE7O0VBRUEsT0FBT3lHLFFBQVFBLENBQUNoSSxHQUFHLEVBQUU7SUFDbkIsTUFBTTZILEdBQUcsR0FBR0YsYUFBYSxDQUFDQyxPQUFPLENBQUM1SCxHQUFHLENBQUM7SUFDdEMsTUFBTWlJLFVBQVUsR0FBR04sYUFBYSxDQUFDSSxVQUFVLENBQUMvSCxHQUFHLENBQUM7SUFDaEQsSUFBSUEsR0FBRyxDQUFDd0QsT0FBTyxHQUFHeUUsVUFBVSxJQUFJSixHQUFHLEVBQUU7TUFDbkMsT0FBTyxLQUFLO0lBQ2Q7SUFDQSxPQUFPLElBQUk7RUFDYjtFQUVBSyxPQUFPLEdBQUlsSSxHQUFHLElBQUs7SUFDakIsTUFBTWdDLElBQUksR0FBRyxJQUFJMEIseURBQUksQ0FBQzFELEdBQUcsQ0FBQztJQUMxQixJQUFJLElBQUksQ0FBQ3FCLE9BQU8sQ0FBQ1csSUFBSSxDQUFDVixXQUFXLENBQUMsSUFBSSxJQUFJLENBQUM1QixXQUFXLENBQUNzSSxRQUFRLENBQUNoSSxHQUFHLENBQUMsRUFBRTtNQUNwRSxPQUFPO1FBQUVtSSxLQUFLLEVBQUUsS0FBSztRQUFFN0csV0FBVyxFQUFFVSxJQUFJLENBQUNWO01BQVcsQ0FBQztJQUN2RDtJQUNBLE9BQU87TUFBRTZHLEtBQUssRUFBRSxJQUFJO01BQUU3RyxXQUFXLEVBQUVVLElBQUksQ0FBQ1Y7SUFBWSxDQUFDO0VBQ3ZELENBQUM7RUFFRDhHLGVBQWUsR0FBSXBJLEdBQUcsSUFBSztJQUN6QnFJLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQ0osT0FBTyxDQUFDbEksR0FBRyxDQUFDLENBQUM7SUFDOUI4QywyREFBdUIsQ0FBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUN3SCxPQUFPLENBQUNsSSxHQUFHLENBQUMsQ0FBQztFQUNwRCxDQUFDOztFQUVEOztFQUVBbUgsU0FBUyxHQUFJbkgsR0FBRyxJQUFLO0lBQ25CLE1BQU1nQyxJQUFJLEdBQUcsSUFBSTBCLHlEQUFJLENBQUMxRCxHQUFHLENBQUM7SUFDMUIsSUFBSSxDQUFDYyxLQUFLLEdBQUdrQixJQUFJO0lBQ2pCLE9BQU9BLElBQUk7RUFDYixDQUFDO0VBRUR1RyxnQkFBZ0IsR0FBSXZJLEdBQUcsSUFBSztJQUMxQixNQUFNZ0MsSUFBSSxHQUFHLElBQUksQ0FBQ21GLFNBQVMsQ0FBQ25ILEdBQUcsQ0FBQztJQUNoQzhDLDREQUF3QixDQUFDcEMsT0FBTyxDQUFDO01BQUNZLFdBQVcsRUFBRVUsSUFBSSxDQUFDVixXQUFXO01BQUVDLE1BQU0sRUFBRVMsSUFBSSxDQUFDVDtJQUFNLENBQUMsQ0FBQztFQUN4RixDQUFDO0FBQ0g7QUFFQSxTQUFTaUgsYUFBYUEsQ0FBQSxFQUFHO0VBQ3ZCLE1BQU1DLFNBQVMsR0FBRyxJQUFJZCxhQUFhLENBQUNqQiwyRUFBb0IsQ0FBQztFQUN6RDVELHNEQUFrQixDQUFDUCxTQUFTLENBQUNrRyxTQUFTLENBQUNMLGVBQWUsQ0FBQztFQUN2RHRGLHdEQUFvQixDQUFDUCxTQUFTLENBQUNrRyxTQUFTLENBQUNGLGdCQUFnQixDQUFDO0VBQzFELFNBQVNHLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQzFCakMscUVBQWMsQ0FBQ2xFLFNBQVMsQ0FBQ2tHLFNBQVMsQ0FBQy9HLFlBQVksQ0FBQztFQUNsRDtFQUNBbEMsNkRBQWdCLENBQUMrQyxTQUFTLENBQUNtRyxnQkFBZ0IsQ0FBQztBQUM5QztBQUVBRixhQUFhLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDNUUrRTtBQUN2QjtBQUNwQjtBQUNEO0FBRWxELE1BQU1HLHdCQUF3QixTQUFTbEosNkZBQW9CLENBQUM7RUFDMURnRixHQUFHLEdBQUd0RixRQUFRLENBQUNtQixhQUFhLENBQUMsNEJBQTRCLENBQUM7O0VBRTFEO0VBQ0EsT0FBT3NJLFNBQVNBLENBQUM1SSxHQUFHLEVBQUU7SUFDcEIsTUFBTTZJLFVBQVUsR0FBRzFKLFFBQVEsQ0FBQ21CLGFBQWEsQ0FBRSxTQUFRTixHQUFHLENBQUN1QixNQUFPLEVBQUMsQ0FBQztJQUNoRXNILFVBQVUsQ0FBQ3hKLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxNQUFNd0osVUFBVSxHQUFHM0osUUFBUSxDQUFDbUIsYUFBYSxDQUFDLENBQUUsY0FBYU4sR0FBRyxDQUFDdUIsTUFBTyxJQUFHLENBQUMsQ0FBQztJQUN6RXVILFVBQVUsQ0FBQ3pKLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztFQUNwQzs7RUFFQTtBQUNGO0VBQ0UsT0FBT3lKLGVBQWVBLENBQUEsRUFBRztJQUN2QixNQUFNQyxLQUFLLEdBQUc3SixRQUFRLENBQUNtQixhQUFhLENBQUUsNEJBQTJCLENBQUM7SUFDbEUsSUFBSTBJLEtBQUssS0FBSyxJQUFJLEVBQUU7TUFDbEJ4Siw2REFBZ0IsQ0FBQ2tCLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUMsTUFBTTtNQUNMc0ksS0FBSyxDQUFDekosWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7SUFDbkM7RUFFRjs7RUFFRDtFQUNFMEosaUJBQWlCLEdBQUdBLENBQUEsS0FBTTtJQUN6QixNQUFNOUksS0FBSyxHQUFHaEIsUUFBUSxDQUFDNEUsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDM0Q1RCxLQUFLLENBQUNDLE9BQU8sQ0FBQ25CLElBQUksSUFBSTtNQUNwQkEsSUFBSSxDQUFDSSxTQUFTLENBQUNnRixNQUFNLENBQUMsa0JBQWtCLENBQUM7TUFDekNwRixJQUFJLENBQUNJLFNBQVMsQ0FBQ2dGLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztJQUM3QyxDQUFDLENBQUM7SUFDRixJQUFJLENBQUNJLEdBQUcsQ0FBQ3lFLGVBQWUsQ0FBQyxVQUFVLENBQUM7RUFDdEMsQ0FBQzs7RUFFRjs7RUFFQ0MsMkJBQTJCLEdBQUluSixHQUFHLElBQUs7SUFDckMsSUFBSSxDQUFDaUosaUJBQWlCLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUNqSixHQUFHLENBQUNtSSxLQUFLLEVBQUU7TUFDZCxJQUFJLENBQUMxRCxHQUFHLENBQUNsRixZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztJQUN2QztJQUNBUyxHQUFHLENBQUNzQixXQUFXLENBQUNsQixPQUFPLENBQUNnSixVQUFVLElBQUk7TUFDcEMsTUFBTW5LLElBQUksR0FBR0UsUUFBUSxDQUFDbUIsYUFBYSxDQUNoQyxlQUFjLElBQUksQ0FBQ1gsTUFBTyxjQUFheUosVUFBVyxJQUNyRCxDQUFDO01BQ0QsSUFBSXBKLEdBQUcsQ0FBQ21JLEtBQUssRUFBRTtRQUNibEosSUFBSSxDQUFDSSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztNQUN4QyxDQUFDLE1BQU07UUFDTEwsSUFBSSxDQUFDSSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztNQUMxQztJQUNGLENBQUMsQ0FBQztFQUNKLENBQUM7RUFFRCtKLG1CQUFtQixHQUFJckosR0FBRyxJQUFLO0lBQzdCLElBQUksQ0FBQ2lKLGlCQUFpQixDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDdkosV0FBVyxDQUFDa0osU0FBUyxDQUFDNUksR0FBRyxDQUFDO0lBQy9CLElBQUksQ0FBQ04sV0FBVyxDQUFDcUosZUFBZSxDQUFDLENBQUM7SUFDbEMvSSxHQUFHLENBQUNzQixXQUFXLENBQUNsQixPQUFPLENBQUNnSixVQUFVLElBQUk7TUFDcEMsTUFBTW5LLElBQUksR0FBR0UsUUFBUSxDQUFDbUIsYUFBYSxDQUNoQyxlQUFjLElBQUksQ0FBQ1gsTUFBTyxjQUFheUosVUFBVyxJQUNyRCxDQUFDO01BQ0RuSyxJQUFJLENBQUNJLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0lBQ3ZDLENBQUMsQ0FBQztFQUNKLENBQUM7QUFDSDtBQUtBLE1BQU1nSyxJQUFJLEdBQUcsTUFBTTtBQUVuQixNQUFNQyxlQUFlLEdBQUcsSUFBSVosd0JBQXdCLENBQUNXLElBQUksQ0FBQztBQUUxRDVDLDJFQUFvQixDQUFDbkUsU0FBUyxDQUFDZ0gsZUFBZSxDQUFDaEosZ0JBQWdCLENBQUM7QUFDaEV1QywyREFBdUIsQ0FBQ1AsU0FBUyxDQUFDZ0gsZUFBZSxDQUFDSiwyQkFBMkIsQ0FBQztBQUM5RXJHLDREQUF3QixDQUFDUCxTQUFTLENBQUNnSCxlQUFlLENBQUNGLG1CQUFtQixDQUFDO0FBRXZFLCtEQUFlRSxlQUFlOzs7Ozs7Ozs7OztBQ2pGOUIsTUFBTUMsWUFBWSxDQUFDO0VBQ2pCOUosV0FBV0EsQ0FBRThELE9BQU8sRUFBRWpDLE1BQU0sRUFBRWtDLFNBQVMsRUFBRTtJQUN2QyxJQUFJLENBQUNELE9BQU8sR0FBRyxDQUFDQSxPQUFPO0lBQ3ZCLElBQUksQ0FBQ2pDLE1BQU0sR0FBRyxDQUFDQSxNQUFNO0lBQ3JCLElBQUksQ0FBQ2tDLFNBQVMsR0FBR0EsU0FBUztFQUM1QjtBQUNGO0FBRUEsK0RBQWUrRixZQUFZOzs7Ozs7Ozs7Ozs7Ozs7QUNSa0I7QUFDTTtBQUM4QjtBQUNkO0FBRW5FLE1BQU1FLGFBQWEsR0FBRztFQUNwQmxHLE9BQU8sRUFBRSxDQUFDO0VBQ1ZtRyxTQUFTQSxDQUFDNUksS0FBSyxFQUFFO0lBQ2YsSUFBSSxDQUFDeUMsT0FBTyxHQUFHekMsS0FBSztJQUNwQjZDLDJGQUFtQyxDQUFDLENBQUM7RUFDdkM7QUFDRixDQUFDO0FBRUQsU0FBU2dHLGNBQWNBLENBQUEsRUFBRztFQUN4QnZCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGdCQUFnQixDQUFDO0VBRTdCLE1BQU07SUFBRTlFO0VBQVEsQ0FBQyxHQUFHa0csYUFBYTtFQUNqQyxNQUFNbkksTUFBTSxHQUFHa0ksc0VBQWlCLENBQUMsTUFBTSxDQUFDO0VBQ3hDLE1BQU1oRyxTQUFTLEdBQUdnRyxzRUFBaUIsQ0FBQyxXQUFXLENBQUM7RUFDaEQsTUFBTTVDLFFBQVEsR0FBRyxJQUFJMkMsdURBQVksQ0FBQ2hHLE9BQU8sRUFBRWpDLE1BQU0sRUFBRWtDLFNBQVMsQ0FBQztFQUM3RCxPQUFPb0QsUUFBUTtBQUNqQjtBQUVBLFNBQVNnRCxvQkFBb0JBLENBQUEsRUFBRztFQUM5QixNQUFNaEQsUUFBUSxHQUFHK0MsY0FBYyxDQUFDLENBQUM7RUFDakM5RyxzREFBa0IsQ0FBQ3BDLE9BQU8sQ0FBQ21HLFFBQVEsQ0FBQztBQUN0QztBQUVBLFNBQVNpRCxxQkFBcUJBLENBQUEsRUFBRztFQUMvQixNQUFNakQsUUFBUSxHQUFHK0MsY0FBYyxDQUFDLENBQUM7RUFDakM5Ryx3REFBb0IsQ0FBQ3BDLE9BQU8sQ0FBQ21HLFFBQVEsQ0FBQztBQUN4QztBQUVBL0QsMkRBQXVCLENBQUNQLFNBQVMsQ0FBQ21ILGFBQWEsQ0FBQ0MsU0FBUyxDQUFDSSxJQUFJLENBQUNMLGFBQWEsQ0FBQyxDQUFDO0FBRTlFNUcsbURBQWUsQ0FBQ1AsU0FBUyxDQUFDc0gsb0JBQW9CLENBQUM7QUFDL0MvRywwREFBc0IsQ0FBQ1AsU0FBUyxDQUFDdUgscUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ1A7QUFDUztBQUNRO0FBQ1I7QUFDUjtBQUVqRCxNQUFNRSxjQUFjLFNBQVMvSCw2REFBTSxDQUFDO0VBQ2xDdkMsV0FBV0EsQ0FBQ2tCLE1BQU0sRUFBRTtJQUNsQixLQUFLLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQ0EsTUFBTSxHQUFHQSxNQUFNO0VBQ3RCO0VBRUFtQyxNQUFNLEdBQUdBLENBQUEsS0FBTTtJQUNiLElBQUlwQixHQUFHLEdBQUc0RixpRUFBWSxDQUFDLEdBQUcsQ0FBQztJQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDbkYsS0FBSyxDQUFDVCxHQUFHLENBQUMsRUFBRTtNQUN4QkEsR0FBRyxHQUFHNEYsaUVBQVksQ0FBQyxHQUFHLENBQUM7SUFDekI7SUFDQSxLQUFLLENBQUNwRixTQUFTLEdBQUdSLEdBQUc7SUFDckIsSUFBSSxDQUFDZixNQUFNLENBQUNGLE9BQU8sQ0FBQ2lCLEdBQUcsQ0FBQztJQUN4QixPQUFPQSxHQUFHO0VBQ1osQ0FBQztBQUNIO0FBRUEsU0FBU3NJLGNBQWNBLENBQUEsRUFBSTtFQUN6QixNQUFNQyxjQUFjLEdBQUcsSUFBSUYsY0FBYyxDQUFDdkQscUVBQWMsQ0FBQztFQUN6REUsNkRBQVUsQ0FBQ3BFLFNBQVMsQ0FBQzJILGNBQWMsQ0FBQ25ILE1BQU0sQ0FBQztBQUM3QztBQUVBdkQsNkRBQWdCLENBQUMrQyxTQUFTLENBQUMwSCxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQzVCTTtBQUNFO0FBQ087QUFDUDtBQUVsRCxNQUFNRSxVQUFVLFNBQVNsSSw2REFBTSxDQUFDO0VBQy9CdkMsV0FBV0EsQ0FBQ2tCLE1BQU0sRUFBRTtJQUNqQixLQUFLLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQ0EsTUFBTSxHQUFHQSxNQUFNO0VBQ3RCO0VBRUFtQyxNQUFNLEdBQUloQyxLQUFLLElBQUs7SUFDbEIsSUFBSSxLQUFLLENBQUNxQixLQUFLLENBQUNyQixLQUFLLENBQUMsRUFBRTtNQUN0QixLQUFLLENBQUNvQixTQUFTLEdBQUdwQixLQUFLO01BQ3ZCLElBQUksQ0FBQ0gsTUFBTSxDQUFDRixPQUFPLENBQUNLLEtBQUssQ0FBQztNQUMxQixPQUFPQSxLQUFLO0lBQ2Q7SUFDQSxNQUFNLElBQUkwQixLQUFLLENBQUMsZ0NBQWdDLENBQUM7RUFDbkQsQ0FBQztBQUNIO0FBRUEsU0FBUzJILFVBQVVBLENBQUEsRUFBRztFQUNwQixNQUFNQyxNQUFNLEdBQUcsSUFBSUYsVUFBVSxDQUFDeEQsNkRBQVUsQ0FBQztFQUN6QzdELG9EQUFnQixDQUFDUCxTQUFTLENBQUM4SCxNQUFNLENBQUN0SCxNQUFNLENBQUM7QUFDM0M7QUFFQXZELDZEQUFnQixDQUFDK0MsU0FBUyxDQUFDNkgsVUFBVSxDQUFDO0FBRXRDLCtEQUFlRCxVQUFVOzs7Ozs7Ozs7OztBQzFCekIsU0FBU1YsaUJBQWlCQSxDQUFDYSxJQUFJLEVBQUU7RUFDL0IsSUFBSSxPQUFPQSxJQUFJLEtBQUssUUFBUSxFQUFFO0lBQzVCLE1BQU0sSUFBSTdILEtBQUssQ0FBQywwQkFBMEIsQ0FBQztFQUM3QztFQUNBLE1BQU04SCxNQUFNLEdBQUdwTCxRQUFRLENBQUM0RSxnQkFBZ0IsQ0FBRSxVQUFTdUcsSUFBSyxJQUFHLENBQUM7RUFFNUQsS0FBSyxJQUFJekwsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHMEwsTUFBTSxDQUFDaEosTUFBTSxFQUFFMUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN2QyxJQUFJMEwsTUFBTSxDQUFDMUwsQ0FBQyxDQUFDLENBQUMyTCxPQUFPLEVBQUU7TUFDckIsT0FBT0QsTUFBTSxDQUFDMUwsQ0FBQyxDQUFDLENBQUNrQyxLQUFLO0lBQ3hCO0VBQ0o7QUFDRjtBQUVBLCtEQUFlMEksaUJBQWlCOzs7Ozs7Ozs7OztBQ2ZoQyxTQUFTbEMsWUFBWUEsQ0FBQ00sR0FBRyxFQUFFO0VBQ3pCLE9BQU80QyxJQUFJLENBQUNDLEtBQUssQ0FBQ0QsSUFBSSxDQUFDRSxNQUFNLENBQUMsQ0FBQyxHQUFHOUMsR0FBRyxDQUFDO0FBQ3hDO0FBRUEsK0RBQWVOLFlBQVk7Ozs7OztVQ0ozQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnFEO0FBQ0c7QUFFeEQvSCwyRUFBbUIsQ0FBQ2tCLE9BQU8sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLWF0dGFjay1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL3NoaXAtaW5mby5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVTaW5nbGVFdmVudFRpbGUgZnJvbSBcIi4vY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50VGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVTaW5nbGVFdmVudFRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRUaWxlcztcbiIsImltcG9ydCBjcmVhdGVTaW5nbGVUaWxlIGZyb20gXCIuL2NyZWF0ZS1zaW5nbGUtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGVFdmVudFRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBjcmVhdGVTaW5nbGVUaWxlKGlkKTtcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIiwiZnVuY3Rpb24gY3JlYXRlU2luZ2xlVGlsZShpZCkge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVUaWxlOyIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5jbGFzcyBHYW1lQm9hcmRWaWV3VXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcbiAgfVxuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZWxlbWVudH1cIl1gXG4gICAgICApO1xuICAgICAgR2FtZUJvYXJkVmlld1VwZGF0ZXIudXBkYXRlU3Vuayh0aWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtvYmoudGlsZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXdVcGRhdGVyLmdldFN0YXR1cyhvYmopKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkVmlld1VwZGF0ZXI7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICBzZXQgc2hpcHModmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIgPSB0aGlzLnNoaXBzQXJyLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogQ2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBudW0gc2VsZWN0ZWQgYnkgcGxheWVyIGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7aGl0OiB0cnVlLCBzdW5rOiB0cnVlLCB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyB9XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmlzT3ZlcigpKSA/IHRoaXMucHViU3ViLnB1Ymxpc2goey4uLm9iaiwgLi4ue2dhbWVvdmVyOiB0cnVlfX0pIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkQXJyLnB1c2gobnVtKTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBDYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7IFxuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2tcbiAgfSBcbiAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcEJ0bigpIHtcbiAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXMsIHBsYWNlU2hpcEJ0bn07XG4iLCJcbi8qIENyZWF0ZXMgYSBjb29yZGluYXRlIGFyciBmb3IgYSBzaGlwIG9iamVjdCdzIGNvb3JkaW5hdGVzIHByb3BlcnR5IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gIGNvbnN0IGFyciA9IFsrb2JqLnRpbGVOdW1dXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvb3JBcnI7XG4iLCJpbXBvcnQgY3JlYXRlQ29vckFyciBmcm9tIFwiLi9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyclwiO1xuXG4vKiBDcmVhdGVzIHNoaXAgb2JqZWN0IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjcmVhdGVDb29yQXJyKG9iaik7XG4gIH1cblxuICB0aW1lc0hpdCA9IDA7XG5cbiAgc3VuayA9IGZhbHNlO1xuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMudGltZXNIaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuXG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcblxuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cblxuLyogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQgKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCApIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpXG4gIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KVxuICB9KVxufVxuXG4vKiBoaWRlcyB0aGUgZm9ybSAqL1xuZnVuY3Rpb24gaGlkZUZvcm0oKSB7XG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtXCIpXG4gIGZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gc2hvd0NvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoc2hvd0NvbXBCb2FyZClcblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKClcbiAgY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZDb21wdXRlciwgcHVibGlzaERvbURhdGEuYXR0YWNrKTtcbn1cblxuLyogQ3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBpbml0Lm5ld0dhbWUucHVibGlzaCgpO1xuICB9KVxuICByZXR1cm4gYnRuXG59XG5cblxuZnVuY3Rpb24gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uXCIpO1xuICBcbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gIGgxLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19oZWFkaW5nXCIpXG4gIGgxLnRleHRDb250ZW50ID0gXCJHQU1FIE9WRVJcIjtcbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcblxuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICAoc3RyaW5nID09PSBcInVzZXJcIikgPyAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBMT1NUXCIpIDogKGgzLnRleHRDb250ZW50ID0gXCJZT1UgV09OXCIpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlTmV3R2FtZUJ0bigpKTtcbiAgcmV0dXJuIGRpdlxufSBcblxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKVxuICBjb25zdCBub3RpZmljYXRpb24gPSBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZyk7XG4gIG1haW4uYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcbn1cblxuLyogcmVtb3ZlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gKi9cbmZ1bmN0aW9uIHJlbW92ZUdhbWVPdmVyKCkge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG4gIGRpdi5yZW1vdmUoKTtcbn1cblxuaW5pdC5uZXdHYW1lLnN1YnNjcmliZShyZW1vdmVHYW1lT3Zlcik7XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRBdHRhY2tTdGFnZVRpbGVzKTtcbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGhpZGVGb3JtKVxuaW5pdC5nYW1lb3Zlci5zdWJzY3JpYmUoc2hvd0dhbWVPdmVyKSIsImltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgXCIuL2xheW91dC0tYXR0YWNrLXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbi8qIHJlbW92ZSBleGlzdGluZyB0aWxlcyAqL1xuXG5mdW5jdGlvbiByZW1vdmVUaWxlcyhwbGF5ZXJTdHJpbmcpIHtcbiAgaWYgKFxuICAgIHR5cGVvZiBwbGF5ZXJTdHJpbmcgIT09IFwic3RyaW5nXCIgJiZcbiAgICAocGxheWVyU3RyaW5nID09PSBcInVzZXJcIiB8fCBwbGF5ZXJTdHJpbmcgPT09IFwiY29tcHV0ZXJcIilcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJGdW5jdGlvbiBhcmd1bWVudCBoYXMgdG8gYmUgYSBzdHJpbmcgd2l0aCB0aGUgdmFsdWUgdXNlciBvciBjb21wdXRlclwiXG4gICAgKTtcbiAgfVxuICBjb25zdCBnYW1lYm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWJvYXJkLS0ke3BsYXllclN0cmluZ31gKTtcbiAgd2hpbGUgKGdhbWVib2FyZC5maXJzdENoaWxkKSB7XG4gICAgZ2FtZWJvYXJkLnJlbW92ZUNoaWxkKGdhbWVib2FyZC5sYXN0Q2hpbGQpO1xuICB9XG59XG5cbi8qIHJlbW92ZXMgZXhpc3RpbmcgdGlsZXMgZnJvbSBnYW1lYm9hcmQtLWNvbXB1dGVyIGFuZCBnYW1lYm9hcmQtLXVzZXIgKi9cblxuZnVuY3Rpb24gcmVzZXRCb2FyZHMoKSB7XG4gIHJlbW92ZVRpbGVzKFwidXNlclwiKTtcbiAgcmVtb3ZlVGlsZXMoXCJjb21wdXRlclwiKTtcbn1cblxuaW5pdC5uZXdHYW1lLnN1YnNjcmliZShyZXNldEJvYXJkcyk7XG5cbmZ1bmN0aW9uIHNob3dBbGxIaWRkZW4obm9kZXMpIHtcbiAgY29uc3Qgbm9kZXNBcnIgPSBBcnJheS5mcm9tKG5vZGVzKTtcbiAgbm9kZXNBcnIuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGlmIChub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImhpZGRlblwiKSkge1xuICAgICAgbm9kZS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0Rm9ybSgpIHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1cIilcbiAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICBjb25zdCBmb3JtSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG4gIGNvbnN0IGZvcm1MYWJlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGFiZWxcIik7XG4gIHNob3dBbGxIaWRkZW4oZm9ybUlucHV0cyk7XG4gIHNob3dBbGxIaWRkZW4oZm9ybUxhYmVscyk7XG59XG5cbmluaXQubmV3R2FtZS5zdWJzY3JpYmUocmVzZXRGb3JtKTtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0Lm5ld0dhbWUuc3Vic2NyaWJlKGhpZGVDb21wQm9hcmQpO1xuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoaGlkZUNvbXBCb2FyZClcblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcyk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycylcblxuZnVuY3Rpb24gYWRkQnRuTGlzdGVuZXIoKSB7XG4gIGNvbnN0IHBsYWNlU2hpcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcbiAgcGxhY2VTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5wbGFjZVNoaXBCdG4pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRCdG5MaXN0ZW5lcilcblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoY3JlYXRlUGxhY2VtZW50VGlsZXMpXG5pbml0Lm5ld0dhbWUuc3Vic2NyaWJlKGNyZWF0ZVBsYWNlbWVudFRpbGVzKVxuXG5cbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gICAqL1xuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICAqL1xuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgICovXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgICovXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBhIG5ldyBnYW1lICovXG5cbmNvbnN0IG5ld0dhbWUgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IGF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSwgbmV3R2FtZSwgZ2FtZW92ZXIgfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IFNoaXBJbmZvIGZyb20gXCIuL3NoaXAtaW5mby9zaGlwLWluZm9cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cblxuY2xhc3MgQ29tcHV0ZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuICAvKiBSZWNyZWF0ZXMgYSByYW5kb20gc2hpcCwgdW50aWwgaXRzIGNvb3JkaW5hdGVzIGFyZSBub3QgdGFrZW4uICovXG5cbiAgcGxhY2VTaGlwKGxlbmd0aCkge1xuICAgIGxldCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIHdoaWxlICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykpIHtcbiAgICAgIHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgICBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q29tcEdCKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJHYW1lQm9hcmQoaGFuZGxlVXNlckF0dGFjayk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNyk7XG4gICAvKiAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNSk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMyk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMik7ICovXG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcEdCKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiXG5cbmNvbnN0IGNvbXB1dGVyID0gXCJjb21wdXRlclwiO1xuXG5jb25zdCBjb21wdXRlclZpZXdVcGRhdGVyID0gbmV3IEdhbWVCb2FyZFZpZXdVcGRhdGVyKGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBDcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDExKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKSk7XG4gIH1cbiAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgY29uc29sZS5sb2codGhpcy5pc1ZhbGlkKG9iaikpXG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJCb2FyZCgpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFVzZXJCb2FyZCgpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlld1VwZGF0ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXJcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciBleHRlbmRzIEdhbWVCb2FyZFZpZXdVcGRhdGVyIHtcbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG4nKVxuICBcbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSByYWRpbyBpbnB1dCBmb3IgdGhhdCBzaGlwIGlzIGhpZGRlbiAqL1xuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKVxuICAgIHJhZGlvTGFiZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfVxuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgbmV4dCByYWRpbyBpbnB1dCBpcyBjaGVja2VkIHNvIHRoYXQgeW91IGNhbid0IHBsYWNlIHR3byBvZiB0aGUgc2FtZSBzaGlwcyB0d2ljZSxcbiAgICAgd2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBzaGlwcyB0byBwbGFjZSBuZXh0U2hpcENoZWNrZWQgd2lsbCBpbml0aWFsaXplIHRoZSBhdHRhY2sgc3RhZ2UgKi9cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKVxuICAgIGlmIChyYWRpbyA9PT0gbnVsbCkge1xuICAgICAgaW5pdC5hdHRhY2tTdGFnZS5wdWJsaXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGlvLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIiwgXCJcIilcbiAgICB9XG4gICAgXG4gIH1cblxuIC8qIENsZWFycyB0aGUgdmFsaWRpdHkgY2hlY2sgb2YgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZC4gSWYgaXQgcGFzc2VzIHRoZSBjaGVjayBpdCB1bmxvY2tzIHRoZSBwbGFjZSBzaGlwIGJ0biAqL1xuICAgY2xlYXJWYWxpZGl0eVZpZXcgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KVxuICAgIHRoaXMuYnRuLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpXG4gIH1cblxuIC8qIGFkZHMgdGhlIHZpc3VhbCBjbGFzcyBwbGFjZW1lbnQtLXZhbGlkL29yIHBsYWNlbWVudC0taW52YWxpZCBiYXNlZCBvbiB0aGUgdGlsZU51bSBjaG9zZW4gYnkgdGhlIHVzZXIsIGRpc2FibGVzIHRoZSBzdWJtaXQgYnRuIGlmIGl0IGZhaWxzIHBsYWNlbWVudCBjaGVjayAqL1xuXG4gIGhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgaWYgKCFvYmoudmFsaWQpIHtcbiAgICAgIHRoaXMuYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG9iai52YWxpZCkge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXZhbGlkXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKVxuICAgIHRoaXMuY29uc3RydWN0b3IubmV4dFNoaXBDaGVja2VkKCk7XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goY29vcmRpbmF0ZSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgIClcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tc2hpcFwiKVxuICAgIH0pXG4gIH1cbn1cblxuXG5cblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyKHVzZXIpO1xuXG5oYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpXG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3KVxuXG5leHBvcnQgZGVmYXVsdCB1c2VyVmlld1VwZGF0ZXI7XG4iLCJjbGFzcyBTaGlwSW5mb1VzZXIge1xuICBjb25zdHJ1Y3RvciAodGlsZU51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICB0aGlzLnRpbGVOdW0gPSArdGlsZU51bTtcbiAgICB0aGlzLmxlbmd0aCA9ICtsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mb1VzZXI7XG5cbiIsImltcG9ydCBTaGlwSW5mb1VzZXIgZnJvbSBcIi4vc2hpcC1pbmZvLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uLy4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcygpO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnNvbGUubG9nKFwic2hpcGNyZWF0ZWRSdW5cIik7XG5cbiAgY29uc3QgeyB0aWxlTnVtIH0gPSBzaGlwUGxhY2VtZW50O1xuICBjb25zdCBsZW5ndGggPSBkaXNwbGF5UmFkaW9WYWx1ZShcInNoaXBcIik7XG4gIGNvbnN0IGRpcmVjdGlvbiA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwiZGlyZWN0aW9uXCIpO1xuICBjb25zdCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mb1VzZXIodGlsZU51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pXG4gIHJldHVybiBzaGlwSW5mb1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpXG4gIHVzZXJDbGljay5zaGlwSW5mby5wdWJsaXNoKHNoaXBJbmZvKTsgIFxufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suY3JlYXRlU2hpcC5wdWJsaXNoKHNoaXBJbmZvKTsgIFxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG5cbnVzZXJDbGljay5pbnB1dC5zdWJzY3JpYmUocHVibGlzaFNoaXBJbmZvQ2hlY2spO1xudXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5zdWJzY3JpYmUocHVibGlzaFNoaXBJbmZvQ3JlYXRlKVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5pbXBvcnQgeyBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmNsYXNzIENvbXB1dGVyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIGF0dGFjayA9ICgpID0+IHtcbiAgICBsZXQgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pKSB7XG4gICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICB9XG4gICAgc3VwZXIuYXR0YWNrQXJyID0gbnVtO1xuICAgIHRoaXMucHViU3ViLnB1Ymxpc2gobnVtKVxuICAgIHJldHVybiBudW1cbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q29tcFBsYXllciAoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBQbGF5ZXIpXG5cbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG4gIFxuICBhdHRhY2sgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc3VwZXIuaXNOZXcodmFsdWUpKSB7XG4gICAgICBzdXBlci5hdHRhY2tBcnIgPSB2YWx1ZTtcbiAgICAgIHRoaXMucHViU3ViLnB1Ymxpc2godmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWRcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFBsYXllcigpIHtcbiAgY29uc3QgcGxheWVyID0gbmV3IFVzZXJQbGF5ZXIodXNlckF0dGFjayk7XG4gIHVzZXJDbGljay5hdHRhY2suc3Vic2NyaWJlKHBsYXllci5hdHRhY2spO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0UGxheWVyKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUGxheWVyO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsImZ1bmN0aW9uIGdldFJhbmRvbU51bShtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tTnVtICIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4vY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5wdWJsaXNoKCk7Il0sIm5hbWVzIjpbImNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImNyZWF0ZUV2ZW50VGlsZXMiLCJkaXYiLCJjYWxsYmFjayIsImkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVNpbmdsZVRpbGUiLCJpZCIsInRpbGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwiaW5pdCIsIkdhbWVCb2FyZFZpZXdVcGRhdGVyIiwiY29uc3RydWN0b3IiLCJzdHJpbmciLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwidXBkYXRlU3Vua1RpbGVzIiwidGlsZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsImdhbWVvdmVyIiwicHVibGlzaCIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWRBcnIiLCJpc1Rha2VuIiwiY29vcmRpbmF0ZXMiLCJsZW5ndGgiLCJ5IiwiaW5jbHVkZXMiLCJoYW5kbGVBdHRhY2siLCJudW0iLCJpc1N1bmsiLCJpc092ZXIiLCJjaGVjayIsImV2ZXJ5Iiwic2hpcCIsIlBsYXllciIsInByZXZpb3VzQXR0YWNrcyIsImF0dGFja0FyciIsImlzTmV3IiwiUHViU3ViIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJ1c2VyQ2xpY2siLCJhdHRhY2siLCJkYXRhc2V0IiwicGlja1BsYWNlbWVudCIsImFsZXJ0U2hpcEluZm9DaGFuZ2VzIiwiaW5wdXQiLCJwbGFjZVNoaXBCdG4iLCJzaGlwUGxhY2VCdG4iLCJjcmVhdGVDb29yQXJyIiwiYXJyIiwidGlsZU51bSIsImRpcmVjdGlvbiIsIlNoaXAiLCJ0aW1lc0hpdCIsInB1Ymxpc2hEb21EYXRhIiwiZ2FtZUJvYXJkRGl2Q29tcHV0ZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGlkZUZvcm0iLCJmb3JtIiwic2hvd0NvbXBCb2FyZCIsImNvbXBCb2FyZCIsInJlbW92ZSIsImF0dGFja1N0YWdlIiwiaW5pdEF0dGFja1N0YWdlVGlsZXMiLCJjcmVhdGVOZXdHYW1lQnRuIiwiYnRuIiwidGV4dENvbnRlbnQiLCJuZXdHYW1lIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwicmVtb3ZlR2FtZU92ZXIiLCJyZW1vdmVUaWxlcyIsInBsYXllclN0cmluZyIsImdhbWVib2FyZCIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImxhc3RDaGlsZCIsInJlc2V0Qm9hcmRzIiwic2hvd0FsbEhpZGRlbiIsIm5vZGVzIiwibm9kZXNBcnIiLCJmcm9tIiwibm9kZSIsInJlc2V0Rm9ybSIsImZvcm1JbnB1dHMiLCJmb3JtTGFiZWxzIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJwbGFjZW1lbnRTdGFnZSIsImFkZElucHV0TGlzdGVuZXJzIiwiYWRkQnRuTGlzdGVuZXIiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3VXBkYXRlciIsImdldFJhbmRvbU51bSIsImdldFJhbmRvbURpcmVjdGlvbiIsImdldFJhbmRvbVRpbGVOdW0iLCJ0b1N0cmluZyIsIlVzZXJHYW1lQm9hcmQiLCJjYWxjTWF4IiwibWF4IiwiY2hhckF0IiwiY2FsY0xlbmd0aCIsImlzVG9vQmlnIiwic2hpcExlbmd0aCIsImlzVmFsaWQiLCJ2YWxpZCIsInB1Ymxpc2hWYWxpZGl0eSIsImNvbnNvbGUiLCJsb2ciLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIiLCJoaWRlUmFkaW8iLCJyYWRpb0lucHV0IiwicmFkaW9MYWJlbCIsIm5leHRTaGlwQ2hlY2tlZCIsInJhZGlvIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlld1VwZGF0ZXIiLCJTaGlwSW5mb1VzZXIiLCJkaXNwbGF5UmFkaW9WYWx1ZSIsInNoaXBQbGFjZW1lbnQiLCJ1cGRhdGVOdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiYmluZCIsIkNvbXB1dGVyUGxheWVyIiwiaW5pdENvbXBQbGF5ZXIiLCJjb21wdXRlclBsYXllciIsIlVzZXJQbGF5ZXIiLCJpbml0UGxheWVyIiwicGxheWVyIiwibmFtZSIsImlucHV0cyIsImNoZWNrZWQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwic291cmNlUm9vdCI6IiJ9