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
    const max = GameBoard.calcMax(obj);
    const shipLength = GameBoard.calcLength(obj);
    if (obj.tileNum + shipLength <= max) {
      return false;
    }
    return true;
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

/***/ "./src/components/common/ship/ship.js":
/*!********************************************!*\
  !*** ./src/components/common/ship/ship.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Ship {
  constructor(obj) {
    this.length = +obj.length;
    this.coordinates = Ship.createCoorArr(obj);
  }
  timesHit = 0;
  sunk = false;
  static createCoorArr(obj) {
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
    while (this.isTaken(ship.coordinates) || this.isNeighboring(ship.coordinates, ship.direction) || _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isTooBig(shipInfo)) {
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
  isValid = obj => {
    const ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](obj);
    if (this.isTaken(ship.coordinates) || _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isTooBig(obj) || this.isNeighboring(ship.coordinates, obj.direction)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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L2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcGxheWVyL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHViLXN1Yi9wdWItc3ViLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tYXR0YWNrLXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9nZXQtcmFuZG9tLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBjcmVhdGVzIHNpbmdsZSB0aWxlIHdpdGggZXZlbnQgbGlzdGVuZXIgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG4vKiBjcmVhdGVzIDEwMCB0aWxlcyB3aXRoIGV2ZW50IGxpc3RlbmVycyAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUaWxlcztcbiIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG4vKiBjbGFzcyB1c2VkIHRvIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIGl0J3MgY29ycmVzcG9uZGluZyBnYW1lYm9hcmQgKi9cblxuY2xhc3MgR2FtZUJvYXJkVmlldyB7XG5cbiAgLyogc3RyaW5nIGlzIHVzZWQgdG8gcXVlcnkgdGhlIGNvcnJlY3QgZ2FtZWJvYXJkLCBpcyBjb21wdXRlciBvciB1c2VyICovXG5cbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7ICBcbiAgICBpZiAoc3RyaW5nICE9PSBcImNvbXB1dGVyXCIgJiYgc3RyaW5nICE9PSBcInVzZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZUJvYXJkVmlldyBjcmVhdGVkIHdpdGggaW5jb3JyZWN0IHN0cmluZ1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB9XG4gIH1cblxuICAvKiB1cGRhdGVzIHRpbGVzIGNsYXNzZXMgZnJvbSBoaXQgdG8gc3VuayAqL1xuXG4gIHN0YXRpYyB1cGRhdGVTdW5rKHRpbGUpIHtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlcGxhY2UoXCJoaXRcIiwgXCJzdW5rXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGdldHMgdGlsZSBzdGF0dXMgKi9cblxuICBzdGF0aWMgZ2V0U3RhdHVzKG9iaikge1xuICAgIHJldHVybiBvYmouaGl0ID8gXCJoaXRcIiA6IFwibWlzc1wiO1xuICB9XG5cbiAgLyogcXVlcnkgdGlsZSBiYXNlZCBvbiBzdHJpbmcgYW5kIGRhdGEtaWQgKi9cblxuICBxdWVyeVRpbGUgPSBkYXRhSWQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2RhdGFJZH1cIl1gKVxuXG4gIC8qIG9uY2UgYSBzaGlwIGlzIHN1bmsgcmVwbGFjZXMgdGhlIGhpdCBjbGFzcyB3aXRoIHN1bmsgY2xhc3Mgb24gYWxsIHRoZSBzaGlwcyB0aWxlcyAqL1xuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMucXVlcnlUaWxlKGVsZW1lbnQpO1xuICAgICAgR2FtZUJvYXJkVmlldy51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogbGFiZWxzIHRpbGVzIHdpdGggaGl0LCBtaXNzLCBzdW5rLCBjbGFzc2VzLiBJZiBhbGwgc2hpcCdzIHN1bmsgcHVibGlzaGVzIHRoZSBzdHJpbmcgdG8gaW5pdGlhbGl6ZSBnYW1lIG92ZXIgcHViIHN1YiAqL1xuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUob2JqLnRpbGUpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXcuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3O1xuIiwiY2xhc3MgR2FtZUJvYXJkIHtcblxuICAvKiB0aGUgcHViIHN1YiByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgdGhlIG9wcG9uZW50cyBhdHRhY2sgKi9cblxuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIHNoaXBzQXJyID0gW107XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyICovXG5cbiAgZ2V0IHNoaXBzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzQXJyO1xuICB9XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyLCBhY2NlcHRzIGJvdGggYXJyYXlzIGFuZCBzaW5nbGUgb2JqZWN0cyAqL1xuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvcnMgZm9yIG1pc3NlZEFyciAqL1xuXG4gIGdldCBtaXNzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlzc2VkQXJyO1xuICB9XG5cbiAgc2V0IG1pc3NlZCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLm1pc3NlZC5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciAoXCJUaGUgc2FtZSB0aWxlIHdhcyBhdHRhY2tlZCB0d2ljZSFcIilcbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaCh2YWx1ZSk7XG4gIH1cblxuICAgIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBHYW1lQm9hcmQuY2FsY01heChvYmopO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogcmV0dXJucyB0cnVlIGlmIGEgc2hpcCBpcyBhbHJlYWR5IHBsYWNlZCBvbiB0aWxlcyBuZWlnaGJvcmluZyBwYXNzZWQgY29vcmRpbmF0ZXMgKi9cblxuICBpc05laWdoYm9yaW5nKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgLy8gSG9yaXpvbnRhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEpO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAvLyBubyBjaGVja3MgZm9yIHRvcCBhbmQgYm90dG9tIGJvcmRlcnMsIHNpbmNlIGltcG9zc2libGUgdG8gcGxhY2Ugc2hpcCBvdXRzaWRlIHRoZSBncmlkXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEwKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMTApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWZXJ0aWNhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKSxcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA8IDExKSB7XG4gICAgICAgIC8vIHRvcCBib3JkZXIsIGFkZHMgb25seSBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSA+IDkwKSB7XG4gICAgICAgIC8vIGJvdHRvbSBib3JkZXIsIGFkZHMgb25seSB0b3AgdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0b3Agb3IgYm90dG9tIGJvcmRlciwgYWRkcyB0aGUgdG9wIGFuZCBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDEwXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxMFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBpZiBzaGlwIHBsYWNlZCBvbiBuZWlnaGJvcmluZyB0aWxlcyByZXR1cm5zIHRydWUgKi9cbiAgICByZXR1cm4gdGhpcy5pc1Rha2VuKGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiB0aGUgdGhlIHRpbGUgbnVtIHNlbGVjdGVkIGJ5IG9wcG9uZW50IGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIsIGVsc2UgYWRkcyB0aWxlIG51bSB0byBtaXNzZWQgYXJyYXkgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgICBoaXQ6IHRydWUsXG4gICAgICAgICAgICBzdW5rOiB0cnVlLFxuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc092ZXIoKVxuICAgICAgICAgICAgPyB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgLi4ub2JqLCAuLi57IGdhbWVvdmVyOiB0cnVlIH0gfSlcbiAgICAgICAgICAgIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZCA9IG51bTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBjYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2sgPSB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpO1xuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiLyogcGxheWVyIGJhc2UgY2xhc3MgKi9cblxuY2xhc3MgUGxheWVyIHtcblxuICBwcmV2aW91c0F0dGFja3MgPSBbXVxuICBcbiAgZ2V0IGF0dGFja0FycigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c0F0dGFja3M7XG4gIH1cblxuICBzZXQgYXR0YWNrQXJyKHZhbHVlKSB7XG4gICAgdGhpcy5wcmV2aW91c0F0dGFja3MucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBpc05ldyh2YWx1ZSkge1xuICAgIHJldHVybiAhdGhpcy5hdHRhY2tBcnIuaW5jbHVkZXModmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFB1YlN1YiB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpXG4gIH1cbiBcbiAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuZmlsdGVyKHN1YiA9PiBzdWIhPT0gc3Vic2NyaWJlcilcbiAgfVxuXG4gIHB1Ymxpc2gocGF5bG9hZCkge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIocGF5bG9hZCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiY2xhc3MgU2hpcCB7XG4gIFxuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBTaGlwLmNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgc3RhdGljIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gICAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMTApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5cbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuLyogaGlkZXMgdGhlIGZvcm0gKi9cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybVwiKTtcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcblxuLyogcHVibGlzaCB0aGUgdGlsZSdzIGRhdGEtaWQgKi9cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHtpZH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGljay5hdHRhY2sucHVibGlzaChpZClcbn1cblxuLyogQ3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogQ3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xuICByZXR1cm4gYnRuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG5cbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gIGgxLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19oZWFkaW5nXCIpO1xuICBoMS50ZXh0Q29udGVudCA9IFwiR0FNRSBPVkVSXCI7XG4gIGRpdi5hcHBlbmRDaGlsZChoMSk7XG5cbiAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gIGgzLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19zdWItaGVhZGluZ1wiKTtcbiAgc3RyaW5nID09PSBcInVzZXJcIlxuICAgID8gKGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiKVxuICAgIDogKGgzLnRleHRDb250ZW50ID0gXCJZT1UgV09OXCIpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlTmV3R2FtZUJ0bigpKTtcbiAgcmV0dXJuIGRpdjtcbn1cblxuZnVuY3Rpb24gc2hvd0dhbWVPdmVyKHN0cmluZykge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0QXR0YWNrU3RhZ2VUaWxlcyk7XG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSk7XG5pbml0LmdhbWVvdmVyLnN1YnNjcmliZShzaG93R2FtZU92ZXIpO1xuIiwiaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCJcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKTtcblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7fSk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycyk7XG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyB1c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnB1Ymxpc2goKTt9KTtcbn1cblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpO1xuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7aWR9ID0gdGhpcy5kYXRhc2V0OyBcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaChpZCk7XG5cbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkICovXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERhdGFJZCk7XG4gIH0pO1xufVxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcyk7XG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShyZW1vdmVFdmVudExpc3RlbmVycylcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gICAqL1xuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICAqL1xuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgICovXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgICovXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyBhdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UsIGdhbWVvdmVyIH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcbiAgLyogUmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLiAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBzaGlwLmRpcmVjdGlvbikgfHwgR2FtZUJvYXJkLmlzVG9vQmlnKHNoaXBJbmZvKSApIHtcbiAgICAgIHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgICBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0Q29tcEdCKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgQ29tcHV0ZXJHYW1lQm9hcmQoaGFuZGxlVXNlckF0dGFjayk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNSk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMyk7XG4gICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMik7XG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3VXBkYXRlciA9IG5ldyBHYW1lQm9hcmRWaWV3KGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3VXBkYXRlci5oYW5kbGVBdHRhY2tWaWV3KTtcblxuZXhwb3J0IGRlZmF1bHQgY29tcHV0ZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBDcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIGlzVmFsaWQgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCBHYW1lQm9hcmQuaXNUb29CaWcob2JqKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgb2JqLmRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXN9IFxuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMgfVxuICB9XG5cbiAgcHVibGlzaFZhbGlkaXR5ID0gKG9iaikgPT4ge1xuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBwbGFjZXMgc2hpcCBpbiBzaGlwc0FyciAqL1xuXG4gIHBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gc2hpcDtcbiAgfVxuXG4gIHB1Ymxpc2hQbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxhY2VTaGlwKG9iailcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcucHVibGlzaCh7Y29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMsIGxlbmd0aDogc2hpcC5sZW5ndGh9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRVc2VyQm9hcmQoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG4gIHVzZXJDbGljay5jcmVhdGVTaGlwLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFBsYWNlU2hpcCk7XG4gIGZ1bmN0aW9uIGluaXRIYW5kbGVBdHRhY2soKSB7XG4gICAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xuICB9XG4gIGluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRIYW5kbGVBdHRhY2spXG59XG5cbmluaXRVc2VyQm9hcmQoKTtcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciBleHRlbmRzIEdhbWVCb2FyZFZpZXcge1xuICBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG5cbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSByYWRpbyBpbnB1dCBmb3IgdGhhdCBzaGlwIGlzIGhpZGRlbiAqL1xuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG4gIHN0YXRpYyBuZXh0U2hpcENoZWNrZWQoKSB7XG4gICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGA6bm90KC5oaWRkZW4pW25hbWU9XCJzaGlwXCJdYCk7XG4gICAgaWYgKHJhZGlvID09PSBudWxsKSB7XG4gICAgICBpbml0LmF0dGFja1N0YWdlLnB1Ymxpc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyogQ2xlYXJzIHRoZSB2YWxpZGl0eSBjaGVjayBvZiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkLiBJZiBpdCBwYXNzZXMgdGhlIGNoZWNrIGl0IHVubG9ja3MgdGhlIHBsYWNlIHNoaXAgYnRuICovXG4gIGNsZWFyVmFsaWRpdHlWaWV3ID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmRfX3RpbGVcIik7XG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KTtcbiAgICB0aGlzLmJ0bi5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgfTtcblxuICAvKiBhZGRzIHRoZSB2aXN1YWwgY2xhc3MgcGxhY2VtZW50LS12YWxpZC9vciBwbGFjZW1lbnQtLWludmFsaWQgYmFzZWQgb24gdGhlIHRpbGVOdW0gY2hvc2VuIGJ5IHRoZSB1c2VyLCBkaXNhYmxlcyB0aGUgc3VibWl0IGJ0biBpZiBpdCBmYWlscyBwbGFjZW1lbnQgY2hlY2sgKi9cblxuICBoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIGlmICghb2JqLnZhbGlkKSB7XG4gICAgICB0aGlzLmJ0bi5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICB9XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIGlmIChvYmoudmFsaWQpIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBoYW5kbGVQbGFjZW1lbnRWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLmhpZGVSYWRpbyhvYmopO1xuICAgIHRoaXMuY29uc3RydWN0b3IubmV4dFNoaXBDaGVja2VkKCk7XG4gICAgb2JqLmNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkaW5hdGUpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tc2hpcFwiKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyKHVzZXIpO1xuXG5oYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpO1xudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlUGxhY2VtZW50Vmlldyk7XG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJWaWV3VXBkYXRlcjtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpOztcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKVxuICByZXR1cm4gc2hpcEluZm9cbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKVxuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7ICBcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KHZhbHVlID0+IHtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gcmV0dXJuIGZhbHNlXG4gIH0pXG4gIGlmIChpc0NvbXBsZXRlKSB7XG4gICAgY29uc29sZS5sb2coc2hpcEluZm8pXG4gICAgdXNlckNsaWNrLmNyZWF0ZVNoaXAucHVibGlzaChzaGlwSW5mbyk7IFxuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTsgXG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSlcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuaW1wb3J0IHtcbiAgY29tcHV0ZXJBdHRhY2ssXG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLFxufSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgPT09IGZhbHNlICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgNzApIHtcbiAgICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIFB1Ymxpc2ggYW5kIEFkZCB0byBhcnIgKi9cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgY29uc29sZS5sb2coYHB1Ymxpc2hlZCAke251bX1gKTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0LmF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVUaWxlIiwiaWQiLCJjYWxsYmFjayIsInRpbGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3JlYXRlVGlsZXMiLCJkaXYiLCJpIiwiYXBwZW5kQ2hpbGQiLCJpbml0IiwiR2FtZUJvYXJkVmlldyIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwiRXJyb3IiLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwicXVlcnlUaWxlIiwiZGF0YUlkIiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsImdhbWVvdmVyIiwicHVibGlzaCIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwibWlzc2VkQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWQiLCJpbmNsdWRlcyIsImNhbGNNYXgiLCJkaXJlY3Rpb24iLCJ0aWxlTnVtIiwibWF4IiwidG9TdHJpbmciLCJjaGFyQXQiLCJjYWxjTGVuZ3RoIiwibGVuZ3RoIiwiaXNUb29CaWciLCJzaGlwTGVuZ3RoIiwiaXNUYWtlbiIsImNvb3JkaW5hdGVzIiwieSIsImlzTmVpZ2hib3JpbmciLCJjb29yZGluYXRlc0FsbE5laWdoYm9ycyIsIm1hcCIsImNvb3IiLCJoYW5kbGVBdHRhY2siLCJudW0iLCJpc1N1bmsiLCJpc092ZXIiLCJjaGVjayIsImV2ZXJ5Iiwic2hpcCIsIlBsYXllciIsInByZXZpb3VzQXR0YWNrcyIsImF0dGFja0FyciIsImlzTmV3IiwiUHViU3ViIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwYXlsb2FkIiwiU2hpcCIsImNyZWF0ZUNvb3JBcnIiLCJ0aW1lc0hpdCIsImFyciIsInVzZXJDbGljayIsImdhbWVCb2FyZERpdkNvbXB1dGVyIiwiaGlkZUZvcm0iLCJmb3JtIiwic2hvd0NvbXBCb2FyZCIsImNvbXBCb2FyZCIsInJlbW92ZSIsImF0dGFja1N0YWdlIiwicHVibGlzaERhdGFJZCIsImRhdGFzZXQiLCJhdHRhY2siLCJpbml0QXR0YWNrU3RhZ2VUaWxlcyIsImNyZWF0ZU5ld0dhbWVCdG4iLCJidG4iLCJ0ZXh0Q29udGVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJwbGFjZW1lbnRTdGFnZSIsImFkZElucHV0TGlzdGVuZXJzIiwiZm9ybUlucHV0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbnB1dCIsImFkZEJ0bkxpc3RlbmVyIiwicGxhY2VTaGlwQnRuIiwic2hpcFBsYWNlQnRuIiwicGlja1BsYWNlbWVudCIsImNyZWF0ZVBsYWNlbWVudFRpbGVzIiwiZ2FtZUJvYXJkRGl2VXNlciIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbXB1dGVyQXR0YWNrIiwiaGFuZGxlQ29tcHV0ZXJBdHRhY2siLCJ1c2VyQXR0YWNrIiwiaGFuZGxlVXNlckF0dGFjayIsInNoaXBJbmZvIiwidmFsaWRpdHlWaWV3cyIsImNyZWF0ZVNoaXAiLCJjcmVhdGVTaGlwVmlldyIsIlNoaXBJbmZvIiwiQ29tcHV0ZXJHYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJpbml0Q29tcEdCIiwiY29tcHV0ZXIiLCJjb21wdXRlclZpZXdVcGRhdGVyIiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsIlVzZXJHYW1lQm9hcmQiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlld1VwZGF0ZXIiLCJoaWRlUmFkaW8iLCJyYWRpb0lucHV0IiwicmFkaW9MYWJlbCIsIm5leHRTaGlwQ2hlY2tlZCIsInJhZGlvIiwiY2hlY2tlZCIsImNsZWFyVmFsaWRpdHlWaWV3IiwicmVtb3ZlQXR0cmlidXRlIiwiaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3IiwiY29vcmRpbmF0ZSIsImhhbmRsZVBsYWNlbWVudFZpZXciLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==