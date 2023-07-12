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
    return obj.hit ? "gameboard__tile--hit" : "gameboard__tile--miss";
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
/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ "./src/components/common/create-tiles/create-tiles.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pub-subs/events */ "./src/components/pub-subs/events.js");









const gameBoardDivComputer = document.querySelector(".gameboard--computer");

/* hides the placement form */

function hideForm() {
  const form = document.querySelector(".placement-form");
  form.classList.add("hidden");
}

/* show's the computer's board */

function showCompBoard() {
  const compBoard = document.querySelector(".div--computer");
  compBoard.classList.remove("hidden");
}

/* publish the tile's data-id */

function publishDataId() {
  const {
    id
  } = this.dataset;
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_8__.attack.publish(id);
}

/* creates tiles for the user gameboard, and tiles with eventListeners for the computer gameboard */

function initAttackStageTiles() {
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_6__["default"])(gameBoardDivComputer, publishDataId);
}

/* creates gameover notification and new game btn */

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
  // eslint-disable-next-line no-unused-expressions
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

/* Subscribe to initializing pub-subs */

_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_7__.attackStage.subscribe(showCompBoard);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_7__.attackStage.subscribe(initAttackStageTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_7__.attackStage.subscribe(hideForm);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_7__.gameover.subscribe(showGameOver);

/***/ }),

/***/ "./src/components/layout/layout--placement-stage.js":
/*!**********************************************************!*\
  !*** ./src/components/layout/layout--placement-stage.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_gameboard_user_ship_info_ship_info_views_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/gameboard--user/ship-info/ship-info__views--user */ "./src/components/views/gameboard--user/ship-info/ship-info__views--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ "./src/components/views/gameboard--user/gameboard--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_views_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/gameboard--user/gameboard-views--user */ "./src/components/views/gameboard--user/gameboard-views--user.js");
/* harmony import */ var _layout_attack_stage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./layout--attack-stage */ "./src/components/layout/layout--attack-stage.js");
/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ "./src/components/common/create-tiles/create-tiles.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../pub-subs/events */ "./src/components/pub-subs/events.js");







function hideCompBoard() {
  const computerBoard = document.querySelector(".div--computer");
  computerBoard.classList.add("hidden");
}
function addInputListeners() {
  const formInputs = document.querySelectorAll(".placement-form__input");
  formInputs.forEach(input => {
    input.addEventListener("click", () => {
      _pub_subs_events__WEBPACK_IMPORTED_MODULE_6__.input.publish();
    });
  });
}
function addBtnListener() {
  const placeShipBtn = document.querySelector(".placement-form__place-btn");
  placeShipBtn.addEventListener("click", () => {
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_6__.shipPlaceBtn.publish();
  });
}
function publishDataId() {
  const {
    id
  } = this.dataset;
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_6__.pickPlacement.publish(id);
}
function createPlacementTiles() {
  const gameBoardDivUser = document.querySelector(".gameboard--user");
  (0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_4__["default"])(gameBoardDivUser, publishDataId);
}

/* Removes event listeners from the user gameboard */

function removeEventListeners() {
  const tiles = document.querySelectorAll(".gameboard--user .gameboard__tile");
  tiles.forEach(tile => {
    tile.removeEventListener("click", publishDataId);
  });
}

/* initialization subscriptions */

_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(addBtnListener);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(addInputListeners);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(hideCompBoard);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(createPlacementTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.attackStage.subscribe(removeEventListeners);

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

/* gameboard.publishValidity publishes an obj with a boo. valid property and a list of coordinates. */

const validityViews = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* When place ship btn is pressed publishShipInfoCreate() will create shipInfo */

const shipPlaceBtn = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* When  publishShipInfoCreate() creates the shipInfo. The gameboard.placeShip */

const createShip = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* UserGameBoard.publishPlaceShip publishes ship coordinates. GameBoardUserView.handlePlacementView adds placement-ship class to tiles */

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
  /* recreates a random ship, until its coordinates are not taken, neighboring other ships, or too big */

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

/* initialize computer game board */

function initCompGB() {
  const computerBoard = new ComputerGameBoard(_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.handleUserAttack);
  const shipsArr = [5, 4, 3, 2];
  shipsArr.forEach(ship => {
    computerBoard.placeShip(ship);
  });
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
const computerView = new _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__["default"](computer);
_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_1__.handleUserAttack.subscribe(computerView.handleAttackView);

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


/* create a random tileNum */

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
  /* checks ship validity */

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

/* initialize user game board */

function initUserGB() {
  const userBoard = new UserGameBoard(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.handleComputerAttack);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.shipInfo.subscribe(userBoard.publishValidity);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.createShip.subscribe(userBoard.publishPlaceShip);
  function initHandleAttack() {
    _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.computerAttack.subscribe(userBoard.handleAttack);
  }
  _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.attackStage.subscribe(initHandleAttack);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.placementStage.subscribe(initUserGB);

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




class GameBoardUserView extends _common_gameboard_gameboard_view__WEBPACK_IMPORTED_MODULE_0__["default"] {
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

  /* clears the validity check of the previous selection from the user gameboard. If it passes the check it unlocks the place ship btn */

  clearValidityView = () => {
    const tiles = document.querySelectorAll(".gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove("placement--valid");
      tile.classList.remove("placement--invalid");
    });
    this.btn.removeAttribute("disabled");
  };

  /* adds the visual class placement--valid or placement--invalid based on the tileNum chosen by the user, disables the submit btn if it fails placement check */

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
const userView = new GameBoardUserView(user);

/* subscriptions */

_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__.handleComputerAttack.subscribe(userView.handleAttackView);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.validityViews.subscribe(userView.handlePlacementValidityView);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.createShipView.subscribe(userView.handlePlacementView);

/***/ }),

/***/ "./src/components/views/gameboard--user/ship-info/ship-info--user.js":
/*!***************************************************************************!*\
  !*** ./src/components/views/gameboard--user/ship-info/ship-info--user.js ***!
  \***************************************************************************/
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

/***/ "./src/components/views/gameboard--user/ship-info/ship-info__views--user.js":
/*!**********************************************************************************!*\
  !*** ./src/components/views/gameboard--user/ship-info/ship-info__views--user.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ship_info_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship-info--user */ "./src/components/views/gameboard--user/ship-info/ship-info--user.js");
/* harmony import */ var _utils_display_radio_value__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/display-radio-value */ "./src/utils/display-radio-value.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../pub-subs/events */ "./src/components/pub-subs/events.js");



const shipPlacement = {
  tileNum: 0,
  updateNum(value) {
    this.tileNum = value;
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.input.publish();
  },
  resetNum() {
    this.tileNum = 0;
  }
};
function createShipInfo() {
  const {
    tileNum
  } = shipPlacement;
  const length = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_1__["default"])("ship");
  const direction = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_1__["default"])("direction");
  const shipInfo = new _ship_info_user__WEBPACK_IMPORTED_MODULE_0__["default"](tileNum, length, direction);
  return shipInfo;
}
function publishShipInfoCheck() {
  const shipInfo = createShipInfo();
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.shipInfo.publish(shipInfo);
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
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.createShip.publish(shipInfo);
    shipPlacement.resetNum();
  }
}
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.input.subscribe(publishShipInfoCheck);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.shipPlaceBtn.subscribe(publishShipInfoCreate);

/***/ }),

/***/ "./src/components/views/player--computer/player--computer.js":
/*!*******************************************************************!*\
  !*** ./src/components/views/player--computer/player--computer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ "./src/components/common/player/player.js");
/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/get-random-num */ "./src/utils/get-random-num.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");





class ComputerPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(pubSub) {
    super();
    this.pubSub = pubSub;
  }

  /* holds information on any ship that was found */

  foundShip = {
    found: false,
    hit: false,
    coordinates: [],
    difference: null,
    endFound: false,
    end: null
  };

  /* receives information on the last attack and adjusts the foundShip object accordingly */

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

  /* generates a coordinate (either top, btm, left, or right) that is next to the coordinate passed */

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

  /* computer attack logic */

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
    this.pubSub.publish(num);
    return num;
  };
}
function initCompPlayer() {
  const computerPlayer = new ComputerPlayer(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_4__.computerAttack);
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_2__.userAttack.subscribe(computerPlayer.attack);
  _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_4__.handleComputerAttack.subscribe(computerPlayer.wasAttackSuccess);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.attackStage.subscribe(initCompPlayer);
/* harmony default export */ __webpack_exports__["default"] = (ComputerPlayer);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Li9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1hdHRhY2stc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9zaGlwLWluZm8uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLyogY3JlYXRlcyBzaW5nbGUgdGlsZSB3aXRoIGV2ZW50IGxpc3RlbmVyICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBpZClcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICByZXR1cm4gdGlsZTtcbn1cblxuLyogY3JlYXRlcyAxMDAgdGlsZXMgd2l0aCBldmVudCBsaXN0ZW5lcnMgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGlsZXM7XG4iLCJpbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuLyogY2xhc3MgdXNlZCB0byB1cGRhdGUgdGhlIERPTSBiYXNlZCBvbiBpdCdzIGNvcnJlc3BvbmRpbmcgZ2FtZWJvYXJkICovXG5cbmNsYXNzIEdhbWVCb2FyZFZpZXcge1xuXG4gIC8qIHN0cmluZyBpcyB1c2VkIHRvIHF1ZXJ5IHRoZSBjb3JyZWN0IGdhbWVib2FyZCwgaXMgY29tcHV0ZXIgb3IgdXNlciAqL1xuXG4gIGNvbnN0cnVjdG9yKHN0cmluZykgeyAgXG4gICAgaWYgKHN0cmluZyAhPT0gXCJjb21wdXRlclwiICYmIHN0cmluZyAhPT0gXCJ1c2VyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWVCb2FyZFZpZXcgY3JlYXRlZCB3aXRoIGluY29ycmVjdCBzdHJpbmdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgfVxuICB9XG5cbiAgLyogdXBkYXRlcyB0aWxlcyBjbGFzc2VzIGZyb20gaGl0IHRvIHN1bmsgKi9cblxuICBzdGF0aWMgdXBkYXRlU3Vuayh0aWxlKSB7XG4gICAgaWYgKHRpbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZXBsYWNlKFwiaGl0XCIsIFwic3Vua1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwic3Vua1wiKTtcbiAgICB9XG4gIH1cblxuICAvKiBnZXRzIHRpbGUgc3RhdHVzICovXG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiZ2FtZWJvYXJkX190aWxlLS1oaXRcIiA6IFwiZ2FtZWJvYXJkX190aWxlLS1taXNzXCI7XG4gIH1cblxuICAvKiBxdWVyeSB0aWxlIGJhc2VkIG9uIHN0cmluZyBhbmQgZGF0YS1pZCAqL1xuXG4gIHF1ZXJ5VGlsZSA9IGRhdGFJZCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZGF0YUlkfVwiXWApXG5cbiAgLyogb25jZSBhIHNoaXAgaXMgc3VuayByZXBsYWNlcyB0aGUgaGl0IGNsYXNzIHdpdGggc3VuayBjbGFzcyBvbiBhbGwgdGhlIHNoaXBzIHRpbGVzICovXG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUoZWxlbWVudCk7XG4gICAgICBHYW1lQm9hcmRWaWV3LnVwZGF0ZVN1bmsodGlsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiBsYWJlbHMgdGlsZXMgd2l0aCBoaXQsIG1pc3MsIHN1bmssIGNsYXNzZXMuIElmIGFsbCBzaGlwJ3Mgc3VuayBwdWJsaXNoZXMgdGhlIHN0cmluZyB0byBpbml0aWFsaXplIGdhbWUgb3ZlciBwdWIgc3ViICovXG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgICBpZiAob2JqLmdhbWVvdmVyKSB7XG4gICAgICAgIGluaXQuZ2FtZW92ZXIucHVibGlzaCh0aGlzLnN0cmluZylcbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnF1ZXJ5VGlsZShvYmoudGlsZSk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlldy5nZXRTdGF0dXMob2JqKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZFZpZXc7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIC8qIHRoZSBwdWIgc3ViIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgb3Bwb25lbnRzIGF0dGFjayAqL1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIgKi9cblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIsIGFjY2VwdHMgYm90aCBhcnJheXMgYW5kIHNpbmdsZSBvYmplY3RzICovXG5cbiAgc2V0IHNoaXBzKHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnNoaXBzQXJyID0gdGhpcy5zaGlwc0Fyci5jb25jYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNoaXBzQXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29ycyBmb3IgbWlzc2VkQXJyICovXG5cbiAgZ2V0IG1pc3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5taXNzZWRBcnI7XG4gIH1cblxuICBzZXQgbWlzc2VkKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubWlzc2VkLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yIChcIlRoZSBzYW1lIHRpbGUgd2FzIGF0dGFja2VkIHR3aWNlIVwiKVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gICAgLyogQ2FsY3VsYXRlcyB0aGUgbWF4IGFjY2VwdGFibGUgdGlsZSBmb3IgYSBzaGlwIGRlcGVuZGluZyBvbiBpdHMgc3RhcnQgKHRpbGVOdW0pLlxuICBmb3IgZXguIElmIGEgc2hpcCBpcyBwbGFjZWQgaG9yaXpvbnRhbGx5IG9uIHRpbGUgMjEgbWF4IHdvdWxkIGJlIDMwICAqL1xuXG4gIHN0YXRpYyBjYWxjTWF4KG9iaikge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBvYmoudGlsZU51bSA+IDEwKSB7XG4gICAgICBpZiAob2JqLnRpbGVOdW0gJSAxMCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqLnRpbGVOdW1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG1heCA9ICtgJHtvYmoudGlsZU51bS50b1N0cmluZygpLmNoYXJBdCgwKX0wYCArIDEwO1xuICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyAxMCA6IDEwMDtcbiAgICByZXR1cm4gbWF4O1xuICB9XG5cbiAgLyogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIGluIHRpbGUgbnVtYmVycy4gVGhlIG1pbnVzIC0xIGFjY291bnRzIGZvciB0aGUgdGlsZU51bSB0aGF0IGlzIGFkZGVkIGluIHRoZSBpc1Rvb0JpZyBmdW5jICovXG5cbiAgc3RhdGljIGNhbGNMZW5ndGgob2JqKSB7XG4gICAgcmV0dXJuIG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IG9iai5sZW5ndGggLSAxXG4gICAgICA6IChvYmoubGVuZ3RoIC0gMSkgKiAxMDtcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiB0aGUgc2hpcCBwbGFjZW1lbnQgd291bGQgYmUgbGVnYWwsIG9yIGlmIHRoZSBzaGlwIGlzIHRvbyBiaWcgdG8gYmUgcGxhY2VkIG9uIHRoZSB0aWxlICovXG5cbiAgc3RhdGljIGlzVG9vQmlnKG9iaikge1xuICAgIGNvbnN0IG1heCA9IEdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IEdhbWVCb2FyZC5jYWxjTGVuZ3RoKG9iaik7XG4gICAgaWYgKG9iai50aWxlTnVtICsgc2hpcExlbmd0aCA8PSBtYXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiBjaGVja3MgaWYgY29vcmRpbmF0ZXMgYWxyZWFkeSBoYXZlIGEgc2hpcCBvbiB0aGVtICovXG5cbiAgaXNUYWtlbihjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiByZXR1cm5zIHRydWUgaWYgYSBzaGlwIGlzIGFscmVhZHkgcGxhY2VkIG9uIHRpbGVzIG5laWdoYm9yaW5nIHBhc3NlZCBjb29yZGluYXRlcyAqL1xuXG4gIGlzTmVpZ2hib3JpbmcoY29vcmRpbmF0ZXMsIGRpcmVjdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIFBsYWNlbWVudFxuICAgICAgLyogTEVGVCBhbmQgUklHSFQgKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAxKSB7XG4gICAgICAgIC8vIGxlZnQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlIG9uIHRoZSByaWdodFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlIG9uIHRoZSBsZWZ0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdGhlIGxlZnQgb3IgcmlnaHQgYm9yZGVyLCBhZGRzIGJvdGggbGVmdCBhbmQgcmlnaHQgdGlsZXNcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvKiBUT1AgYW5kIEJPVFRPTSAqL1xuICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgIC8vIG5vIGNoZWNrcyBmb3IgdG9wIGFuZCBib3R0b20gYm9yZGVycywgc2luY2UgaW1wb3NzaWJsZSB0byBwbGFjZSBzaGlwIG91dHNpZGUgdGhlIGdyaWRcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMTApLFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxMClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZlcnRpY2FsIFBsYWNlbWVudFxuICAgICAgLyogTEVGVCBhbmQgUklHSFQgKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAxKSB7XG4gICAgICAgIC8vIGxlZnQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyByaWdodCBib3JkZXIgb25seSBhZGRzIHRpbGVzIG9uIHRoZSBsZWZ0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpLFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvKiBUT1AgYW5kIEJPVFRPTSAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdIDwgMTEpIHtcbiAgICAgICAgLy8gdG9wIGJvcmRlciwgYWRkcyBvbmx5IGJvdHRvbSB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxMCk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdID4gOTApIHtcbiAgICAgICAgLy8gYm90dG9tIGJvcmRlciwgYWRkcyBvbmx5IHRvcCB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRvcCBvciBib3R0b20gYm9yZGVyLCBhZGRzIHRoZSB0b3AgYW5kIGJvdHRvbSB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMTBdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDEwXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIGlmIHNoaXAgcGxhY2VkIG9uIG5laWdoYm9yaW5nIHRpbGVzIHJldHVybnMgdHJ1ZSAqL1xuICAgIHJldHVybiB0aGlzLmlzVGFrZW4oY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMpO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIHRoZSB0aGUgdGlsZSBudW0gc2VsZWN0ZWQgYnkgb3Bwb25lbnQgaGFzIGEgc2hpcCwgaWYgaGl0IGNoZWNrcyBpZiBzaGlwIGlzIHN1bmssIGlmIHN1bmsgY2hlY2tzIGlmIGdhbWUgaXMgb3ZlciwgZWxzZSBhZGRzIHRpbGUgbnVtIHRvIG1pc3NlZCBhcnJheSAgKi9cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgICAgIGhpdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1bms6IHRydWUsXG4gICAgICAgICAgICB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiB0aGlzLmlzT3ZlcigpXG4gICAgICAgICAgICA/IHRoaXMucHViU3ViLnB1Ymxpc2goeyAuLi5vYmosIC4uLnsgZ2FtZW92ZXI6IHRydWUgfSB9KVxuICAgICAgICAgICAgOiB0aGlzLnB1YlN1Yi5wdWJsaXNoKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkID0gbnVtO1xuXG4gICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogZmFsc2UsIHN1bms6IGZhbHNlIH0pO1xuICB9O1xuXG4gIC8qIGNhbGxlZCB3aGVuIGEgc2hpcCBpcyBzdW5rLCByZXR1cm5zIEEpIEdBTUUgT1ZFUiBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3IgQikgU1VOSyBpZiB0aGVyZSdzIG1vcmUgc2hpcHMgbGVmdCAqL1xuXG4gIGlzT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjaGVjayA9IHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCIvKiBwbGF5ZXIgYmFzZSBjbGFzcyAqL1xuXG5jbGFzcyBQbGF5ZXIge1xuXG4gIHByZXZpb3VzQXR0YWNrcyA9IFtdXG4gIFxuICBnZXQgYXR0YWNrQXJyKCkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzQXR0YWNrcztcbiAgfVxuXG4gIHNldCBhdHRhY2tBcnIodmFsdWUpIHtcbiAgICB0aGlzLnByZXZpb3VzQXR0YWNrcy5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGlzTmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuICF0aGlzLmF0dGFja0Fyci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgXG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFNoaXAuY3JlYXRlQ29vckFycihvYmopO1xuICB9XG5cbiAgdGltZXNIaXQgPSAwO1xuXG4gIHN1bmsgPSBmYWxzZTtcblxuICBzdGF0aWMgY3JlYXRlQ29vckFycihvYmopIHtcbiAgICBjb25zdCBhcnIgPSBbK29iai50aWxlTnVtXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSwgZ2FtZW92ZXIgYXMgaW5pdEdhbWVvdmVyIH0gZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IGF0dGFjayBhcyB1c2VyQ2xpY2tBdHRhY2sgfSBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCI7IFxuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuLyogaGlkZXMgdGhlIHBsYWNlbWVudCBmb3JtICovXG5cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybVwiKTtcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG4vKiBzaG93J3MgdGhlIGNvbXB1dGVyJ3MgYm9hcmQgKi9cblxuZnVuY3Rpb24gc2hvd0NvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuLyogcHVibGlzaCB0aGUgdGlsZSdzIGRhdGEtaWQgKi9cblxuZnVuY3Rpb24gcHVibGlzaERhdGFJZCgpIHtcbiAgY29uc3Qge2lkfSA9IHRoaXMuZGF0YXNldDtcbiAgdXNlckNsaWNrQXR0YWNrLnB1Ymxpc2goaWQpXG59XG5cbi8qIGNyZWF0ZXMgdGlsZXMgZm9yIHRoZSB1c2VyIGdhbWVib2FyZCwgYW5kIHRpbGVzIHdpdGggZXZlbnRMaXN0ZW5lcnMgZm9yIHRoZSBjb21wdXRlciBnYW1lYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogY3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xuICByZXR1cm4gYnRuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBoMS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faGVhZGluZ1wiKTtcbiAgaDEudGV4dENvbnRlbnQgPSBcIkdBTUUgT1ZFUlwiO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDEpO1xuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gIHN0cmluZyA9PT0gXCJ1c2VyXCJcbiAgICA/IChoMy50ZXh0Q29udGVudCA9IFwiWU9VIExPU1RcIilcbiAgICA6IChoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiKTtcbiAgZGl2LmFwcGVuZENoaWxkKGgzKTtcbiAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZU5ld0dhbWVCdG4oKSk7XG4gIHJldHVybiBkaXY7XG59XG5cbmZ1bmN0aW9uIHNob3dHYW1lT3ZlcihzdHJpbmcpIHtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICBjb25zdCBub3RpZmljYXRpb24gPSBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZyk7XG4gIG1haW4uYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcbn1cblxuLyogU3Vic2NyaWJlIHRvIGluaXRpYWxpemluZyBwdWItc3VicyAqL1xuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKHNob3dDb21wQm9hcmQpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0QXR0YWNrU3RhZ2VUaWxlcyk7XG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGhpZGVGb3JtKTtcbmluaXRHYW1lb3Zlci5zdWJzY3JpYmUoc2hvd0dhbWVPdmVyKTtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi9sYXlvdXQtLWF0dGFjay1zdGFnZVwiO1xuaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0IHtcbiAgcGxhY2VtZW50U3RhZ2UgYXMgaW5pdFBsYWNlbWVudFN0YWdlLFxuICBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsXG59IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5mdW5jdGlvbiBoaWRlQ29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIGFkZElucHV0TGlzdGVuZXJzKCkge1xuICBjb25zdCBmb3JtSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG4gIGZvcm1JbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHVzZXJDbGljay5zaGlwUGxhY2VCdG4ucHVibGlzaCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHVibGlzaERhdGFJZCgpIHtcbiAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhc2V0O1xuICB1c2VyQ2xpY2sucGlja1BsYWNlbWVudC5wdWJsaXNoKGlkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkICovXG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkLS11c2VyIC5nYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRGF0YUlkKTtcbiAgfSk7XG59XG5cbi8qIGluaXRpYWxpemF0aW9uIHN1YnNjcmlwdGlvbnMgKi9cblxuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRCdG5MaXN0ZW5lcik7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZElucHV0TGlzdGVuZXJzKTtcbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoaGlkZUNvbXBCb2FyZCk7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGNyZWF0ZVBsYWNlbWVudFRpbGVzKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUocmVtb3ZlRXZlbnRMaXN0ZW5lcnMpO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7Y29tcHV0ZXJBdHRhY2ssIGhhbmRsZUNvbXB1dGVyQXR0YWNrfSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgdXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlVXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayx9O1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBjcmVhdGVTaGlwSW5mbygpIHB1Ymxpc2hlcyBhIHNoaXBJbmZvIG9iai4gZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBpcyBzdWJzY3JpYmVkIGFuZCBjaGVja3Mgd2hldGhlciBhIHNoaXAgY2FuIGJlIHBsYWNlZCB0aGVyZSAqL1xuXG5jb25zdCBzaGlwSW5mbyA9IG5ldyBQdWJTdWIoKTtcblxuLyogZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBwdWJsaXNoZXMgYW4gb2JqIHdpdGggYSBib28uIHZhbGlkIHByb3BlcnR5IGFuZCBhIGxpc3Qgb2YgY29vcmRpbmF0ZXMuICovXG5cbmNvbnN0IHZhbGlkaXR5Vmlld3MgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gcGxhY2Ugc2hpcCBidG4gaXMgcHJlc3NlZCBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB3aWxsIGNyZWF0ZSBzaGlwSW5mbyAqL1xuXG5jb25zdCBzaGlwUGxhY2VCdG4gPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIGNyZWF0ZXMgdGhlIHNoaXBJbmZvLiBUaGUgZ2FtZWJvYXJkLnBsYWNlU2hpcCAqL1xuXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcgYWRkcyBwbGFjZW1lbnQtc2hpcCBjbGFzcyB0byB0aWxlcyAqL1xuXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyBhdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UsIGdhbWVvdmVyIH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuLyogcmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLCBuZWlnaGJvcmluZyBvdGhlciBzaGlwcywgb3IgdG9vIGJpZyAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBzaGlwLmRpcmVjdGlvbikgfHwgR2FtZUJvYXJkLmlzVG9vQmlnKHNoaXBJbmZvKSApIHtcbiAgICAgIHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgICBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgfVxufVxuXG4vKiBpbml0aWFsaXplIGNvbXB1dGVyIGdhbWUgYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbnN0IHNoaXBzQXJyID0gWzUsIDQsIDMsIDJdXG5cbiAgICBzaGlwc0Fyci5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwKVxuICAgIH0pO1xuXG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFZpZXcoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXcuaGFuZGxlQXR0YWNrVmlldyk7XG5cbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBjcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mbztcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssIGNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UgYXMgaW5pdFBsYWNlbWVudFN0YWdlIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIGNoZWNrcyBzaGlwIHZhbGlkaXR5ICovXG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhvYmopIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSB1c2VyIGdhbWUgYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdFVzZXJHQigpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0SGFuZGxlQXR0YWNrKVxufVxuXG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGluaXRVc2VyR0IpXG5cblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3IGV4dGVuZHMgR2FtZUJvYXJkVmlldyB7XG5cbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgcmFkaW8gaW5wdXQgZm9yIHRoYXQgc2hpcCBpcyBoaWRkZW4gKi9cblxuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG5cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKTtcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiBjbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cblxuICBjbGVhclZhbGlkaXR5VmlldyA9ICgpID0+IHtcbiAgICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkX190aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSk7XG4gICAgdGhpcy5idG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gIH07XG5cbiAgLyogYWRkcyB0aGUgdmlzdWFsIGNsYXNzIHBsYWNlbWVudC0tdmFsaWQgb3IgcGxhY2VtZW50LS1pbnZhbGlkIGJhc2VkIG9uIHRoZSB0aWxlTnVtIGNob3NlbiBieSB0aGUgdXNlciwgZGlzYWJsZXMgdGhlIHN1Ym1pdCBidG4gaWYgaXQgZmFpbHMgcGxhY2VtZW50IGNoZWNrICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBpZiAoIW9iai52YWxpZCkge1xuICAgICAgdGhpcy5idG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICBpZiAob2JqLnZhbGlkKSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIik7XG4gICAgfSk7XG4gIH07XG59XG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXcgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXcodXNlcik7XG5cbi8qIHN1YnNjcmlwdGlvbnMgKi9cblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5Vmlldyk7XG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcpO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICB9LFxuICByZXNldE51bSgpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSAwO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgcmV0dXJuIHNoaXBJbmZvO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICBjb25zdCBpc0NvbXBsZXRlID0gT2JqZWN0LnZhbHVlcyhzaGlwSW5mbykuZXZlcnkoKHZhbHVlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHZhbHVlICE9PSBmYWxzZSAmJlxuICAgICAgdmFsdWUgIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNDb21wbGV0ZSkge1xuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwLnB1Ymxpc2goc2hpcEluZm8pO1xuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTtcbiAgfVxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSk7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQge2F0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZX0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7XG4gIGNvbXB1dGVyQXR0YWNrLFxuICBoYW5kbGVDb21wdXRlckF0dGFjayxcbn0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgLyogaG9sZHMgaW5mb3JtYXRpb24gb24gYW55IHNoaXAgdGhhdCB3YXMgZm91bmQgKi9cblxuICBmb3VuZFNoaXAgPSB7XG4gICAgZm91bmQ6IGZhbHNlLFxuICAgIGhpdDogZmFsc2UsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgIGVuZDogbnVsbCxcbiAgfTtcblxuICAvKiByZWNlaXZlcyBpbmZvcm1hdGlvbiBvbiB0aGUgbGFzdCBhdHRhY2sgYW5kIGFkanVzdHMgdGhlIGZvdW5kU2hpcCBvYmplY3QgYWNjb3JkaW5nbHkgKi9cblxuICB3YXNBdHRhY2tTdWNjZXNzID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy5mb3VuZFNoaXAgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgICAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgICAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPSBNYXRoLmFicyhcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIG9iai50aWxlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9iai5oaXQgPT09IGZhbHNlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gZmFsc2U7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKiBnZW5lcmF0ZXMgYSBjb29yZGluYXRlIChlaXRoZXIgdG9wLCBidG0sIGxlZnQsIG9yIHJpZ2h0KSB0aGF0IGlzIG5leHQgdG8gdGhlIGNvb3JkaW5hdGUgcGFzc2VkICovXG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICAvKiBjb21wdXRlciBhdHRhY2sgbG9naWMgKi9cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgNzApIHtcbiAgICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIFB1Ymxpc2ggYW5kIEFkZCB0byBhcnIgKi9cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgdGhpcy5wdWJTdWIucHVibGlzaChudW0pO1xuICAgIHJldHVybiBudW07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wUGxheWVyKCkge1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBDb21wdXRlclBsYXllcihjb21wdXRlckF0dGFjayk7XG4gIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLmF0dGFjayk7XG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclBsYXllci53YXNBdHRhY2tTdWNjZXNzKTtcbn1cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG5cbmV4cG9ydCBkZWZhdWx0IENvbXB1dGVyUGxheWVyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UgfWZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcblxuIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cbiAgXG4gIGF0dGFjayA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzdXBlci5pc05ldyh2YWx1ZSkpIHtcbiAgICAgIHN1cGVyLmF0dGFja0FyciA9IHZhbHVlO1xuICAgICAgdGhpcy5wdWJTdWIucHVibGlzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZFwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0UGxheWVyKCkge1xuICBjb25zdCBwbGF5ZXIgPSBuZXcgVXNlclBsYXllcih1c2VyQXR0YWNrKTtcbiAgdXNlckNsaWNrLmF0dGFjay5zdWJzY3JpYmUocGxheWVyLmF0dGFjayk7XG59XG5cbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVUaWxlIiwiaWQiLCJjYWxsYmFjayIsInRpbGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY3JlYXRlVGlsZXMiLCJkaXYiLCJpIiwiYXBwZW5kQ2hpbGQiLCJpbml0IiwiR2FtZUJvYXJkVmlldyIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwiRXJyb3IiLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwicXVlcnlUaWxlIiwiZGF0YUlkIiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsImdhbWVvdmVyIiwicHVibGlzaCIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwibWlzc2VkQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWQiLCJpbmNsdWRlcyIsImNhbGNNYXgiLCJkaXJlY3Rpb24iLCJ0aWxlTnVtIiwibWF4IiwidG9TdHJpbmciLCJjaGFyQXQiLCJjYWxjTGVuZ3RoIiwibGVuZ3RoIiwiaXNUb29CaWciLCJzaGlwTGVuZ3RoIiwiaXNUYWtlbiIsImNvb3JkaW5hdGVzIiwieSIsImlzTmVpZ2hib3JpbmciLCJjb29yZGluYXRlc0FsbE5laWdoYm9ycyIsIm1hcCIsImNvb3IiLCJoYW5kbGVBdHRhY2siLCJudW0iLCJpc1N1bmsiLCJpc092ZXIiLCJjaGVjayIsImV2ZXJ5Iiwic2hpcCIsIlBsYXllciIsInByZXZpb3VzQXR0YWNrcyIsImF0dGFja0FyciIsImlzTmV3IiwiUHViU3ViIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwYXlsb2FkIiwiU2hpcCIsImNyZWF0ZUNvb3JBcnIiLCJ0aW1lc0hpdCIsImFyciIsImF0dGFja1N0YWdlIiwiaW5pdEF0dGFja1N0YWdlIiwiaW5pdEdhbWVvdmVyIiwiYXR0YWNrIiwidXNlckNsaWNrQXR0YWNrIiwiZ2FtZUJvYXJkRGl2Q29tcHV0ZXIiLCJoaWRlRm9ybSIsImZvcm0iLCJzaG93Q29tcEJvYXJkIiwiY29tcEJvYXJkIiwicmVtb3ZlIiwicHVibGlzaERhdGFJZCIsImRhdGFzZXQiLCJpbml0QXR0YWNrU3RhZ2VUaWxlcyIsImNyZWF0ZU5ld0dhbWVCdG4iLCJidG4iLCJ0ZXh0Q29udGVudCIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwicGxhY2VtZW50U3RhZ2UiLCJpbml0UGxhY2VtZW50U3RhZ2UiLCJ1c2VyQ2xpY2siLCJoaWRlQ29tcEJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImFkZElucHV0TGlzdGVuZXJzIiwiZm9ybUlucHV0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbnB1dCIsImFkZEJ0bkxpc3RlbmVyIiwicGxhY2VTaGlwQnRuIiwic2hpcFBsYWNlQnRuIiwicGlja1BsYWNlbWVudCIsImNyZWF0ZVBsYWNlbWVudFRpbGVzIiwiZ2FtZUJvYXJkRGl2VXNlciIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbXB1dGVyQXR0YWNrIiwiaGFuZGxlQ29tcHV0ZXJBdHRhY2siLCJ1c2VyQXR0YWNrIiwiaGFuZGxlVXNlckF0dGFjayIsInNoaXBJbmZvIiwidmFsaWRpdHlWaWV3cyIsImNyZWF0ZVNoaXAiLCJjcmVhdGVTaGlwVmlldyIsIlNoaXBJbmZvIiwiQ29tcHV0ZXJHYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJpbml0Q29tcEdCIiwiY29tcHV0ZXIiLCJjb21wdXRlclZpZXciLCJnZXRSYW5kb21OdW0iLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJnZXRSYW5kb21UaWxlTnVtIiwiVXNlckdhbWVCb2FyZCIsImlzVmFsaWQiLCJ2YWxpZCIsInB1Ymxpc2hWYWxpZGl0eSIsInB1Ymxpc2hQbGFjZVNoaXAiLCJpbml0VXNlckdCIiwidXNlckJvYXJkIiwiaW5pdEhhbmRsZUF0dGFjayIsIkdhbWVCb2FyZFVzZXJWaWV3IiwiaGlkZVJhZGlvIiwicmFkaW9JbnB1dCIsInJhZGlvTGFiZWwiLCJuZXh0U2hpcENoZWNrZWQiLCJyYWRpbyIsImNoZWNrZWQiLCJjbGVhclZhbGlkaXR5VmlldyIsInJlbW92ZUF0dHJpYnV0ZSIsImhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyIsImNvb3JkaW5hdGUiLCJoYW5kbGVQbGFjZW1lbnRWaWV3IiwidXNlciIsInVzZXJWaWV3IiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImJpbmQiLCJDb21wdXRlclBsYXllciIsImZvdW5kU2hpcCIsImZvdW5kIiwiZGlmZmVyZW5jZSIsImVuZEZvdW5kIiwiZW5kIiwid2FzQXR0YWNrU3VjY2VzcyIsIk1hdGgiLCJhYnMiLCJyYW5kb21TaWRlQXR0YWNrIiwic2lkZXMiLCJvcGVyYXRvcnMiLCJzaWduIiwibWV0aG9kIiwiYSIsImIiLCJmbG9vciIsInJhbmRvbSIsIm5ld0Nvb3IiLCJwcmV2Q29vciIsImNvb3JEaWZmIiwic29ydCIsImluaXRDb21wUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJVc2VyUGxheWVyIiwiaW5pdFBsYXllciIsInBsYXllciIsIm5hbWUiLCJpbnB1dHMiXSwic291cmNlUm9vdCI6IiJ9