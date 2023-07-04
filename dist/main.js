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

  /* Checks if ship would be neighboring a different ship */
  isNeighboring(coordinates, direction) {
    let coordinatesAllNeighbors = [];
    if (direction === "horizontal") {
      coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 10), coordinates.map(coor => coor - 10)); // top and bottom neighbors
      if (coordinates[0] === 1 || +String(coordinates[0]).slice(0, -1) === 1) {
        coordinatesAllNeighbors.push(coordinates[-1] + 1); // right neighbor
      } else if (coordinates[-1] % 10 === 0) {
        coordinatesAllNeighbors.push(coordinates[0] - 1); // left neighbor
      } else {
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 1] + 1, coordinates[0] - 1); // left and right neighbors
      }
    } else {
      coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 1), coordinates.map(coor => coor - 1)); // left and right neighbors
      if (coordinates[0] < 11) {
        coordinatesAllNeighbors.push(coordinates[-1] + 10); // btm neighbor
      } else if (coordinates[coordinates.length - 1] > 90) {
        coordinatesAllNeighbors.push(coordinates[0] - 10); // top neighbor
      } else {
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 10] + 1, coordinates[0] - 10); // top and btm neighbors
      }
    }

    if (this.isTaken(coordinatesAllNeighbors)) {
      return true;
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







function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}
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
/* harmony export */   placementStage: function() { return /* binding */ placementStage; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");


/* initializes the placement stage */

const placementStage = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* initializes the attack stage */

const attackStage = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* initializes game over div */

const gameover = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


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
    while (this.isTaken(ship.coordinates) || this.isNeighboring(ship.coordinates, ship.direction)) {
      shipInfo = new _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__["default"](length);
      ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](shipInfo);
    }
    this.ships = ship;
  }
}
function initCompGB() {
  const computerBoard = new ComputerGameBoard(_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.handleUserAttack);
  computerBoard.placeShip(5);
  computerBoard.placeShip(4);
  computerBoard.placeShip(3);
  computerBoard.placeShip(2);
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
    return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString());
  }
  return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString());
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
      if (obj.tileNum % 10 === 0) {
        return obj.tileNum;
      }
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
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj) || this.isNeighboring(ship.coordinates, obj.direction)) {
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
      radio.checked = true;
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
  },
  resetNum() {
    this.tileNum = 0;
  }
};
function createShipInfo() {
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
  const isComplete = Object.values(shipInfo).every(value => {
    if (value !== null && value !== undefined && value !== false && value !== 0) {
      return true;
    }
    return false;
  });
  if (isComplete) {
    console.log(shipInfo);
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.createShip.publish(shipInfo);
    shipPlacement.resetNum();
  }
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
  foundShip = {
    found: false,
    hit: false,
    coordinates: [],
    difference: null,
    endFound: false,
    end: null
  };
  wasAttackSuccess = obj => {
    if (obj.sunk) {
      this.foundShip = {
        found: false,
        hit: false,
        coordinates: [],
        difference: null,
        endFound: false
      };
    } else if (obj.hit && this.foundShip.found === false) {
      this.foundShip.coordinates.push(obj.tile);
      this.foundShip.hit = true;
      this.foundShip.found = true;
    } else if (obj.hit && this.foundShip.found === true) {
      this.foundShip.hit = true;
      this.foundShip.coordinates.push(obj.tile);
      if (this.foundShip.difference === null) {
        this.foundShip.difference = Math.abs(this.foundShip.coordinates[0] - obj.tile);
      }
    } else if (obj.hit === false && this.foundShip.found === true && this.foundShip.coordinates.length > 1) {
      console.log("endFound");
      this.foundShip.hit = false;
      this.foundShip.endFound = true;
      this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
    } else if (obj.hit === false && this.foundShip.found === true) {
      this.foundShip.hit = false;
    }
  };
  attack = () => {
    console.log(this.foundShip);
    let num;
    if (this.foundShip.coordinates.length === 1) {
      const sides = [1, 10];
      const operators = [{
        sign: "+",
        method: function (a, b) {
          return a + b;
        }
      }, {
        sign: "-",
        method: function (a, b) {
          return a - b;
        }
      }];
      num = operators[Math.floor(Math.random() * operators.length)].method(this.foundShip.coordinates[0], sides[Math.floor(Math.random() * sides.length)]);
      console.log(num);
      /* num = this.foundShip.coordinates[0]+1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10; */ //need to refactor this
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = operators[Math.floor(Math.random() * operators.length)].method(this.foundShip.coordinates[0], sides[Math.floor(Math.random() * sides.length)]);
        console.log(num);
        /*  num = this.foundShip.coordinates[0] +1 || this.foundShip.coordinates[0]-1 || this.foundShip.coordinates[0] +10 || this.foundShip.coordinates[0] -10; */
      }
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === true) {
      if (this.foundShip.endFound === false) {
        if (this.foundShip.coordinates[this.foundShip.coordinates.length - 1] > this.foundShip.coordinates[this.foundShip.coordinates.length - 2]) {
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
        } else if (this.foundShip.coordinates[this.foundShip.coordinates.length - 1] < this.foundShip.coordinates[this.foundShip.coordinates.length - 2]) {
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] - this.foundShip.difference;
        }
        if (num > 100 || num < 1 || !super.isNew(num)) {
          // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true;
          this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
          this.foundShip.coordinates = this.foundShip.coordinates.sort();
          if (this.foundShip.end === this.foundShip.coordinates[0]) {
            num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
          } else {
            num = this.foundShip.coordinates[0] - this.foundShip.difference;
          }
        }
      } else if (this.foundShip.endFound === true) {
        /* console.log num */
        if (this.foundShip.end === this.foundShip.coordinates[0]) {
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
        } else {
          num = this.foundShip.coordinates[0] - this.foundShip.difference;
        }
      }
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === false) {
      this.foundShip.endFound = true;
      this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
      this.foundShip.coordinates = this.foundShip.coordinates.sort();
      if (this.foundShip.end === this.foundShip.coordinates[0]) {
        num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
      } else {
        num = this.foundShip.coordinates[0] - this.foundShip.difference;
      }
    }
    if (this.foundShip.found === false) {
      num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      while (!super.isNew(num)) {
        num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      }
    }
    super.attackArr = num;
    this.pubSub.publish(num);
    console.log(num);
    return num;
  };
}
function initCompPlayer() {
  const computerPlayer = new ComputerPlayer(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.computerAttack);
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.userAttack.subscribe(computerPlayer.attack);
  _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.handleComputerAttack.subscribe(computerPlayer.wasAttackSuccess);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUQsU0FBUyxLQUFLLFlBQVksRUFBRTtNQUM5QkMsdUJBQXVCLEdBQUdBLHVCQUF1QixDQUFDVixNQUFNLENBQ3RESSxXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQ3BDUixXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUNyQyxDQUFDLENBQUMsQ0FBQztNQUNILElBQUlSLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQ1MsTUFBTSxDQUFDVCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0RUosdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNyRCxDQUFDLE1BQU0sSUFBSUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNyQ00sdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEQsQ0FBQyxNQUFNO1FBQ0xNLHVCQUF1QixDQUFDVCxJQUFJLENBQzFCRyxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDdkNELFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNuQixDQUFDLENBQUMsQ0FBQztNQUNMO0lBQ0YsQ0FBQyxNQUFNO01BQ0xNLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ1YsTUFBTSxDQUN0REksV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUNuQ1IsV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FDcEMs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QkFBZ0IsQ0FBRSxVQUFTaUgsSUFBSyxJQUFHLENBQUM7RUFFNUQsS0FBSyxJQUFJek0sQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHME0sTUFBTSxDQUFDaEssTUFBTSxFQUFFMUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN2QyxJQUFJME0sTUFBTSxDQUFDMU0sQ0FBQyxDQUFDLENBQUMySixPQUFPLEVBQUU7TUFDckIsT0FBTytDLE1BQU0sQ0FBQzFNLENBQUMsQ0FBQyxDQUFDa0MsS0FBSztJQUN4QjtFQUNKO0FBQ0Y7QUFFQSwrREFBZWtJLGlCQUFpQjs7Ozs7Ozs7Ozs7QUNmaEMsU0FBU2pDLFlBQVlBLENBQUNNLEdBQUcsRUFBRTtFQUN6QixPQUFPZ0QsSUFBSSxDQUFDUSxLQUFLLENBQUNSLElBQUksQ0FBQ1MsTUFBTSxDQUFDLENBQUMsR0FBR3pELEdBQUcsQ0FBQztBQUN4QztBQUVBLCtEQUFlTixZQUFZOzs7Ozs7VUNKM0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQSw4Q0FBOEM7Ozs7O1dDQTlDO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05xRDtBQUNHO0FBRXhEeEgsMkVBQW1CLENBQUNrQixPQUFPLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC12aWV3LXVwZGF0ZXIvZ2FtZWJvYXJkLXZpZXctdXBkYXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcGxheWVyL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHViLXN1Yi9wdWItc3ViLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGEuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvY3JlYXRlLWNvb3JkaW5hdGVzLWFyci9jcmVhdGUtY29vci1hcnIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1hdHRhY2stc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9zaGlwLWluZm8uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8tLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2dldC1yYW5kb20tbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIGZyb20gXCIuL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50VGlsZXM7XG4iLCJpbXBvcnQgY3JlYXRlU2luZ2xlVGlsZSBmcm9tIFwiLi9jcmVhdGUtc2luZ2xlLXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gY3JlYXRlU2luZ2xlVGlsZShpZCk7XG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImZ1bmN0aW9uIGNyZWF0ZVNpbmdsZVRpbGUoaWQpIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlVGlsZTsiLCJpbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuY2xhc3MgR2FtZUJvYXJkVmlld1VwZGF0ZXIge1xuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyB1cGRhdGVTdW5rKHRpbGUpIHtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlcGxhY2UoXCJoaXRcIiwgXCJzdW5rXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXRTdGF0dXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai5oaXQgPyBcImhpdFwiIDogXCJtaXNzXCI7XG4gIH1cblxuICB1cGRhdGVTdW5rVGlsZXMob2JqKSB7XG4gICAgb2JqLnRpbGVzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2VsZW1lbnR9XCJdYFxuICAgICAgKTtcbiAgICAgIEdhbWVCb2FyZFZpZXdVcGRhdGVyLnVwZGF0ZVN1bmsodGlsZSk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVBdHRhY2tWaWV3ID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy51cGRhdGVTdW5rVGlsZXMob2JqKTtcbiAgICAgIGlmIChvYmouZ2FtZW92ZXIpIHtcbiAgICAgICAgaW5pdC5nYW1lb3Zlci5wdWJsaXNoKHRoaXMuc3RyaW5nKVxuICAgICAgfSBcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7b2JqLnRpbGV9XCJdYFxuICAgICAgKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChHYW1lQm9hcmRWaWV3VXBkYXRlci5nZXRTdGF0dXMob2JqKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZFZpZXdVcGRhdGVyO1xuIiwiY2xhc3MgR2FtZUJvYXJkIHtcbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBzaGlwc0FyciA9IFtdO1xuXG4gIGdldCBzaGlwcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwc0FycjtcbiAgfVxuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBDaGVja3MgaWYgY29vcmRpbmF0ZXMgYWxyZWFkeSBoYXZlIGEgc2hpcCBvbiB0aGVtICovXG5cbiAgaXNUYWtlbihjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgc2hpcCB3b3VsZCBiZSBuZWlnaGJvcmluZyBhIGRpZmZlcmVudCBzaGlwICovXG4gIGlzTmVpZ2hib3JpbmcoY29vcmRpbmF0ZXMsIGRpcmVjdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMTApLFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxMClcbiAgICAgICk7IC8vIHRvcCBhbmQgYm90dG9tIG5laWdoYm9yc1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdID09PSAxIHx8ICtTdHJpbmcoY29vcmRpbmF0ZXNbMF0pLnNsaWNlKDAsIC0xKSA9PT0gMSkge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWy0xXSArIDEpOyAvLyByaWdodCBuZWlnaGJvclxuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1stMV0gJSAxMCA9PT0gMCkge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMSk7IC8vIGxlZnQgbmVpZ2hib3JcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMVxuICAgICAgICApOyAvLyBsZWZ0IGFuZCByaWdodCBuZWlnaGJvcnNcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpLFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgKTsgLy8gbGVmdCBhbmQgcmlnaHQgbmVpZ2hib3JzXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gPCAxMSkge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWy0xXSArIDEwKTsgLy8gYnRtIG5laWdoYm9yXG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdID4gOTApIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEwKTsgLy8gdG9wIG5laWdoYm9yXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDEwXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxMFxuICAgICAgICApOyAvLyB0b3AgYW5kIGJ0bSBuZWlnaGJvcnNcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNUYWtlbihjb29yZGluYXRlc0FsbE5laWdoYm9ycykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIG51bSBzZWxlY3RlZCBieSBwbGF5ZXIgaGFzIGEgc2hpcCwgaWYgaGl0IGNoZWNrcyBpZiBzaGlwIGlzIHN1bmssIGlmIHN1bmsgY2hlY2tzIGlmIGdhbWUgaXMgb3ZlciAgKi9cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgICAgIGhpdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1bms6IHRydWUsXG4gICAgICAgICAgICB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiB0aGlzLmlzT3ZlcigpXG4gICAgICAgICAgICA/IHRoaXMucHViU3ViLnB1Ymxpc2goeyAuLi5vYmosIC4uLnsgZ2FtZW92ZXI6IHRydWUgfSB9KVxuICAgICAgICAgICAgOiB0aGlzLnB1YlN1Yi5wdWJsaXNoKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkQXJyLnB1c2gobnVtKTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBDYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2sgPSB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpO1xuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiY2xhc3MgUGxheWVyIHtcblxuICBwcmV2aW91c0F0dGFja3MgPSBbXVxuICBcbiAgZ2V0IGF0dGFja0FycigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c0F0dGFja3M7XG4gIH1cblxuICBzZXQgYXR0YWNrQXJyKHZhbHVlKSB7XG4gICAgdGhpcy5wcmV2aW91c0F0dGFja3MucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBpc05ldyh2YWx1ZSkge1xuICAgIHJldHVybiAhdGhpcy5hdHRhY2tBcnIuaW5jbHVkZXModmFsdWUpO1xuICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsImltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbi8qIHRyaWdnZXJzIHdoZW4gYSB1c2VyIHBpY2tzIGEgY29vcmRpbmF0ZSB0byBhdHRhY2sgKi9cblxuZnVuY3Rpb24gYXR0YWNrKCkge1xuICB1c2VyQ2xpY2suYXR0YWNrLnB1Ymxpc2godGhpcy5kYXRhc2V0LmlkKTtcbn1cblxuLyogdHJpZ2dlcnMgc2hpcFBsYWNlbWVudC51cGRhdGVOdW0gaW4gc2hpcC1pbmZvX192aWV3cy0tdXNlciB3aGljaCBzdG9yZXMgdGhlIHVzZXIncyBjdXJyZW50IHNoaXAgcGxhY2VtZW50IHBpY2suIE9uY2UgdXBkYXRlZCB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpIGlzIHJ1biAqL1xuXG5mdW5jdGlvbiBwaWNrUGxhY2VtZW50KCkge1xuICB1c2VyQ2xpY2sucGlja1BsYWNlbWVudC5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIGNyZWF0ZVNoaXBJbmZvIGZ1bmMgaW4gc2hpcC1pbmZvX192aWV3cy0tdXNlciB3aGVuIHVzZXIgY2xpY2tlZCBhbiBpbnB1dCAqL1xuXG5mdW5jdGlvbiBhbGVydFNoaXBJbmZvQ2hhbmdlcygpIHtcbiAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwQnRuKCkge1xuICB1c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnB1Ymxpc2goKTtcbn1cblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgcHVibGlzaERvbURhdGEgKi9cblxuZXhwb3J0IHsgYXR0YWNrLCBwaWNrUGxhY2VtZW50LCBhbGVydFNoaXBJbmZvQ2hhbmdlcywgcGxhY2VTaGlwQnRufTtcbiIsIlxuLyogQ3JlYXRlcyBhIGNvb3JkaW5hdGUgYXJyIGZvciBhIHNoaXAgb2JqZWN0J3MgY29vcmRpbmF0ZXMgcHJvcGVydHkgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuZnVuY3Rpb24gY3JlYXRlQ29vckFycihvYmopIHtcbiAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV1cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29vckFycjtcbiIsImltcG9ydCBjcmVhdGVDb29yQXJyIGZyb20gXCIuL2NyZWF0ZS1jb29yZGluYXRlcy1hcnIvY3JlYXRlLWNvb3ItYXJyXCI7XG5cbi8qIENyZWF0ZXMgc2hpcCBvYmplY3QgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5cbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuaW1wb3J0IGNyZWF0ZUV2ZW50VGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzXCI7XG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YVwiO1xuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuXG4vKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoICkge1xuICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkLS11c2VyIC5nYW1lYm9hcmRfX3RpbGVcIilcbiAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgIHRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLnBpY2tQbGFjZW1lbnQpXG4gIH0pXG59XG5cbi8qIGhpZGVzIHRoZSBmb3JtICovXG5mdW5jdGlvbiBoaWRlRm9ybSgpIHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1cIilcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKVxuXG4vKiBDcmVhdGVzIHRpbGVzIGZvciB0aGUgdXNlciBnYW1lYm9hcmQsIGFuZCB0aWxlcyB3aXRoIGV2ZW50TGlzdGVuZXJzIGZvciB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkICovXG5mdW5jdGlvbiBpbml0QXR0YWNrU3RhZ2VUaWxlcygpIHtcbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKVxuICBjcmVhdGVFdmVudFRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRG9tRGF0YS5hdHRhY2spO1xufVxuXG4vKiBDcmVhdGVzIGdhbWVvdmVyIG5vdGlmaWNhdGlvbiBhbmQgbmV3IGdhbWUgYnRuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0dhbWVCdG4oKSB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICBidG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0IE5ldyBHYW1lXCI7XG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICB9KVxuICByZXR1cm4gYnRuXG59XG5cblxuZnVuY3Rpb24gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uXCIpO1xuICBcbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gIGgxLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19oZWFkaW5nXCIpXG4gIGgxLnRleHRDb250ZW50ID0gXCJHQU1FIE9WRVJcIjtcbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcblxuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICAoc3RyaW5nID09PSBcInVzZXJcIikgPyAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBMT1NUXCIpIDogKGgzLnRleHRDb250ZW50ID0gXCJZT1UgV09OXCIpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlTmV3R2FtZUJ0bigpKTtcbiAgcmV0dXJuIGRpdlxufSBcblxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKVxuICBjb25zdCBub3RpZmljYXRpb24gPSBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZyk7XG4gIG1haW4uYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcbn1cblxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0QXR0YWNrU3RhZ2VUaWxlcyk7XG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSlcbmluaXQuZ2FtZW92ZXIuc3Vic2NyaWJlKHNob3dHYW1lT3ZlcikiLCJpbXBvcnQgY3JlYXRlRXZlbnRUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXNcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YVwiO1xuaW1wb3J0IFwiLi9sYXlvdXQtLWF0dGFjay1zdGFnZVwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5mdW5jdGlvbiBoaWRlQ29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGhpZGVDb21wQm9hcmQpXG5cbmZ1bmN0aW9uIGFkZElucHV0TGlzdGVuZXJzKCkge1xuICBjb25zdCBmb3JtSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG4gIGZvcm1JbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMpO1xuICB9KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkSW5wdXRMaXN0ZW5lcnMpXG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEucGxhY2VTaGlwQnRuKTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpXG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYWNlbWVudFRpbGVzKCkge1xuICBjb25zdCBnYW1lQm9hcmREaXZVc2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLXVzZXJcIik7XG4gIGNyZWF0ZUV2ZW50VGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERvbURhdGEucGlja1BsYWNlbWVudCk7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGNyZWF0ZVBsYWNlbWVudFRpbGVzKVxuXG5cbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gICAqL1xuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICAqL1xuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgICovXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgICovXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyBhdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UsIGdhbWVvdmVyIH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcbiAgLyogUmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLiAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBzaGlwLmRpcmVjdGlvbikgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDUpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDMpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDIpO1xuICAgIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyQm9hcmQuaGFuZGxlQXR0YWNrKTsgXG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wR0IpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlld1VwZGF0ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXJcIjtcbmltcG9ydCB7IGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCJcblxuY29uc3QgY29tcHV0ZXIgPSBcImNvbXB1dGVyXCI7XG5cbmNvbnN0IGNvbXB1dGVyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVmlld1VwZGF0ZXIoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xuXG5leHBvcnQgZGVmYXVsdCBjb21wdXRlclZpZXdVcGRhdGVyO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuZnVuY3Rpb24gZ2V0UmFuZG9tRGlyZWN0aW9uKCkge1xuICByZXR1cm4gZ2V0UmFuZG9tTnVtKDIpID09PSAxID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbURpcmVjdGlvbjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbi8qIENyZWF0ZSBhIHJhbmRvbSB0aWxlTnVtICovXG5cbmZ1bmN0aW9uIGdldFJhbmRvbVRpbGVOdW0obGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTEgLSBsZW5ndGgpLnRvU3RyaW5nKCkpO1xuICB9XG4gIHJldHVybiArKGdldFJhbmRvbU51bSgxMS0gbGVuZ3RoKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tVGlsZU51bTtcbiIsIlxuaW1wb3J0IGdldFJhbmRvbURpcmVjdGlvbiBmcm9tIFwiLi9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvblwiO1xuaW1wb3J0IGdldFJhbmRvbVRpbGVOdW0gZnJvbSBcIi4vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtXCI7XG5cbmNsYXNzIFNoaXBJbmZvIHtcbiAgXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZ2V0UmFuZG9tRGlyZWN0aW9uKCk7XG4gICAgdGhpcy50aWxlTnVtID0gZ2V0UmFuZG9tVGlsZU51bSh0aGlzLmxlbmd0aCwgdGhpcy5kaXJlY3Rpb24pO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm87XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCJcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG5cbiAgLyogQ2FsY3VsYXRlcyB0aGUgbWF4IGFjY2VwdGFibGUgdGlsZSBmb3IgYSBzaGlwIGRlcGVuZGluZyBvbiBpdHMgc3RhcnQgKHRpbGVOdW0pLlxuICBmb3IgZXguIElmIGEgc2hpcCBpcyBwbGFjZWQgaG9yaXpvbnRhbGx5IG9uIHRpbGUgMjEgbWF4IHdvdWxkIGJlIDMwICAqL1xuXG4gIHN0YXRpYyBjYWxjTWF4KG9iaikge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBvYmoudGlsZU51bSA+IDEwKSB7XG4gICAgICBpZiAob2JqLnRpbGVOdW0gJSAxMCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqLnRpbGVOdW1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG1heCA9ICtgJHtvYmoudGlsZU51bS50b1N0cmluZygpLmNoYXJBdCgwKX0wYCArIDEwO1xuICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyAxMCA6IDEwMDtcbiAgICByZXR1cm4gbWF4O1xuICB9XG5cbiAgLyogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIGluIHRpbGUgbnVtYmVycy4gVGhlIG1pbnVzIC0xIGFjY291bnRzIGZvciB0aGUgdGlsZU51bSB0aGF0IGlzIGFkZGVkIGluIHRoZSBpc1Rvb0JpZyBmdW5jICovXG5cbiAgc3RhdGljIGNhbGNMZW5ndGgob2JqKSB7XG4gICAgcmV0dXJuIG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IG9iai5sZW5ndGggLSAxXG4gICAgICA6IChvYmoubGVuZ3RoIC0gMSkgKiAxMDtcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiB0aGUgc2hpcCBwbGFjZW1lbnQgd291bGQgYmUgbGVnYWwsIG9yIGlmIHRoZSBzaGlwIGlzIHRvbyBiaWcgdG8gYmUgcGxhY2VkIG9uIHRoZSB0aWxlICovXG5cbiAgc3RhdGljIGlzVG9vQmlnKG9iaikge1xuICAgIGNvbnN0IG1heCA9IFVzZXJHYW1lQm9hcmQuY2FsY01heChvYmopO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBVc2VyR2FtZUJvYXJkLmNhbGNMZW5ndGgob2JqKTtcbiAgICBpZiAob2JqLnRpbGVOdW0gKyBzaGlwTGVuZ3RoIDw9IG1heCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlzVmFsaWQgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCB0aGlzLmNvbnN0cnVjdG9yLmlzVG9vQmlnKG9iaikgfHwgdGhpcy5pc05laWdoYm9yaW5nKHNoaXAuY29vcmRpbmF0ZXMsIG9iai5kaXJlY3Rpb24pKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGNvb3JkaW5hdGVzOiBzaGlwLmNvb3JkaW5hdGVzfSBcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGNvb3JkaW5hdGVzOiBzaGlwLmNvb3JkaW5hdGVzIH1cbiAgfVxuXG4gIHB1Ymxpc2hWYWxpZGl0eSA9IChvYmopID0+IHtcbiAgICB1c2VyQ2xpY2sudmFsaWRpdHlWaWV3cy5wdWJsaXNoKHRoaXMuaXNWYWxpZChvYmopKVxuICB9XG5cbiAgLyogcGxhY2VzIHNoaXAgaW4gc2hpcHNBcnIgKi9cblxuICBwbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gICAgcmV0dXJuIHNoaXA7XG4gIH1cblxuICBwdWJsaXNoUGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSB0aGlzLnBsYWNlU2hpcChvYmopXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnB1Ymxpc2goe2Nvb3JkaW5hdGVzOiBzaGlwLmNvb3JkaW5hdGVzLCBsZW5ndGg6IHNoaXAubGVuZ3RofSlcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0VXNlckJvYXJkKCkge1xuICBjb25zdCB1c2VyQm9hcmQgPSBuZXcgVXNlckdhbWVCb2FyZChoYW5kbGVDb21wdXRlckF0dGFjayk7XG4gIHVzZXJDbGljay5zaGlwSW5mby5zdWJzY3JpYmUodXNlckJvYXJkLnB1Ymxpc2hWYWxpZGl0eSk7IFxuICB1c2VyQ2xpY2suY3JlYXRlU2hpcC5zdWJzY3JpYmUodXNlckJvYXJkLnB1Ymxpc2hQbGFjZVNoaXApO1xuICBmdW5jdGlvbiBpbml0SGFuZGxlQXR0YWNrKCkge1xuICAgIGNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyQm9hcmQuaGFuZGxlQXR0YWNrKTtcbiAgfVxuICBpbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0SGFuZGxlQXR0YWNrKVxufVxuXG5pbml0VXNlckJvYXJkKCk7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3VXBkYXRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC12aWV3LXVwZGF0ZXIvZ2FtZWJvYXJkLXZpZXctdXBkYXRlclwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyIGV4dGVuZHMgR2FtZUJvYXJkVmlld1VwZGF0ZXIge1xuICBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0bicpXG4gIFxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIHJhZGlvIGlucHV0IGZvciB0aGF0IHNoaXAgaXMgaGlkZGVuICovXG4gIHN0YXRpYyBoaWRlUmFkaW8ob2JqKSB7XG4gICAgY29uc3QgcmFkaW9JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzaGlwLSR7b2JqLmxlbmd0aH1gKTtcbiAgICByYWRpb0lucHV0LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgY29uc3QgcmFkaW9MYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoW2BbZm9yPVwic2hpcC0ke29iai5sZW5ndGh9XCJdYF0pXG4gICAgcmFkaW9MYWJlbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9XG5cbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSBuZXh0IHJhZGlvIGlucHV0IGlzIGNoZWNrZWQgc28gdGhhdCB5b3UgY2FuJ3QgcGxhY2UgdHdvIG9mIHRoZSBzYW1lIHNoaXBzIHR3aWNlLFxuICAgICB3aGVuIHRoZXJlIGFyZSBubyBtb3JlIHNoaXBzIHRvIHBsYWNlIG5leHRTaGlwQ2hlY2tlZCB3aWxsIGluaXRpYWxpemUgdGhlIGF0dGFjayBzdGFnZSAqL1xuICBzdGF0aWMgbmV4dFNoaXBDaGVja2VkKCkge1xuICAgIGNvbnN0IHJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgOm5vdCguaGlkZGVuKVtuYW1lPVwic2hpcFwiXWApXG4gICAgaWYgKHJhZGlvID09PSBudWxsKSB7XG4gICAgICBpbml0LmF0dGFja1N0YWdlLnB1Ymxpc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgICBcbiAgICB9XG4gICAgXG4gIH1cblxuIC8qIENsZWFycyB0aGUgdmFsaWRpdHkgY2hlY2sgb2YgdGhlIHByZXZpb3VzIHNlbGVjdGlvbiBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZC4gSWYgaXQgcGFzc2VzIHRoZSBjaGVjayBpdCB1bmxvY2tzIHRoZSBwbGFjZSBzaGlwIGJ0biAqL1xuICAgY2xlYXJWYWxpZGl0eVZpZXcgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KVxuICAgIHRoaXMuYnRuLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpXG4gIH1cblxuIC8qIGFkZHMgdGhlIHZpc3VhbCBjbGFzcyBwbGFjZW1lbnQtLXZhbGlkL29yIHBsYWNlbWVudC0taW52YWxpZCBiYXNlZCBvbiB0aGUgdGlsZU51bSBjaG9zZW4gYnkgdGhlIHVzZXIsIGRpc2FibGVzIHRoZSBzdWJtaXQgYnRuIGlmIGl0IGZhaWxzIHBsYWNlbWVudCBjaGVjayAqL1xuXG4gIGhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgaWYgKCFvYmoudmFsaWQpIHtcbiAgICAgIHRoaXMuYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG9iai52YWxpZCkge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXZhbGlkXCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKVxuICAgIHRoaXMuY29uc3RydWN0b3IubmV4dFNoaXBDaGVja2VkKCk7XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goY29vcmRpbmF0ZSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgIClcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tc2hpcFwiKVxuICAgIH0pXG4gIH1cbn1cblxuXG5cblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyKHVzZXIpO1xuXG5oYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpXG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3KVxuXG5leHBvcnQgZGVmYXVsdCB1c2VyVmlld1VwZGF0ZXI7XG4iLCJjbGFzcyBTaGlwSW5mb1VzZXIge1xuICBjb25zdHJ1Y3RvciAodGlsZU51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICB0aGlzLnRpbGVOdW0gPSArdGlsZU51bTtcbiAgICB0aGlzLmxlbmd0aCA9ICtsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mb1VzZXI7XG5cbiIsImltcG9ydCBTaGlwSW5mb1VzZXIgZnJvbSBcIi4vc2hpcC1pbmZvLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uLy4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcygpO1xuICB9LFxuICByZXNldE51bSgpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSAwO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwSW5mbygpIHtcbiAgY29uc3QgeyB0aWxlTnVtIH0gPSBzaGlwUGxhY2VtZW50O1xuICBjb25zdCBsZW5ndGggPSBkaXNwbGF5UmFkaW9WYWx1ZShcInNoaXBcIik7XG4gIGNvbnN0IGRpcmVjdGlvbiA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwiZGlyZWN0aW9uXCIpO1xuICBjb25zdCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mb1VzZXIodGlsZU51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pXG4gIHJldHVybiBzaGlwSW5mb1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpXG4gIHVzZXJDbGljay5zaGlwSW5mby5wdWJsaXNoKHNoaXBJbmZvKTsgIFxufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICBjb25zdCBpc0NvbXBsZXRlID0gT2JqZWN0LnZhbHVlcyhzaGlwSW5mbykuZXZlcnkodmFsdWUgPT4ge1xuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBmYWxzZSAmJiB2YWx1ZSAhPT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSByZXR1cm4gZmFsc2VcbiAgfSlcbiAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICBjb25zb2xlLmxvZyhzaGlwSW5mbylcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcC5wdWJsaXNoKHNoaXBJbmZvKTsgXG4gICAgc2hpcFBsYWNlbWVudC5yZXNldE51bSgpOyBcbiAgfVxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG5cbnVzZXJDbGljay5pbnB1dC5zdWJzY3JpYmUocHVibGlzaFNoaXBJbmZvQ2hlY2spO1xudXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5zdWJzY3JpYmUocHVibGlzaFNoaXBJbmZvQ3JlYXRlKVxuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5pbXBvcnQge1xuICBjb21wdXRlckF0dGFjayxcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssXG59IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5jbGFzcyBDb21wdXRlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBmb3VuZFNoaXAgPSB7XG4gICAgZm91bmQ6IGZhbHNlLFxuICAgIGhpdDogZmFsc2UsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgIGVuZDogbnVsbCxcbiAgfTtcblxuICB3YXNBdHRhY2tTdWNjZXNzID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy5mb3VuZFNoaXAgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgICAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgICAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPSBNYXRoLmFicyhcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIG9iai50aWxlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9iai5oaXQgPT09IGZhbHNlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgY29uc29sZS5sb2coXCJlbmRGb3VuZFwiKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ID09PSBmYWxzZSAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGF0dGFjayA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmZvdW5kU2hpcCk7XG4gICAgbGV0IG51bTtcbiAgICBpZiAodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBjb25zdCBzaWRlcyA9IFsxLCAxMF07XG4gICAgICBjb25zdCBvcGVyYXRvcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBzaWduOiBcIitcIixcbiAgICAgICAgICBtZXRob2Q6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNpZ246IFwiLVwiLFxuICAgICAgICAgIG1ldGhvZDogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgbnVtID0gb3BlcmF0b3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wZXJhdG9ycy5sZW5ndGgpXS5tZXRob2QoXG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdLFxuICAgICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKG51bSk7XG4gICAgICAvKiBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSsxIHx8IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdLTEgfHwgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gKzEwIHx8IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0xMDsgKi8gLy9uZWVkIHRvIHJlZmFjdG9yIHRoaXNcbiAgICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSB8fCBudW0gPiAxMDAgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSxcbiAgICAgICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICAgICApO1xuICAgICAgICBjb25zb2xlLmxvZyhudW0pO1xuICAgICAgICAvKiAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gKzEgfHwgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0tMSB8fCB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSArMTAgfHwgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLTEwOyAqL1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdID5cbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAyXVxuICAgICAgICApIHtcbiAgICAgICAgICBudW0gPVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXSA8XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl1cbiAgICAgICAgKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdIC1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7XG4gICAgICAgICAgLy8gZm9yIGVkZ2UgY2FzZXMsIGFuZCBzaXR1YXRpb25zIGluIHdoaWNoIHRoZSBlbmQgdGlsZSB3YXMgYWxyZWFkeSBhdHRhY2tlZFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KCk7XG4gICAgICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZCA9PT0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pIHtcbiAgICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW1xuICAgICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgXSArIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgLyogY29uc29sZS5sb2cgbnVtICovXG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KCk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICBudW0gPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSkge1xuICAgICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIuYXR0YWNrQXJyID0gbnVtO1xuICAgIHRoaXMucHViU3ViLnB1Ymxpc2gobnVtKTtcbiAgICBjb25zb2xlLmxvZyhudW0pO1xuICAgIHJldHVybiBudW07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wUGxheWVyKCkge1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBDb21wdXRlclBsYXllcihjb21wdXRlckF0dGFjayk7XG4gIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLmF0dGFjayk7XG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclBsYXllci53YXNBdHRhY2tTdWNjZXNzKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBQbGF5ZXIpO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cbiAgXG4gIGF0dGFjayA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzdXBlci5pc05ldyh2YWx1ZSkpIHtcbiAgICAgIHN1cGVyLmF0dGFja0FyciA9IHZhbHVlO1xuICAgICAgdGhpcy5wdWJTdWIucHVibGlzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZFwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0UGxheWVyKCkge1xuICBjb25zdCBwbGF5ZXIgPSBuZXcgVXNlclBsYXllcih1c2VyQXR0YWNrKTtcbiAgdXNlckNsaWNrLmF0dGFjay5zdWJzY3JpYmUocGxheWVyLmF0dGFjayk7XG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRQbGF5ZXIpXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJQbGF5ZXI7XG4iLCJcblxuZnVuY3Rpb24gZGlzcGxheVJhZGlvVmFsdWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOYW1lIGhhcyB0byBiZSBhIHN0cmluZyFcIik7XG4gIH1cbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9XCIke25hbWV9XCJdYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChpbnB1dHNbaV0uY2hlY2tlZCkge1xuICAgICAgICByZXR1cm4gaW5wdXRzW2ldLnZhbHVlIFxuICAgICAgfSAgICAgICAgIFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlSYWRpb1ZhbHVlIiwiZnVuY3Rpb24gZ2V0UmFuZG9tTnVtKG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21OdW0gIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZVwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnB1Ymxpc2goKTsiXSwibmFtZXMiOlsiY3JlYXRlU2luZ2xlRXZlbnRUaWxlIiwiY3JlYXRlRXZlbnRUaWxlcyIsImRpdiIsImNhbGxiYWNrIiwiaSIsImFwcGVuZENoaWxkIiwiY3JlYXRlU2luZ2xlVGlsZSIsImlkIiwidGlsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJpbml0IiwiR2FtZUJvYXJkVmlld1VwZGF0ZXIiLCJjb25zdHJ1Y3RvciIsInN0cmluZyIsInVwZGF0ZVN1bmsiLCJjb250YWlucyIsInJlcGxhY2UiLCJnZXRTdGF0dXMiLCJvYmoiLCJoaXQiLCJ1cGRhdGVTdW5rVGlsZXMiLCJ0aWxlcyIsImZvckVhY2giLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImhhbmRsZUF0dGFja1ZpZXciLCJzdW5rIiwiZ2FtZW92ZXIiLCJwdWJsaXNoIiwiR2FtZUJvYXJkIiwicHViU3ViIiwic2hpcHNBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZEFyciIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInkiLCJpbmNsdWRlcyIsImlzTmVpZ2hib3JpbmciLCJkaXJlY3Rpb24iLCJjb29yZGluYXRlc0FsbE5laWdoYm9ycyIsIm1hcCIsImNvb3IiLCJTdHJpbmciLCJzbGljZSIsImhhbmRsZUF0dGFjayIsIm51bSIsImlzU3VuayIsImlzT3ZlciIsImNoZWNrIiwiZXZlcnkiLCJzaGlwIiwiUGxheWVyIiwicHJldmlvdXNBdHRhY2tzIiwiYXR0YWNrQXJyIiwiaXNOZXciLCJQdWJTdWIiLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInN1YnNjcmliZXIiLCJFcnJvciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsInVzZXJDbGljayIsImF0dGFjayIsImRhdGFzZXQiLCJwaWNrUGxhY2VtZW50IiwiYWxlcnRTaGlwSW5mb0NoYW5nZXMiLCJpbnB1dCIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsImNyZWF0ZUNvb3JBcnIiLCJhcnIiLCJ0aWxlTnVtIiwiU2hpcCIsInRpbWVzSGl0IiwicHVibGlzaERvbURhdGEiLCJnYW1lQm9hcmREaXZDb21wdXRlciIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicXVlcnlTZWxlY3RvckFsbCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoaWRlRm9ybSIsImZvcm0iLCJzaG93Q29tcEJvYXJkIiwiY29tcEJvYXJkIiwicmVtb3ZlIiwiYXR0YWNrU3RhZ2UiLCJpbml0QXR0YWNrU3RhZ2VUaWxlcyIsImNyZWF0ZU5ld0dhbWVCdG4iLCJidG4iLCJ0ZXh0Q29udGVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJwbGFjZW1lbnRTdGFnZSIsImFkZElucHV0TGlzdGVuZXJzIiwiZm9ybUlucHV0cyIsImFkZEJ0bkxpc3RlbmVyIiwiY3JlYXRlUGxhY2VtZW50VGlsZXMiLCJnYW1lQm9hcmREaXZVc2VyIiwiY29tcHV0ZXJBdHRhY2siLCJoYW5kbGVDb21wdXRlckF0dGFjayIsInVzZXJBdHRhY2siLCJoYW5kbGVVc2VyQXR0YWNrIiwic2hpcEluZm8iLCJ2YWxpZGl0eVZpZXdzIiwiY3JlYXRlU2hpcCIsImNyZWF0ZVNoaXBWaWV3IiwiU2hpcEluZm8iLCJDb21wdXRlckdhbWVCb2FyZCIsInBsYWNlU2hpcCIsImluaXRDb21wR0IiLCJjb21wdXRlciIsImNvbXB1dGVyVmlld1VwZGF0ZXIiLCJnZXRSYW5kb21OdW0iLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJnZXRSYW5kb21UaWxlTnVtIiwidG9TdHJpbmciLCJVc2VyR2FtZUJvYXJkIiwiY2FsY01heCIsIm1heCIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIiLCJoaWRlUmFkaW8iLCJyYWRpb0lucHV0IiwicmFkaW9MYWJlbCIsIm5leHRTaGlwQ2hlY2tlZCIsInJhZGlvIiwiY2hlY2tlZCIsImNsZWFyVmFsaWRpdHlWaWV3IiwicmVtb3ZlQXR0cmlidXRlIiwiaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3IiwiY29vcmRpbmF0ZSIsImhhbmRsZVBsYWNlbWVudFZpZXciLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwic2lkZXMiLCJvcGVyYXRvcnMiLCJzaWduIiwibWV0aG9kIiwiYSIsImIiLCJmbG9vciIsInJhbmRvbSIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==