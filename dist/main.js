/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/common/create-tiles/create-tiles.js":
/*!************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tiles.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* creates single tile with event listener */

function createTile(id, callback) {
  const tile = document.createElement("div");
  tile.classList.add("gameboard__tile");
  tile.setAttribute("data-id", id);
  tile.addEventListener("click", callback);
  return tile;
}

/* creates 100 tiles with event listeners */

function createTiles(div, callback) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild(createTile(i, callback));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (createTiles);

/***/ }),

/***/ "./src/components/common/gameboard/gameboard-view.js":
/*!***********************************************************!*\
  !*** ./src/components/common/gameboard/gameboard-view.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");

class GameBoardView {
  /* string is used to query the correct gameboard, is computer or user */

  constructor(string) {
    if (string !== "computer" && string !== "user") {
      throw new Error("GameBoardView created with incorrect string");
    } else {
      this.string = string;
    }
  }

  /* updates tiles classes from hit to sunk */

  static updateSunk(tile) {
    if (tile.classList.contains("hit")) {
      tile.classList.replace("hit", "sunk");
    } else {
      tile.classList.add("sunk");
    }
  }

  /* gets tile status */

  static getStatus(obj) {
    return obj.hit ? "hit" : "miss";
  }

  /* query tile based on string and data-id */

  queryTile = dataId => document.querySelector(`.gameboard--${this.string} [data-id="${dataId}"]`);

  /* once a ship is sunk replaces the hit class with sunk class on all the ships tiles */

  updateSunkTiles(obj) {
    obj.tiles.forEach(element => {
      const tile = this.queryTile(element);
      GameBoardView.updateSunk(tile);
    });
  }

  /* labels tiles with hit, miss, sunk, classes. If all ship's sunk publishes the string to initialize game over pub sub */

  handleAttackView = obj => {
    if (obj.sunk) {
      this.updateSunkTiles(obj);
      if (obj.gameover) {
        _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_0__.gameover.publish(this.string);
      }
    } else {
      const tile = this.queryTile(obj.tile);
      tile.classList.add(GameBoardView.getStatus(obj));
    }
  };
}
/* harmony default export */ __webpack_exports__["default"] = (GameBoardView);

/***/ }),

/***/ "./src/components/common/gameboard/gameboard.js":
/*!******************************************************!*\
  !*** ./src/components/common/gameboard/gameboard.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class GameBoard {
  /* the pub sub responsible for handling the opponents attack */

  constructor(pubSub) {
    this.pubSub = pubSub;
  }
  shipsArr = [];
  missedArr = [];

  /* property accessor for shipsArr */

  get ships() {
    return this.shipsArr;
  }

  /* property accessor for shipsArr, accepts both arrays and single objects */

  set ships(value) {
    if (Array.isArray(value)) {
      this.shipsArr = this.shipsArr.concat(value);
    } else {
      this.shipsArr.push(value);
    }
  }

  /* property accessors for missedArr */

  get missed() {
    return this.missedArr;
  }
  set missed(value) {
    if (this.missed.includes(value)) {
      throw new Error("The same tile was attacked twice!");
    }
    this.missedArr.push(value);
  }

  /* checks if coordinates already have a ship on them */

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

  /* returns true if a ship is already placed on tiles neighboring passed coordinates */

  isNeighboring(coordinates, direction) {
    let coordinatesAllNeighbors = [];
    if (direction === "horizontal") {
      // Horizontal Placement
      /* LEFT and RIGHT */
      if (coordinates[0] % 10 === 1) {
        // left border only adds tile on the right
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 1] + 1);
      } else if (coordinates[coordinates.length - 1] % 10 === 0) {
        // right border only adds tile on the left
        coordinatesAllNeighbors.push(coordinates[0] - 1);
      } else {
        // neither the left or right border, adds both left and right tiles
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 1] + 1, coordinates[0] - 1);
      }
      /* TOP and BOTTOM */
      coordinatesAllNeighbors = coordinatesAllNeighbors.concat(
      // no checks for top and bottom borders, since impossible to place ship outside the grid
      coordinates.map(coor => coor + 10), coordinates.map(coor => coor - 10));
    } else {
      // Vertical Placement
      /* LEFT and RIGHT */
      if (coordinates[0] % 10 === 1) {
        // left border only adds tiles on the right
        coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 1));
      } else if (coordinates[0] % 10 === 0) {
        // right border only adds tiles on the left
        coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor - 1));
      } else {
        // neither the left or right border, adds both left and right tiles
        coordinatesAllNeighbors = coordinatesAllNeighbors.concat(coordinates.map(coor => coor + 1), coordinates.map(coor => coor - 1));
      }
      /* TOP and BOTTOM */
      if (coordinates[0] < 11) {
        // top border, adds only bottom tile
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 1] + 10);
      } else if (coordinates[coordinates.length - 1] > 90) {
        // bottom border, adds only top tile
        coordinatesAllNeighbors.push(coordinates[0] - 10);
      } else {
        // neither top or bottom border, adds the top and bottom tile
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 10] + 1, coordinates[0] - 10);
      }
    }
    /* if ship placed on neighboring tiles returns true */
    return this.isTaken(coordinatesAllNeighbors);
  }

  /* checks if the the tile num selected by opponent has a ship, if hit checks if ship is sunk, if sunk checks if game is over, else adds tile num to missed array  */

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
    this.missed = num;
    return this.pubSub.publish({
      tile: num,
      hit: false,
      sunk: false
    });
  };

  /* called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */

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
/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ "./src/components/common/create-tiles/create-tiles.js");
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
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_7__["default"])(gameBoardDivComputer, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_8__.attack);
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
/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ "./src/components/common/create-tiles/create-tiles.js");
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
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.pickPlacement);
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
/* harmony import */ var _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard-view */ "./src/components/common/gameboard/gameboard-view.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");


const computer = "computer";
const computerViewUpdater = new _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__["default"](computer);
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
/* harmony import */ var _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard-view */ "./src/components/common/gameboard/gameboard-view.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");




class GameBoardUserViewUpdater extends _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__["default"] {
  btn = document.querySelector(".placement-form__place-btn");

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
    return operators[Math.floor(Math.random() * operators.length)].method(coordinate, sides[Math.floor(Math.random() * sides.length)]); // generates the data num of a random side (horizontal left = hit coordinate - 1 / vertical bottom = hit coordinate +10 etc.)
  }

  attack = () => {
    let num;
    /* A) if a ship was found, but was only hit once, so it is unknown whether its horizontal or vertical */
    if (this.foundShip.coordinates.length === 1) {
      num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]);
      while (!super.isNew(num) || num > 100 || num < 1) {
        num = ComputerPlayer.randomSideAttack(this.foundShip.coordinates[0]); // if the generated num was already attacked, or it's too big or too small to be on the board, it generates the num again
      }
      /* B) if a ship was found, and was hit more than once, with the last attack also being a hit */
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === true) {
      /* B)1. if the end of the ship was not found */
      if (this.foundShip.endFound === false) {
        const newCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
        const prevCoor = this.foundShip.coordinates[this.foundShip.coordinates.length - 2];
        const coorDiff = this.foundShip.difference;
        if (newCoor > prevCoor) {
          num = newCoor + coorDiff;
        } else if (newCoor < prevCoor) {
          num = newCoor - coorDiff;
        }
        if (num > 100 || num < 1 || !super.isNew(num)) {
          // for edge cases, and situations in which the end tile was already attacked
          this.foundShip.endFound = true;
          this.foundShip.end = newCoor;
          this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
          if (this.foundShip.end === this.foundShip.coordinates[0]) {
            num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + coorDiff;
          } else {
            num = this.foundShip.coordinates[0] - coorDiff;
          }
        }
        /* B)2. if the end of the ship was found */
      } else if (this.foundShip.endFound === true) {
        const coorDiff = this.foundShip.difference;
        this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
        if (this.foundShip.end === this.foundShip.coordinates[0]) {
          num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + coorDiff;
        } else {
          num = this.foundShip.coordinates[0] - coorDiff;
        }
      }
      /* C) if a ship was found, and was hit more than once, with the last attack being a miss */
    } else if (this.foundShip.coordinates.length > 1 && this.foundShip.hit === false) {
      this.foundShip.endFound = true;
      this.foundShip.end = this.foundShip.coordinates[this.foundShip.coordinates.length - 1];
      this.foundShip.coordinates = this.foundShip.coordinates.sort((a, b) => a - b);
      if (this.foundShip.end === this.foundShip.coordinates[0]) {
        num = this.foundShip.coordinates[this.foundShip.coordinates.length - 1] + this.foundShip.difference;
      } else {
        num = this.foundShip.coordinates[0] - this.foundShip.difference;
      }
      /* D) ship was not found */
    } else {
      num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      while (!super.isNew(num) || num < 70) {
        num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__["default"])(101);
      }
    }
    /* Publish and Add to arr */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3BsYXllci9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL2NyZWF0ZS1jb29yZGluYXRlcy1hcnIvY3JlYXRlLWNvb3ItYXJyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tYXR0YWNrLXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9nZXQtcmFuZG9tLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBjcmVhdGVzIHNpbmdsZSB0aWxlIHdpdGggZXZlbnQgbGlzdGVuZXIgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG4vKiBjcmVhdGVzIDEwMCB0aWxlcyB3aXRoIGV2ZW50IGxpc3RlbmVycyAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUaWxlcztcbiIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5jbGFzcyBHYW1lQm9hcmRWaWV3IHtcblxuICAvKiBzdHJpbmcgaXMgdXNlZCB0byBxdWVyeSB0aGUgY29ycmVjdCBnYW1lYm9hcmQsIGlzIGNvbXB1dGVyIG9yIHVzZXIgKi9cblxuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHsgIFxuICAgIGlmIChzdHJpbmcgIT09IFwiY29tcHV0ZXJcIiAmJiBzdHJpbmcgIT09IFwidXNlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lQm9hcmRWaWV3IGNyZWF0ZWQgd2l0aCBpbmNvcnJlY3Qgc3RyaW5nXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qIHVwZGF0ZXMgdGlsZXMgY2xhc3NlcyBmcm9tIGhpdCB0byBzdW5rICovXG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgLyogZ2V0cyB0aWxlIHN0YXR1cyAqL1xuXG4gIHN0YXRpYyBnZXRTdGF0dXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai5oaXQgPyBcImhpdFwiIDogXCJtaXNzXCI7XG4gIH1cblxuICAvKiBxdWVyeSB0aWxlIGJhc2VkIG9uIHN0cmluZyBhbmQgZGF0YS1pZCAqL1xuXG4gIHF1ZXJ5VGlsZSA9IGRhdGFJZCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZGF0YUlkfVwiXWApXG5cbiAgLyogb25jZSBhIHNoaXAgaXMgc3VuayByZXBsYWNlcyB0aGUgaGl0IGNsYXNzIHdpdGggc3VuayBjbGFzcyBvbiBhbGwgdGhlIHNoaXBzIHRpbGVzICovXG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUoZWxlbWVudCk7XG4gICAgICBHYW1lQm9hcmRWaWV3LnVwZGF0ZVN1bmsodGlsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiBsYWJlbHMgdGlsZXMgd2l0aCBoaXQsIG1pc3MsIHN1bmssIGNsYXNzZXMuIElmIGFsbCBzaGlwJ3Mgc3VuayBwdWJsaXNoZXMgdGhlIHN0cmluZyB0byBpbml0aWFsaXplIGdhbWUgb3ZlciBwdWIgc3ViICovXG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgICBpZiAob2JqLmdhbWVvdmVyKSB7XG4gICAgICAgIGluaXQuZ2FtZW92ZXIucHVibGlzaCh0aGlzLnN0cmluZylcbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnF1ZXJ5VGlsZShvYmoudGlsZSk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlldy5nZXRTdGF0dXMob2JqKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZFZpZXc7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIC8qIHRoZSBwdWIgc3ViIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgb3Bwb25lbnRzIGF0dGFjayAqL1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIgKi9cblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIsIGFjY2VwdHMgYm90aCBhcnJheXMgYW5kIHNpbmdsZSBvYmplY3RzICovXG5cbiAgc2V0IHNoaXBzKHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnNoaXBzQXJyID0gdGhpcy5zaGlwc0Fyci5jb25jYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNoaXBzQXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29ycyBmb3IgbWlzc2VkQXJyICovXG5cbiAgZ2V0IG1pc3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5taXNzZWRBcnI7XG4gIH1cblxuICBzZXQgbWlzc2VkKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubWlzc2VkLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yIChcIlRoZSBzYW1lIHRpbGUgd2FzIGF0dGFja2VkIHR3aWNlIVwiKVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiBjb29yZGluYXRlcyBhbHJlYWR5IGhhdmUgYSBzaGlwIG9uIHRoZW0gKi9cblxuICBpc1Rha2VuKGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIHJldHVybnMgdHJ1ZSBpZiBhIHNoaXAgaXMgYWxyZWFkeSBwbGFjZWQgb24gdGlsZXMgbmVpZ2hib3JpbmcgcGFzc2VkIGNvb3JkaW5hdGVzICovXG5cbiAgaXNOZWlnaGJvcmluZyhjb29yZGluYXRlcywgZGlyZWN0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIC8vIEhvcml6b250YWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyByaWdodCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgLy8gbm8gY2hlY2tzIGZvciB0b3AgYW5kIGJvdHRvbSBib3JkZXJzLCBzaW5jZSBpbXBvc3NpYmxlIHRvIHBsYWNlIHNoaXAgb3V0c2lkZSB0aGUgZ3JpZFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxMCksXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEwKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVmVydGljYWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGVzIG9uIHRoZSByaWdodFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdGhlIGxlZnQgb3IgcmlnaHQgYm9yZGVyLCBhZGRzIGJvdGggbGVmdCBhbmQgcmlnaHQgdGlsZXNcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSksXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gPCAxMSkge1xuICAgICAgICAvLyB0b3AgYm9yZGVyLCBhZGRzIG9ubHkgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEwKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPiA5MCkge1xuICAgICAgICAvLyBib3R0b20gYm9yZGVyLCBhZGRzIG9ubHkgdG9wIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdG9wIG9yIGJvdHRvbSBib3JkZXIsIGFkZHMgdGhlIHRvcCBhbmQgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxMF0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMTBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogaWYgc2hpcCBwbGFjZWQgb24gbmVpZ2hib3JpbmcgdGlsZXMgcmV0dXJucyB0cnVlICovXG4gICAgcmV0dXJuIHRoaXMuaXNUYWtlbihjb29yZGluYXRlc0FsbE5laWdoYm9ycyk7XG4gIH1cblxuICAvKiBjaGVja3MgaWYgdGhlIHRoZSB0aWxlIG51bSBzZWxlY3RlZCBieSBvcHBvbmVudCBoYXMgYSBzaGlwLCBpZiBoaXQgY2hlY2tzIGlmIHNoaXAgaXMgc3VuaywgaWYgc3VuayBjaGVja3MgaWYgZ2FtZSBpcyBvdmVyLCBlbHNlIGFkZHMgdGlsZSBudW0gdG8gbWlzc2VkIGFycmF5ICAqL1xuXG4gIGhhbmRsZUF0dGFjayA9IChudW0pID0+IHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKCtudW0pKSB7XG4gICAgICAgIHRoaXMuc2hpcHNbeV0uaGl0KCk7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmlzU3VuaygpKSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgICAgaGl0OiB0cnVlLFxuICAgICAgICAgICAgc3VuazogdHJ1ZSxcbiAgICAgICAgICAgIHRpbGVzOiB0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNPdmVyKClcbiAgICAgICAgICAgID8gdGhpcy5wdWJTdWIucHVibGlzaCh7IC4uLm9iaiwgLi4ueyBnYW1lb3ZlcjogdHJ1ZSB9IH0pXG4gICAgICAgICAgICA6IHRoaXMucHViU3ViLnB1Ymxpc2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiB0cnVlLCBzdW5rOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5taXNzZWQgPSBudW07XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogY2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlU2hpcEJ0bigpIHtcbiAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXMsIHBsYWNlU2hpcEJ0bn07XG4iLCJcbi8qIENyZWF0ZXMgYSBjb29yZGluYXRlIGFyciBmb3IgYSBzaGlwIG9iamVjdCdzIGNvb3JkaW5hdGVzIHByb3BlcnR5IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gIGNvbnN0IGFyciA9IFsrb2JqLnRpbGVOdW1dXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvb3JBcnI7XG4iLCJpbXBvcnQgY3JlYXRlQ29vckFyciBmcm9tIFwiLi9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyclwiO1xuXG4vKiBDcmVhdGVzIHNoaXAgb2JqZWN0IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBjcmVhdGVDb29yQXJyKG9iaik7XG4gIH1cblxuICB0aW1lc0hpdCA9IDA7XG5cbiAgc3VuayA9IGZhbHNlO1xuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMudGltZXNIaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuXG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5cbmNvbnN0IGdhbWVCb2FyZERpdkNvbXB1dGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLWNvbXB1dGVyXCIpO1xuXG4vKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmQtLXVzZXIgLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgIHRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLnBpY2tQbGFjZW1lbnQpO1xuICB9KTtcbn1cblxuLyogaGlkZXMgdGhlIGZvcm0gKi9cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybVwiKTtcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRG9tRGF0YS5hdHRhY2spO1xufVxuXG4vKiBDcmVhdGVzIGdhbWVvdmVyIG5vdGlmaWNhdGlvbiBhbmQgbmV3IGdhbWUgYnRuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0dhbWVCdG4oKSB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICBidG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0IE5ldyBHYW1lXCI7XG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSk7XG4gIHJldHVybiBidG47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvblwiKTtcblxuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgaDEuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2hlYWRpbmdcIik7XG4gIGgxLnRleHRDb250ZW50ID0gXCJHQU1FIE9WRVJcIjtcbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcblxuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICBzdHJpbmcgPT09IFwidXNlclwiXG4gICAgPyAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBMT1NUXCIpXG4gICAgOiAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBXT05cIik7XG4gIGRpdi5hcHBlbmRDaGlsZChoMyk7XG4gIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVOZXdHYW1lQnRuKCkpO1xuICByZXR1cm4gZGl2O1xufVxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRBdHRhY2tTdGFnZVRpbGVzKTtcbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGhpZGVGb3JtKTtcbmluaXQuZ2FtZW92ZXIuc3Vic2NyaWJlKHNob3dHYW1lT3Zlcik7XG4iLCJpbXBvcnQgY3JlYXRlVGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKTtcblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcyk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycyk7XG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEucGxhY2VTaGlwQnRuKTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpO1xuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZW1lbnRUaWxlcygpIHtcbiAgY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuICBjcmVhdGVUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoY3JlYXRlUGxhY2VtZW50VGlsZXMpO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7Y29tcHV0ZXJBdHRhY2ssIGhhbmRsZUNvbXB1dGVyQXR0YWNrfSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgdXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlVXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayx9O1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBjcmVhdGVTaGlwSW5mbygpIHB1Ymxpc2hlcyBhIHNoaXBJbmZvIG9iai4gZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBpcyBzdWJzY3JpYmVkIGFuZCBjaGVja3Mgd2hldGhlciBhIHNoaXAgY2FuIGJlIHBsYWNlZCB0aGVyZSAqL1xuY29uc3Qgc2hpcEluZm8gPSBuZXcgUHViU3ViKCk7XG5cbi8qIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgcHVibGlzaGVzIGFuIG9iaiB3aXRoIGEgYm9vLiB2YWxpZCBwcm9wZXJ0eSBhbmQgYSBsaXN0IG9mIGNvb3JkaW5hdGVzLiAgICovXG5jb25zdCB2YWxpZGl0eVZpZXdzID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuIHBsYWNlIHNoaXAgYnRuIGlzIHByZXNzZWQgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgd2lsbCBjcmVhdGUgc2hpcEluZm8gICovXG5jb25zdCBzaGlwUGxhY2VCdG4gPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIGNyZWF0ZXMgdGhlIHNoaXBJbmZvLiBUaGUgZ2FtZWJvYXJkLnBsYWNlU2hpcCAgKi9cbmNvbnN0IGNyZWF0ZVNoaXAgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFVzZXJHYW1lQm9hcmQucHVibGlzaFBsYWNlU2hpcCBwdWJsaXNoZXMgc2hpcCBjb29yZGluYXRlcy4gR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyLmhhbmRsZVBsYWNlbWVudFZpZXcgYWRkcyBwbGFjZW1lbnQtc2hpcCBjbGFzcyB0byB0aWxlcyAgKi9cbmNvbnN0IGNyZWF0ZVNoaXBWaWV3ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0LCBzaGlwSW5mbywgdmFsaWRpdHlWaWV3cywgc2hpcFBsYWNlQnRuLCBjcmVhdGVTaGlwLCBjcmVhdGVTaGlwVmlld30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBwbGFjZW1lbnQgc3RhZ2UgKi9cblxuY29uc3QgcGxhY2VtZW50U3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBhdHRhY2sgc3RhZ2UgKi9cblxuY29uc3QgYXR0YWNrU3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIGdhbWUgb3ZlciBkaXYgKi9cblxuY29uc3QgZ2FtZW92ZXIgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IGF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSwgZ2FtZW92ZXIgfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IFNoaXBJbmZvIGZyb20gXCIuL3NoaXAtaW5mby9zaGlwLWluZm9cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cblxuY2xhc3MgQ29tcHV0ZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuICAvKiBSZWNyZWF0ZXMgYSByYW5kb20gc2hpcCwgdW50aWwgaXRzIGNvb3JkaW5hdGVzIGFyZSBub3QgdGFrZW4uICovXG5cbiAgcGxhY2VTaGlwKGxlbmd0aCkge1xuICAgIGxldCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIHdoaWxlICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5pc05laWdoYm9yaW5nKHNoaXAuY29vcmRpbmF0ZXMsIHNoaXAuZGlyZWN0aW9uKSApIHtcbiAgICAgIHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgICBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q29tcEdCKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJHYW1lQm9hcmQoaGFuZGxlVXNlckF0dGFjayk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNSk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMyk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMik7XG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3VXBkYXRlciA9IG5ldyBHYW1lQm9hcmRWaWV3KGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBDcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBVc2VyR2FtZUJvYXJkLmNhbGNNYXgob2JqKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gVXNlckdhbWVCb2FyZC5jYWxjTGVuZ3RoKG9iaik7XG4gICAgaWYgKG9iai50aWxlTnVtICsgc2hpcExlbmd0aCA8PSBtYXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1ZhbGlkID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIGlmICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5jb25zdHJ1Y3Rvci5pc1Rvb0JpZyhvYmopIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJCb2FyZCgpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFVzZXJCb2FyZCgpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlldyBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlld1wiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyIGV4dGVuZHMgR2FtZUJvYXJkVmlldyB7XG4gIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIHJhZGlvIGlucHV0IGZvciB0aGF0IHNoaXAgaXMgaGlkZGVuICovXG4gIHN0YXRpYyBoaWRlUmFkaW8ob2JqKSB7XG4gICAgY29uc3QgcmFkaW9JbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzaGlwLSR7b2JqLmxlbmd0aH1gKTtcbiAgICByYWRpb0lucHV0LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgY29uc3QgcmFkaW9MYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoW2BbZm9yPVwic2hpcC0ke29iai5sZW5ndGh9XCJdYF0pO1xuICAgIHJhZGlvTGFiZWwuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfVxuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgbmV4dCByYWRpbyBpbnB1dCBpcyBjaGVja2VkIHNvIHRoYXQgeW91IGNhbid0IHBsYWNlIHR3byBvZiB0aGUgc2FtZSBzaGlwcyB0d2ljZSxcbiAgICAgd2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBzaGlwcyB0byBwbGFjZSBuZXh0U2hpcENoZWNrZWQgd2lsbCBpbml0aWFsaXplIHRoZSBhdHRhY2sgc3RhZ2UgKi9cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKTtcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiBDbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cbiAgY2xlYXJWYWxpZGl0eVZpZXcgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgIH0pO1xuICAgIHRoaXMuYnRuLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICB9O1xuXG4gIC8qIGFkZHMgdGhlIHZpc3VhbCBjbGFzcyBwbGFjZW1lbnQtLXZhbGlkL29yIHBsYWNlbWVudC0taW52YWxpZCBiYXNlZCBvbiB0aGUgdGlsZU51bSBjaG9zZW4gYnkgdGhlIHVzZXIsIGRpc2FibGVzIHRoZSBzdWJtaXQgYnRuIGlmIGl0IGZhaWxzIHBsYWNlbWVudCBjaGVjayAqL1xuXG4gIGhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgaWYgKCFvYmoudmFsaWQpIHtcbiAgICAgIHRoaXMuYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIH1cbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG9iai52YWxpZCkge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGhhbmRsZVBsYWNlbWVudFZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIHRoaXMuY29uc3RydWN0b3IuaGlkZVJhZGlvKG9iaik7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5uZXh0U2hpcENoZWNrZWQoKTtcbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1zaGlwXCIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5jb25zdCB1c2VyID0gXCJ1c2VyXCI7XG5cbmNvbnN0IHVzZXJWaWV3VXBkYXRlciA9IG5ldyBHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIodXNlcik7XG5cbmhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlQXR0YWNrVmlldyk7XG51c2VyQ2xpY2sudmFsaWRpdHlWaWV3cy5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5Vmlldyk7XG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlclZpZXdVcGRhdGVyO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi8uLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgZGlzcGxheVJhZGlvVmFsdWUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWVcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgdGlsZU51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy50aWxlTnVtID0gdmFsdWU7XG4gICAgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMoKTtcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKVxuICByZXR1cm4gc2hpcEluZm9cbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7ICBcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KHZhbHVlID0+IHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gcmV0dXJuIGZhbHNlXG4gIH0pXG4gIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgY29uc29sZS5sb2coc2hpcEluZm8pXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXAucHVibGlzaChzaGlwSW5mbyk7IFxuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTsgXG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSlcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuaW1wb3J0IHtcbiAgY29tcHV0ZXJBdHRhY2ssXG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLFxufSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgPT09IGZhbHNlICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgNzApIHtcbiAgICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIFB1Ymxpc2ggYW5kIEFkZCB0byBhcnIgKi9cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgY29uc29sZS5sb2coYHB1Ymxpc2hlZCAke251bX1gKTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVUaWxlIiwiaWQiLCJjYWxsYmFjayIsInRpbGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3JlYXRlVGlsZXMiLCJkaXYiLCJpIiwiYXBwZW5kQ2hpbGQiLCJpbml0IiwiR2FtZUJvYXJkVmlldyIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwiRXJyb3IiLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwicXVlcnlUaWxlIiwiZGF0YUlkIiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsImdhbWVvdmVyIiwicHVibGlzaCIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwibWlzc2VkQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWQiLCJpbmNsdWRlcyIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInkiLCJpc05laWdoYm9yaW5nIiwiZGlyZWN0aW9uIiwiY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMiLCJtYXAiLCJjb29yIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsInVzZXJDbGljayIsImF0dGFjayIsImRhdGFzZXQiLCJwaWNrUGxhY2VtZW50IiwiYWxlcnRTaGlwSW5mb0NoYW5nZXMiLCJpbnB1dCIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsImNyZWF0ZUNvb3JBcnIiLCJhcnIiLCJ0aWxlTnVtIiwiU2hpcCIsInRpbWVzSGl0IiwicHVibGlzaERvbURhdGEiLCJnYW1lQm9hcmREaXZDb21wdXRlciIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicXVlcnlTZWxlY3RvckFsbCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoaWRlRm9ybSIsImZvcm0iLCJzaG93Q29tcEJvYXJkIiwiY29tcEJvYXJkIiwicmVtb3ZlIiwiYXR0YWNrU3RhZ2UiLCJpbml0QXR0YWNrU3RhZ2VUaWxlcyIsImNyZWF0ZU5ld0dhbWVCdG4iLCJidG4iLCJ0ZXh0Q29udGVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJwbGFjZW1lbnRTdGFnZSIsImFkZElucHV0TGlzdGVuZXJzIiwiZm9ybUlucHV0cyIsImFkZEJ0bkxpc3RlbmVyIiwiY3JlYXRlUGxhY2VtZW50VGlsZXMiLCJnYW1lQm9hcmREaXZVc2VyIiwiY29tcHV0ZXJBdHRhY2siLCJoYW5kbGVDb21wdXRlckF0dGFjayIsInVzZXJBdHRhY2siLCJoYW5kbGVVc2VyQXR0YWNrIiwic2hpcEluZm8iLCJ2YWxpZGl0eVZpZXdzIiwiY3JlYXRlU2hpcCIsImNyZWF0ZVNoaXBWaWV3IiwiU2hpcEluZm8iLCJDb21wdXRlckdhbWVCb2FyZCIsInBsYWNlU2hpcCIsImluaXRDb21wR0IiLCJjb21wdXRlciIsImNvbXB1dGVyVmlld1VwZGF0ZXIiLCJnZXRSYW5kb21OdW0iLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJnZXRSYW5kb21UaWxlTnVtIiwidG9TdHJpbmciLCJVc2VyR2FtZUJvYXJkIiwiY2FsY01heCIsIm1heCIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIiLCJoaWRlUmFkaW8iLCJyYWRpb0lucHV0IiwicmFkaW9MYWJlbCIsIm5leHRTaGlwQ2hlY2tlZCIsInJhZGlvIiwiY2hlY2tlZCIsImNsZWFyVmFsaWRpdHlWaWV3IiwicmVtb3ZlQXR0cmlidXRlIiwiaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3IiwiY29vcmRpbmF0ZSIsImhhbmRsZVBsYWNlbWVudFZpZXciLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==