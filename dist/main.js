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

  /* Checks if coordinate is an edge tile */
  static isEdge(coordinate) {
    return coordinate % 10 === 0;
  }

  /* Checks if ship would be neighboring a different ship */
  isNeighboring = (coordinates, direction) => {
    if (direction === "horizontal") {
      const coordinatesTopNeighbor = coordinates.map(coor => coor + 10);
      const coordinatesBtmNeighbor = coordinates.map(coor => coor + 10);
    }
  };

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
    while (this.isTaken(ship.coordinates)) {
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
      if (_common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isEdge(obj.tileNum)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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eER6SCwyRUFBbUIsQ0FBQ2tCLE9BQU8sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLWF0dGFjay1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL3NoaXAtaW5mby5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVTaW5nbGVFdmVudFRpbGUgZnJvbSBcIi4vY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50VGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVTaW5nbGVFdmVudFRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRUaWxlcztcbiIsImltcG9ydCBjcmVhdGVTaW5nbGVUaWxlIGZyb20gXCIuL2NyZWF0ZS1zaW5nbGUtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGVFdmVudFRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBjcmVhdGVTaW5nbGVUaWxlKGlkKTtcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIiwiZnVuY3Rpb24gY3JlYXRlU2luZ2xlVGlsZShpZCkge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVUaWxlOyIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5jbGFzcyBHYW1lQm9hcmRWaWV3VXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcbiAgfVxuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZWxlbWVudH1cIl1gXG4gICAgICApO1xuICAgICAgR2FtZUJvYXJkVmlld1VwZGF0ZXIudXBkYXRlU3Vuayh0aWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtvYmoudGlsZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXdVcGRhdGVyLmdldFN0YXR1cyhvYmopKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkVmlld1VwZGF0ZXI7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICBzZXQgc2hpcHModmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIgPSB0aGlzLnNoaXBzQXJyLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogQ2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIGNvb3JkaW5hdGUgaXMgYW4gZWRnZSB0aWxlICovXG4gIHN0YXRpYyBpc0VkZ2UoY29vcmRpbmF0ZSkge1xuICAgIHJldHVybiAoY29vcmRpbmF0ZSAlIDEwID09PSAwKVxuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHNoaXAgd291bGQgYmUgbmVpZ2hib3JpbmcgYSBkaWZmZXJlbnQgc2hpcCAqL1xuICBpc05laWdoYm9yaW5nID0gKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pID0+IHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXNUb3BOZWlnaGJvciA9IGNvb3JkaW5hdGVzLm1hcChjb29yID0+IGNvb3IgKyAxMCk7XG4gICAgICBjb25zdCBjb29yZGluYXRlc0J0bU5laWdoYm9yID0gY29vcmRpbmF0ZXMubWFwKGNvb3IgPT4gY29vciArIDEwKTtcblxuXG4gICAgfVxuICAgIFxuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBudW0gc2VsZWN0ZWQgYnkgcGxheWVyIGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7aGl0OiB0cnVlLCBzdW5rOiB0cnVlLCB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyB9XG4gICAgICAgICAgcmV0dXJuICh0aGlzLmlzT3ZlcigpKSA/IHRoaXMucHViU3ViLnB1Ymxpc2goey4uLm9iaiwgLi4ue2dhbWVvdmVyOiB0cnVlfX0pIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkQXJyLnB1c2gobnVtKTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBDYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7IFxuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2tcbiAgfSBcbiAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcEJ0bigpIHtcbiAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXMsIHBsYWNlU2hpcEJ0bn07XG4iLCJcbi8qIENyZWF0ZXMgYSBjb29yZGluYXRlIGFyciBmb3IgYSBzaGlwIG9iamVjdCdzIGNvb3JkaW5hdGVzIHByb3BlcnR5IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gIGNvbnN0IGFyciA9IFsrb2JqLnRpbGVOdW1dXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvb3JBcnI7XG4iLCJpbXBvcnQgY3JlYXRlQ29vckFyciBmcm9tIFwiLi9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyclwiO1xuXG4vKiBDcmVhdGVzIHNoaXAgb2JqZWN0IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjcmVhdGVDb29yQXJyKG9iaik7XG4gIH1cblxuICB0aW1lc0hpdCA9IDA7XG5cbiAgc3VuayA9IGZhbHNlO1xuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMudGltZXNIaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuXG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcblxuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cblxuLyogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQgKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCApIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpXG4gIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KVxuICB9KVxufVxuXG4vKiBoaWRlcyB0aGUgZm9ybSAqL1xuZnVuY3Rpb24gaGlkZUZvcm0oKSB7XG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtXCIpXG4gIGZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gc2hvd0NvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoc2hvd0NvbXBCb2FyZClcblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKClcbiAgY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZDb21wdXRlciwgcHVibGlzaERvbURhdGEuYXR0YWNrKTtcbn1cblxuLyogQ3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgfSlcbiAgcmV0dXJuIGJ0blxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvblwiKTtcbiAgXG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBoMS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faGVhZGluZ1wiKVxuICBoMS50ZXh0Q29udGVudCA9IFwiR0FNRSBPVkVSXCI7XG4gIGRpdi5hcHBlbmRDaGlsZChoMSk7XG5cbiAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gIGgzLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19zdWItaGVhZGluZ1wiKTtcbiAgKHN0cmluZyA9PT0gXCJ1c2VyXCIpID8gKGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiKSA6IChoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiKTtcbiAgZGl2LmFwcGVuZENoaWxkKGgzKTtcbiAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZU5ld0dhbWVCdG4oKSk7XG4gIHJldHVybiBkaXZcbn0gXG5cblxuZnVuY3Rpb24gc2hvd0dhbWVPdmVyKHN0cmluZykge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIilcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEF0dGFja1N0YWdlVGlsZXMpO1xuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaGlkZUZvcm0pXG5pbml0LmdhbWVvdmVyLnN1YnNjcmliZShzaG93R2FtZU92ZXIpIiwiaW1wb3J0IGNyZWF0ZUV2ZW50VGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKVxuXG5mdW5jdGlvbiBhZGRJbnB1dExpc3RlbmVycygpIHtcbiAgY29uc3QgZm9ybUlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VtZW50LWZvcm1fX2lucHV0XCIpO1xuICBmb3JtSW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKTtcbiAgfSk7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZElucHV0TGlzdGVuZXJzKVxuXG5mdW5jdGlvbiBhZGRCdG5MaXN0ZW5lcigpIHtcbiAgY29uc3QgcGxhY2VTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuICBwbGFjZVNoaXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLnBsYWNlU2hpcEJ0bik7XG59XG5cbmluaXQucGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZEJ0bkxpc3RlbmVyKVxuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZW1lbnRUaWxlcygpIHtcbiAgY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuICBjcmVhdGVFdmVudFRpbGVzKGdhbWVCb2FyZERpdlVzZXIsIHB1Ymxpc2hEb21EYXRhLnBpY2tQbGFjZW1lbnQpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcylcblxuXG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCB1c2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVVc2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrLH07XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgcGlja1BsYWNlbWVudCA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaW5wdXQgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGNyZWF0ZVNoaXBJbmZvKCkgcHVibGlzaGVzIGEgc2hpcEluZm8gb2JqLiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IGlzIHN1YnNjcmliZWQgYW5kIGNoZWNrcyB3aGV0aGVyIGEgc2hpcCBjYW4gYmUgcGxhY2VkIHRoZXJlICovXG5jb25zdCBzaGlwSW5mbyA9IG5ldyBQdWJTdWIoKTtcblxuLyogZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBwdWJsaXNoZXMgYW4gb2JqIHdpdGggYSBib28uIHZhbGlkIHByb3BlcnR5IGFuZCBhIGxpc3Qgb2YgY29vcmRpbmF0ZXMuICAgKi9cbmNvbnN0IHZhbGlkaXR5Vmlld3MgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gcGxhY2Ugc2hpcCBidG4gaXMgcHJlc3NlZCBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB3aWxsIGNyZWF0ZSBzaGlwSW5mbyAgKi9cbmNvbnN0IHNoaXBQbGFjZUJ0biA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiAgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgY3JlYXRlcyB0aGUgc2hpcEluZm8uIFRoZSBnYW1lYm9hcmQucGxhY2VTaGlwICAqL1xuY29uc3QgY3JlYXRlU2hpcCA9IG5ldyBQdWJTdWIoKTtcblxuLyogVXNlckdhbWVCb2FyZC5wdWJsaXNoUGxhY2VTaGlwIHB1Ymxpc2hlcyBzaGlwIGNvb3JkaW5hdGVzLiBHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmlldyBhZGRzIHBsYWNlbWVudC1zaGlwIGNsYXNzIHRvIHRpbGVzICAqL1xuY29uc3QgY3JlYXRlU2hpcFZpZXcgPSBuZXcgUHViU3ViKCk7XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHVzZXJDbGljayAqL1xuXG5leHBvcnQge3BpY2tQbGFjZW1lbnQsIGF0dGFjaywgaW5wdXQsIHNoaXBJbmZvLCB2YWxpZGl0eVZpZXdzLCBzaGlwUGxhY2VCdG4sIGNyZWF0ZVNoaXAsIGNyZWF0ZVNoaXBWaWV3fSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIHBsYWNlbWVudCBzdGFnZSAqL1xuXG5jb25zdCBwbGFjZW1lbnRTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG5jb25zdCBhdHRhY2tTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgZ2FtZSBvdmVyIGRpdiAqL1xuXG5jb25zdCBnYW1lb3ZlciA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgYXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlLCBnYW1lb3ZlciB9ICA7IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgU2hpcEluZm8gZnJvbSBcIi4vc2hpcC1pbmZvL3NoaXAtaW5mb1wiO1xuaW1wb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuXG5jbGFzcyBDb21wdXRlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG4gIC8qIFJlY3JlYXRlcyBhIHJhbmRvbSBzaGlwLCB1bnRpbCBpdHMgY29vcmRpbmF0ZXMgYXJlIG5vdCB0YWtlbi4gKi9cblxuICBwbGFjZVNoaXAobGVuZ3RoKSB7XG4gICAgbGV0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgd2hpbGUgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSkge1xuICAgICAgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICAgIHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgfVxuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wR0IoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckdhbWVCb2FyZChoYW5kbGVVc2VyQXR0YWNrKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCg1KTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCg0KTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCgzKTtcbiAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcCgyKTtcbiAgICB1c2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlckJvYXJkLmhhbmRsZUF0dGFjayk7IFxufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcEdCKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiXG5cbmNvbnN0IGNvbXB1dGVyID0gXCJjb21wdXRlclwiO1xuXG5jb25zdCBjb21wdXRlclZpZXdVcGRhdGVyID0gbmV3IEdhbWVCb2FyZFZpZXdVcGRhdGVyKGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBDcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKEdhbWVCb2FyZC5pc0VkZ2Uob2JqLnRpbGVOdW0pKSB7XG4gICAgICAgIHJldHVybiBvYmoudGlsZU51bVxuICAgICAgfVxuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJCb2FyZCgpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFVzZXJCb2FyZCgpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlld1VwZGF0ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXJcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciBleHRlbmRzIEdhbWVCb2FyZFZpZXdVcGRhdGVyIHtcbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG4nKVxuICBcbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSByYWRpbyBpbnB1dCBmb3IgdGhhdCBzaGlwIGlzIGhpZGRlbiAqL1xuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKVxuICAgIHJhZGlvTGFiZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfVxuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgbmV4dCByYWRpbyBpbnB1dCBpcyBjaGVja2VkIHNvIHRoYXQgeW91IGNhbid0IHBsYWNlIHR3byBvZiB0aGUgc2FtZSBzaGlwcyB0d2ljZSxcbiAgICAgd2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBzaGlwcyB0byBwbGFjZSBuZXh0U2hpcENoZWNrZWQgd2lsbCBpbml0aWFsaXplIHRoZSBhdHRhY2sgc3RhZ2UgKi9cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKVxuICAgIGlmIChyYWRpbyA9PT0gbnVsbCkge1xuICAgICAgaW5pdC5hdHRhY2tTdGFnZS5wdWJsaXNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGlvLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgXG4gICAgfVxuICAgIFxuICB9XG5cbiAvKiBDbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cbiAgIGNsZWFyVmFsaWRpdHlWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmRfX3RpbGVcIik7XG4gICAgdGlsZXMuZm9yRWFjaCh0aWxlID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSlcbiAgICB0aGlzLmJ0bi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKVxuICB9XG5cbiAvKiBhZGRzIHRoZSB2aXN1YWwgY2xhc3MgcGxhY2VtZW50LS12YWxpZC9vciBwbGFjZW1lbnQtLWludmFsaWQgYmFzZWQgb24gdGhlIHRpbGVOdW0gY2hvc2VuIGJ5IHRoZSB1c2VyLCBkaXNhYmxlcyB0aGUgc3VibWl0IGJ0biBpZiBpdCBmYWlscyBwbGFjZW1lbnQgY2hlY2sgKi9cblxuICBoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIGlmICghb2JqLnZhbGlkKSB7XG4gICAgICB0aGlzLmJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKVxuICAgIH1cbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaChjb29yZGluYXRlID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIGlmIChvYmoudmFsaWQpIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS12YWxpZFwiKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVBsYWNlbWVudFZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIHRoaXMuY29uc3RydWN0b3IuaGlkZVJhZGlvKG9iailcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKGNvb3JkaW5hdGUgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApXG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIilcbiAgICB9KVxuICB9XG59XG5cblxuXG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXdVcGRhdGVyID0gbmV3IEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlcih1c2VyKTtcblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcbnVzZXJDbGljay52YWxpZGl0eVZpZXdzLnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3KVxudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50VmlldylcblxuZXhwb3J0IGRlZmF1bHQgdXNlclZpZXdVcGRhdGVyO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi8uLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgZGlzcGxheVJhZGlvVmFsdWUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWVcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgdGlsZU51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy50aWxlTnVtID0gdmFsdWU7XG4gICAgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMoKTtcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKVxuICByZXR1cm4gc2hpcEluZm9cbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7ICBcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KHZhbHVlID0+IHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gcmV0dXJuIGZhbHNlXG4gIH0pXG4gIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgY29uc29sZS5sb2coc2hpcEluZm8pXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXAucHVibGlzaChzaGlwSW5mbyk7IFxuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTsgXG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSlcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuaW1wb3J0IHsgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5jbGFzcyBDb21wdXRlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSkge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgfVxuICAgIHN1cGVyLmF0dGFja0FyciA9IG51bTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSlcbiAgICByZXR1cm4gbnVtXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIgKCkge1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBDb21wdXRlclBsYXllcihjb21wdXRlckF0dGFjayk7XG4gIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLmF0dGFjayk7XG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wUGxheWVyKVxuXG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImluaXQiLCJHYW1lQm9hcmRWaWV3VXBkYXRlciIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaGFuZGxlQXR0YWNrVmlldyIsInN1bmsiLCJnYW1lb3ZlciIsInB1Ymxpc2giLCJHYW1lQm9hcmQiLCJwdWJTdWIiLCJzaGlwc0FyciIsInNoaXBzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJwdXNoIiwibWlzc2VkQXJyIiwiaXNUYWtlbiIsImNvb3JkaW5hdGVzIiwibGVuZ3RoIiwieSIsImluY2x1ZGVzIiwiaXNFZGdlIiwiY29vcmRpbmF0ZSIsImlzTmVpZ2hib3JpbmciLCJkaXJlY3Rpb24iLCJjb29yZGluYXRlc1RvcE5laWdoYm9yIiwibWFwIiwiY29vciIsImNvb3JkaW5hdGVzQnRtTmVpZ2hib3IiLCJoYW5kbGVBdHRhY2siLCJudW0iLCJpc1N1bmsiLCJpc092ZXIiLCJjaGVjayIsImV2ZXJ5Iiwic2hpcCIsIlBsYXllciIsInByZXZpb3VzQXR0YWNrcyIsImF0dGFja0FyciIsImlzTmV3IiwiUHViU3ViIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJ1c2VyQ2xpY2siLCJhdHRhY2siLCJkYXRhc2V0IiwicGlja1BsYWNlbWVudCIsImFsZXJ0U2hpcEluZm9DaGFuZ2VzIiwiaW5wdXQiLCJwbGFjZVNoaXBCdG4iLCJzaGlwUGxhY2VCdG4iLCJjcmVhdGVDb29yQXJyIiwiYXJyIiwidGlsZU51bSIsIlNoaXAiLCJ0aW1lc0hpdCIsInB1Ymxpc2hEb21EYXRhIiwiZ2FtZUJvYXJkRGl2Q29tcHV0ZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGlkZUZvcm0iLCJmb3JtIiwic2hvd0NvbXBCb2FyZCIsImNvbXBCb2FyZCIsInJlbW92ZSIsImF0dGFja1N0YWdlIiwiaW5pdEF0dGFja1N0YWdlVGlsZXMiLCJjcmVhdGVOZXdHYW1lQnRuIiwiYnRuIiwidGV4dENvbnRlbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsImNyZWF0ZUdhbWVPdmVyQWxlcnQiLCJoMSIsImgzIiwic2hvd0dhbWVPdmVyIiwibWFpbiIsIm5vdGlmaWNhdGlvbiIsImhpZGVDb21wQm9hcmQiLCJjb21wdXRlckJvYXJkIiwicGxhY2VtZW50U3RhZ2UiLCJhZGRJbnB1dExpc3RlbmVycyIsImZvcm1JbnB1dHMiLCJhZGRCdG5MaXN0ZW5lciIsImNyZWF0ZVBsYWNlbWVudFRpbGVzIiwiZ2FtZUJvYXJkRGl2VXNlciIsImNvbXB1dGVyQXR0YWNrIiwiaGFuZGxlQ29tcHV0ZXJBdHRhY2siLCJ1c2VyQXR0YWNrIiwiaGFuZGxlVXNlckF0dGFjayIsInNoaXBJbmZvIiwidmFsaWRpdHlWaWV3cyIsImNyZWF0ZVNoaXAiLCJjcmVhdGVTaGlwVmlldyIsIlNoaXBJbmZvIiwiQ29tcHV0ZXJHYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJpbml0Q29tcEdCIiwiY29tcHV0ZXIiLCJjb21wdXRlclZpZXdVcGRhdGVyIiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsInRvU3RyaW5nIiwiVXNlckdhbWVCb2FyZCIsImNhbGNNYXgiLCJtYXgiLCJjaGFyQXQiLCJjYWxjTGVuZ3RoIiwiaXNUb29CaWciLCJzaGlwTGVuZ3RoIiwiaXNWYWxpZCIsInZhbGlkIiwicHVibGlzaFZhbGlkaXR5IiwicHVibGlzaFBsYWNlU2hpcCIsImluaXRVc2VyQm9hcmQiLCJ1c2VyQm9hcmQiLCJpbml0SGFuZGxlQXR0YWNrIiwiR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyIiwiaGlkZVJhZGlvIiwicmFkaW9JbnB1dCIsInJhZGlvTGFiZWwiLCJuZXh0U2hpcENoZWNrZWQiLCJyYWRpbyIsImNoZWNrZWQiLCJjbGVhclZhbGlkaXR5VmlldyIsInJlbW92ZUF0dHJpYnV0ZSIsImhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyIsImhhbmRsZVBsYWNlbWVudFZpZXciLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIl0sInNvdXJjZVJvb3QiOiIifQ==