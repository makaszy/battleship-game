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
      //if 
      const sides = [1, 10];
      const operators = [{
        sign: "+",
        method(a, b) {
          return a + b;
        }
      }, {
        sign: "-",
        method(a, b) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUQsU0FBUyxLQUFLLFlBQVksRUFBRTtNQUM5QkMsdUJBQXVCLEdBQUdBLHVCQUF1QixDQUFDVixNQUFNLENBQ3RESSxXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQ3BDUixXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUNyQyxDQUFDLENBQUMsQ0FBQztNQUNILElBQUlSLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQ1MsTUFBTSxDQUFDVCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0RUosdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNyRCxDQUFDLE1BQU0sSUFBSUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNyQ00sdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEQsQ0FBQyxNQUFNO1FBQ0xNLHVCQUF1QixDQUFDVCxJQUFJLENBQzFCRyxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDdkNELFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNuQixDQUFDLENBQUMsQ0FBQztNQUNMO0lBQ0YsQ0FBQyxNQUFNO01BQ0xNLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ1YsTUFBTSxDQUN0REksV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUNuQ1IsV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FDcEMs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LElBQUssSUFBRyxDQUFDO0VBRTVELEtBQUssSUFBSXpNLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBRzBNLE1BQU0sQ0FBQ2hLLE1BQU0sRUFBRTFDLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDdkMsSUFBSTBNLE1BQU0sQ0FBQzFNLENBQUMsQ0FBQyxDQUFDMkosT0FBTyxFQUFFO01BQ3JCLE9BQU8rQyxNQUFNLENBQUMxTSxDQUFDLENBQUMsQ0FBQ2tDLEtBQUs7SUFDeEI7RUFDSjtBQUNGO0FBRUEsK0RBQWVrSSxpQkFBaUI7Ozs7Ozs7Ozs7O0FDZmhDLFNBQVNqQyxZQUFZQSxDQUFDTSxHQUFHLEVBQUU7RUFDekIsT0FBT2dELElBQUksQ0FBQ1EsS0FBSyxDQUFDUixJQUFJLENBQUNTLE1BQU0sQ0FBQyxDQUFDLEdBQUd6RCxHQUFHLENBQUM7QUFDeEM7QUFFQSwrREFBZU4sWUFBWTs7Ozs7O1VDSjNCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEEsOENBQThDOzs7OztXQ0E5QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOcUQ7QUFDRztBQUV4RHhILDJFQUFtQixDQUFDa0IsT0FBTyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3BsYXllci9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL2NyZWF0ZS1jb29yZGluYXRlcy1hcnIvY3JlYXRlLWNvb3ItYXJyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tYXR0YWNrLXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9nZXQtcmFuZG9tLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSBmcm9tIFwiLi9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlRXZlbnRUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudFRpbGVzO1xuIiwiaW1wb3J0IGNyZWF0ZVNpbmdsZVRpbGUgZnJvbSBcIi4vY3JlYXRlLXNpbmdsZS10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGNyZWF0ZVNpbmdsZVRpbGUoaWQpO1xuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJmdW5jdGlvbiBjcmVhdGVTaW5nbGVUaWxlKGlkKSB7XG4gIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBpZClcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZVRpbGU7IiwiaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmNsYXNzIEdhbWVCb2FyZFZpZXdVcGRhdGVyIHtcbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlU3Vuayh0aWxlKSB7XG4gICAgaWYgKHRpbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZXBsYWNlKFwiaGl0XCIsIFwic3Vua1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwic3Vua1wiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0U3RhdHVzKG9iaikge1xuICAgIHJldHVybiBvYmouaGl0ID8gXCJoaXRcIiA6IFwibWlzc1wiO1xuICB9XG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtlbGVtZW50fVwiXWBcbiAgICAgICk7XG4gICAgICBHYW1lQm9hcmRWaWV3VXBkYXRlci51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgICBpZiAob2JqLmdhbWVvdmVyKSB7XG4gICAgICAgIGluaXQuZ2FtZW92ZXIucHVibGlzaCh0aGlzLnN0cmluZylcbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke29iai50aWxlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlld1VwZGF0ZXIuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3VXBkYXRlcjtcbiIsImNsYXNzIEdhbWVCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICBzZXQgc2hpcHModmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIgPSB0aGlzLnNoaXBzQXJyLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogQ2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHNoaXAgd291bGQgYmUgbmVpZ2hib3JpbmcgYSBkaWZmZXJlbnQgc2hpcCAqL1xuICBpc05laWdoYm9yaW5nKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEwKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMTApXG4gICAgICApOyAvLyB0b3AgYW5kIGJvdHRvbSBuZWlnaGJvcnNcbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA9PT0gMSB8fCArU3RyaW5nKGNvb3JkaW5hdGVzWzBdKS5zbGljZSgwLCAtMSkgPT09IDEpIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1stMV0gKyAxKTsgLy8gcmlnaHQgbmVpZ2hib3JcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbLTFdICUgMTAgPT09IDApIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEpOyAvLyBsZWZ0IG5laWdoYm9yXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDFcbiAgICAgICAgKTsgLy8gbGVmdCBhbmQgcmlnaHQgbmVpZ2hib3JzXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICk7IC8vIGxlZnQgYW5kIHJpZ2h0IG5laWdoYm9yc1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdIDwgMTEpIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1stMV0gKyAxMCk7IC8vIGJ0bSBuZWlnaGJvclxuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSA+IDkwKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxMCk7IC8vIHRvcCBuZWlnaGJvclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxMF0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMTBcbiAgICAgICAgKTsgLy8gdG9wIGFuZCBidG0gbmVpZ2hib3JzXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmlzVGFrZW4oY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBudW0gc2VsZWN0ZWQgYnkgcGxheWVyIGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgICBoaXQ6IHRydWUsXG4gICAgICAgICAgICBzdW5rOiB0cnVlLFxuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc092ZXIoKVxuICAgICAgICAgICAgPyB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgLi4ub2JqLCAuLi57IGdhbWVvdmVyOiB0cnVlIH0gfSlcbiAgICAgICAgICAgIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKG51bSk7XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogQ2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcEJ0bigpIHtcbiAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXMsIHBsYWNlU2hpcEJ0bn07XG4iLCJcbi8qIENyZWF0ZXMgYSBjb29yZGluYXRlIGFyciBmb3IgYSBzaGlwIG9iamVjdCdzIGNvb3JkaW5hdGVzIHByb3BlcnR5IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gIGNvbnN0IGFyciA9IFsrb2JqLnRpbGVOdW1dXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvb3JBcnI7XG4iLCJpbXBvcnQgY3JlYXRlQ29vckFyciBmcm9tIFwiLi9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyclwiO1xuXG4vKiBDcmVhdGVzIHNoaXAgb2JqZWN0IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjcmVhdGVDb29yQXJyKG9iaik7XG4gIH1cblxuICB0aW1lc0hpdCA9IDA7XG5cbiAgc3VuayA9IGZhbHNlO1xuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMudGltZXNIaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuXG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcblxuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cblxuLyogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQgKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCApIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpXG4gIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KVxuICB9KVxufVxuXG4vKiBoaWRlcyB0aGUgZm9ybSAqL1xuZnVuY3Rpb24gaGlkZUZvcm0oKSB7XG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtXCIpXG4gIGZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gc2hvd0NvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoc2hvd0NvbXBCb2FyZClcblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKClcbiAgY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZDb21wdXRlciwgcHVibGlzaERvbURhdGEuYXR0YWNrKTtcbn1cblxuLyogQ3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgfSlcbiAgcmV0dXJuIGJ0blxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvblwiKTtcbiAgXG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBoMS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faGVhZGluZ1wiKVxuICBoMS50ZXh0Q29udGVudCA9IFwiR0FNRSBPVkVSXCI7XG4gIGRpdi5hcHBlbmRDaGlsZChoMSk7XG5cbiAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gIGgzLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19zdWItaGVhZGluZ1wiKTtcbiAgKHN0cmluZyA9PT0gXCJ1c2VyXCIpID8gKGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiKSA6IChoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiKTtcbiAgZGl2LmFwcGVuZENoaWxkKGgzKTtcbiAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZU5ld0dhbWVCdG4oKSk7XG4gIHJldHVybiBkaXZcbn0gXG5cblxuZnVuY3Rpb24gc2hvd0dhbWVPdmVyKHN0cmluZykge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIilcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEF0dGFja1N0YWdlVGlsZXMpO1xuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaGlkZUZvcm0pXG5pbml0LmdhbWVvdmVyLnN1YnNjcmliZShzaG93R2FtZU92ZXIpIiwiaW1wb3J0IGNyZWF0ZUV2ZW50VGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKVxuXG5mdW5jdGlvbiBhZGRJbnB1dExpc3RlbmVycygpIHtcbiAgY29uc3QgZm9ybUlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VtZW50LWZvcm1fX2lucHV0XCIpO1xuICBmb3JtSW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKTtcbiAgfSk7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZElucHV0TGlzdGVuZXJzKVxuXG5mdW5jdGlvbiBhZGRCdG5MaXN0ZW5lcigpIHtcbiAgY29uc3QgcGxhY2VTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuICBwbGFjZVNoaXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLnBsYWNlU2hpcEJ0bik7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZEJ0bkxpc3RlbmVyKVxuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZW1lbnRUaWxlcygpIHtcbiAgY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuICBjcmVhdGVFdmVudFRpbGVzKGdhbWVCb2FyZERpdlVzZXIsIHB1Ymxpc2hEb21EYXRhLnBpY2tQbGFjZW1lbnQpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcylcblxuXG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCB1c2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVVc2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrLH07XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgcGlja1BsYWNlbWVudCA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaW5wdXQgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGNyZWF0ZVNoaXBJbmZvKCkgcHVibGlzaGVzIGEgc2hpcEluZm8gb2JqLiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IGlzIHN1YnNjcmliZWQgYW5kIGNoZWNrcyB3aGV0aGVyIGEgc2hpcCBjYW4gYmUgcGxhY2VkIHRoZXJlICovXG5jb25zdCBzaGlwSW5mbyA9IG5ldyBQdWJTdWIoKTtcblxuLyogZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBwdWJsaXNoZXMgYW4gb2JqIHdpdGggYSBib28uIHZhbGlkIHByb3BlcnR5IGFuZCBhIGxpc3Qgb2YgY29vcmRpbmF0ZXMuICAgKi9cbmNvbnN0IHZhbGlkaXR5Vmlld3MgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gcGxhY2Ugc2hpcCBidG4gaXMgcHJlc3NlZCBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB3aWxsIGNyZWF0ZSBzaGlwSW5mbyAgKi9cbmNvbnN0IHNoaXBQbGFjZUJ0biA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiAgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgY3JlYXRlcyB0aGUgc2hpcEluZm8uIFRoZSBnYW1lYm9hcmQucGxhY2VTaGlwICAqL1xuY29uc3QgY3JlYXRlU2hpcCA9IG5ldyBQdWJTdWIoKTtcblxuLyogVXNlckdhbWVCb2FyZC5wdWJsaXNoUGxhY2VTaGlwIHB1Ymxpc2hlcyBzaGlwIGNvb3JkaW5hdGVzLiBHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmlldyBhZGRzIHBsYWNlbWVudC1zaGlwIGNsYXNzIHRvIHRpbGVzICAqL1xuY29uc3QgY3JlYXRlU2hpcFZpZXcgPSBuZXcgUHViU3ViKCk7XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHVzZXJDbGljayAqL1xuXG5leHBvcnQge3BpY2tQbGFjZW1lbnQsIGF0dGFjaywgaW5wdXQsIHNoaXBJbmZvLCB2YWxpZGl0eVZpZXdzLCBzaGlwUGxhY2VCdG4sIGNyZWF0ZVNoaXAsIGNyZWF0ZVNoaXBWaWV3fSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIHBsYWNlbWVudCBzdGFnZSAqL1xuXG5jb25zdCBwbGFjZW1lbnRTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG5jb25zdCBhdHRhY2tTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgZ2FtZSBvdmVyIGRpdiAqL1xuXG5jb25zdCBnYW1lb3ZlciA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgYXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlLCBnYW1lb3ZlciB9ICA7IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgU2hpcEluZm8gZnJvbSBcIi4vc2hpcC1pbmZvL3NoaXAtaW5mb1wiO1xuaW1wb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuXG5jbGFzcyBDb21wdXRlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG4gIC8qIFJlY3JlYXRlcyBhIHJhbmRvbSBzaGlwLCB1bnRpbCBpdHMgY29vcmRpbmF0ZXMgYXJlIG5vdCB0YWtlbi4gKi9cblxuICBwbGFjZVNoaXAobGVuZ3RoKSB7XG4gICAgbGV0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgd2hpbGUgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgc2hpcC5kaXJlY3Rpb24pICkge1xuICAgICAgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICAgIHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgfVxuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wR0IoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckdhbWVCb2FyZChoYW5kbGVVc2VyQXR0YWNrKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCg1KTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCg0KTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCgzKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCgyKTtcbiAgICB1c2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlckJvYXJkLmhhbmRsZUF0dGFjayk7IFxufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcEdCKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiXG5cbmNvbnN0IGNvbXB1dGVyID0gXCJjb21wdXRlclwiO1xuXG5jb25zdCBjb21wdXRlclZpZXdVcGRhdGVyID0gbmV3IEdhbWVCb2FyZFZpZXdVcGRhdGVyKGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBDcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBVc2VyR2FtZUJvYXJkLmNhbGNNYXgob2JqKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gVXNlckdhbWVCb2FyZC5jYWxjTGVuZ3RoKG9iaik7XG4gICAgaWYgKG9iai50aWxlTnVtICsgc2hpcExlbmd0aCA8PSBtYXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1ZhbGlkID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIGlmICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5jb25zdHJ1Y3Rvci5pc1Rvb0JpZyhvYmopIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJCb2FyZCgpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFVzZXJCb2FyZCgpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlld1VwZGF0ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXJcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciBleHRlbmRzIEdhbWVCb2FyZFZpZXdVcGRhdGVyIHtcbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG4nKVxuICBcbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSByYWRpbyBpbnB1dCBmb3IgdGhhdCBzaGlwIGlzIGhpZGRlbiAqL1xuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKVxuICAgIHJhZGlvTGFiZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfVxuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgbmV4dCByYWRpbyBpbnB1dCBpcyBjaGVja2VkIHNvIHRoYXQgeW91IGNhbid0IHBsYWNlIHR3byBvZiB0aGUgc2FtZSBzaGlwcyB0d2ljZSxcbiAgICAgd2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBzaGlwcyB0byBwbGFjZSBuZXh0U2hpcENoZWNrZWQgd2lsbCBpbml0aWFsaXplIHRoZSBhdHRhY2sgc3RhZ2UgKi9cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKVxuICAgIGlmIChyYWRpbyA9PT0gbnVsbCkge1xuICAgICAgaW5pdC5hdHRhY2tTdGFnZS5wdWJsaXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGlvLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgXG4gICAgfVxuICAgIFxuICB9XG5cbiAvKiBDbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cbiAgIGNsZWFyVmFsaWRpdHlWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmRfX3RpbGVcIik7XG4gICAgdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSlcbiAgICB0aGlzLmJ0bi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKVxuICB9XG5cbiAvKiBhZGRzIHRoZSB2aXN1YWwgY2xhc3MgcGxhY2VtZW50LS12YWxpZC9vciBwbGFjZW1lbnQtLWludmFsaWQgYmFzZWQgb24gdGhlIHRpbGVOdW0gY2hvc2VuIGJ5IHRoZSB1c2VyLCBkaXNhYmxlcyB0aGUgc3VibWl0IGJ0biBpZiBpdCBmYWlscyBwbGFjZW1lbnQgY2hlY2sgKi9cblxuICBoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIGlmICghb2JqLnZhbGlkKSB7XG4gICAgICB0aGlzLmJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKVxuICAgIH1cbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaChjb29yZGluYXRlID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIGlmIChvYmoudmFsaWQpIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS12YWxpZFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVBsYWNlbWVudFZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIHRoaXMuY29uc3RydWN0b3IuaGlkZVJhZGlvKG9iailcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApXG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIilcbiAgICB9KVxuICB9XG59XG5cblxuXG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXdVcGRhdGVyID0gbmV3IEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlcih1c2VyKTtcblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcbnVzZXJDbGljay52YWxpZGl0eVZpZXdzLnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3KVxudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmlldylcblxuZXhwb3J0IGRlZmF1bHQgdXNlclZpZXdVcGRhdGVyO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi8uLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgZGlzcGxheVJhZGlvVmFsdWUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWVcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgdGlsZU51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy50aWxlTnVtID0gdmFsdWU7XG4gICAgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMoKTtcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKVxuICByZXR1cm4gc2hpcEluZm9cbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7ICBcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KHZhbHVlID0+IHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gcmV0dXJuIGZhbHNlXG4gIH0pXG4gIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgY29uc29sZS5sb2coc2hpcEluZm8pXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXAucHVibGlzaChzaGlwSW5mbyk7IFxuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTsgXG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSlcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuaW1wb3J0IHtcbiAgY29tcHV0ZXJBdHRhY2ssXG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLFxufSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiZW5kRm91bmRcIik7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2codGhpcy5mb3VuZFNoaXApO1xuICAgIGxldCBudW07XG4gICAgaWYgKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMSkgeyAvL2lmIFxuICAgICAgY29uc3Qgc2lkZXMgPSBbMSwgMTBdO1xuICAgICAgY29uc3Qgb3BlcmF0b3JzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgICAgbWV0aG9kIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNpZ246IFwiLVwiLFxuICAgICAgICAgIG1ldGhvZCAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICBudW0gPSBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0sXG4gICAgICAgIHNpZGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzLmxlbmd0aCldXG4gICAgICApO1xuICAgICAgY29uc29sZS5sb2cobnVtKTtcbiAgICAgIC8qIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKzEgfHwgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0tMSB8fCB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSArMTAgfHwgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLTEwOyAqLyAvL25lZWQgdG8gcmVmYWN0b3IgdGhpc1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IG9wZXJhdG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGVyYXRvcnMubGVuZ3RoKV0ubWV0aG9kKFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdLFxuICAgICAgICAgIHNpZGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzLmxlbmd0aCldXG4gICAgICAgICk7XG4gICAgICAgIGNvbnNvbGUubG9nKG51bSk7XG4gICAgICAgIC8qICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSArMSB8fCB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXS0xIHx8IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdICsxMCB8fCB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtMTA7ICovXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9PT0gdHJ1ZVxuICAgICkge1xuICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSBmYWxzZSkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPlxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDJdXG4gICAgICAgICkge1xuICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXSArXG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdIDxcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAyXVxuICAgICAgICApIHtcbiAgICAgICAgICBudW0gPVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gLVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobnVtID4gMTAwIHx8IG51bSA8IDEgfHwgIXN1cGVyLmlzTmV3KG51bSkpIHtcbiAgICAgICAgICAvLyBmb3IgZWRnZSBjYXNlcywgYW5kIHNpdHVhdGlvbnMgaW4gd2hpY2ggdGhlIGVuZCB0aWxlIHdhcyBhbHJlYWR5IGF0dGFja2VkXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoKTtcbiAgICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvKiBjb25zb2xlLmxvZyBudW0gKi9cbiAgICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZCA9PT0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pIHtcbiAgICAgICAgICBudW0gPVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pKSB7XG4gICAgICAgIG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgdGhpcy5wdWJTdWIucHVibGlzaChudW0pO1xuICAgIGNvbnNvbGUubG9nKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImluaXQiLCJHYW1lQm9hcmRWaWV3VXBkYXRlciIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaGFuZGxlQXR0YWNrVmlldyIsInN1bmsiLCJnYW1lb3ZlciIsInB1Ymxpc2giLCJHYW1lQm9hcmQiLCJwdWJTdWIiLCJzaGlwc0FyciIsInNoaXBzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJwdXNoIiwibWlzc2VkQXJyIiwiaXNUYWtlbiIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwieSIsImluY2x1ZGVzIiwiaXNOZWlnaGJvcmluZyIsImRpcmVjdGlvbiIsImNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzIiwibWFwIiwiY29vciIsIlN0cmluZyIsInNsaWNlIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsIkVycm9yIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwYXlsb2FkIiwidXNlckNsaWNrIiwiYXR0YWNrIiwiZGF0YXNldCIsInBpY2tQbGFjZW1lbnQiLCJhbGVydFNoaXBJbmZvQ2hhbmdlcyIsImlucHV0IiwicGxhY2VTaGlwQnRuIiwic2hpcFBsYWNlQnRuIiwiY3JlYXRlQ29vckFyciIsImFyciIsInRpbGVOdW0iLCJTaGlwIiwidGltZXNIaXQiLCJwdWJsaXNoRG9tRGF0YSIsImdhbWVCb2FyZERpdkNvbXB1dGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhpZGVGb3JtIiwiZm9ybSIsInNob3dDb21wQm9hcmQiLCJjb21wQm9hcmQiLCJyZW1vdmUiLCJhdHRhY2tTdGFnZSIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsInRleHRDb250ZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsInNob3dHYW1lT3ZlciIsIm1haW4iLCJub3RpZmljYXRpb24iLCJoaWRlQ29tcEJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsInBsYWNlbWVudFN0YWdlIiwiYWRkSW5wdXRMaXN0ZW5lcnMiLCJmb3JtSW5wdXRzIiwiYWRkQnRuTGlzdGVuZXIiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3VXBkYXRlciIsImdldFJhbmRvbU51bSIsImdldFJhbmRvbURpcmVjdGlvbiIsImdldFJhbmRvbVRpbGVOdW0iLCJ0b1N0cmluZyIsIlVzZXJHYW1lQm9hcmQiLCJjYWxjTWF4IiwibWF4IiwiY2hhckF0IiwiY2FsY0xlbmd0aCIsImlzVG9vQmlnIiwic2hpcExlbmd0aCIsImlzVmFsaWQiLCJ2YWxpZCIsInB1Ymxpc2hWYWxpZGl0eSIsInB1Ymxpc2hQbGFjZVNoaXAiLCJpbml0VXNlckJvYXJkIiwidXNlckJvYXJkIiwiaW5pdEhhbmRsZUF0dGFjayIsIkdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlld1VwZGF0ZXIiLCJTaGlwSW5mb1VzZXIiLCJkaXNwbGF5UmFkaW9WYWx1ZSIsInNoaXBQbGFjZW1lbnQiLCJ1cGRhdGVOdW0iLCJyZXNldE51bSIsImNyZWF0ZVNoaXBJbmZvIiwicHVibGlzaFNoaXBJbmZvQ2hlY2siLCJwdWJsaXNoU2hpcEluZm9DcmVhdGUiLCJpc0NvbXBsZXRlIiwiT2JqZWN0IiwidmFsdWVzIiwidW5kZWZpbmVkIiwiY29uc29sZSIsImxvZyIsImJpbmQiLCJDb21wdXRlclBsYXllciIsImZvdW5kU2hpcCIsImZvdW5kIiwiZGlmZmVyZW5jZSIsImVuZEZvdW5kIiwiZW5kIiwid2FzQXR0YWNrU3VjY2VzcyIsIk1hdGgiLCJhYnMiLCJzaWRlcyIsIm9wZXJhdG9ycyIsInNpZ24iLCJtZXRob2QiLCJhIiwiYiIsImZsb29yIiwicmFuZG9tIiwic29ydCIsImluaXRDb21wUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJVc2VyUGxheWVyIiwiaW5pdFBsYXllciIsInBsYXllciIsIm5hbWUiLCJpbnB1dHMiXSwic291cmNlUm9vdCI6IiJ9