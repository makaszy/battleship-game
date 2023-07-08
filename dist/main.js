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


/* class used to update the DOM based on it's corresponding gameboard */

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
/* player base class */

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
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pub-subs/events */ "./src/components/pub-subs/events.js");









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
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.attackStage.subscribe(showCompBoard);

/* publish the tile's data-id */
function publishDataId() {
  const {
    id
  } = this.dataset;
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_8__.attack.publish(id);
}

/* Creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */
function initAttackStageTiles() {
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_7__["default"])(gameBoardDivComputer, publishDataId);
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
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pub-subs/events */ "./src/components/pub-subs/events.js");
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
    input.addEventListener("click", () => {
      _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.input.publish();
    });
  });
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(addInputListeners);
function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", () => {
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.shipPlaceBtn.publish();
  });
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(addBtnListener);
function publishDataId() {
  const {
    id
  } = this.dataset;
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.pickPlacement.publish(id);
}
function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, publishDataId);
}

/* Removes event listeners from the user gameboard */
function removeEventListeners() {
  const tiles = document.querySelectorAll(".gameboard--user .gameboard__tile");
  tiles.forEach(tile => {
    tile.removeEventListener("click", publishDataId);
  });
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.placementStage.subscribe(createPlacementTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_6__.attackStage.subscribe(removeEventListeners);

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
/* harmony import */ var _utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/display-radio-value */ "./src/utils/display-radio-value.js");



const shipPlacement = {
  tileNum: 0,
  updateNum(value) {
    this.tileNum = value;
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.input.publish();
    ;
  },
  resetNum() {
    this.tileNum = 0;
  }
};
function createShipInfo() {
  const {
    tileNum
  } = shipPlacement;
  const length = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__["default"])("ship");
  const direction = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__["default"])("direction");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBOztBQUVBLFNBQVNBLFVBQVVBLENBQUNDLEVBQUUsRUFBRUMsUUFBUSxFQUFFO0VBQ2hDLE1BQU1DLElBQUksR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzFDRixJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0VBQ3JDSixJQUFJLENBQUNLLFlBQVksQ0FBQyxTQUFTLEVBQUVQLEVBQUUsQ0FBQztFQUNoQ0UsSUFBSSxDQUFDTSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVQLFFBQVEsQ0FBQztFQUN4QyxPQUFPQyxJQUFJO0FBQ2I7O0FBRUE7O0FBRUEsU0FBU08sV0FBV0EsQ0FBQ0MsR0FBRyxFQUFFVCxRQUFRLEVBQUU7RUFDbEMsS0FBSyxJQUFJVSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLElBQUksR0FBRyxFQUFFQSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hDRCxHQUFHLENBQUNFLFdBQVcsQ0FBQ2IsVUFBVSxDQUFDWSxDQUFDLEVBQUVWLFFBQVEsQ0FBQyxDQUFDO0VBQzFDO0FBQ0Y7QUFFQSwrREFBZVEsV0FBVzs7Ozs7Ozs7Ozs7O0FDbkJ1Qjs7QUFFakQ7O0FBRUEsTUFBTUssYUFBYSxDQUFDO0VBRWxCOztFQUVBQyxXQUFXQSxDQUFDQyxNQUFNLEVBQUU7SUFDbEIsSUFBSUEsTUFBTSxLQUFLLFVBQVUsSUFBSUEsTUFBTSxLQUFLLE1BQU0sRUFBRTtNQUM5QyxNQUFNLElBQUlDLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQztJQUNoRSxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNELE1BQU0sR0FBR0EsTUFBTTtJQUN0QjtFQUNGOztFQUVBOztFQUVBLE9BQU9FLFVBQVVBLENBQUNoQixJQUFJLEVBQUU7SUFDdEIsSUFBSUEsSUFBSSxDQUFDRyxTQUFTLENBQUNjLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNsQ2pCLElBQUksQ0FBQ0csU0FBUyxDQUFDZSxPQUFPLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztJQUN2QyxDQUFDLE1BQU07TUFDTGxCLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzVCO0VBQ0Y7O0VBRUE7O0VBRUEsT0FBT2UsU0FBU0EsQ0FBQ0MsR0FBRyxFQUFFO0lBQ3BCLE9BQU9BLEdBQUcsQ0FBQ0MsR0FBRyxHQUFHLEtBQUssR0FBRyxNQUFNO0VBQ2pDOztFQUVBOztFQUVBQyxTQUFTLEdBQUdDLE1BQU0sSUFBSXRCLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FBRSxlQUFjLElBQUksQ0FBQ1YsTUFBTyxjQUFhUyxNQUFPLElBQUcsQ0FBQzs7RUFFaEc7O0VBRUFFLGVBQWVBLENBQUNMLEdBQUcsRUFBRTtJQUNuQkEsR0FBRyxDQUFDTSxLQUFLLENBQUNDLE9BQU8sQ0FBRUMsT0FBTyxJQUFLO01BQzdCLE1BQU01QixJQUFJLEdBQUcsSUFBSSxDQUFDc0IsU0FBUyxDQUFDTSxPQUFPLENBQUM7TUFDcENoQixhQUFhLENBQUNJLFVBQVUsQ0FBQ2hCLElBQUksQ0FBQztJQUNoQyxDQUFDLENBQUM7RUFDSjs7RUFFQTs7RUFFQTZCLGdCQUFnQixHQUFJVCxHQUFHLElBQUs7SUFDMUIsSUFBSUEsR0FBRyxDQUFDVSxJQUFJLEVBQUU7TUFDWixJQUFJLENBQUNMLGVBQWUsQ0FBQ0wsR0FBRyxDQUFDO01BQ3pCLElBQUlBLEdBQUcsQ0FBQ1csUUFBUSxFQUFFO1FBQ2hCcEIsMERBQWEsQ0FBQ3FCLE9BQU8sQ0FBQyxJQUFJLENBQUNsQixNQUFNLENBQUM7TUFDcEM7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNZCxJQUFJLEdBQUcsSUFBSSxDQUFDc0IsU0FBUyxDQUFDRixHQUFHLENBQUNwQixJQUFJLENBQUM7TUFDckNBLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUNRLGFBQWEsQ0FBQ08sU0FBUyxDQUFDQyxHQUFHLENBQUMsQ0FBQztJQUNsRDtFQUNGLENBQUM7QUFDSDtBQUVBLCtEQUFlUixhQUFhOzs7Ozs7Ozs7OztBQzVENUIsTUFBTXFCLFNBQVMsQ0FBQztFQUVkOztFQUVBcEIsV0FBV0EsQ0FBQ3FCLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0QjtFQUVBQyxRQUFRLEdBQUcsRUFBRTtFQUViQyxTQUFTLEdBQUcsRUFBRTs7RUFFZDs7RUFFQSxJQUFJQyxLQUFLQSxDQUFBLEVBQUc7SUFDVixPQUFPLElBQUksQ0FBQ0YsUUFBUTtFQUN0Qjs7RUFFQTs7RUFFQSxJQUFJRSxLQUFLQSxDQUFDQyxLQUFLLEVBQUU7SUFDZixJQUFJQyxLQUFLLENBQUNDLE9BQU8sQ0FBQ0YsS0FBSyxDQUFDLEVBQUU7TUFDeEIsSUFBSSxDQUFDSCxRQUFRLEdBQUcsSUFBSSxDQUFDQSxRQUFRLENBQUNNLE1BQU0sQ0FBQ0gsS0FBSyxDQUFDO0lBQzdDLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ0gsUUFBUSxDQUFDTyxJQUFJLENBQUNKLEtBQUssQ0FBQztJQUMzQjtFQUNGOztFQUVBOztFQUVBLElBQUlLLE1BQU1BLENBQUEsRUFBRztJQUNYLE9BQU8sSUFBSSxDQUFDUCxTQUFTO0VBQ3ZCO0VBRUEsSUFBSU8sTUFBTUEsQ0FBQ0wsS0FBSyxFQUFFO0lBQ2hCLElBQUksSUFBSSxDQUFDSyxNQUFNLENBQUNDLFFBQVEsQ0FBQ04sS0FBSyxDQUFDLEVBQUU7TUFDL0IsTUFBTSxJQUFJdkIsS0FBSyxDQUFFLG1DQUFtQyxDQUFDO0lBQ3ZEO0lBQ0EsSUFBSSxDQUFDcUIsU0FBUyxDQUFDTSxJQUFJLENBQUNKLEtBQUssQ0FBQztFQUM1Qjs7RUFFQTs7RUFFQU8sT0FBT0EsQ0FBQ0MsV0FBVyxFQUFFO0lBQ25CLEtBQUssSUFBSXJDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3FDLFdBQVcsQ0FBQ0MsTUFBTSxFQUFFdEMsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUM5QyxLQUFLLElBQUl1QyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDWCxLQUFLLENBQUNVLE1BQU0sRUFBRUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM3QyxJQUFJLElBQUksQ0FBQ1gsS0FBSyxDQUFDVyxDQUFDLENBQUMsQ0FBQ0YsV0FBVyxDQUFDRixRQUFRLENBQUNFLFdBQVcsQ0FBQ3JDLENBQUMsQ0FBQyxDQUFDLEVBQUU7VUFDdEQsT0FBTyxJQUFJO1FBQ2I7TUFDRjtJQUNGO0lBQ0EsT0FBTyxLQUFLO0VBQ2Q7O0VBRUE7O0VBRUF3QyxhQUFhQSxDQUFDSCxXQUFXLEVBQUVJLFNBQVMsRUFBRTtJQUNwQyxJQUFJQyx1QkFBdUIsR0FBRyxFQUFFO0lBQ2hDLElBQUlELFNBQVMsS0FBSyxZQUFZLEVBQUU7TUFDOUI7TUFDQTtNQUNBLElBQUlKLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQzdCO1FBQ0FLLHVCQUF1QixDQUFDVCxJQUFJLENBQUNJLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3ZFLENBQUMsTUFBTSxJQUFJRCxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDekQ7UUFDQUksdUJBQXVCLENBQUNULElBQUksQ0FBQ0ksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNsRCxDQUFDLE1BQU07UUFDTDtRQUNBSyx1QkFBdUIsQ0FBQ1QsSUFBSSxDQUMxQkksV0FBVyxDQUFDQSxXQUFXLENBQUNDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ3ZDRCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDbkIsQ0FBQztNQUNIO01BQ0E7TUFDQUssdUJBQXVCLEdBQUdBLHVCQUF1QixDQUFDVixNQUFNO01BQ3REO01BQ0FLLFdBQVcsQ0FBQ00sR0FBRyxDQUFFQyxJQUFJLElBQUtBLElBQUksR0FBRyxFQUFFLENBQUMsRUFDcENQLFdBQVcsQ0FBQ00sR0FBRyxDQUFFQyxJQUFJLElBQUtBLElBQUksR0FBRyxFQUFFLENBQ3JDLENBQUM7SUFDSCxDQUFDLE1BQU07TUFDTDtNQUNBO01BQ0EsSUFBSVAsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUU7UUFDN0I7UUFDQUssdUJBQXVCLEdBQUdBLHVCQUF1QixDQUFDVixNQUFNLENBQ3RESyxXQUFXLENBQUNNLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsQ0FBQyxDQUNwQyxDQUFDO01BQ0gsQ0FBQyxNQUFNLElBQUlQLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ3BDO1FBQ0FLLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ1YsTUFBTSxDQUN0REssV0FBVyxDQUFDTSxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FDcEMsQ0FBQztNQUNILENBQUMsTUFBTTtRQUNMO1FBQ0FGLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ1YsTUFBTSxDQUN0REssV0FBVyxDQUFDTSxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUNuQ1AsV0FBVyxDQUFDTSxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLENBQUMsQ0FDcEMsQ0FBQztNQUNIO01BQ0E7TUFDQSxJQUFJUCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3ZCO1FBQ0FLLHVCQUF1QixDQUFDVCxJQUFJLENBQUNJLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ3hFLENBQUMsTUFBTSxJQUFJRCxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuRDtRQUNBSSx1QkFBdUIsQ0FBQ1QsSUFBSSxDQUFDSSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ25ELENBQUMsTUFBTTtRQUNMO1FBQ0FLLHVCQUF1QixDQUFDVCxJQUFJLENBQzFCSSxXQUFXLENBQUNBLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFDeENELFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUNuQixDQUFDO01BQ0g7SUFDRjtJQUNBO0lBQ0EsT0FBTyxJQUFJLENBQUNELE9BQU8sQ0FBQ00sdUJBQXVCLENBQUM7RUFDOUM7O0VBRUE7O0VBRUFHLFlBQVksR0FBSUMsR0FBRyxJQUFLO0lBQ3RCLEtBQUssSUFBSVAsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLElBQUksQ0FBQ1gsS0FBSyxDQUFDVSxNQUFNLEVBQUVDLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDN0MsSUFBSSxJQUFJLENBQUNYLEtBQUssQ0FBQ1csQ0FBQyxDQUFDLENBQUNGLFdBQVcsQ0FBQ0YsUUFBUSxDQUFDLENBQUNXLEdBQUcsQ0FBQyxFQUFFO1FBQzVDLElBQUksQ0FBQ2xCLEtBQUssQ0FBQ1csQ0FBQyxDQUFDLENBQUMzQixHQUFHLENBQUMsQ0FBQztRQUNuQixJQUFJLElBQUksQ0FBQ2dCLEtBQUssQ0FBQ1csQ0FBQyxDQUFDLENBQUNRLE1BQU0sQ0FBQyxDQUFDLEVBQUU7VUFDMUIsTUFBTXBDLEdBQUcsR0FBRztZQUNWQyxHQUFHLEVBQUUsSUFBSTtZQUNUUyxJQUFJLEVBQUUsSUFBSTtZQUNWSixLQUFLLEVBQUUsSUFBSSxDQUFDVyxLQUFLLENBQUNXLENBQUMsQ0FBQyxDQUFDRjtVQUN2QixDQUFDO1VBQ0QsT0FBTyxJQUFJLENBQUNXLE1BQU0sQ0FBQyxDQUFDLEdBQ2hCLElBQUksQ0FBQ3ZCLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO1lBQUUsR0FBR1osR0FBRztZQUFFLEdBQUc7Y0FBRVcsUUFBUSxFQUFFO1lBQUs7VUFBRSxDQUFDLENBQUMsR0FDdEQsSUFBSSxDQUFDRyxNQUFNLENBQUNGLE9BQU8sQ0FBQ1osR0FBRyxDQUFDO1FBQzlCO1FBQ0EsT0FBTyxJQUFJLENBQUNjLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO1VBQUVoQyxJQUFJLEVBQUV1RCxHQUFHO1VBQUVsQyxHQUFHLEVBQUUsSUFBSTtVQUFFUyxJQUFJLEVBQUU7UUFBTSxDQUFDLENBQUM7TUFDbkU7SUFDRjtJQUNBLElBQUksQ0FBQ2EsTUFBTSxHQUFHWSxHQUFHO0lBRWpCLE9BQU8sSUFBSSxDQUFDckIsTUFBTSxDQUFDRixPQUFPLENBQUM7TUFBRWhDLElBQUksRUFBRXVELEdBQUc7TUFBRWxDLEdBQUcsRUFBRSxLQUFLO01BQUVTLElBQUksRUFBRTtJQUFNLENBQUMsQ0FBQztFQUNwRSxDQUFDOztFQUVEOztFQUVBMkIsTUFBTSxHQUFHQSxDQUFBLEtBQU07SUFDYixNQUFNQyxLQUFLLEdBQUcsSUFBSSxDQUFDckIsS0FBSyxDQUFDc0IsS0FBSyxDQUFFQyxJQUFJLElBQUtBLElBQUksQ0FBQzlCLElBQUksS0FBSyxJQUFJLENBQUM7SUFDNUQsT0FBTzRCLEtBQUs7RUFDZCxDQUFDO0FBQ0g7QUFFQSwrREFBZXpCLFNBQVM7Ozs7Ozs7Ozs7O0FDdkp4Qjs7QUFFQSxNQUFNNEIsTUFBTSxDQUFDO0VBRVhDLGVBQWUsR0FBRyxFQUFFO0VBRXBCLElBQUlDLFNBQVNBLENBQUEsRUFBRztJQUNkLE9BQU8sSUFBSSxDQUFDRCxlQUFlO0VBQzdCO0VBRUEsSUFBSUMsU0FBU0EsQ0FBQ3pCLEtBQUssRUFBRTtJQUNuQixJQUFJLENBQUN3QixlQUFlLENBQUNwQixJQUFJLENBQUNKLEtBQUssQ0FBQztFQUNsQztFQUVBMEIsS0FBS0EsQ0FBQzFCLEtBQUssRUFBRTtJQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUN5QixTQUFTLENBQUNuQixRQUFRLENBQUNOLEtBQUssQ0FBQztFQUN4QztBQUNGO0FBRUEsK0RBQWV1QixNQUFNOzs7Ozs7Ozs7OztBQ25CckIsTUFBTUksTUFBTSxDQUFDO0VBQ1hwRCxXQUFXQSxDQUFBLEVBQUU7SUFDWCxJQUFJLENBQUNxRCxXQUFXLEdBQUcsRUFBRTtFQUN2QjtFQUVBQyxTQUFTQSxDQUFDQyxVQUFVLEVBQUU7SUFDcEIsSUFBRyxPQUFPQSxVQUFVLEtBQUssVUFBVSxFQUFDO01BQ2xDLE1BQU0sSUFBSXJELEtBQUssQ0FBRSxHQUFFLE9BQU9xRCxVQUFXLHNEQUFxRCxDQUFDO0lBQzdGO0lBQ0EsSUFBSSxDQUFDRixXQUFXLENBQUN4QixJQUFJLENBQUMwQixVQUFVLENBQUM7RUFDbkM7RUFFQUMsV0FBV0EsQ0FBQ0QsVUFBVSxFQUFFO0lBQ3RCLElBQUcsT0FBT0EsVUFBVSxLQUFLLFVBQVUsRUFBQztNQUNsQyxNQUFNLElBQUlyRCxLQUFLLENBQUUsR0FBRSxPQUFPcUQsVUFBVyxzREFBcUQsQ0FBQztJQUM3RjtJQUNBLElBQUksQ0FBQ0YsV0FBVyxHQUFHLElBQUksQ0FBQ0EsV0FBVyxDQUFDSSxNQUFNLENBQUNDLEdBQUcsSUFBSUEsR0FBRyxLQUFJSCxVQUFVLENBQUM7RUFDdEU7RUFFQXBDLE9BQU9BLENBQUN3QyxPQUFPLEVBQUU7SUFDZixJQUFJLENBQUNOLFdBQVcsQ0FBQ3ZDLE9BQU8sQ0FBQ3lDLFVBQVUsSUFBSUEsVUFBVSxDQUFDSSxPQUFPLENBQUMsQ0FBQztFQUM3RDtBQUNGO0FBRUEsK0RBQWVQLE1BQU07Ozs7Ozs7Ozs7O0FDdkJyQjs7QUFFQSxTQUFTUSxhQUFhQSxDQUFDckQsR0FBRyxFQUFFO0VBQzFCLE1BQU1zRCxHQUFHLEdBQUcsQ0FBQyxDQUFDdEQsR0FBRyxDQUFDdUQsT0FBTyxDQUFDO0VBQzFCLEtBQUssSUFBSWxFLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR1csR0FBRyxDQUFDMkIsTUFBTSxFQUFFdEMsQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN0QyxJQUFJVyxHQUFHLENBQUM4QixTQUFTLEtBQUssWUFBWSxFQUFFO01BQ2xDd0IsR0FBRyxDQUFDaEMsSUFBSSxDQUFDZ0MsR0FBRyxDQUFDakUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDLE1BQU07TUFDTGlFLEdBQUcsQ0FBQ2hDLElBQUksQ0FBQ2dDLEdBQUcsQ0FBQ2pFLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDM0I7RUFDRjtFQUNBLE9BQU9pRSxHQUFHO0FBQ1o7QUFFQSwrREFBZUQsYUFBYTs7Ozs7Ozs7Ozs7O0FDZnlDOztBQUVyRTs7QUFFQSxNQUFNRyxJQUFJLENBQUM7RUFDVC9ELFdBQVdBLENBQUNPLEdBQUcsRUFBRTtJQUNmLElBQUksQ0FBQzJCLE1BQU0sR0FBRyxDQUFDM0IsR0FBRyxDQUFDMkIsTUFBTTtJQUN6QixJQUFJLENBQUNELFdBQVcsR0FBRzJCLG1GQUFhLENBQUNyRCxHQUFHLENBQUM7RUFDdkM7RUFFQXlELFFBQVEsR0FBRyxDQUFDO0VBRVovQyxJQUFJLEdBQUcsS0FBSztFQUVaVCxHQUFHQSxDQUFBLEVBQUc7SUFDSixJQUFJLENBQUN3RCxRQUFRLElBQUksQ0FBQztFQUNwQjtFQUVBckIsTUFBTUEsQ0FBQSxFQUFHO0lBQ1AsSUFBSSxJQUFJLENBQUNxQixRQUFRLEtBQUssSUFBSSxDQUFDOUIsTUFBTSxFQUFFO01BQ2pDLElBQUksQ0FBQ2pCLElBQUksR0FBRyxJQUFJO0lBQ2xCO0lBQ0EsT0FBTyxJQUFJLENBQUNBLElBQUk7RUFDbEI7QUFDRjtBQUVBLCtEQUFlOEMsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMxQjhDO0FBQ1Q7QUFDRTtBQUNkO0FBQ1E7QUFDRjtBQUVIO0FBRWU7QUFDZjtBQUUvQyxNQUFNRyxvQkFBb0IsR0FBRzlFLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFFM0U7QUFDQSxTQUFTd0QsUUFBUUEsQ0FBQSxFQUFHO0VBQ2xCLE1BQU1DLElBQUksR0FBR2hGLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztFQUN0RHlELElBQUksQ0FBQzlFLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUM5QjtBQUVBLFNBQVM4RSxhQUFhQSxDQUFBLEVBQUc7RUFDdkIsTUFBTUMsU0FBUyxHQUFHbEYsUUFBUSxDQUFDdUIsYUFBYSxDQUFDLGdCQUFnQixDQUFDO0VBQzFEMkQsU0FBUyxDQUFDaEYsU0FBUyxDQUFDaUYsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUN0QztBQUVBekUsNkRBQWdCLENBQUN3RCxTQUFTLENBQUNlLGFBQWEsQ0FBQzs7QUFFekM7QUFDQSxTQUFTSSxhQUFhQSxDQUFBLEVBQUc7RUFDdkIsTUFBTTtJQUFDeEY7RUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDeUYsT0FBTztFQUN6QlQsb0RBQWdCLENBQUM5QyxPQUFPLENBQUNsQyxFQUFFLENBQUM7QUFDOUI7O0FBRUE7QUFDQSxTQUFTMkYsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUJsRiw2RUFBVyxDQUFDd0Usb0JBQW9CLEVBQUVPLGFBQWEsQ0FBQztBQUNsRDs7QUFFQTs7QUFFQSxTQUFTSSxnQkFBZ0JBLENBQUEsRUFBRztFQUMxQixNQUFNQyxHQUFHLEdBQUcxRixRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7RUFDNUN5RixHQUFHLENBQUN0RixZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztFQUNsQ3NGLEdBQUcsQ0FBQ0MsV0FBVyxHQUFHLGdCQUFnQjtFQUNsQ0QsR0FBRyxDQUFDckYsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDbEN1RixNQUFNLENBQUNDLFFBQVEsQ0FBQ0MsTUFBTSxDQUFDLENBQUM7RUFDMUIsQ0FBQyxDQUFDO0VBQ0YsT0FBT0osR0FBRztBQUNaO0FBRUEsU0FBU0ssbUJBQW1CQSxDQUFDbEYsTUFBTSxFQUFFO0VBQ25DLE1BQU1OLEdBQUcsR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQ3pDTSxHQUFHLENBQUNMLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0VBRTNDLE1BQU02RixFQUFFLEdBQUdoRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDdkMrRixFQUFFLENBQUM5RixTQUFTLENBQUNDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQztFQUNuRDZGLEVBQUUsQ0FBQ0wsV0FBVyxHQUFHLFdBQVc7RUFDNUJwRixHQUFHLENBQUNFLFdBQVcsQ0FBQ3VGLEVBQUUsQ0FBQztFQUVuQixNQUFNQyxFQUFFLEdBQUdqRyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxJQUFJLENBQUM7RUFDdkNnRyxFQUFFLENBQUMvRixTQUFTLENBQUNDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQztFQUN2RFUsTUFBTSxLQUFLLE1BQU0sR0FDWm9GLEVBQUUsQ0FBQ04sV0FBVyxHQUFHLFVBQVUsR0FDM0JNLEVBQUUsQ0FBQ04sV0FBVyxHQUFHLFNBQVU7RUFDaENwRixHQUFHLENBQUNFLFdBQVcsQ0FBQ3dGLEVBQUUsQ0FBQztFQUNuQjFGLEdBQUcsQ0FBQ0UsV0FBVyxDQUFDZ0YsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0VBQ25DLE9BQU9sRixHQUFHO0FBQ1o7QUFFQSxTQUFTMkYsWUFBWUEsQ0FBQ3JGLE1BQU0sRUFBRTtFQUM1QixNQUFNc0YsSUFBSSxHQUFHbkcsUUFBUSxDQUFDdUIsYUFBYSxDQUFDLE1BQU0sQ0FBQztFQUMzQyxNQUFNNkUsWUFBWSxHQUFHTCxtQkFBbUIsQ0FBQ2xGLE1BQU0sQ0FBQztFQUNoRHNGLElBQUksQ0FBQzFGLFdBQVcsQ0FBQzJGLFlBQVksQ0FBQztBQUNoQztBQUVBMUYsNkRBQWdCLENBQUN3RCxTQUFTLENBQUNzQixvQkFBb0IsQ0FBQztBQUNoRDlFLDZEQUFnQixDQUFDd0QsU0FBUyxDQUFDYSxRQUFRLENBQUM7QUFDcENyRSwwREFBYSxDQUFDd0QsU0FBUyxDQUFDZ0MsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RXlCO0FBQ0w7QUFDUDtBQUNNO0FBQ1Q7QUFDZjtBQUNlO0FBRS9DLFNBQVNHLGFBQWFBLENBQUEsRUFBRztFQUN2QixNQUFNQyxhQUFhLEdBQUd0RyxRQUFRLENBQUN1QixhQUFhLENBQUMsZ0JBQWdCLENBQUM7RUFDOUQrRSxhQUFhLENBQUNwRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDdkM7QUFFQU8sZ0VBQW1CLENBQUN3RCxTQUFTLENBQUNtQyxhQUFhLENBQUM7QUFFNUMsU0FBU0csaUJBQWlCQSxDQUFBLEVBQUc7RUFDM0IsTUFBTUMsVUFBVSxHQUFHekcsUUFBUSxDQUFDMEcsZ0JBQWdCLENBQUMsd0JBQXdCLENBQUM7RUFDdEVELFVBQVUsQ0FBQy9FLE9BQU8sQ0FBRWlGLEtBQUssSUFBSztJQUM1QkEsS0FBSyxDQUFDdEcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07TUFBRXdFLG1EQUFlLENBQUM5QyxPQUFPLENBQUMsQ0FBQztJQUFDLENBQUMsQ0FBQztFQUN0RSxDQUFDLENBQUM7QUFDSjtBQUVBckIsZ0VBQW1CLENBQUN3RCxTQUFTLENBQUNzQyxpQkFBaUIsQ0FBQztBQUVoRCxTQUFTSSxjQUFjQSxDQUFBLEVBQUc7RUFDeEIsTUFBTUMsWUFBWSxHQUFHN0csUUFBUSxDQUFDdUIsYUFBYSxDQUFDLDRCQUE0QixDQUFDO0VBQ3pFc0YsWUFBWSxDQUFDeEcsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU07SUFBRXdFLDBEQUFzQixDQUFDOUMsT0FBTyxDQUFDLENBQUM7RUFBQyxDQUFDLENBQUM7QUFDcEY7QUFFQXJCLGdFQUFtQixDQUFDd0QsU0FBUyxDQUFDMEMsY0FBYyxDQUFDO0FBRTdDLFNBQVN2QixhQUFhQSxDQUFBLEVBQUc7RUFDdkIsTUFBTTtJQUFDeEY7RUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDeUYsT0FBTztFQUN6QlQsMkRBQXVCLENBQUM5QyxPQUFPLENBQUNsQyxFQUFFLENBQUM7QUFFckM7QUFFQSxTQUFTbUgsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTUMsZ0JBQWdCLEdBQUdqSCxRQUFRLENBQUN1QixhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDbkVqQiw2RUFBVyxDQUFDMkcsZ0JBQWdCLEVBQUU1QixhQUFhLENBQUM7QUFDOUM7O0FBRUE7QUFDQSxTQUFTNkIsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTXpGLEtBQUssR0FBR3pCLFFBQVEsQ0FBQzBHLGdCQUFnQixDQUFDLG1DQUFtQyxDQUFDO0VBQzVFakYsS0FBSyxDQUFDQyxPQUFPLENBQUUzQixJQUFJLElBQUs7SUFDdEJBLElBQUksQ0FBQ29ILG1CQUFtQixDQUFDLE9BQU8sRUFBRTlCLGFBQWEsQ0FBQztFQUNsRCxDQUFDLENBQUM7QUFDSjtBQUVBM0UsZ0VBQW1CLENBQUN3RCxTQUFTLENBQUM4QyxvQkFBb0IsQ0FBQztBQUNuRHRHLDZEQUFnQixDQUFDd0QsU0FBUyxDQUFDZ0Qsb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuREQ7QUFFL0MsTUFBTUUsY0FBYyxHQUFHLElBQUlwRCwrREFBTSxDQUFDLENBQUM7QUFFbkMsTUFBTXFELG9CQUFvQixHQUFHLElBQUlyRCwrREFBTSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSk07QUFFL0MsTUFBTXNELFVBQVUsR0FBRyxJQUFJdEQsK0RBQU0sQ0FBQyxDQUFDO0FBRS9CLE1BQU11RCxnQkFBZ0IsR0FBRyxJQUFJdkQsK0RBQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pVO0FBRS9DLE1BQU11QixNQUFNLEdBQUcsSUFBSXZCLCtEQUFNLENBQUMsQ0FBQztBQUUzQixNQUFNK0MsYUFBYSxHQUFHLElBQUkvQywrREFBTSxDQUFDLENBQUM7QUFFbEMsTUFBTTJDLEtBQUssR0FBRyxJQUFJM0MsK0RBQU0sQ0FBQyxDQUFDOztBQUUxQjtBQUNBLE1BQU13RCxRQUFRLEdBQUcsSUFBSXhELCtEQUFNLENBQUMsQ0FBQzs7QUFFN0I7QUFDQSxNQUFNeUQsYUFBYSxHQUFHLElBQUl6RCwrREFBTSxDQUFDLENBQUM7O0FBRWxDO0FBQ0EsTUFBTThDLFlBQVksR0FBRyxJQUFJOUMsK0RBQU0sQ0FBQyxDQUFDOztBQUVqQztBQUNBLE1BQU0wRCxVQUFVLEdBQUcsSUFBSTFELCtEQUFNLENBQUMsQ0FBQzs7QUFFL0I7QUFDQSxNQUFNMkQsY0FBYyxHQUFHLElBQUkzRCwrREFBTSxDQUFDLENBQUM7O0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkIrQzs7QUFFL0M7O0FBRUEsTUFBTXVDLGNBQWMsR0FBRyxJQUFJdkMsK0RBQU0sQ0FBQyxDQUFDOztBQUVuQzs7QUFFQSxNQUFNb0IsV0FBVyxHQUFHLElBQUlwQiwrREFBTSxDQUFDLENBQUM7O0FBRWhDOztBQUVBLE1BQU1sQyxRQUFRLEdBQUcsSUFBSWtDLCtEQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaNEI7QUFDZjtBQUNHO0FBQzhCO0FBQ3pCO0FBR2xELE1BQU02RCxpQkFBaUIsU0FBUzdGLG1FQUFTLENBQUM7RUFDeEM7O0VBRUE4RixTQUFTQSxDQUFDaEYsTUFBTSxFQUFFO0lBQ2hCLElBQUkwRSxRQUFRLEdBQUcsSUFBSUksNERBQVEsQ0FBQzlFLE1BQU0sQ0FBQztJQUNuQyxJQUFJYSxJQUFJLEdBQUcsSUFBSWdCLHlEQUFJLENBQUM2QyxRQUFRLENBQUM7SUFDN0IsT0FBTyxJQUFJLENBQUM1RSxPQUFPLENBQUNlLElBQUksQ0FBQ2QsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDRyxhQUFhLENBQUNXLElBQUksQ0FBQ2QsV0FBVyxFQUFFYyxJQUFJLENBQUNWLFNBQVMsQ0FBQyxFQUFHO01BQzlGdUUsUUFBUSxHQUFHLElBQUlJLDREQUFRLENBQUM5RSxNQUFNLENBQUM7TUFDL0JhLElBQUksR0FBRyxJQUFJZ0IseURBQUksQ0FBQzZDLFFBQVEsQ0FBQztJQUMzQjtJQUNBLElBQUksQ0FBQ3BGLEtBQUssR0FBR3VCLElBQUk7RUFDbkI7QUFDRjtBQUVBLFNBQVNvRSxVQUFVQSxDQUFBLEVBQUc7RUFDbEIsTUFBTXpCLGFBQWEsR0FBRyxJQUFJdUIsaUJBQWlCLENBQUNOLG1FQUFnQixDQUFDO0VBQzdEakIsYUFBYSxDQUFDd0IsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUMxQnhCLGFBQWEsQ0FBQ3dCLFNBQVMsQ0FBQyxDQUFDLENBQUM7RUFDMUJ4QixhQUFhLENBQUN3QixTQUFTLENBQUMsQ0FBQyxDQUFDO0VBQzFCeEIsYUFBYSxDQUFDd0IsU0FBUyxDQUFDLENBQUMsQ0FBQztFQUMxQlIsNkRBQVUsQ0FBQ3BELFNBQVMsQ0FBQ29DLGFBQWEsQ0FBQ2pELFlBQVksQ0FBQztBQUNwRDtBQUVBM0MsNkRBQWdCLENBQUN3RCxTQUFTLENBQUM2RCxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5QjRCO0FBQ0g7QUFFL0QsTUFBTUMsUUFBUSxHQUFHLFVBQVU7QUFFM0IsTUFBTUMsbUJBQW1CLEdBQUcsSUFBSXRILHdFQUFhLENBQUNxSCxRQUFRLENBQUM7QUFFdkRULG1FQUFnQixDQUFDckQsU0FBUyxDQUFDK0QsbUJBQW1CLENBQUNyRyxnQkFBZ0IsQ0FBQztBQUVoRSwrREFBZXFHLG1CQUFtQjs7Ozs7Ozs7Ozs7O0FDVDZCO0FBRS9ELFNBQVNFLGtCQUFrQkEsQ0FBQSxFQUFHO0VBQzVCLE9BQU9ELGlFQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLFlBQVksR0FBRyxVQUFVO0FBQzFEO0FBRUEsK0RBQWVDLGtCQUFrQjs7Ozs7Ozs7Ozs7O0FDTjhCOztBQUUvRDs7QUFFQSxTQUFTQyxnQkFBZ0JBLENBQUN0RixNQUFNLEVBQUVHLFNBQVMsRUFBRTtFQUMzQyxJQUFJQSxTQUFTLEtBQUssWUFBWSxFQUFFO0lBQzlCLE9BQU8sRUFBRWlGLGlFQUFZLENBQUMsRUFBRSxDQUFDLENBQUNHLFFBQVEsQ0FBQyxDQUFDLEdBQUdILGlFQUFZLENBQUMsRUFBRSxHQUFHcEYsTUFBTSxDQUFDLENBQUN1RixRQUFRLENBQUMsQ0FBQyxDQUFDO0VBQzlFO0VBQ0EsT0FBTyxFQUFFSCxpRUFBWSxDQUFDLEVBQUUsR0FBRXBGLE1BQU0sQ0FBQyxDQUFDdUYsUUFBUSxDQUFDLENBQUMsR0FBR0gsaUVBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQ0csUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM3RTtBQUVBLCtEQUFlRCxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7QUNWOEM7QUFDSjtBQUV6RSxNQUFNUixRQUFRLENBQUM7RUFFYmhILFdBQVdBLENBQUNrQyxNQUFNLEVBQUU7SUFDbEIsSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU07SUFDcEIsSUFBSSxDQUFDRyxTQUFTLEdBQUdrRixzRkFBa0IsQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQ3pELE9BQU8sR0FBRzBELG9GQUFnQixDQUFDLElBQUksQ0FBQ3RGLE1BQU0sRUFBRSxJQUFJLENBQUNHLFNBQVMsQ0FBQztFQUM5RDtBQUVGO0FBRUEsK0RBQWUyRSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7O0FDZGtDO0FBQ2Y7QUFDNkM7QUFDdEM7QUFDQztBQUVsRCxNQUFNVSxhQUFhLFNBQVN0RyxtRUFBUyxDQUFDO0VBRXBDO0FBQ0Y7O0VBRUUsT0FBT3VHLE9BQU9BLENBQUNwSCxHQUFHLEVBQUU7SUFDbEIsSUFBSUEsR0FBRyxDQUFDOEIsU0FBUyxLQUFLLFlBQVksSUFBSTlCLEdBQUcsQ0FBQ3VELE9BQU8sR0FBRyxFQUFFLEVBQUU7TUFDdEQsSUFBSXZELEdBQUcsQ0FBQ3VELE9BQU8sR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE9BQU92RCxHQUFHLENBQUN1RCxPQUFPO01BQ3BCO01BQ0EsTUFBTThELEdBQUcsR0FBRyxDQUFFLEdBQUVySCxHQUFHLENBQUN1RCxPQUFPLENBQUMyRCxRQUFRLENBQUMsQ0FBQyxDQUFDSSxNQUFNLENBQUMsQ0FBQyxDQUFFLEdBQUUsR0FBRyxFQUFFO01BQ3hELE9BQU9ELEdBQUc7SUFDWjtJQUNBLE1BQU1BLEdBQUcsR0FBR3JILEdBQUcsQ0FBQzhCLFNBQVMsS0FBSyxZQUFZLEdBQUcsRUFBRSxHQUFHLEdBQUc7SUFDckQsT0FBT3VGLEdBQUc7RUFDWjs7RUFFQTs7RUFFQSxPQUFPRSxVQUFVQSxDQUFDdkgsR0FBRyxFQUFFO0lBQ3JCLE9BQU9BLEdBQUcsQ0FBQzhCLFNBQVMsS0FBSyxZQUFZLEdBQ2pDOUIsR0FBRyxDQUFDMkIsTUFBTSxHQUFHLENBQUMsR0FDZCxDQUFDM0IsR0FBRyxDQUFDMkIsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFO0VBQzNCOztFQUVBOztFQUVBLE9BQU82RixRQUFRQSxDQUFDeEgsR0FBRyxFQUFFO0lBQ25CLE1BQU1xSCxHQUFHLEdBQUdGLGFBQWEsQ0FBQ0MsT0FBTyxDQUFDcEgsR0FBRyxDQUFDO0lBQ3RDLE1BQU15SCxVQUFVLEdBQUdOLGFBQWEsQ0FBQ0ksVUFBVSxDQUFDdkgsR0FBRyxDQUFDO0lBQ2hELElBQUlBLEdBQUcsQ0FBQ3VELE9BQU8sR0FBR2tFLFVBQVUsSUFBSUosR0FBRyxFQUFFO01BQ25DLE9BQU8sS0FBSztJQUNkO0lBQ0EsT0FBTyxJQUFJO0VBQ2I7RUFFQUssT0FBTyxHQUFJMUgsR0FBRyxJQUFLO0lBQ2pCLE1BQU13QyxJQUFJLEdBQUcsSUFBSWdCLHlEQUFJLENBQUN4RCxHQUFHLENBQUM7SUFDMUIsSUFBSSxJQUFJLENBQUN5QixPQUFPLENBQUNlLElBQUksQ0FBQ2QsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDakMsV0FBVyxDQUFDK0gsUUFBUSxDQUFDeEgsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDNkIsYUFBYSxDQUFDVyxJQUFJLENBQUNkLFdBQVcsRUFBRTFCLEdBQUcsQ0FBQzhCLFNBQVMsQ0FBQyxFQUFFO01BQzNILE9BQU87UUFBRTZGLEtBQUssRUFBRSxLQUFLO1FBQUVqRyxXQUFXLEVBQUVjLElBQUksQ0FBQ2Q7TUFBVyxDQUFDO0lBQ3ZEO0lBQ0EsT0FBTztNQUFFaUcsS0FBSyxFQUFFLElBQUk7TUFBRWpHLFdBQVcsRUFBRWMsSUFBSSxDQUFDZDtJQUFZLENBQUM7RUFDdkQsQ0FBQztFQUVEa0csZUFBZSxHQUFJNUgsR0FBRyxJQUFLO0lBQ3pCMEQsMkRBQXVCLENBQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDOEcsT0FBTyxDQUFDMUgsR0FBRyxDQUFDLENBQUM7RUFDcEQsQ0FBQzs7RUFFRDs7RUFFQTJHLFNBQVMsR0FBSTNHLEdBQUcsSUFBSztJQUNuQixNQUFNd0MsSUFBSSxHQUFHLElBQUlnQix5REFBSSxDQUFDeEQsR0FBRyxDQUFDO0lBQzFCLElBQUksQ0FBQ2lCLEtBQUssR0FBR3VCLElBQUk7SUFDakIsT0FBT0EsSUFBSTtFQUNiLENBQUM7RUFFRHFGLGdCQUFnQixHQUFJN0gsR0FBRyxJQUFLO0lBQzFCLE1BQU13QyxJQUFJLEdBQUcsSUFBSSxDQUFDbUUsU0FBUyxDQUFDM0csR0FBRyxDQUFDO0lBQ2hDMEQsNERBQXdCLENBQUM5QyxPQUFPLENBQUM7TUFBQ2MsV0FBVyxFQUFFYyxJQUFJLENBQUNkLFdBQVc7TUFBRUMsTUFBTSxFQUFFYSxJQUFJLENBQUNiO0lBQU0sQ0FBQyxDQUFDO0VBQ3hGLENBQUM7QUFDSDtBQUVBLFNBQVNtRyxhQUFhQSxDQUFBLEVBQUc7RUFDdkIsTUFBTUMsU0FBUyxHQUFHLElBQUlaLGFBQWEsQ0FBQ2pCLDJFQUFvQixDQUFDO0VBQ3pEeEMsc0RBQWtCLENBQUNYLFNBQVMsQ0FBQ2dGLFNBQVMsQ0FBQ0gsZUFBZSxDQUFDO0VBQ3ZEbEUsd0RBQW9CLENBQUNYLFNBQVMsQ0FBQ2dGLFNBQVMsQ0FBQ0YsZ0JBQWdCLENBQUM7RUFDMUQsU0FBU0csZ0JBQWdCQSxDQUFBLEVBQUc7SUFDMUIvQixxRUFBYyxDQUFDbEQsU0FBUyxDQUFDZ0YsU0FBUyxDQUFDN0YsWUFBWSxDQUFDO0VBQ2xEO0VBQ0EzQyw2REFBZ0IsQ0FBQ3dELFNBQVMsQ0FBQ2lGLGdCQUFnQixDQUFDO0FBQzlDO0FBRUFGLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUM5RW1EO0FBQ0s7QUFDcEI7QUFDRDtBQUVsRCxNQUFNRyx3QkFBd0IsU0FBU3pJLHdFQUFhLENBQUM7RUFDbkQrRSxHQUFHLEdBQUcxRixRQUFRLENBQUN1QixhQUFhLENBQUMsNEJBQTRCLENBQUM7O0VBRTFEO0VBQ0EsT0FBTzhILFNBQVNBLENBQUNsSSxHQUFHLEVBQUU7SUFDcEIsTUFBTW1JLFVBQVUsR0FBR3RKLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FBRSxTQUFRSixHQUFHLENBQUMyQixNQUFPLEVBQUMsQ0FBQztJQUNoRXdHLFVBQVUsQ0FBQ3BKLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxNQUFNb0osVUFBVSxHQUFHdkosUUFBUSxDQUFDdUIsYUFBYSxDQUFDLENBQUUsY0FBYUosR0FBRyxDQUFDMkIsTUFBTyxJQUFHLENBQUMsQ0FBQztJQUN6RXlHLFVBQVUsQ0FBQ3JKLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztFQUNwQzs7RUFFQTtBQUNGO0VBQ0UsT0FBT3FKLGVBQWVBLENBQUEsRUFBRztJQUN2QixNQUFNQyxLQUFLLEdBQUd6SixRQUFRLENBQUN1QixhQUFhLENBQUUsNEJBQTJCLENBQUM7SUFDbEUsSUFBSWtJLEtBQUssS0FBSyxJQUFJLEVBQUU7TUFDbEIvSSw2REFBZ0IsQ0FBQ3FCLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUMsTUFBTTtNQUNMMEgsS0FBSyxDQUFDQyxPQUFPLEdBQUcsSUFBSTtJQUN0QjtFQUNGOztFQUVBO0VBQ0FDLGlCQUFpQixHQUFHQSxDQUFBLEtBQU07SUFDeEIsTUFBTWxJLEtBQUssR0FBR3pCLFFBQVEsQ0FBQzBHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0lBQzNEakYsS0FBSyxDQUFDQyxPQUFPLENBQUUzQixJQUFJLElBQUs7TUFDdEJBLElBQUksQ0FBQ0csU0FBUyxDQUFDaUYsTUFBTSxDQUFDLGtCQUFrQixDQUFDO01BQ3pDcEYsSUFBSSxDQUFDRyxTQUFTLENBQUNpRixNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDTyxHQUFHLENBQUNrRSxlQUFlLENBQUMsVUFBVSxDQUFDO0VBQ3RDLENBQUM7O0VBRUQ7O0VBRUFDLDJCQUEyQixHQUFJMUksR0FBRyxJQUFLO0lBQ3JDLElBQUksQ0FBQ3dJLGlCQUFpQixDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDeEksR0FBRyxDQUFDMkgsS0FBSyxFQUFFO01BQ2QsSUFBSSxDQUFDcEQsR0FBRyxDQUFDdEYsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDdkM7SUFDQWUsR0FBRyxDQUFDMEIsV0FBVyxDQUFDbkIsT0FBTyxDQUFFb0ksVUFBVSxJQUFLO01BQ3RDLE1BQU0vSixJQUFJLEdBQUdDLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FDaEMsZUFBYyxJQUFJLENBQUNWLE1BQU8sY0FBYWlKLFVBQVcsSUFDckQsQ0FBQztNQUNELElBQUkzSSxHQUFHLENBQUMySCxLQUFLLEVBQUU7UUFDYi9JLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7TUFDeEMsQ0FBQyxNQUFNO1FBQ0xKLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLENBQUM7TUFDMUM7SUFDRixDQUFDLENBQUM7RUFDSixDQUFDO0VBRUQ0SixtQkFBbUIsR0FBSTVJLEdBQUcsSUFBSztJQUM3QixJQUFJLENBQUN3SSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQy9JLFdBQVcsQ0FBQ3lJLFNBQVMsQ0FBQ2xJLEdBQUcsQ0FBQztJQUMvQixJQUFJLENBQUNQLFdBQVcsQ0FBQzRJLGVBQWUsQ0FBQyxDQUFDO0lBQ2xDckksR0FBRyxDQUFDMEIsV0FBVyxDQUFDbkIsT0FBTyxDQUFFb0ksVUFBVSxJQUFLO01BQ3RDLE1BQU0vSixJQUFJLEdBQUdDLFFBQVEsQ0FBQ3VCLGFBQWEsQ0FDaEMsZUFBYyxJQUFJLENBQUNWLE1BQU8sY0FBYWlKLFVBQVcsSUFDckQsQ0FBQztNQUNEL0osSUFBSSxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztJQUN2QyxDQUFDLENBQUM7RUFDSixDQUFDO0FBQ0g7QUFFQSxNQUFNNkosSUFBSSxHQUFHLE1BQU07QUFFbkIsTUFBTUMsZUFBZSxHQUFHLElBQUliLHdCQUF3QixDQUFDWSxJQUFJLENBQUM7QUFFMUQzQywyRUFBb0IsQ0FBQ25ELFNBQVMsQ0FBQytGLGVBQWUsQ0FBQ3JJLGdCQUFnQixDQUFDO0FBQ2hFaUQsMkRBQXVCLENBQUNYLFNBQVMsQ0FBQytGLGVBQWUsQ0FBQ0osMkJBQTJCLENBQUM7QUFDOUVoRiw0REFBd0IsQ0FBQ1gsU0FBUyxDQUFDK0YsZUFBZSxDQUFDRixtQkFBbUIsQ0FBQztBQUV2RSwrREFBZUUsZUFBZTs7Ozs7Ozs7Ozs7QUM3RTlCLE1BQU1DLFlBQVksQ0FBQztFQUNqQnRKLFdBQVdBLENBQUU4RCxPQUFPLEVBQUU1QixNQUFNLEVBQUVHLFNBQVMsRUFBRTtJQUN2QyxJQUFJLENBQUN5QixPQUFPLEdBQUcsQ0FBQ0EsT0FBTztJQUN2QixJQUFJLENBQUM1QixNQUFNLEdBQUcsQ0FBQ0EsTUFBTTtJQUNyQixJQUFJLENBQUNHLFNBQVMsR0FBR0EsU0FBUztFQUM1QjtBQUNGO0FBRUEsK0RBQWVpSCxZQUFZOzs7Ozs7Ozs7Ozs7OztBQ1JrQjtBQUNNO0FBRWdCO0FBRW5FLE1BQU1FLGFBQWEsR0FBRztFQUNwQjFGLE9BQU8sRUFBRSxDQUFDO0VBQ1YyRixTQUFTQSxDQUFDaEksS0FBSyxFQUFFO0lBQ2YsSUFBSSxDQUFDcUMsT0FBTyxHQUFHckMsS0FBSztJQUNwQndDLG1EQUFlLENBQUM5QyxPQUFPLENBQUMsQ0FBQztJQUFDO0VBQzVCLENBQUM7RUFDRHVJLFFBQVFBLENBQUEsRUFBRztJQUNULElBQUksQ0FBQzVGLE9BQU8sR0FBRyxDQUFDO0VBQ2xCO0FBQ0YsQ0FBQztBQUVELFNBQVM2RixjQUFjQSxDQUFBLEVBQUc7RUFDeEIsTUFBTTtJQUFFN0Y7RUFBUSxDQUFDLEdBQUcwRixhQUFhO0VBQ2pDLE1BQU10SCxNQUFNLEdBQUdxSCxzRUFBaUIsQ0FBQyxNQUFNLENBQUM7RUFDeEMsTUFBTWxILFNBQVMsR0FBR2tILHNFQUFpQixDQUFDLFdBQVcsQ0FBQztFQUNoRCxNQUFNM0MsUUFBUSxHQUFHLElBQUkwQyx1REFBWSxDQUFDeEYsT0FBTyxFQUFFNUIsTUFBTSxFQUFFRyxTQUFTLENBQUM7RUFDN0QsT0FBT3VFLFFBQVE7QUFDakI7QUFFQSxTQUFTZ0Qsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTWhELFFBQVEsR0FBRytDLGNBQWMsQ0FBQyxDQUFDO0VBQ2pDMUYsc0RBQWtCLENBQUM5QyxPQUFPLENBQUN5RixRQUFRLENBQUM7QUFDdEM7QUFFQSxTQUFTaUQscUJBQXFCQSxDQUFBLEVBQUc7RUFDL0IsTUFBTWpELFFBQVEsR0FBRytDLGNBQWMsQ0FBQyxDQUFDO0VBQ2pDLE1BQU1HLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxNQUFNLENBQUNwRCxRQUFRLENBQUMsQ0FBQzlELEtBQUssQ0FBQ3JCLEtBQUssSUFBSTtJQUN4RCxJQUFJQSxLQUFLLEtBQUssSUFBSSxJQUFJQSxLQUFLLEtBQUt3SSxTQUFTLElBQUl4SSxLQUFLLEtBQUssS0FBSyxJQUFJQSxLQUFLLEtBQUssQ0FBQyxFQUFFO01BQzNFLE9BQU8sSUFBSTtJQUNiO0lBQUUsT0FBTyxLQUFLO0VBQ2hCLENBQUMsQ0FBQztFQUNGLElBQUlxSSxVQUFVLEVBQUU7SUFDZEksT0FBTyxDQUFDQyxHQUFHLENBQUN2RCxRQUFRLENBQUM7SUFDckIzQyx3REFBb0IsQ0FBQzlDLE9BQU8sQ0FBQ3lGLFFBQVEsQ0FBQztJQUN0QzRDLGFBQWEsQ0FBQ0UsUUFBUSxDQUFDLENBQUM7RUFDMUI7QUFDRjtBQUVBekYsMkRBQXVCLENBQUNYLFNBQVMsQ0FBQ2tHLGFBQWEsQ0FBQ0MsU0FBUyxDQUFDVyxJQUFJLENBQUNaLGFBQWEsQ0FBQyxDQUFDO0FBRTlFdkYsbURBQWUsQ0FBQ1gsU0FBUyxDQUFDc0csb0JBQW9CLENBQUM7QUFDL0MzRiwwREFBc0IsQ0FBQ1gsU0FBUyxDQUFDdUcscUJBQXFCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Q1A7QUFDUztBQUloQjtBQUNnQjtBQUNQO0FBRWxELE1BQU1RLGNBQWMsU0FBU3JILDZEQUFNLENBQUM7RUFDbENoRCxXQUFXQSxDQUFDcUIsTUFBTSxFQUFFO0lBQ2xCLEtBQUssQ0FBQyxDQUFDO0lBQ1AsSUFBSSxDQUFDQSxNQUFNLEdBQUdBLE1BQU07RUFDdEI7RUFFQWlKLFNBQVMsR0FBRztJQUNWQyxLQUFLLEVBQUUsS0FBSztJQUNaL0osR0FBRyxFQUFFLEtBQUs7SUFDVnlCLFdBQVcsRUFBRSxFQUFFO0lBQ2Z1SSxVQUFVLEVBQUUsSUFBSTtJQUNoQkMsUUFBUSxFQUFFLEtBQUs7SUFDZkMsR0FBRyxFQUFFO0VBQ1AsQ0FBQztFQUVEQyxnQkFBZ0IsR0FBSXBLLEdBQUcsSUFBSztJQUMxQixJQUFJQSxHQUFHLENBQUNVLElBQUksRUFBRTtNQUNaLElBQUksQ0FBQ3FKLFNBQVMsR0FBRztRQUNmQyxLQUFLLEVBQUUsS0FBSztRQUNaL0osR0FBRyxFQUFFLEtBQUs7UUFDVnlCLFdBQVcsRUFBRSxFQUFFO1FBQ2Z1SSxVQUFVLEVBQUUsSUFBSTtRQUNoQkMsUUFBUSxFQUFFO01BQ1osQ0FBQztJQUNILENBQUMsTUFBTSxJQUFJbEssR0FBRyxDQUFDQyxHQUFHLElBQUksSUFBSSxDQUFDOEosU0FBUyxDQUFDQyxLQUFLLEtBQUssS0FBSyxFQUFFO01BQ3BELElBQUksQ0FBQ0QsU0FBUyxDQUFDckksV0FBVyxDQUFDSixJQUFJLENBQUN0QixHQUFHLENBQUNwQixJQUFJLENBQUM7TUFDekMsSUFBSSxDQUFDbUwsU0FBUyxDQUFDOUosR0FBRyxHQUFHLElBQUk7TUFDekIsSUFBSSxDQUFDOEosU0FBUyxDQUFDQyxLQUFLLEdBQUcsSUFBSTtJQUM3QixDQUFDLE1BQU0sSUFBSWhLLEdBQUcsQ0FBQ0MsR0FBRyxJQUFJLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ0MsS0FBSyxLQUFLLElBQUksRUFBRTtNQUNuRCxJQUFJLENBQUNELFNBQVMsQ0FBQzlKLEdBQUcsR0FBRyxJQUFJO01BQ3pCLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQ0osSUFBSSxDQUFDdEIsR0FBRyxDQUFDcEIsSUFBSSxDQUFDO01BQ3pDLElBQUksSUFBSSxDQUFDbUwsU0FBUyxDQUFDRSxVQUFVLEtBQUssSUFBSSxFQUFFO1FBQ3RDLElBQUksQ0FBQ0YsU0FBUyxDQUFDRSxVQUFVLEdBQUdJLElBQUksQ0FBQ0MsR0FBRyxDQUNsQyxJQUFJLENBQUNQLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRzFCLEdBQUcsQ0FBQ3BCLElBQ3RDLENBQUM7TUFDSDtJQUNGLENBQUMsTUFBTSxJQUNMb0IsR0FBRyxDQUFDQyxHQUFHLEtBQUssS0FBSyxJQUNqQixJQUFJLENBQUM4SixTQUFTLENBQUNDLEtBQUssS0FBSyxJQUFJLElBQzdCLElBQUksQ0FBQ0QsU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxFQUNyQztNQUNBLElBQUksQ0FBQ29JLFNBQVMsQ0FBQzlKLEdBQUcsR0FBRyxLQUFLO01BQzFCLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ0csUUFBUSxHQUFHLElBQUk7TUFFOUIsSUFBSSxDQUFDSCxTQUFTLENBQUNJLEdBQUcsR0FDaEIsSUFBSSxDQUFDSixTQUFTLENBQUNySSxXQUFXLENBQUMsSUFBSSxDQUFDcUksU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsTUFBTSxJQUFJM0IsR0FBRyxDQUFDQyxHQUFHLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ0MsS0FBSyxLQUFLLElBQUksRUFBRTtNQUM3RCxJQUFJLENBQUNELFNBQVMsQ0FBQzlKLEdBQUcsR0FBRyxLQUFLO0lBQzVCO0VBQ0YsQ0FBQztFQUVELE9BQU9zSyxnQkFBZ0JBLENBQUM1QixVQUFVLEVBQUU7SUFDbEMsTUFBTTZCLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLE1BQU1DLFNBQVMsR0FBRztJQUNoQjtJQUNBO01BQ0VDLElBQUksRUFBRSxHQUFHO01BQ1RDLE1BQU1BLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxFQUFFO1FBQ1gsT0FBT0QsQ0FBQyxHQUFHQyxDQUFDO01BQ2Q7SUFDRixDQUFDLEVBQ0Q7TUFDRUgsSUFBSSxFQUFFLEdBQUc7TUFDVEMsTUFBTUEsQ0FBQ0MsQ0FBQyxFQUFFQyxDQUFDLEVBQUU7UUFDWCxPQUFPRCxDQUFDLEdBQUdDLENBQUM7TUFDZDtJQUNGLENBQUMsQ0FDRjtJQUNELE9BQU9KLFNBQVMsQ0FBQ0osSUFBSSxDQUFDUyxLQUFLLENBQUNULElBQUksQ0FBQ1UsTUFBTSxDQUFDLENBQUMsR0FBR04sU0FBUyxDQUFDOUksTUFBTSxDQUFDLENBQUMsQ0FBQ2dKLE1BQU0sQ0FDbkVoQyxVQUFVLEVBQ1Y2QixLQUFLLENBQUNILElBQUksQ0FBQ1MsS0FBSyxDQUFDVCxJQUFJLENBQUNVLE1BQU0sQ0FBQyxDQUFDLEdBQUdQLEtBQUssQ0FBQzdJLE1BQU0sQ0FBQyxDQUNoRCxDQUFDLENBQUMsQ0FBQztFQUNMOztFQUVBeUMsTUFBTSxHQUFHQSxDQUFBLEtBQU07SUFDYixJQUFJakMsR0FBRztJQUNQO0lBQ0EsSUFBSSxJQUFJLENBQUM0SCxTQUFTLENBQUNySSxXQUFXLENBQUNDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDM0NRLEdBQUcsR0FBRzJILGNBQWMsQ0FBQ1MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDUixTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDcEUsT0FBTyxDQUFDLEtBQUssQ0FBQ2tCLEtBQUssQ0FBQ1QsR0FBRyxDQUFDLElBQUlBLEdBQUcsR0FBRyxHQUFHLElBQUlBLEdBQUcsR0FBRyxDQUFDLEVBQUU7UUFDaERBLEdBQUcsR0FBRzJILGNBQWMsQ0FBQ1MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDUixTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hFO01BQ0Y7SUFDQSxDQUFDLE1BQU0sSUFDTCxJQUFJLENBQUNxSSxTQUFTLENBQUNySSxXQUFXLENBQUNDLE1BQU0sR0FBRyxDQUFDLElBQ3JDLElBQUksQ0FBQ29JLFNBQVMsQ0FBQzlKLEdBQUcsS0FBSyxJQUFJLEVBQzNCO01BQ0E7TUFDQSxJQUFJLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ0csUUFBUSxLQUFLLEtBQUssRUFBRTtRQUNyQyxNQUFNYyxPQUFPLEdBQ1gsSUFBSSxDQUFDakIsU0FBUyxDQUFDckksV0FBVyxDQUFDLElBQUksQ0FBQ3FJLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQ0MsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuRSxNQUFNc0osUUFBUSxHQUNaLElBQUksQ0FBQ2xCLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQyxJQUFJLENBQUNxSSxTQUFTLENBQUNySSxXQUFXLENBQUNDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkUsTUFBTXVKLFFBQVEsR0FBRyxJQUFJLENBQUNuQixTQUFTLENBQUNFLFVBQVU7UUFDMUMsSUFBSWUsT0FBTyxHQUFHQyxRQUFRLEVBQUU7VUFDdEI5SSxHQUFHLEdBQUc2SSxPQUFPLEdBQUdFLFFBQVE7UUFDMUIsQ0FBQyxNQUFNLElBQUlGLE9BQU8sR0FBR0MsUUFBUSxFQUFFO1VBQzdCOUksR0FBRyxHQUFHNkksT0FBTyxHQUFHRSxRQUFRO1FBQzFCO1FBQ0EsSUFBSS9JLEdBQUcsR0FBRyxHQUFHLElBQUlBLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUNTLEtBQUssQ0FBQ1QsR0FBRyxDQUFDLEVBQUU7VUFBRTtVQUMvQyxJQUFJLENBQUM0SCxTQUFTLENBQUNHLFFBQVEsR0FBRyxJQUFJO1VBQzlCLElBQUksQ0FBQ0gsU0FBUyxDQUFDSSxHQUFHLEdBQUdhLE9BQU87VUFDNUIsSUFBSSxDQUFDakIsU0FBUyxDQUFDckksV0FBVyxHQUFHLElBQUksQ0FBQ3FJLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQ3lKLElBQUksQ0FDMUQsQ0FBQ1AsQ0FBQyxFQUFFQyxDQUFDLEtBQUtELENBQUMsR0FBR0MsQ0FDaEIsQ0FBQztVQUNELElBQUksSUFBSSxDQUFDZCxTQUFTLENBQUNJLEdBQUcsS0FBSyxJQUFJLENBQUNKLFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN4RFMsR0FBRyxHQUNELElBQUksQ0FBQzRILFNBQVMsQ0FBQ3JJLFdBQVcsQ0FDeEIsSUFBSSxDQUFDcUksU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUN0QyxHQUFHdUosUUFBUTtVQUNoQixDQUFDLE1BQU07WUFDTC9JLEdBQUcsR0FBRyxJQUFJLENBQUM0SCxTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUd3SixRQUFRO1VBQ2hEO1FBQ0Y7UUFDRjtNQUNBLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQ25CLFNBQVMsQ0FBQ0csUUFBUSxLQUFLLElBQUksRUFBRTtRQUMzQyxNQUFNZ0IsUUFBUSxHQUFHLElBQUksQ0FBQ25CLFNBQVMsQ0FBQ0UsVUFBVTtRQUMxQyxJQUFJLENBQUNGLFNBQVMsQ0FBQ3JJLFdBQVcsR0FBRyxJQUFJLENBQUNxSSxTQUFTLENBQUNySSxXQUFXLENBQUN5SixJQUFJLENBQzFELENBQUNQLENBQUMsRUFBRUMsQ0FBQyxLQUFLRCxDQUFDLEdBQUdDLENBQ2hCLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQ2QsU0FBUyxDQUFDSSxHQUFHLEtBQUssSUFBSSxDQUFDSixTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7VUFDeERTLEdBQUcsR0FDRCxJQUFJLENBQUM0SCxTQUFTLENBQUNySSxXQUFXLENBQUMsSUFBSSxDQUFDcUksU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQ2pFdUosUUFBUTtRQUNaLENBQUMsTUFBTTtVQUNML0ksR0FBRyxHQUFHLElBQUksQ0FBQzRILFNBQVMsQ0FBQ3JJLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBR3dKLFFBQVE7UUFDaEQ7TUFDRjtNQUNGO0lBQ0EsQ0FBQyxNQUFNLElBQ0wsSUFBSSxDQUFDbkIsU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxJQUNyQyxJQUFJLENBQUNvSSxTQUFTLENBQUM5SixHQUFHLEtBQUssS0FBSyxFQUM1QjtNQUNBLElBQUksQ0FBQzhKLFNBQVMsQ0FBQ0csUUFBUSxHQUFHLElBQUk7TUFDOUIsSUFBSSxDQUFDSCxTQUFTLENBQUNJLEdBQUcsR0FDaEIsSUFBSSxDQUFDSixTQUFTLENBQUNySSxXQUFXLENBQUMsSUFBSSxDQUFDcUksU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO01BQ25FLElBQUksQ0FBQ29JLFNBQVMsQ0FBQ3JJLFdBQVcsR0FBRyxJQUFJLENBQUNxSSxTQUFTLENBQUNySSxXQUFXLENBQUN5SixJQUFJLENBQzFELENBQUNQLENBQUMsRUFBRUMsQ0FBQyxLQUFLRCxDQUFDLEdBQUdDLENBQ2hCLENBQUM7TUFDRCxJQUFJLElBQUksQ0FBQ2QsU0FBUyxDQUFDSSxHQUFHLEtBQUssSUFBSSxDQUFDSixTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDeERTLEdBQUcsR0FDRCxJQUFJLENBQUM0SCxTQUFTLENBQUNySSxXQUFXLENBQUMsSUFBSSxDQUFDcUksU0FBUyxDQUFDckksV0FBVyxDQUFDQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQ2pFLElBQUksQ0FBQ29JLFNBQVMsQ0FBQ0UsVUFBVTtNQUM3QixDQUFDLE1BQU07UUFDTDlILEdBQUcsR0FBRyxJQUFJLENBQUM0SCxTQUFTLENBQUNySSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDcUksU0FBUyxDQUFDRSxVQUFVO01BQ2pFO01BQ0Y7SUFDQSxDQUFDLE1BQU07TUFDTDlILEdBQUcsR0FBRzRFLGlFQUFZLENBQUMsR0FBRyxDQUFDO01BQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUNuRSxLQUFLLENBQUNULEdBQUcsQ0FBQyxJQUFJQSxHQUFHLEdBQUcsRUFBRSxFQUFFO1FBQ3BDQSxHQUFHLEdBQUc0RSxpRUFBWSxDQUFDLEdBQUcsQ0FBQztNQUN6QjtJQUNGO0lBQ0E7SUFDQSxLQUFLLENBQUNwRSxTQUFTLEdBQUdSLEdBQUc7SUFDckJ3SCxPQUFPLENBQUNDLEdBQUcsQ0FBRSxhQUFZekgsR0FBSSxFQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDckIsTUFBTSxDQUFDRixPQUFPLENBQUN1QixHQUFHLENBQUM7SUFDeEIsT0FBT0EsR0FBRztFQUNaLENBQUM7QUFDSDtBQUVBLFNBQVNpSixjQUFjQSxDQUFBLEVBQUc7RUFDeEIsTUFBTUMsY0FBYyxHQUFHLElBQUl2QixjQUFjLENBQUM3RCxxRUFBYyxDQUFDO0VBQ3pERSw2REFBVSxDQUFDcEQsU0FBUyxDQUFDc0ksY0FBYyxDQUFDakgsTUFBTSxDQUFDO0VBQzNDOEIsMkVBQW9CLENBQUNuRCxTQUFTLENBQUNzSSxjQUFjLENBQUNqQixnQkFBZ0IsQ0FBQztBQUNqRTtBQUVBN0ssNkRBQWdCLENBQUN3RCxTQUFTLENBQUNxSSxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2hMTTtBQUNFO0FBQ087QUFDUDtBQUVsRCxNQUFNRSxVQUFVLFNBQVM3SSw2REFBTSxDQUFDO0VBQy9CaEQsV0FBV0EsQ0FBQ3FCLE1BQU0sRUFBRTtJQUNqQixLQUFLLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQ0EsTUFBTSxHQUFHQSxNQUFNO0VBQ3RCO0VBRUFzRCxNQUFNLEdBQUlsRCxLQUFLLElBQUs7SUFDbEIsSUFBSSxLQUFLLENBQUMwQixLQUFLLENBQUMxQixLQUFLLENBQUMsRUFBRTtNQUN0QixLQUFLLENBQUN5QixTQUFTLEdBQUd6QixLQUFLO01BQ3ZCLElBQUksQ0FBQ0osTUFBTSxDQUFDRixPQUFPLENBQUNNLEtBQUssQ0FBQztNQUMxQixPQUFPQSxLQUFLO0lBQ2Q7SUFDQSxNQUFNLElBQUl2QixLQUFLLENBQUMsZ0NBQWdDLENBQUM7RUFDbkQsQ0FBQztBQUNIO0FBRUEsU0FBUzRMLFVBQVVBLENBQUEsRUFBRztFQUNwQixNQUFNQyxNQUFNLEdBQUcsSUFBSUYsVUFBVSxDQUFDbkYsNkRBQVUsQ0FBQztFQUN6Q3pDLG9EQUFnQixDQUFDWCxTQUFTLENBQUN5SSxNQUFNLENBQUNwSCxNQUFNLENBQUM7QUFDM0M7QUFFQTdFLDZEQUFnQixDQUFDd0QsU0FBUyxDQUFDd0ksVUFBVSxDQUFDO0FBRXRDLCtEQUFlRCxVQUFVOzs7Ozs7Ozs7OztBQzFCekIsU0FBU3RDLGlCQUFpQkEsQ0FBQ3lDLElBQUksRUFBRTtFQUMvQixJQUFJLE9BQU9BLElBQUksS0FBSyxRQUFRLEVBQUU7SUFDNUIsTUFBTSxJQUFJOUwsS0FBSyxDQUFDLDBCQUEwQixDQUFDO0VBQzdDO0VBQ0EsTUFBTStMLE1BQU0sR0FBRzdNLFFBQVEsQ0FBQzBHLGdCQUFnQixDQUFFLFVBQVNrRyxJQUFLLElBQUcsQ0FBQztFQUU1RCxLQUFLLElBQUlwTSxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdxTSxNQUFNLENBQUMvSixNQUFNLEVBQUV0QyxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3ZDLElBQUlxTSxNQUFNLENBQUNyTSxDQUFDLENBQUMsQ0FBQ2tKLE9BQU8sRUFBRTtNQUNyQixPQUFPbUQsTUFBTSxDQUFDck0sQ0FBQyxDQUFDLENBQUM2QixLQUFLO0lBQ3hCO0VBQ0o7QUFDRjtBQUVBLCtEQUFlOEgsaUJBQWlCOzs7Ozs7Ozs7OztBQ2ZoQyxTQUFTakMsWUFBWUEsQ0FBQ00sR0FBRyxFQUFFO0VBQ3pCLE9BQU9nRCxJQUFJLENBQUNTLEtBQUssQ0FBQ1QsSUFBSSxDQUFDVSxNQUFNLENBQUMsQ0FBQyxHQUFHMUQsR0FBRyxDQUFDO0FBQ3hDO0FBRUEsK0RBQWVOLFlBQVk7Ozs7OztVQ0ozQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnFEO0FBQ0c7QUFFeER4SCwyRUFBbUIsQ0FBQ3FCLE9BQU8sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvY3JlYXRlLWNvb3JkaW5hdGVzLWFyci9jcmVhdGUtY29vci1hcnIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1hdHRhY2stc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9zaGlwLWluZm8uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8tLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2dldC1yYW5kb20tbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGNyZWF0ZXMgc2luZ2xlIHRpbGUgd2l0aCBldmVudCBsaXN0ZW5lciAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbi8qIGNyZWF0ZXMgMTAwIHRpbGVzIHdpdGggZXZlbnQgbGlzdGVuZXJzICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlVGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVRpbGVzO1xuIiwiaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbi8qIGNsYXNzIHVzZWQgdG8gdXBkYXRlIHRoZSBET00gYmFzZWQgb24gaXQncyBjb3JyZXNwb25kaW5nIGdhbWVib2FyZCAqL1xuXG5jbGFzcyBHYW1lQm9hcmRWaWV3IHtcblxuICAvKiBzdHJpbmcgaXMgdXNlZCB0byBxdWVyeSB0aGUgY29ycmVjdCBnYW1lYm9hcmQsIGlzIGNvbXB1dGVyIG9yIHVzZXIgKi9cblxuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHsgIFxuICAgIGlmIChzdHJpbmcgIT09IFwiY29tcHV0ZXJcIiAmJiBzdHJpbmcgIT09IFwidXNlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lQm9hcmRWaWV3IGNyZWF0ZWQgd2l0aCBpbmNvcnJlY3Qgc3RyaW5nXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qIHVwZGF0ZXMgdGlsZXMgY2xhc3NlcyBmcm9tIGhpdCB0byBzdW5rICovXG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgLyogZ2V0cyB0aWxlIHN0YXR1cyAqL1xuXG4gIHN0YXRpYyBnZXRTdGF0dXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai5oaXQgPyBcImhpdFwiIDogXCJtaXNzXCI7XG4gIH1cblxuICAvKiBxdWVyeSB0aWxlIGJhc2VkIG9uIHN0cmluZyBhbmQgZGF0YS1pZCAqL1xuXG4gIHF1ZXJ5VGlsZSA9IGRhdGFJZCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZGF0YUlkfVwiXWApXG5cbiAgLyogb25jZSBhIHNoaXAgaXMgc3VuayByZXBsYWNlcyB0aGUgaGl0IGNsYXNzIHdpdGggc3VuayBjbGFzcyBvbiBhbGwgdGhlIHNoaXBzIHRpbGVzICovXG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUoZWxlbWVudCk7XG4gICAgICBHYW1lQm9hcmRWaWV3LnVwZGF0ZVN1bmsodGlsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiBsYWJlbHMgdGlsZXMgd2l0aCBoaXQsIG1pc3MsIHN1bmssIGNsYXNzZXMuIElmIGFsbCBzaGlwJ3Mgc3VuayBwdWJsaXNoZXMgdGhlIHN0cmluZyB0byBpbml0aWFsaXplIGdhbWUgb3ZlciBwdWIgc3ViICovXG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgICBpZiAob2JqLmdhbWVvdmVyKSB7XG4gICAgICAgIGluaXQuZ2FtZW92ZXIucHVibGlzaCh0aGlzLnN0cmluZylcbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnF1ZXJ5VGlsZShvYmoudGlsZSk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlldy5nZXRTdGF0dXMob2JqKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZFZpZXc7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIC8qIHRoZSBwdWIgc3ViIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgb3Bwb25lbnRzIGF0dGFjayAqL1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIgKi9cblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIsIGFjY2VwdHMgYm90aCBhcnJheXMgYW5kIHNpbmdsZSBvYmplY3RzICovXG5cbiAgc2V0IHNoaXBzKHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnNoaXBzQXJyID0gdGhpcy5zaGlwc0Fyci5jb25jYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNoaXBzQXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29ycyBmb3IgbWlzc2VkQXJyICovXG5cbiAgZ2V0IG1pc3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5taXNzZWRBcnI7XG4gIH1cblxuICBzZXQgbWlzc2VkKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubWlzc2VkLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yIChcIlRoZSBzYW1lIHRpbGUgd2FzIGF0dGFja2VkIHR3aWNlIVwiKVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiBjb29yZGluYXRlcyBhbHJlYWR5IGhhdmUgYSBzaGlwIG9uIHRoZW0gKi9cblxuICBpc1Rha2VuKGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIHJldHVybnMgdHJ1ZSBpZiBhIHNoaXAgaXMgYWxyZWFkeSBwbGFjZWQgb24gdGlsZXMgbmVpZ2hib3JpbmcgcGFzc2VkIGNvb3JkaW5hdGVzICovXG5cbiAgaXNOZWlnaGJvcmluZyhjb29yZGluYXRlcywgZGlyZWN0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIC8vIEhvcml6b250YWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyByaWdodCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgLy8gbm8gY2hlY2tzIGZvciB0b3AgYW5kIGJvdHRvbSBib3JkZXJzLCBzaW5jZSBpbXBvc3NpYmxlIHRvIHBsYWNlIHNoaXAgb3V0c2lkZSB0aGUgZ3JpZFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxMCksXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEwKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVmVydGljYWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGVzIG9uIHRoZSByaWdodFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdGhlIGxlZnQgb3IgcmlnaHQgYm9yZGVyLCBhZGRzIGJvdGggbGVmdCBhbmQgcmlnaHQgdGlsZXNcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSksXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gPCAxMSkge1xuICAgICAgICAvLyB0b3AgYm9yZGVyLCBhZGRzIG9ubHkgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEwKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPiA5MCkge1xuICAgICAgICAvLyBib3R0b20gYm9yZGVyLCBhZGRzIG9ubHkgdG9wIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdG9wIG9yIGJvdHRvbSBib3JkZXIsIGFkZHMgdGhlIHRvcCBhbmQgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxMF0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMTBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogaWYgc2hpcCBwbGFjZWQgb24gbmVpZ2hib3JpbmcgdGlsZXMgcmV0dXJucyB0cnVlICovXG4gICAgcmV0dXJuIHRoaXMuaXNUYWtlbihjb29yZGluYXRlc0FsbE5laWdoYm9ycyk7XG4gIH1cblxuICAvKiBjaGVja3MgaWYgdGhlIHRoZSB0aWxlIG51bSBzZWxlY3RlZCBieSBvcHBvbmVudCBoYXMgYSBzaGlwLCBpZiBoaXQgY2hlY2tzIGlmIHNoaXAgaXMgc3VuaywgaWYgc3VuayBjaGVja3MgaWYgZ2FtZSBpcyBvdmVyLCBlbHNlIGFkZHMgdGlsZSBudW0gdG8gbWlzc2VkIGFycmF5ICAqL1xuXG4gIGhhbmRsZUF0dGFjayA9IChudW0pID0+IHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKCtudW0pKSB7XG4gICAgICAgIHRoaXMuc2hpcHNbeV0uaGl0KCk7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmlzU3VuaygpKSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgICAgaGl0OiB0cnVlLFxuICAgICAgICAgICAgc3VuazogdHJ1ZSxcbiAgICAgICAgICAgIHRpbGVzOiB0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNPdmVyKClcbiAgICAgICAgICAgID8gdGhpcy5wdWJTdWIucHVibGlzaCh7IC4uLm9iaiwgLi4ueyBnYW1lb3ZlcjogdHJ1ZSB9IH0pXG4gICAgICAgICAgICA6IHRoaXMucHViU3ViLnB1Ymxpc2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiB0cnVlLCBzdW5rOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5taXNzZWQgPSBudW07XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogY2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsIi8qIHBsYXllciBiYXNlIGNsYXNzICovXG5cbmNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsIlxuLyogQ3JlYXRlcyBhIGNvb3JkaW5hdGUgYXJyIGZvciBhIHNoaXAgb2JqZWN0J3MgY29vcmRpbmF0ZXMgcHJvcGVydHkgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuZnVuY3Rpb24gY3JlYXRlQ29vckFycihvYmopIHtcbiAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV1cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29vckFycjtcbiIsImltcG9ydCBjcmVhdGVDb29yQXJyIGZyb20gXCIuL2NyZWF0ZS1jb29yZGluYXRlcy1hcnIvY3JlYXRlLWNvb3ItYXJyXCI7XG5cbi8qIENyZWF0ZXMgc2hpcCBvYmplY3QgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5cbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuLyogaGlkZXMgdGhlIGZvcm0gKi9cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybVwiKTtcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcblxuLyogcHVibGlzaCB0aGUgdGlsZSdzIGRhdGEtaWQgKi9cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHtpZH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGljay5hdHRhY2sucHVibGlzaChpZClcbn1cblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogQ3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xuICByZXR1cm4gYnRuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG5cbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gIGgxLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19oZWFkaW5nXCIpO1xuICBoMS50ZXh0Q29udGVudCA9IFwiR0FNRSBPVkVSXCI7XG4gIGRpdi5hcHBlbmRDaGlsZChoMSk7XG5cbiAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gIGgzLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19zdWItaGVhZGluZ1wiKTtcbiAgc3RyaW5nID09PSBcInVzZXJcIlxuICAgID8gKGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiKVxuICAgIDogKGgzLnRleHRDb250ZW50ID0gXCJZT1UgV09OXCIpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlTmV3R2FtZUJ0bigpKTtcbiAgcmV0dXJuIGRpdjtcbn1cblxuZnVuY3Rpb24gc2hvd0dhbWVPdmVyKHN0cmluZykge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0QXR0YWNrU3RhZ2VUaWxlcyk7XG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSk7XG5pbml0LmdhbWVvdmVyLnN1YnNjcmliZShzaG93R2FtZU92ZXIpO1xuIiwiaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCJcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKTtcblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7fSk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycyk7XG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB1c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnB1Ymxpc2goKTt9KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpO1xuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7aWR9ID0gdGhpcy5kYXRhc2V0OyBcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaChpZCk7XG5cbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERhdGFJZCk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcyk7XG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShyZW1vdmVFdmVudExpc3RlbmVycylcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gICAqL1xuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICAqL1xuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgICovXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgICovXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyBhdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UsIGdhbWVvdmVyIH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcbiAgLyogUmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLiAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBzaGlwLmRpcmVjdGlvbikgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDUpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDMpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDIpO1xuICAgIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyQm9hcmQuaGFuZGxlQXR0YWNrKTsgXG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wR0IpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlldyBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlld1wiO1xuaW1wb3J0IHsgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcblxuY29uc3QgY29tcHV0ZXIgPSBcImNvbXB1dGVyXCI7XG5cbmNvbnN0IGNvbXB1dGVyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVmlldyhjb21wdXRlcik7XG5cbmhhbmRsZVVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyVmlld1VwZGF0ZXIuaGFuZGxlQXR0YWNrVmlldyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXB1dGVyVmlld1VwZGF0ZXI7XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG5mdW5jdGlvbiBnZXRSYW5kb21EaXJlY3Rpb24oKSB7XG4gIHJldHVybiBnZXRSYW5kb21OdW0oMikgPT09IDEgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tRGlyZWN0aW9uO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuLyogQ3JlYXRlIGEgcmFuZG9tIHRpbGVOdW0gKi9cblxuZnVuY3Rpb24gZ2V0UmFuZG9tVGlsZU51bShsZW5ndGgsIGRpcmVjdGlvbikge1xuICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgIHJldHVybiArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDExLSBsZW5ndGgpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21UaWxlTnVtO1xuIiwiXG5pbXBvcnQgZ2V0UmFuZG9tRGlyZWN0aW9uIGZyb20gXCIuL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uXCI7XG5pbXBvcnQgZ2V0UmFuZG9tVGlsZU51bSBmcm9tIFwiLi9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW1cIjtcblxuY2xhc3MgU2hpcEluZm8ge1xuICBcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBnZXRSYW5kb21EaXJlY3Rpb24oKTtcbiAgICB0aGlzLnRpbGVOdW0gPSBnZXRSYW5kb21UaWxlTnVtKHRoaXMubGVuZ3RoLCB0aGlzLmRpcmVjdGlvbik7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mbztcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssIGNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuICAvKiBDYWxjdWxhdGVzIHRoZSBtYXggYWNjZXB0YWJsZSB0aWxlIGZvciBhIHNoaXAgZGVwZW5kaW5nIG9uIGl0cyBzdGFydCAodGlsZU51bSkuXG4gIGZvciBleC4gSWYgYSBzaGlwIGlzIHBsYWNlZCBob3Jpem9udGFsbHkgb24gdGlsZSAyMSBtYXggd291bGQgYmUgMzAgICovXG5cbiAgc3RhdGljIGNhbGNNYXgob2JqKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIG9iai50aWxlTnVtID4gMTApIHtcbiAgICAgIGlmIChvYmoudGlsZU51bSAlIDEwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBvYmoudGlsZU51bVxuICAgICAgfVxuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgb2JqLmRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXN9IFxuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMgfVxuICB9XG5cbiAgcHVibGlzaFZhbGlkaXR5ID0gKG9iaikgPT4ge1xuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBwbGFjZXMgc2hpcCBpbiBzaGlwc0FyciAqL1xuXG4gIHBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gc2hpcDtcbiAgfVxuXG4gIHB1Ymxpc2hQbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxhY2VTaGlwKG9iailcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcucHVibGlzaCh7Y29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMsIGxlbmd0aDogc2hpcC5sZW5ndGh9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRVc2VyQm9hcmQoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG4gIHVzZXJDbGljay5jcmVhdGVTaGlwLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFBsYWNlU2hpcCk7XG4gIGZ1bmN0aW9uIGluaXRIYW5kbGVBdHRhY2soKSB7XG4gICAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xuICB9XG4gIGluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRIYW5kbGVBdHRhY2spXG59XG5cbmluaXRVc2VyQm9hcmQoKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciBleHRlbmRzIEdhbWVCb2FyZFZpZXcge1xuICBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG5cbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSByYWRpbyBpbnB1dCBmb3IgdGhhdCBzaGlwIGlzIGhpZGRlbiAqL1xuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG4gIHN0YXRpYyBuZXh0U2hpcENoZWNrZWQoKSB7XG4gICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGA6bm90KC5oaWRkZW4pW25hbWU9XCJzaGlwXCJdYCk7XG4gICAgaWYgKHJhZGlvID09PSBudWxsKSB7XG4gICAgICBpbml0LmF0dGFja1N0YWdlLnB1Ymxpc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyogQ2xlYXJzIHRoZSB2YWxpZGl0eSBjaGVjayBvZiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkLiBJZiBpdCBwYXNzZXMgdGhlIGNoZWNrIGl0IHVubG9ja3MgdGhlIHBsYWNlIHNoaXAgYnRuICovXG4gIGNsZWFyVmFsaWRpdHlWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmRfX3RpbGVcIik7XG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KTtcbiAgICB0aGlzLmJ0bi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgfTtcblxuICAvKiBhZGRzIHRoZSB2aXN1YWwgY2xhc3MgcGxhY2VtZW50LS12YWxpZC9vciBwbGFjZW1lbnQtLWludmFsaWQgYmFzZWQgb24gdGhlIHRpbGVOdW0gY2hvc2VuIGJ5IHRoZSB1c2VyLCBkaXNhYmxlcyB0aGUgc3VibWl0IGJ0biBpZiBpdCBmYWlscyBwbGFjZW1lbnQgY2hlY2sgKi9cblxuICBoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIGlmICghb2JqLnZhbGlkKSB7XG4gICAgICB0aGlzLmJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICB9XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIGlmIChvYmoudmFsaWQpIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBoYW5kbGVQbGFjZW1lbnRWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmhpZGVSYWRpbyhvYmopO1xuICAgIHRoaXMuY29uc3RydWN0b3IubmV4dFNoaXBDaGVja2VkKCk7XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tc2hpcFwiKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyKHVzZXIpO1xuXG5oYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpO1xudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50Vmlldyk7XG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJWaWV3VXBkYXRlcjtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpOztcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKVxuICByZXR1cm4gc2hpcEluZm9cbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7ICBcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KHZhbHVlID0+IHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gcmV0dXJuIGZhbHNlXG4gIH0pXG4gIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgY29uc29sZS5sb2coc2hpcEluZm8pXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXAucHVibGlzaChzaGlwSW5mbyk7IFxuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTsgXG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSlcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuaW1wb3J0IHtcbiAgY29tcHV0ZXJBdHRhY2ssXG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLFxufSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgPT09IGZhbHNlICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgNzApIHtcbiAgICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIFB1Ymxpc2ggYW5kIEFkZCB0byBhcnIgKi9cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgY29uc29sZS5sb2coYHB1Ymxpc2hlZCAke251bX1gKTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVUaWxlIiwiaWQiLCJjYWxsYmFjayIsInRpbGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3JlYXRlVGlsZXMiLCJkaXYiLCJpIiwiYXBwZW5kQ2hpbGQiLCJpbml0IiwiR2FtZUJvYXJkVmlldyIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwiRXJyb3IiLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwicXVlcnlUaWxlIiwiZGF0YUlkIiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsImdhbWVvdmVyIiwicHVibGlzaCIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwibWlzc2VkQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWQiLCJpbmNsdWRlcyIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInkiLCJpc05laWdoYm9yaW5nIiwiZGlyZWN0aW9uIiwiY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMiLCJtYXAiLCJjb29yIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsImNyZWF0ZUNvb3JBcnIiLCJhcnIiLCJ0aWxlTnVtIiwiU2hpcCIsInRpbWVzSGl0IiwidXNlckNsaWNrIiwiZ2FtZUJvYXJkRGl2Q29tcHV0ZXIiLCJoaWRlRm9ybSIsImZvcm0iLCJzaG93Q29tcEJvYXJkIiwiY29tcEJvYXJkIiwicmVtb3ZlIiwiYXR0YWNrU3RhZ2UiLCJwdWJsaXNoRGF0YUlkIiwiZGF0YXNldCIsImF0dGFjayIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsInRleHRDb250ZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsInNob3dHYW1lT3ZlciIsIm1haW4iLCJub3RpZmljYXRpb24iLCJoaWRlQ29tcEJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsInBsYWNlbWVudFN0YWdlIiwiYWRkSW5wdXRMaXN0ZW5lcnMiLCJmb3JtSW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsImlucHV0IiwiYWRkQnRuTGlzdGVuZXIiLCJwbGFjZVNoaXBCdG4iLCJzaGlwUGxhY2VCdG4iLCJwaWNrUGxhY2VtZW50IiwiY3JlYXRlUGxhY2VtZW50VGlsZXMiLCJnYW1lQm9hcmREaXZVc2VyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY29tcHV0ZXJBdHRhY2siLCJoYW5kbGVDb21wdXRlckF0dGFjayIsInVzZXJBdHRhY2siLCJoYW5kbGVVc2VyQXR0YWNrIiwic2hpcEluZm8iLCJ2YWxpZGl0eVZpZXdzIiwiY3JlYXRlU2hpcCIsImNyZWF0ZVNoaXBWaWV3IiwiU2hpcEluZm8iLCJDb21wdXRlckdhbWVCb2FyZCIsInBsYWNlU2hpcCIsImluaXRDb21wR0IiLCJjb21wdXRlciIsImNvbXB1dGVyVmlld1VwZGF0ZXIiLCJnZXRSYW5kb21OdW0iLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJnZXRSYW5kb21UaWxlTnVtIiwidG9TdHJpbmciLCJVc2VyR2FtZUJvYXJkIiwiY2FsY01heCIsIm1heCIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIiLCJoaWRlUmFkaW8iLCJyYWRpb0lucHV0IiwicmFkaW9MYWJlbCIsIm5leHRTaGlwQ2hlY2tlZCIsInJhZGlvIiwiY2hlY2tlZCIsImNsZWFyVmFsaWRpdHlWaWV3IiwicmVtb3ZlQXR0cmlidXRlIiwiaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3IiwiY29vcmRpbmF0ZSIsImhhbmRsZVBsYWNlbWVudFZpZXciLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==