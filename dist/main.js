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
      this.foundShip.hit = false;
      this.foundShip.endFound = true;
      this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
    } else if (obj.hit === false && this.foundShip.found === true) {
      this.foundShip.hit = false;
    }
  };
  static randomSideAttack(coordinate) {
    const sides = [1, 10]; // data difference for vertical sides is 10, and horizontal sides is 1  
    const operators = [
    // array of operators (+, -) which are used to generate a random operator
    {
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
    return operators[Math.floor(Math.random() * operators.length)].method(coordinate /* this.foundShip.coordinates[0] */, sides[Math.floor(Math.random() * sides.length)]); // generates the data num of a random side (horizontal left = hit coordinate - 1 / vertical bottom = hit coordinate +10 etc.)
  }

  attack = () => {
    let num;
    if (this.foundShip.coordinates.length === 1) {
      // if a ship was found, but was only hit once, so it is unknown whether its horizontal or vertical
      num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]);
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]); // if the generated num was already attacked, or it's too big or too small to be on the board, it generates the num again
      }
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === true) {
      if (this.foundShip.endFound === false) {
        /*     let newCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
            let prevCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 2];
            let coorDiff = this.foundShip.difference; */
        if ( /*  newCoor > prevCoor */
        this.foundShip.coordinates[this.foundShip.coordinates.length - 1] > this.foundShip.coordinates[this.foundShip.coordinates.length - 2]) {
          num = /*  newCoor + coorDiff; */
          this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
        } else if ( /*  newCoor < prevCoor */

        this.foundShip.coordinates[this.foundShip.coordinates.length - 1] < this.foundShip.coordinates[this.foundShip.coordinates.length - 2]) {
          /* num = newCoor - coorDiff/*  */
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] - this.foundShip.difference;
        }
        if (num > 100 || num < 1 || !super.isNew(num)) {
          // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true;
          this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
          console.log(`foundshipcoor ${this.foundShip.coordinates[this.foundShip.coordinates.length - 1]}`);
          this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
          console.log(`sorted ${this.foundShip.coordinates}`); //issue is sort not smallest to largest but largest to smallest
          if (this.foundShip.end === this.foundShip.coordinates[0]) {
            num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
          } else {
            num = this.foundShip.coordinates[0] - this.foundShip.difference;
            console.log(`highest number is end ${num}`);
          }
        }
      } else if (this.foundShip.endFound === true) {
        /* console.log num */

        this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
        if (this.foundShip.end === this.foundShip.coordinates[0]) {
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
        } else {
          num = this.foundShip.coordinates[0] - this.foundShip.difference;
        }
      }
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === false) {
      this.foundShip.endFound = true;
      this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
      this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
      if (this.foundShip.end === this.foundShip.coordinates[0]) {
        num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
      } else {
        num = this.foundShip.coordinates[0] - this.foundShip.difference;
      }
    }
    if (this.foundShip.found === false) {
      num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      while (!super.isNew(num) || num < 1) {
        num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      }
    }
    super.attackArr = num;
    console.log(`published ${num}`);
    this.pubSub.publish(num);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUQsU0FBUyxLQUFLLFlBQVksRUFBRTtNQUM5QkMsdUJBQXVCLEdBQUdBLHVCQUF1QixDQUFDVixNQUFNLENBQ3RESSxXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUFDLEVBQ3BDUixXQUFXLENBQUNPLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsRUFBRSxDQUNyQyxDQUFDLENBQUMsQ0FBQztNQUNILElBQUlSLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQ1MsTUFBTSxDQUFDVCxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ1UsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0RUosdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNyRCxDQUFDLE1BQU0sSUFBSUEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUNyQ00sdUJBQXVCLENBQUNULElBQUksQ0FBQ0csV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEQsQ0FBQyxNQUFNO1FBQ0xNLHVCQUF1QixDQUFDVCxJQUFJLENBQzFCRyxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDdkNELFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUNuQixDQUFDLENBQUMsQ0FBQztNQUNMO0lBQ0YsQ0FBQyxNQUFNO01BQ0xNLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ1YsTUFBTSxDQUN0REksV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUNuQ1IsV0FBVyxDQUFDTyxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FDcEMs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dURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnFEO0FBQ0c7QUFFeER4SCwyRUFBbUIsQ0FBQ2tCLE9BQU8sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLWF0dGFjay1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL3NoaXAtaW5mby5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVTaW5nbGVFdmVudFRpbGUgZnJvbSBcIi4vY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50VGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVTaW5nbGVFdmVudFRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRUaWxlcztcbiIsImltcG9ydCBjcmVhdGVTaW5nbGVUaWxlIGZyb20gXCIuL2NyZWF0ZS1zaW5nbGUtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGVFdmVudFRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBjcmVhdGVTaW5nbGVUaWxlKGlkKTtcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIiwiZnVuY3Rpb24gY3JlYXRlU2luZ2xlVGlsZShpZCkge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVUaWxlOyIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5jbGFzcyBHYW1lQm9hcmRWaWV3VXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcbiAgfVxuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZWxlbWVudH1cIl1gXG4gICAgICApO1xuICAgICAgR2FtZUJvYXJkVmlld1VwZGF0ZXIudXBkYXRlU3Vuayh0aWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtvYmoudGlsZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXdVcGRhdGVyLmdldFN0YXR1cyhvYmopKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkVmlld1VwZGF0ZXI7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIHNoaXBzQXJyID0gW107XG5cbiAgZ2V0IHNoaXBzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzQXJyO1xuICB9XG5cbiAgc2V0IHNoaXBzKHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnNoaXBzQXJyID0gdGhpcy5zaGlwc0Fyci5jb25jYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNoaXBzQXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG1pc3NlZEFyciA9IFtdO1xuXG4gIC8qIENoZWNrcyBpZiBjb29yZGluYXRlcyBhbHJlYWR5IGhhdmUgYSBzaGlwIG9uIHRoZW0gKi9cblxuICBpc1Rha2VuKGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiBzaGlwIHdvdWxkIGJlIG5laWdoYm9yaW5nIGEgZGlmZmVyZW50IHNoaXAgKi9cbiAgaXNOZWlnaGJvcmluZyhjb29yZGluYXRlcywgZGlyZWN0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxMCksXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEwKVxuICAgICAgKTsgLy8gdG9wIGFuZCBib3R0b20gbmVpZ2hib3JzXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gPT09IDEgfHwgK1N0cmluZyhjb29yZGluYXRlc1swXSkuc2xpY2UoMCwgLTEpID09PSAxKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbLTFdICsgMSk7IC8vIHJpZ2h0IG5laWdoYm9yXG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzWy0xXSAlIDEwID09PSAwKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxKTsgLy8gbGVmdCBuZWlnaGJvclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxXG4gICAgICAgICk7IC8vIGxlZnQgYW5kIHJpZ2h0IG5laWdoYm9yc1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSksXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEpXG4gICAgICApOyAvLyBsZWZ0IGFuZCByaWdodCBuZWlnaGJvcnNcbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA8IDExKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbLTFdICsgMTApOyAvLyBidG0gbmVpZ2hib3JcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPiA5MCkge1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMTApOyAvLyB0b3AgbmVpZ2hib3JcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMTBdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDEwXG4gICAgICAgICk7IC8vIHRvcCBhbmQgYnRtIG5laWdoYm9yc1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pc1Rha2VuKGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiB0aGUgbnVtIHNlbGVjdGVkIGJ5IHBsYXllciBoYXMgYSBzaGlwLCBpZiBoaXQgY2hlY2tzIGlmIHNoaXAgaXMgc3VuaywgaWYgc3VuayBjaGVja3MgaWYgZ2FtZSBpcyBvdmVyICAqL1xuXG4gIGhhbmRsZUF0dGFjayA9IChudW0pID0+IHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKCtudW0pKSB7XG4gICAgICAgIHRoaXMuc2hpcHNbeV0uaGl0KCk7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmlzU3VuaygpKSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgICAgaGl0OiB0cnVlLFxuICAgICAgICAgICAgc3VuazogdHJ1ZSxcbiAgICAgICAgICAgIHRpbGVzOiB0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNPdmVyKClcbiAgICAgICAgICAgID8gdGhpcy5wdWJTdWIucHVibGlzaCh7IC4uLm9iaiwgLi4ueyBnYW1lb3ZlcjogdHJ1ZSB9IH0pXG4gICAgICAgICAgICA6IHRoaXMucHViU3ViLnB1Ymxpc2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiB0cnVlLCBzdW5rOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaChudW0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogZmFsc2UsIHN1bms6IGZhbHNlIH0pO1xuICB9O1xuXG4gIC8qIENhbGxlZCB3aGVuIGEgc2hpcCBpcyBzdW5rLCByZXR1cm5zIEEpIEdBTUUgT1ZFUiBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3IgQikgU1VOSyBpZiB0aGVyZSdzIG1vcmUgc2hpcHMgbGVmdCAqL1xuXG4gIGlzT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjaGVjayA9IHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCJjbGFzcyBQbGF5ZXIge1xuXG4gIHByZXZpb3VzQXR0YWNrcyA9IFtdXG4gIFxuICBnZXQgYXR0YWNrQXJyKCkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzQXR0YWNrcztcbiAgfVxuXG4gIHNldCBhdHRhY2tBcnIodmFsdWUpIHtcbiAgICB0aGlzLnByZXZpb3VzQXR0YWNrcy5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGlzTmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuICF0aGlzLmF0dGFja0Fyci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH1cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFB1YlN1YiB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpXG4gIH1cbiBcbiAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuZmlsdGVyKHN1YiA9PiBzdWIhPT0gc3Vic2NyaWJlcilcbiAgfVxuXG4gIHB1Ymxpc2gocGF5bG9hZCkge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIocGF5bG9hZCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcblxuLyogdHJpZ2dlcnMgd2hlbiBhIHVzZXIgcGlja3MgYSBjb29yZGluYXRlIHRvIGF0dGFjayAqL1xuXG5mdW5jdGlvbiBhdHRhY2soKSB7XG4gIHVzZXJDbGljay5hdHRhY2sucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBzaGlwUGxhY2VtZW50LnVwZGF0ZU51bSBpbiBzaGlwLWluZm9fX3ZpZXdzLS11c2VyIHdoaWNoIHN0b3JlcyB0aGUgdXNlcidzIGN1cnJlbnQgc2hpcCBwbGFjZW1lbnQgcGljay4gT25jZSB1cGRhdGVkIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCkgaXMgcnVuICovXG5cbmZ1bmN0aW9uIHBpY2tQbGFjZW1lbnQoKSB7XG4gIHVzZXJDbGljay5waWNrUGxhY2VtZW50LnB1Ymxpc2godGhpcy5kYXRhc2V0LmlkKTtcbn1cblxuLyogdHJpZ2dlcnMgY3JlYXRlU2hpcEluZm8gZnVuYyBpbiBzaGlwLWluZm9fX3ZpZXdzLS11c2VyIHdoZW4gdXNlciBjbGlja2VkIGFuIGlucHV0ICovXG5cbmZ1bmN0aW9uIGFsZXJ0U2hpcEluZm9DaGFuZ2VzKCkge1xuICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xufVxuXG5mdW5jdGlvbiBwbGFjZVNoaXBCdG4oKSB7XG4gIHVzZXJDbGljay5zaGlwUGxhY2VCdG4ucHVibGlzaCgpO1xufVxuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyBwdWJsaXNoRG9tRGF0YSAqL1xuXG5leHBvcnQgeyBhdHRhY2ssIHBpY2tQbGFjZW1lbnQsIGFsZXJ0U2hpcEluZm9DaGFuZ2VzLCBwbGFjZVNoaXBCdG59O1xuIiwiXG4vKiBDcmVhdGVzIGEgY29vcmRpbmF0ZSBhcnIgZm9yIGEgc2hpcCBvYmplY3QncyBjb29yZGluYXRlcyBwcm9wZXJ0eSBmcm9tIHNoaXBJbmZvIG9iamVjdCAqL1xuXG5mdW5jdGlvbiBjcmVhdGVDb29yQXJyKG9iaikge1xuICBjb25zdCBhcnIgPSBbK29iai50aWxlTnVtXVxuICBmb3IgKGxldCBpID0gMTsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb29yQXJyO1xuIiwiaW1wb3J0IGNyZWF0ZUNvb3JBcnIgZnJvbSBcIi4vY3JlYXRlLWNvb3JkaW5hdGVzLWFyci9jcmVhdGUtY29vci1hcnJcIjtcblxuLyogQ3JlYXRlcyBzaGlwIG9iamVjdCBmcm9tIHNoaXBJbmZvIG9iamVjdCAqL1xuXG5jbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgdGhpcy5sZW5ndGggPSArb2JqLmxlbmd0aDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY3JlYXRlQ29vckFycihvYmopO1xuICB9XG5cbiAgdGltZXNIaXQgPSAwO1xuXG4gIHN1bmsgPSBmYWxzZTtcblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcblxuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5pbXBvcnQgY3JlYXRlRXZlbnRUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5cbmNvbnN0IGdhbWVCb2FyZERpdkNvbXB1dGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLWNvbXB1dGVyXCIpO1xuXG5cbi8qIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycyggKSB7XG4gIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmQtLXVzZXIgLmdhbWVib2FyZF9fdGlsZVwiKVxuICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEucGlja1BsYWNlbWVudClcbiAgfSlcbn1cblxuLyogaGlkZXMgdGhlIGZvcm0gKi9cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybVwiKVxuICBmb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIHNob3dDb21wQm9hcmQoKSB7XG4gIGNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKHNob3dDb21wQm9hcmQpXG5cbi8qIENyZWF0ZXMgdGlsZXMgZm9yIHRoZSB1c2VyIGdhbWVib2FyZCwgYW5kIHRpbGVzIHdpdGggZXZlbnRMaXN0ZW5lcnMgZm9yIHRoZSBjb21wdXRlciBnYW1lYm9hcmQgKi9cbmZ1bmN0aW9uIGluaXRBdHRhY2tTdGFnZVRpbGVzKCkge1xuICByZW1vdmVFdmVudExpc3RlbmVycygpXG4gIGNyZWF0ZUV2ZW50VGlsZXMoZ2FtZUJvYXJkRGl2Q29tcHV0ZXIsIHB1Ymxpc2hEb21EYXRhLmF0dGFjayk7XG59XG5cbi8qIENyZWF0ZXMgZ2FtZW92ZXIgbm90aWZpY2F0aW9uIGFuZCBuZXcgZ2FtZSBidG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlTmV3R2FtZUJ0bigpIHtcbiAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgYnRuLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gIGJ0bi50ZXh0Q29udGVudCA9IFwiU3RhcnQgTmV3IEdhbWVcIjtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gIH0pXG4gIHJldHVybiBidG5cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG4gIFxuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgaDEuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2hlYWRpbmdcIilcbiAgaDEudGV4dENvbnRlbnQgPSBcIkdBTUUgT1ZFUlwiO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDEpO1xuXG4gIGNvbnN0IGgzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICBoMy5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9fc3ViLWhlYWRpbmdcIik7XG4gIChzdHJpbmcgPT09IFwidXNlclwiKSA/IChoMy50ZXh0Q29udGVudCA9IFwiWU9VIExPU1RcIikgOiAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBXT05cIik7XG4gIGRpdi5hcHBlbmRDaGlsZChoMyk7XG4gIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVOZXdHYW1lQnRuKCkpO1xuICByZXR1cm4gZGl2XG59IFxuXG5cbmZ1bmN0aW9uIHNob3dHYW1lT3ZlcihzdHJpbmcpIHtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpXG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xufVxuXG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRBdHRhY2tTdGFnZVRpbGVzKTtcbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGhpZGVGb3JtKVxuaW5pdC5nYW1lb3Zlci5zdWJzY3JpYmUoc2hvd0dhbWVPdmVyKSIsImltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgXCIuL2xheW91dC0tYXR0YWNrLXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmZ1bmN0aW9uIGhpZGVDb21wQm9hcmQoKSB7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoaGlkZUNvbXBCb2FyZClcblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcyk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycylcblxuZnVuY3Rpb24gYWRkQnRuTGlzdGVuZXIoKSB7XG4gIGNvbnN0IHBsYWNlU2hpcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcbiAgcGxhY2VTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5wbGFjZVNoaXBCdG4pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRCdG5MaXN0ZW5lcilcblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoY3JlYXRlUGxhY2VtZW50VGlsZXMpXG5cblxuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7Y29tcHV0ZXJBdHRhY2ssIGhhbmRsZUNvbXB1dGVyQXR0YWNrfSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgdXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlVXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayx9O1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBjcmVhdGVTaGlwSW5mbygpIHB1Ymxpc2hlcyBhIHNoaXBJbmZvIG9iai4gZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBpcyBzdWJzY3JpYmVkIGFuZCBjaGVja3Mgd2hldGhlciBhIHNoaXAgY2FuIGJlIHBsYWNlZCB0aGVyZSAqL1xuY29uc3Qgc2hpcEluZm8gPSBuZXcgUHViU3ViKCk7XG5cbi8qIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgcHVibGlzaGVzIGFuIG9iaiB3aXRoIGEgYm9vLiB2YWxpZCBwcm9wZXJ0eSBhbmQgYSBsaXN0IG9mIGNvb3JkaW5hdGVzLiAgICovXG5jb25zdCB2YWxpZGl0eVZpZXdzID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuIHBsYWNlIHNoaXAgYnRuIGlzIHByZXNzZWQgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgd2lsbCBjcmVhdGUgc2hpcEluZm8gICovXG5jb25zdCBzaGlwUGxhY2VCdG4gPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIGNyZWF0ZXMgdGhlIHNoaXBJbmZvLiBUaGUgZ2FtZWJvYXJkLnBsYWNlU2hpcCAgKi9cbmNvbnN0IGNyZWF0ZVNoaXAgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFVzZXJHYW1lQm9hcmQucHVibGlzaFBsYWNlU2hpcCBwdWJsaXNoZXMgc2hpcCBjb29yZGluYXRlcy4gR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyLmhhbmRsZVBsYWNlbWVudFZpZXcgYWRkcyBwbGFjZW1lbnQtc2hpcCBjbGFzcyB0byB0aWxlcyAgKi9cbmNvbnN0IGNyZWF0ZVNoaXBWaWV3ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0LCBzaGlwSW5mbywgdmFsaWRpdHlWaWV3cywgc2hpcFBsYWNlQnRuLCBjcmVhdGVTaGlwLCBjcmVhdGVTaGlwVmlld30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBwbGFjZW1lbnQgc3RhZ2UgKi9cblxuY29uc3QgcGxhY2VtZW50U3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBhdHRhY2sgc3RhZ2UgKi9cblxuY29uc3QgYXR0YWNrU3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIGdhbWUgb3ZlciBkaXYgKi9cblxuY29uc3QgZ2FtZW92ZXIgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IGF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSwgZ2FtZW92ZXIgfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IFNoaXBJbmZvIGZyb20gXCIuL3NoaXAtaW5mby9zaGlwLWluZm9cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cblxuY2xhc3MgQ29tcHV0ZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuICAvKiBSZWNyZWF0ZXMgYSByYW5kb20gc2hpcCwgdW50aWwgaXRzIGNvb3JkaW5hdGVzIGFyZSBub3QgdGFrZW4uICovXG5cbiAgcGxhY2VTaGlwKGxlbmd0aCkge1xuICAgIGxldCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIHdoaWxlICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5pc05laWdoYm9yaW5nKHNoaXAuY29vcmRpbmF0ZXMsIHNoaXAuZGlyZWN0aW9uKSApIHtcbiAgICAgIHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgICBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q29tcEdCKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJHYW1lQm9hcmQoaGFuZGxlVXNlckF0dGFjayk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNSk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMyk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMik7XG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3VXBkYXRlciBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC12aWV3LXVwZGF0ZXIvZ2FtZWJvYXJkLXZpZXctdXBkYXRlclwiO1xuaW1wb3J0IHsgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIlxuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3VXBkYXRlciA9IG5ldyBHYW1lQm9hcmRWaWV3VXBkYXRlcihjb21wdXRlcik7XG5cbmhhbmRsZVVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyVmlld1VwZGF0ZXIuaGFuZGxlQXR0YWNrVmlldyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyVmlld1VwZGF0ZXI7XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG5mdW5jdGlvbiBnZXRSYW5kb21EaXJlY3Rpb24oKSB7XG4gIHJldHVybiBnZXRSYW5kb21OdW0oMikgPT09IDEgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tRGlyZWN0aW9uO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuLyogQ3JlYXRlIGEgcmFuZG9tIHRpbGVOdW0gKi9cblxuZnVuY3Rpb24gZ2V0UmFuZG9tVGlsZU51bShsZW5ndGgsIGRpcmVjdGlvbikge1xuICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgIHJldHVybiArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDExLSBsZW5ndGgpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21UaWxlTnVtO1xuIiwiXG5pbXBvcnQgZ2V0UmFuZG9tRGlyZWN0aW9uIGZyb20gXCIuL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uXCI7XG5pbXBvcnQgZ2V0UmFuZG9tVGlsZU51bSBmcm9tIFwiLi9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW1cIjtcblxuY2xhc3MgU2hpcEluZm8ge1xuICBcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBnZXRSYW5kb21EaXJlY3Rpb24oKTtcbiAgICB0aGlzLnRpbGVOdW0gPSBnZXRSYW5kb21UaWxlTnVtKHRoaXMubGVuZ3RoLCB0aGlzLmRpcmVjdGlvbik7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mbztcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssIGNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuICAvKiBDYWxjdWxhdGVzIHRoZSBtYXggYWNjZXB0YWJsZSB0aWxlIGZvciBhIHNoaXAgZGVwZW5kaW5nIG9uIGl0cyBzdGFydCAodGlsZU51bSkuXG4gIGZvciBleC4gSWYgYSBzaGlwIGlzIHBsYWNlZCBob3Jpem9udGFsbHkgb24gdGlsZSAyMSBtYXggd291bGQgYmUgMzAgICovXG5cbiAgc3RhdGljIGNhbGNNYXgob2JqKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIG9iai50aWxlTnVtID4gMTApIHtcbiAgICAgIGlmIChvYmoudGlsZU51bSAlIDEwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBvYmoudGlsZU51bVxuICAgICAgfVxuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgb2JqLmRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXN9IFxuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMgfVxuICB9XG5cbiAgcHVibGlzaFZhbGlkaXR5ID0gKG9iaikgPT4ge1xuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBwbGFjZXMgc2hpcCBpbiBzaGlwc0FyciAqL1xuXG4gIHBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gc2hpcDtcbiAgfVxuXG4gIHB1Ymxpc2hQbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxhY2VTaGlwKG9iailcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcucHVibGlzaCh7Y29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMsIGxlbmd0aDogc2hpcC5sZW5ndGh9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRVc2VyQm9hcmQoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG4gIHVzZXJDbGljay5jcmVhdGVTaGlwLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFBsYWNlU2hpcCk7XG4gIGZ1bmN0aW9uIGluaXRIYW5kbGVBdHRhY2soKSB7XG4gICAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xuICB9XG4gIGluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRIYW5kbGVBdHRhY2spXG59XG5cbmluaXRVc2VyQm9hcmQoKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5jbGFzcyBHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIgZXh0ZW5kcyBHYW1lQm9hcmRWaWV3VXBkYXRlciB7XG4gIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuJylcbiAgXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgcmFkaW8gaW5wdXQgZm9yIHRoYXQgc2hpcCBpcyBoaWRkZW4gKi9cbiAgc3RhdGljIGhpZGVSYWRpbyhvYmopIHtcbiAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3NoaXAtJHtvYmoubGVuZ3RofWApO1xuICAgIHJhZGlvSW5wdXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBjb25zdCByYWRpb0xhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihbYFtmb3I9XCJzaGlwLSR7b2JqLmxlbmd0aH1cIl1gXSlcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG4gIHN0YXRpYyBuZXh0U2hpcENoZWNrZWQoKSB7XG4gICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGA6bm90KC5oaWRkZW4pW25hbWU9XCJzaGlwXCJdYClcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIFxuICAgIH1cbiAgICBcbiAgfVxuXG4gLyogQ2xlYXJzIHRoZSB2YWxpZGl0eSBjaGVjayBvZiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkLiBJZiBpdCBwYXNzZXMgdGhlIGNoZWNrIGl0IHVubG9ja3MgdGhlIHBsYWNlIHNoaXAgYnRuICovXG4gICBjbGVhclZhbGlkaXR5VmlldyA9ICgpID0+IHtcbiAgICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkX190aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2godGlsZSA9PiB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgIH0pXG4gICAgdGhpcy5idG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIilcbiAgfVxuXG4gLyogYWRkcyB0aGUgdmlzdWFsIGNsYXNzIHBsYWNlbWVudC0tdmFsaWQvb3IgcGxhY2VtZW50LS1pbnZhbGlkIGJhc2VkIG9uIHRoZSB0aWxlTnVtIGNob3NlbiBieSB0aGUgdXNlciwgZGlzYWJsZXMgdGhlIHN1Ym1pdCBidG4gaWYgaXQgZmFpbHMgcGxhY2VtZW50IGNoZWNrICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBpZiAoIW9iai52YWxpZCkge1xuICAgICAgdGhpcy5idG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIilcbiAgICB9XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goY29vcmRpbmF0ZSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICBpZiAob2JqLnZhbGlkKSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tdmFsaWRcIilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0taW52YWxpZFwiKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVQbGFjZW1lbnRWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmhpZGVSYWRpbyhvYmopXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5uZXh0U2hpcENoZWNrZWQoKTtcbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaChjb29yZGluYXRlID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKVxuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1zaGlwXCIpXG4gICAgfSlcbiAgfVxufVxuXG5cblxuXG5jb25zdCB1c2VyID0gXCJ1c2VyXCI7XG5cbmNvbnN0IHVzZXJWaWV3VXBkYXRlciA9IG5ldyBHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIodXNlcik7XG5cbmhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlQXR0YWNrVmlldyk7XG51c2VyQ2xpY2sudmFsaWRpdHlWaWV3cy5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldylcbnVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZVBsYWNlbWVudFZpZXcpXG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJWaWV3VXBkYXRlcjtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vLi4vY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YVwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5cbmNvbnN0IHNoaXBQbGFjZW1lbnQgPSB7XG4gIHRpbGVOdW06IDAsXG4gIHVwZGF0ZU51bSh2YWx1ZSkge1xuICAgIHRoaXMudGlsZU51bSA9IHZhbHVlO1xuICAgIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKCk7XG4gIH0sXG4gIHJlc2V0TnVtKCkge1xuICAgIHRoaXMudGlsZU51bSA9IDA7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBJbmZvKCkge1xuICBjb25zdCB7IHRpbGVOdW0gfSA9IHNoaXBQbGFjZW1lbnQ7XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIGNvbnN0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvVXNlcih0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbilcbiAgcmV0dXJuIHNoaXBJbmZvXG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NoZWNrKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnB1Ymxpc2goc2hpcEluZm8pOyAgXG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpXG4gIGNvbnN0IGlzQ29tcGxldGUgPSBPYmplY3QudmFsdWVzKHNoaXBJbmZvKS5ldmVyeSh2YWx1ZSA9PiB7XG4gICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IGZhbHNlICYmIHZhbHVlICE9PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IHJldHVybiBmYWxzZVxuICB9KVxuICBpZiAoaXNDb21wbGV0ZSkge1xuICAgIGNvbnNvbGUubG9nKHNoaXBJbmZvKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwLnB1Ymxpc2goc2hpcEluZm8pOyBcbiAgICBzaGlwUGxhY2VtZW50LnJlc2V0TnVtKCk7IFxuICB9XG59XG5cbnVzZXJDbGljay5waWNrUGxhY2VtZW50LnN1YnNjcmliZShzaGlwUGxhY2VtZW50LnVwZGF0ZU51bS5iaW5kKHNoaXBQbGFjZW1lbnQpKTtcblxudXNlckNsaWNrLmlucHV0LnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DaGVjayk7XG51c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DcmVhdGUpXG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcbmltcG9ydCB7XG4gIGNvbXB1dGVyQXR0YWNrLFxuICBoYW5kbGVDb21wdXRlckF0dGFjayxcbn0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIENvbXB1dGVyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIGZvdW5kU2hpcCA9IHtcbiAgICBmb3VuZDogZmFsc2UsXG4gICAgaGl0OiBmYWxzZSxcbiAgICBjb29yZGluYXRlczogW10sXG4gICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgZW5kOiBudWxsLFxuICB9O1xuXG4gIHdhc0F0dGFja1N1Y2Nlc3MgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcCA9IHtcbiAgICAgICAgZm91bmQ6IGZhbHNlLFxuICAgICAgICBoaXQ6IGZhbHNlLFxuICAgICAgICBjb29yZGluYXRlczogW10sXG4gICAgICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9IE1hdGguYWJzKFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gb2JqLnRpbGVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb2JqLmhpdCA9PT0gZmFsc2UgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxXG4gICAgKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgIFxuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgIFxuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBzdGF0aWMgcmFuZG9tU2lkZUF0dGFjayhjb29yZGluYXRlKSB7XG4gICAgY29uc3Qgc2lkZXMgPSBbMSwgMTBdOyAvLyBkYXRhIGRpZmZlcmVuY2UgZm9yIHZlcnRpY2FsIHNpZGVzIGlzIDEwLCBhbmQgaG9yaXpvbnRhbCBzaWRlcyBpcyAxICBcbiAgICAgIGNvbnN0IG9wZXJhdG9ycyA9IFsgLy8gYXJyYXkgb2Ygb3BlcmF0b3JzICgrLCAtKSB3aGljaCBhcmUgdXNlZCB0byBnZW5lcmF0ZSBhIHJhbmRvbSBvcGVyYXRvclxuICAgICAgICB7XG4gICAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgICAgbWV0aG9kIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNpZ246IFwiLVwiLFxuICAgICAgICAgIG1ldGhvZCAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgICAgcmV0dXJuIG9wZXJhdG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGVyYXRvcnMubGVuZ3RoKV0ubWV0aG9kKFxuICAgICAgICBjb29yZGluYXRlLyogdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gKi8sXG4gICAgICAgIHNpZGVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpZGVzLmxlbmd0aCldIFxuICAgICAgKTsgLy8gZ2VuZXJhdGVzIHRoZSBkYXRhIG51bSBvZiBhIHJhbmRvbSBzaWRlIChob3Jpem9udGFsIGxlZnQgPSBoaXQgY29vcmRpbmF0ZSAtIDEgLyB2ZXJ0aWNhbCBib3R0b20gPSBoaXQgY29vcmRpbmF0ZSArMTAgZXRjLilcbiAgfVxuXG4gIGF0dGFjayA9ICgpID0+IHtcbiAgICBsZXQgbnVtO1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHsgLy8gaWYgYSBzaGlwIHdhcyBmb3VuZCwgYnV0IHdhcyBvbmx5IGhpdCBvbmNlLCBzbyBpdCBpcyB1bmtub3duIHdoZXRoZXIgaXRzIGhvcml6b250YWwgb3IgdmVydGljYWxcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pXG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtID4gMTAwIHx8IG51bSA8IDEpIHtcbiAgICAgICBudW0gPSBDb21wdXRlclBsYXllci5yYW5kb21TaWRlQXR0YWNrKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9PT0gdHJ1ZVxuICAgICkge1xuICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSBmYWxzZSkge1xuICAgIC8qICAgICBsZXQgbmV3Q29vciA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBsZXQgcHJldkNvb3IgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAyXTtcbiAgICAgICAgbGV0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTsgKi9cbiAgICAgICAgaWYgKFxuICAgICAgICAgLyogIG5ld0Nvb3IgPiBwcmV2Q29vciAqL1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdID5cbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAyXSBcbiAgICAgICAgKSB7XG4gICAgICAgICAgbnVtID0vKiAgbmV3Q29vciArIGNvb3JEaWZmOyAqL1xuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTsgXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAvKiAgbmV3Q29vciA8IHByZXZDb29yICovXG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDJdIFxuICAgICAgICApIHtcbiAgICAgICAgICAvKiBudW0gPSBuZXdDb29yIC0gY29vckRpZmYvKiAgKi9cbiAgICAgICAgICBudW0gPSAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gLVxuICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTsgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7XG4gICAgICAgICAgLy8gZm9yIGVkZ2UgY2FzZXMsIGFuZCBzaXR1YXRpb25zIGluIHdoaWNoIHRoZSBlbmQgdGlsZSB3YXMgYWxyZWFkeSBhdHRhY2tlZFxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTsgXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgZm91bmRzaGlwY29vciAke3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdfWApXG4gICAgICAgICAgICBcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoKGEsYikgPT4gYSAtIGIpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBzb3J0ZWQgJHt0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc31gKSAvL2lzc3VlIGlzIHNvcnQgbm90IHNtYWxsZXN0IHRvIGxhcmdlc3QgYnV0IGxhcmdlc3QgdG8gc21hbGxlc3RcbiAgICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGhpZ2hlc3QgbnVtYmVyIGlzIGVuZCAke251bX1gKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvKiBjb25zb2xlLmxvZyBudW0gKi9cblxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoKGEsYikgPT4gYSAtIGIpO1xuICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXSArXG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMuc29ydCgoYSxiKSA9PiBhIC0gYik7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICBudW0gPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSB8fCBudW0gPCAxICkge1xuICAgICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIuYXR0YWNrQXJyID0gbnVtO1xuXG4gICAgY29uc29sZS5sb2coYHB1Ymxpc2hlZCAke251bX1gKTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImluaXQiLCJHYW1lQm9hcmRWaWV3VXBkYXRlciIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaGFuZGxlQXR0YWNrVmlldyIsInN1bmsiLCJnYW1lb3ZlciIsInB1Ymxpc2giLCJHYW1lQm9hcmQiLCJwdWJTdWIiLCJzaGlwc0FyciIsInNoaXBzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJwdXNoIiwibWlzc2VkQXJyIiwiaXNUYWtlbiIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwieSIsImluY2x1ZGVzIiwiaXNOZWlnaGJvcmluZyIsImRpcmVjdGlvbiIsImNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzIiwibWFwIiwiY29vciIsIlN0cmluZyIsInNsaWNlIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsIkVycm9yIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwYXlsb2FkIiwidXNlckNsaWNrIiwiYXR0YWNrIiwiZGF0YXNldCIsInBpY2tQbGFjZW1lbnQiLCJhbGVydFNoaXBJbmZvQ2hhbmdlcyIsImlucHV0IiwicGxhY2VTaGlwQnRuIiwic2hpcFBsYWNlQnRuIiwiY3JlYXRlQ29vckFyciIsImFyciIsInRpbGVOdW0iLCJTaGlwIiwidGltZXNIaXQiLCJwdWJsaXNoRG9tRGF0YSIsImdhbWVCb2FyZERpdkNvbXB1dGVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhpZGVGb3JtIiwiZm9ybSIsInNob3dDb21wQm9hcmQiLCJjb21wQm9hcmQiLCJyZW1vdmUiLCJhdHRhY2tTdGFnZSIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsInRleHRDb250ZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsInNob3dHYW1lT3ZlciIsIm1haW4iLCJub3RpZmljYXRpb24iLCJoaWRlQ29tcEJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsInBsYWNlbWVudFN0YWdlIiwiYWRkSW5wdXRMaXN0ZW5lcnMiLCJmb3JtSW5wdXRzIiwiYWRkQnRuTGlzdGVuZXIiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3VXBkYXRlciIsImdldFJhbmRvbU51bSIsImdldFJhbmRvbURpcmVjdGlvbiIsImdldFJhbmRvbVRpbGVOdW0iLCJ0b1N0cmluZyIsIlVzZXJHYW1lQm9hcmQiLCJjYWxjTWF4IiwibWF4IiwiY2hhckF0IiwiY2FsY0xlbmd0aCIsImlzVG9vQmlnIiwic2hpcExlbmd0aCIsImlzVmFsaWQiLCJ2YWxpZCIsInB1Ymxpc2hWYWxpZGl0eSIsInB1Ymxpc2hQbGFjZVNoaXAiLCJpbml0VXNlckJvYXJkIiwidXNlckJvYXJkIiwiaW5pdEhhbmRsZUF0dGFjayIsIkdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlld1VwZGF0ZXIiLCJTaGlwSW5mb1VzZXIiLCJkaXNwbGF5UmFkaW9WYWx1ZSIsInNoaXBQbGFjZW1lbnQiLCJ1cGRhdGVOdW0iLCJyZXNldE51bSIsImNyZWF0ZVNoaXBJbmZvIiwicHVibGlzaFNoaXBJbmZvQ2hlY2siLCJwdWJsaXNoU2hpcEluZm9DcmVhdGUiLCJpc0NvbXBsZXRlIiwiT2JqZWN0IiwidmFsdWVzIiwidW5kZWZpbmVkIiwiY29uc29sZSIsImxvZyIsImJpbmQiLCJDb21wdXRlclBsYXllciIsImZvdW5kU2hpcCIsImZvdW5kIiwiZGlmZmVyZW5jZSIsImVuZEZvdW5kIiwiZW5kIiwid2FzQXR0YWNrU3VjY2VzcyIsIk1hdGgiLCJhYnMiLCJyYW5kb21TaWRlQXR0YWNrIiwic2lkZXMiLCJvcGVyYXRvcnMiLCJzaWduIiwibWV0aG9kIiwiYSIsImIiLCJmbG9vciIsInJhbmRvbSIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==