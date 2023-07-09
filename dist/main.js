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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Yy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3BsYXllci9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLWF0dGFjay1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL3NoaXAtaW5mby5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby9zaGlwLWluZm8tLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9nZXQtcmFuZG9tLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBjcmVhdGVzIHNpbmdsZSB0aWxlIHdpdGggZXZlbnQgbGlzdGVuZXIgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG4vKiBjcmVhdGVzIDEwMCB0aWxlcyB3aXRoIGV2ZW50IGxpc3RlbmVycyAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUaWxlcztcbiIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG4vKiBjbGFzcyB1c2VkIHRvIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIGl0J3MgY29ycmVzcG9uZGluZyBnYW1lYm9hcmQgKi9cblxuY2xhc3MgR2FtZUJvYXJkVmlldyB7XG5cbiAgLyogc3RyaW5nIGlzIHVzZWQgdG8gcXVlcnkgdGhlIGNvcnJlY3QgZ2FtZWJvYXJkLCBpcyBjb21wdXRlciBvciB1c2VyICovXG5cbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7ICBcbiAgICBpZiAoc3RyaW5nICE9PSBcImNvbXB1dGVyXCIgJiYgc3RyaW5nICE9PSBcInVzZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZUJvYXJkVmlldyBjcmVhdGVkIHdpdGggaW5jb3JyZWN0IHN0cmluZ1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB9XG4gIH1cblxuICAvKiB1cGRhdGVzIHRpbGVzIGNsYXNzZXMgZnJvbSBoaXQgdG8gc3VuayAqL1xuXG4gIHN0YXRpYyB1cGRhdGVTdW5rKHRpbGUpIHtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlcGxhY2UoXCJoaXRcIiwgXCJzdW5rXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGdldHMgdGlsZSBzdGF0dXMgKi9cblxuICBzdGF0aWMgZ2V0U3RhdHVzKG9iaikge1xuICAgIHJldHVybiBvYmouaGl0ID8gXCJoaXRcIiA6IFwibWlzc1wiO1xuICB9XG5cbiAgLyogcXVlcnkgdGlsZSBiYXNlZCBvbiBzdHJpbmcgYW5kIGRhdGEtaWQgKi9cblxuICBxdWVyeVRpbGUgPSBkYXRhSWQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2RhdGFJZH1cIl1gKVxuXG4gIC8qIG9uY2UgYSBzaGlwIGlzIHN1bmsgcmVwbGFjZXMgdGhlIGhpdCBjbGFzcyB3aXRoIHN1bmsgY2xhc3Mgb24gYWxsIHRoZSBzaGlwcyB0aWxlcyAqL1xuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMucXVlcnlUaWxlKGVsZW1lbnQpO1xuICAgICAgR2FtZUJvYXJkVmlldy51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogbGFiZWxzIHRpbGVzIHdpdGggaGl0LCBtaXNzLCBzdW5rLCBjbGFzc2VzLiBJZiBhbGwgc2hpcCdzIHN1bmsgcHVibGlzaGVzIHRoZSBzdHJpbmcgdG8gaW5pdGlhbGl6ZSBnYW1lIG92ZXIgcHViIHN1YiAqL1xuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUob2JqLnRpbGUpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXcuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3O1xuIiwiY2xhc3MgR2FtZUJvYXJkIHtcblxuICAvKiB0aGUgcHViIHN1YiByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgdGhlIG9wcG9uZW50cyBhdHRhY2sgKi9cblxuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIHNoaXBzQXJyID0gW107XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyICovXG5cbiAgZ2V0IHNoaXBzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzQXJyO1xuICB9XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyLCBhY2NlcHRzIGJvdGggYXJyYXlzIGFuZCBzaW5nbGUgb2JqZWN0cyAqL1xuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvcnMgZm9yIG1pc3NlZEFyciAqL1xuXG4gIGdldCBtaXNzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlzc2VkQXJyO1xuICB9XG5cbiAgc2V0IG1pc3NlZCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLm1pc3NlZC5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciAoXCJUaGUgc2FtZSB0aWxlIHdhcyBhdHRhY2tlZCB0d2ljZSFcIilcbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaCh2YWx1ZSk7XG4gIH1cblxuICAgIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBHYW1lQm9hcmQuY2FsY01heChvYmopO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogcmV0dXJucyB0cnVlIGlmIGEgc2hpcCBpcyBhbHJlYWR5IHBsYWNlZCBvbiB0aWxlcyBuZWlnaGJvcmluZyBwYXNzZWQgY29vcmRpbmF0ZXMgKi9cblxuICBpc05laWdoYm9yaW5nKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgLy8gSG9yaXpvbnRhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEpO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAvLyBubyBjaGVja3MgZm9yIHRvcCBhbmQgYm90dG9tIGJvcmRlcnMsIHNpbmNlIGltcG9zc2libGUgdG8gcGxhY2Ugc2hpcCBvdXRzaWRlIHRoZSBncmlkXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEwKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMTApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWZXJ0aWNhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKSxcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA8IDExKSB7XG4gICAgICAgIC8vIHRvcCBib3JkZXIsIGFkZHMgb25seSBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSA+IDkwKSB7XG4gICAgICAgIC8vIGJvdHRvbSBib3JkZXIsIGFkZHMgb25seSB0b3AgdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0b3Agb3IgYm90dG9tIGJvcmRlciwgYWRkcyB0aGUgdG9wIGFuZCBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDEwXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxMFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBpZiBzaGlwIHBsYWNlZCBvbiBuZWlnaGJvcmluZyB0aWxlcyByZXR1cm5zIHRydWUgKi9cbiAgICByZXR1cm4gdGhpcy5pc1Rha2VuKGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiB0aGUgdGhlIHRpbGUgbnVtIHNlbGVjdGVkIGJ5IG9wcG9uZW50IGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIsIGVsc2UgYWRkcyB0aWxlIG51bSB0byBtaXNzZWQgYXJyYXkgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgICBoaXQ6IHRydWUsXG4gICAgICAgICAgICBzdW5rOiB0cnVlLFxuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc092ZXIoKVxuICAgICAgICAgICAgPyB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgLi4ub2JqLCAuLi57IGdhbWVvdmVyOiB0cnVlIH0gfSlcbiAgICAgICAgICAgIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZCA9IG51bTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBjYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2sgPSB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpO1xuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiLyogcGxheWVyIGJhc2UgY2xhc3MgKi9cblxuY2xhc3MgUGxheWVyIHtcblxuICBwcmV2aW91c0F0dGFja3MgPSBbXVxuICBcbiAgZ2V0IGF0dGFja0FycigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c0F0dGFja3M7XG4gIH1cblxuICBzZXQgYXR0YWNrQXJyKHZhbHVlKSB7XG4gICAgdGhpcy5wcmV2aW91c0F0dGFja3MucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBpc05ldyh2YWx1ZSkge1xuICAgIHJldHVybiAhdGhpcy5hdHRhY2tBcnIuaW5jbHVkZXModmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFB1YlN1YiB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpXG4gIH1cbiBcbiAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuZmlsdGVyKHN1YiA9PiBzdWIhPT0gc3Vic2NyaWJlcilcbiAgfVxuXG4gIHB1Ymxpc2gocGF5bG9hZCkge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIocGF5bG9hZCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiY2xhc3MgU2hpcCB7XG4gIFxuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBTaGlwLmNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgc3RhdGljIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gICAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMTApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5pbXBvcnQgY3JlYXRlVGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsIGdhbWVvdmVyIGFzIGluaXRHYW1lb3ZlciB9IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgeyBhdHRhY2sgYXMgdXNlckNsaWNrQXR0YWNrIH0gZnJvbSBcIi4uL3B1Yi1zdWJzL2V2ZW50c1wiOyBcblxuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cbi8qIGhpZGVzIHRoZSBwbGFjZW1lbnQgZm9ybSAqL1xuXG5mdW5jdGlvbiBoaWRlRm9ybSgpIHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1cIik7XG4gIGZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuLyogc2hvdydzIHRoZSBjb21wdXRlcidzIGJvYXJkICovXG5cbmZ1bmN0aW9uIHNob3dDb21wQm9hcmQoKSB7XG4gIGNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59XG5cbi8qIHB1Ymxpc2ggdGhlIHRpbGUncyBkYXRhLWlkICovXG5cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHtpZH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGlja0F0dGFjay5wdWJsaXNoKGlkKVxufVxuXG4vKiBjcmVhdGVzIHRpbGVzIGZvciB0aGUgdXNlciBnYW1lYm9hcmQsIGFuZCB0aWxlcyB3aXRoIGV2ZW50TGlzdGVuZXJzIGZvciB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkICovXG5cbmZ1bmN0aW9uIGluaXRBdHRhY2tTdGFnZVRpbGVzKCkge1xuICBjcmVhdGVUaWxlcyhnYW1lQm9hcmREaXZDb21wdXRlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIGNyZWF0ZXMgZ2FtZW92ZXIgbm90aWZpY2F0aW9uIGFuZCBuZXcgZ2FtZSBidG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlTmV3R2FtZUJ0bigpIHtcbiAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgYnRuLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gIGJ0bi50ZXh0Q29udGVudCA9IFwiU3RhcnQgTmV3IEdhbWVcIjtcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uXCIpO1xuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgaDEuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2hlYWRpbmdcIik7XG4gIGgxLnRleHRDb250ZW50ID0gXCJHQU1FIE9WRVJcIjtcbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcbiAgY29uc3QgaDMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gIGgzLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19zdWItaGVhZGluZ1wiKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICBzdHJpbmcgPT09IFwidXNlclwiXG4gICAgPyAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBMT1NUXCIpXG4gICAgOiAoaDMudGV4dENvbnRlbnQgPSBcIllPVSBXT05cIik7XG4gIGRpdi5hcHBlbmRDaGlsZChoMyk7XG4gIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVOZXdHYW1lQnRuKCkpO1xuICByZXR1cm4gZGl2O1xufVxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cbi8qIFN1YnNjcmliZSB0byBpbml0aWFsaXppbmcgcHViLXN1YnMgKi9cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEF0dGFja1N0YWdlVGlsZXMpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSk7XG5pbml0R2FtZW92ZXIuc3Vic2NyaWJlKHNob3dHYW1lT3Zlcik7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7XG4gIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSxcbiAgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlLFxufSBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBhZGRJbnB1dExpc3RlbmVycygpIHtcbiAgY29uc3QgZm9ybUlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VtZW50LWZvcm1fX2lucHV0XCIpO1xuICBmb3JtSW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRCdG5MaXN0ZW5lcigpIHtcbiAgY29uc3QgcGxhY2VTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuICBwbGFjZVNoaXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB1c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnB1Ymxpc2goKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YXNldDtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaChpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYWNlbWVudFRpbGVzKCkge1xuICBjb25zdCBnYW1lQm9hcmREaXZVc2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLXVzZXJcIik7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdlVzZXIsIHB1Ymxpc2hEYXRhSWQpO1xufVxuXG4vKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZCAqL1xuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERhdGFJZCk7XG4gIH0pO1xufVxuXG4vKiBpbml0aWFsaXphdGlvbiBzdWJzY3JpcHRpb25zICovXG5cbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpO1xuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycyk7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGhpZGVDb21wQm9hcmQpO1xuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcyk7XG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKHJlbW92ZUV2ZW50TGlzdGVuZXJzKTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cblxuY29uc3Qgc2hpcEluZm8gPSBuZXcgUHViU3ViKCk7XG5cbi8qIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgcHVibGlzaGVzIGFuIG9iaiB3aXRoIGEgYm9vLiB2YWxpZCBwcm9wZXJ0eSBhbmQgYSBsaXN0IG9mIGNvb3JkaW5hdGVzLiAqL1xuXG5jb25zdCB2YWxpZGl0eVZpZXdzID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuIHBsYWNlIHNoaXAgYnRuIGlzIHByZXNzZWQgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgd2lsbCBjcmVhdGUgc2hpcEluZm8gKi9cblxuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgKi9cblxuY29uc3QgY3JlYXRlU2hpcCA9IG5ldyBQdWJTdWIoKTtcblxuLyogVXNlckdhbWVCb2FyZC5wdWJsaXNoUGxhY2VTaGlwIHB1Ymxpc2hlcyBzaGlwIGNvb3JkaW5hdGVzLiBHYW1lQm9hcmRVc2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgKi9cblxuY29uc3QgY3JlYXRlU2hpcFZpZXcgPSBuZXcgUHViU3ViKCk7XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHVzZXJDbGljayAqL1xuXG5leHBvcnQge3BpY2tQbGFjZW1lbnQsIGF0dGFjaywgaW5wdXQsIHNoaXBJbmZvLCB2YWxpZGl0eVZpZXdzLCBzaGlwUGxhY2VCdG4sIGNyZWF0ZVNoaXAsIGNyZWF0ZVNoaXBWaWV3fSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIHBsYWNlbWVudCBzdGFnZSAqL1xuXG5jb25zdCBwbGFjZW1lbnRTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG5jb25zdCBhdHRhY2tTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgZ2FtZSBvdmVyIGRpdiAqL1xuXG5jb25zdCBnYW1lb3ZlciA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgYXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlLCBnYW1lb3ZlciB9ICA7IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgU2hpcEluZm8gZnJvbSBcIi4vc2hpcC1pbmZvL3NoaXAtaW5mb1wiO1xuaW1wb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuXG5jbGFzcyBDb21wdXRlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG5cbi8qIHJlY3JlYXRlcyBhIHJhbmRvbSBzaGlwLCB1bnRpbCBpdHMgY29vcmRpbmF0ZXMgYXJlIG5vdCB0YWtlbiwgbmVpZ2hib3Jpbmcgb3RoZXIgc2hpcHMsIG9yIHRvbyBiaWcgKi9cblxuICBwbGFjZVNoaXAobGVuZ3RoKSB7XG4gICAgbGV0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgd2hpbGUgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgc2hpcC5kaXJlY3Rpb24pIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhzaGlwSW5mbykgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSBjb21wdXRlciBnYW1lIGJvYXJkICovXG5cbmZ1bmN0aW9uIGluaXRDb21wR0IoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckdhbWVCb2FyZChoYW5kbGVVc2VyQXR0YWNrKTtcbiAgICBjb25zdCBzaGlwc0FyciA9IFs1LCA0LCAzLCAyXVxuXG4gICAgc2hpcHNBcnIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcClcbiAgICB9KTtcblxuICAgIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyQm9hcmQuaGFuZGxlQXR0YWNrKTsgXG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wR0IpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlldyBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlld1wiO1xuaW1wb3J0IHsgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcblxuY29uc3QgY29tcHV0ZXIgPSBcImNvbXB1dGVyXCI7XG5cbmNvbnN0IGNvbXB1dGVyVmlldyA9IG5ldyBHYW1lQm9hcmRWaWV3KGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xuXG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG5mdW5jdGlvbiBnZXRSYW5kb21EaXJlY3Rpb24oKSB7XG4gIHJldHVybiBnZXRSYW5kb21OdW0oMikgPT09IDEgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tRGlyZWN0aW9uO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuLyogY3JlYXRlIGEgcmFuZG9tIHRpbGVOdW0gKi9cblxuZnVuY3Rpb24gZ2V0UmFuZG9tVGlsZU51bShsZW5ndGgsIGRpcmVjdGlvbikge1xuICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgIHJldHVybiArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDExLSBsZW5ndGgpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21UaWxlTnVtO1xuIiwiXG5pbXBvcnQgZ2V0UmFuZG9tRGlyZWN0aW9uIGZyb20gXCIuL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uXCI7XG5pbXBvcnQgZ2V0UmFuZG9tVGlsZU51bSBmcm9tIFwiLi9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW1cIjtcblxuY2xhc3MgU2hpcEluZm8ge1xuICBcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBnZXRSYW5kb21EaXJlY3Rpb24oKTtcbiAgICB0aGlzLnRpbGVOdW0gPSBnZXRSYW5kb21UaWxlTnVtKHRoaXMubGVuZ3RoLCB0aGlzLmRpcmVjdGlvbik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm87XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuICAvKiBjaGVja3Mgc2hpcCB2YWxpZGl0eSAqL1xuXG4gIGlzVmFsaWQgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCBHYW1lQm9hcmQuaXNUb29CaWcob2JqKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgb2JqLmRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXN9IFxuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMgfVxuICB9XG5cbiAgcHVibGlzaFZhbGlkaXR5ID0gKG9iaikgPT4ge1xuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBwbGFjZXMgc2hpcCBpbiBzaGlwc0FyciAqL1xuXG4gIHBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gc2hpcDtcbiAgfVxuXG4gIHB1Ymxpc2hQbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxhY2VTaGlwKG9iailcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcucHVibGlzaCh7Y29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMsIGxlbmd0aDogc2hpcC5sZW5ndGh9KVxuICB9XG59XG5cbi8qIGluaXRpYWxpemUgdXNlciBnYW1lIGJvYXJkICovXG5cbmZ1bmN0aW9uIGluaXRVc2VyR0IoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG4gIHVzZXJDbGljay5jcmVhdGVTaGlwLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFBsYWNlU2hpcCk7XG4gIGZ1bmN0aW9uIGluaXRIYW5kbGVBdHRhY2soKSB7XG4gICAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xuICB9XG4gIGluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShpbml0VXNlckdCKVxuXG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5jbGFzcyBHYW1lQm9hcmRVc2VyVmlldyBleHRlbmRzIEdhbWVCb2FyZFZpZXcge1xuXG4gIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIHJhZGlvIGlucHV0IGZvciB0aGF0IHNoaXAgaXMgaGlkZGVuICovXG5cbiAgc3RhdGljIGhpZGVSYWRpbyhvYmopIHtcbiAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3NoaXAtJHtvYmoubGVuZ3RofWApO1xuICAgIHJhZGlvSW5wdXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBjb25zdCByYWRpb0xhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihbYFtmb3I9XCJzaGlwLSR7b2JqLmxlbmd0aH1cIl1gXSk7XG4gICAgcmFkaW9MYWJlbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9XG5cbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSBuZXh0IHJhZGlvIGlucHV0IGlzIGNoZWNrZWQgc28gdGhhdCB5b3UgY2FuJ3QgcGxhY2UgdHdvIG9mIHRoZSBzYW1lIHNoaXBzIHR3aWNlLFxuICAgICB3aGVuIHRoZXJlIGFyZSBubyBtb3JlIHNoaXBzIHRvIHBsYWNlIG5leHRTaGlwQ2hlY2tlZCB3aWxsIGluaXRpYWxpemUgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG4gIHN0YXRpYyBuZXh0U2hpcENoZWNrZWQoKSB7XG4gICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGA6bm90KC5oaWRkZW4pW25hbWU9XCJzaGlwXCJdYCk7XG4gICAgaWYgKHJhZGlvID09PSBudWxsKSB7XG4gICAgICBpbml0LmF0dGFja1N0YWdlLnB1Ymxpc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyogY2xlYXJzIHRoZSB2YWxpZGl0eSBjaGVjayBvZiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkLiBJZiBpdCBwYXNzZXMgdGhlIGNoZWNrIGl0IHVubG9ja3MgdGhlIHBsYWNlIHNoaXAgYnRuICovXG5cbiAgY2xlYXJWYWxpZGl0eVZpZXcgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgIH0pO1xuICAgIHRoaXMuYnRuLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICB9O1xuXG4gIC8qIGFkZHMgdGhlIHZpc3VhbCBjbGFzcyBwbGFjZW1lbnQtLXZhbGlkIG9yIHBsYWNlbWVudC0taW52YWxpZCBiYXNlZCBvbiB0aGUgdGlsZU51bSBjaG9zZW4gYnkgdGhlIHVzZXIsIGRpc2FibGVzIHRoZSBzdWJtaXQgYnRuIGlmIGl0IGZhaWxzIHBsYWNlbWVudCBjaGVjayAqL1xuXG4gIGhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgaWYgKCFvYmoudmFsaWQpIHtcbiAgICAgIHRoaXMuYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIH1cbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG9iai52YWxpZCkge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGhhbmRsZVBsYWNlbWVudFZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIHRoaXMuY29uc3RydWN0b3IuaGlkZVJhZGlvKG9iaik7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5uZXh0U2hpcENoZWNrZWQoKTtcbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1zaGlwXCIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5jb25zdCB1c2VyID0gXCJ1c2VyXCI7XG5cbmNvbnN0IHVzZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFVzZXJWaWV3KHVzZXIpO1xuXG4vKiBzdWJzY3JpcHRpb25zICovXG5cbmhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVBdHRhY2tWaWV3KTtcbnVzZXJDbGljay52YWxpZGl0eVZpZXdzLnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpO1xudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWaWV3KTtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgdGlsZU51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy50aWxlTnVtID0gdmFsdWU7XG4gICAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBJbmZvKCkge1xuICBjb25zdCB7IHRpbGVOdW0gfSA9IHNoaXBQbGFjZW1lbnQ7XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIGNvbnN0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvVXNlcih0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIHJldHVybiBzaGlwSW5mbztcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnB1Ymxpc2goc2hpcEluZm8pO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKTtcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KCh2YWx1ZSkgPT4ge1xuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB2YWx1ZSAhPT0gZmFsc2UgJiZcbiAgICAgIHZhbHVlICE9PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbiAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcC5wdWJsaXNoKHNoaXBJbmZvKTtcbiAgICBzaGlwUGxhY2VtZW50LnJlc2V0TnVtKCk7XG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xudXNlckNsaWNrLmlucHV0LnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DaGVjayk7XG51c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DcmVhdGUpO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0IHthdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2V9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQge1xuICBjb21wdXRlckF0dGFjayxcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssXG59IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5cbmNsYXNzIENvbXB1dGVyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIC8qIGhvbGRzIGluZm9ybWF0aW9uIG9uIGFueSBzaGlwIHRoYXQgd2FzIGZvdW5kICovXG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgLyogcmVjZWl2ZXMgaW5mb3JtYXRpb24gb24gdGhlIGxhc3QgYXR0YWNrIGFuZCBhZGp1c3RzIHRoZSBmb3VuZFNoaXAgb2JqZWN0IGFjY29yZGluZ2x5ICovXG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgPT09IGZhbHNlICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyogZ2VuZXJhdGVzIGEgY29vcmRpbmF0ZSAoZWl0aGVyIHRvcCwgYnRtLCBsZWZ0LCBvciByaWdodCkgdGhhdCBpcyBuZXh0IHRvIHRoZSBjb29yZGluYXRlIHBhc3NlZCAqL1xuXG4gIHN0YXRpYyByYW5kb21TaWRlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaWRlcyA9IFsxLCAxMF07IC8vIGRhdGEgZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc2lkZXMgaXMgMTAsIGFuZCBob3Jpem9udGFsIHNpZGVzIGlzIDFcbiAgICBjb25zdCBvcGVyYXRvcnMgPSBbXG4gICAgICAvLyBhcnJheSBvZiBvcGVyYXRvcnMgKCssIC0pIHdoaWNoIGFyZSB1c2VkIHRvIGdlbmVyYXRlIGEgcmFuZG9tIG9wZXJhdG9yXG4gICAgICB7XG4gICAgICAgIHNpZ246IFwiK1wiLFxuICAgICAgICBtZXRob2QoYSwgYikge1xuICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNpZ246IFwiLVwiLFxuICAgICAgICBtZXRob2QoYSwgYikge1xuICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgICByZXR1cm4gb3BlcmF0b3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wZXJhdG9ycy5sZW5ndGgpXS5tZXRob2QoXG4gICAgICBjb29yZGluYXRlLFxuICAgICAgc2lkZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2lkZXMubGVuZ3RoKV1cbiAgICApOyAvLyBnZW5lcmF0ZXMgdGhlIGRhdGEgbnVtIG9mIGEgcmFuZG9tIHNpZGUgKGhvcml6b250YWwgbGVmdCA9IGhpdCBjb29yZGluYXRlIC0gMSAvIHZlcnRpY2FsIGJvdHRvbSA9IGhpdCBjb29yZGluYXRlICsxMCBldGMuKVxuICB9XG5cbiAgLyogY29tcHV0ZXIgYXR0YWNrIGxvZ2ljICovXG5cbiAgYXR0YWNrID0gKCkgPT4ge1xuICAgIGxldCBudW07XG4gICAgLyogQSkgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYnV0IHdhcyBvbmx5IGhpdCBvbmNlLCBzbyBpdCBpcyB1bmtub3duIHdoZXRoZXIgaXRzIGhvcml6b250YWwgb3IgdmVydGljYWwgKi9cbiAgICBpZiAodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBudW0gPSBDb21wdXRlclBsYXllci5yYW5kb21TaWRlQXR0YWNrKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKTtcbiAgICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSB8fCBudW0gPiAxMDAgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBDb21wdXRlclBsYXllci5yYW5kb21TaWRlQXR0YWNrKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKTsgLy8gaWYgdGhlIGdlbmVyYXRlZCBudW0gd2FzIGFscmVhZHkgYXR0YWNrZWQsIG9yIGl0J3MgdG9vIGJpZyBvciB0b28gc21hbGwgdG8gYmUgb24gdGhlIGJvYXJkLCBpdCBnZW5lcmF0ZXMgdGhlIG51bSBhZ2FpblxuICAgICAgfVxuICAgIC8qIEIpIGlmIGEgc2hpcCB3YXMgZm91bmQsIGFuZCB3YXMgaGl0IG1vcmUgdGhhbiBvbmNlLCB3aXRoIHRoZSBsYXN0IGF0dGFjayBhbHNvIGJlaW5nIGEgaGl0ICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSB0cnVlXG4gICAgKSB7XG4gICAgICAvKiBCKTEuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIG5vdCBmb3VuZCAqL1xuICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBuZXdDb29yID1cbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgcHJldkNvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICBjb25zdCBjb29yRGlmZiA9IHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgIGlmIChuZXdDb29yID4gcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yICsgY29vckRpZmY7XG4gICAgICAgIH0gZWxzZSBpZiAobmV3Q29vciA8IHByZXZDb29yKSB7XG4gICAgICAgICAgbnVtID0gbmV3Q29vciAtIGNvb3JEaWZmO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudW0gPiAxMDAgfHwgbnVtIDwgMSB8fCAhc3VwZXIuaXNOZXcobnVtKSkgeyAvLyBmb3IgZWRnZSBjYXNlcywgYW5kIHNpdHVhdGlvbnMgaW4gd2hpY2ggdGhlIGVuZCB0aWxlIHdhcyBhbHJlYWR5IGF0dGFja2VkXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9IG5ld0Nvb3I7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkgeyBcbiAgICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW1xuICAgICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgXSArIGNvb3JEaWZmO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIGNvb3JEaWZmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgLyogQikyLiBpZiB0aGUgZW5kIG9mIHRoZSBzaGlwIHdhcyBmb3VuZCAqLyAgXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXSArXG4gICAgICAgICAgICBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIGNvb3JEaWZmO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLyogQykgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGJlaW5nIGEgbWlzcyAqLyAgXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICBudW0gPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfVxuICAgIC8qIEQpIHNoaXAgd2FzIG5vdCBmb3VuZCAqLyAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA8IDcwKSB7XG4gICAgICAgIG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBQdWJsaXNoIGFuZCBBZGQgdG8gYXJyICovXG4gICAgc3VwZXIuYXR0YWNrQXJyID0gbnVtO1xuICAgIHRoaXMucHViU3ViLnB1Ymxpc2gobnVtKTtcbiAgICByZXR1cm4gbnVtO1xuICB9O1xufVxuXG5mdW5jdGlvbiBpbml0Q29tcFBsYXllcigpIHtcbiAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBuZXcgQ29tcHV0ZXJQbGF5ZXIoY29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclBsYXllci5hdHRhY2spO1xuICBoYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIud2FzQXR0YWNrU3VjY2Vzcyk7XG59XG5cbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBQbGF5ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBDb21wdXRlclBsYXllcjsiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IHsgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlIH1mcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlclBsYXllciBleHRlbmRzIFBsYXllciB7XG5cbiBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG4gIFxuICBhdHRhY2sgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc3VwZXIuaXNOZXcodmFsdWUpKSB7XG4gICAgICBzdXBlci5hdHRhY2tBcnIgPSB2YWx1ZTtcbiAgICAgIHRoaXMucHViU3ViLnB1Ymxpc2godmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWRcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFBsYXllcigpIHtcbiAgY29uc3QgcGxheWVyID0gbmV3IFVzZXJQbGF5ZXIodXNlckF0dGFjayk7XG4gIHVzZXJDbGljay5hdHRhY2suc3Vic2NyaWJlKHBsYXllci5hdHRhY2spO1xufVxuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRQbGF5ZXIpXG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJQbGF5ZXI7XG4iLCJcblxuZnVuY3Rpb24gZGlzcGxheVJhZGlvVmFsdWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJOYW1lIGhhcyB0byBiZSBhIHN0cmluZyFcIik7XG4gIH1cbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW25hbWU9XCIke25hbWV9XCJdYCk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChpbnB1dHNbaV0uY2hlY2tlZCkge1xuICAgICAgICByZXR1cm4gaW5wdXRzW2ldLnZhbHVlIFxuICAgICAgfSAgICAgICAgIFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRpc3BsYXlSYWRpb1ZhbHVlIiwiZnVuY3Rpb24gZ2V0UmFuZG9tTnVtKG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21OdW0gIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZVwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG5pbml0LnBsYWNlbWVudFN0YWdlLnB1Ymxpc2goKTsiXSwibmFtZXMiOlsiY3JlYXRlVGlsZSIsImlkIiwiY2FsbGJhY2siLCJ0aWxlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNyZWF0ZVRpbGVzIiwiZGl2IiwiaSIsImFwcGVuZENoaWxkIiwiaW5pdCIsIkdhbWVCb2FyZFZpZXciLCJjb25zdHJ1Y3RvciIsInN0cmluZyIsIkVycm9yIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInF1ZXJ5VGlsZSIsImRhdGFJZCIsInF1ZXJ5U2VsZWN0b3IiLCJ1cGRhdGVTdW5rVGlsZXMiLCJ0aWxlcyIsImZvckVhY2giLCJlbGVtZW50IiwiaGFuZGxlQXR0YWNrVmlldyIsInN1bmsiLCJnYW1lb3ZlciIsInB1Ymxpc2giLCJHYW1lQm9hcmQiLCJwdWJTdWIiLCJzaGlwc0FyciIsIm1pc3NlZEFyciIsInNoaXBzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJwdXNoIiwibWlzc2VkIiwiaW5jbHVkZXMiLCJjYWxjTWF4IiwiZGlyZWN0aW9uIiwidGlsZU51bSIsIm1heCIsInRvU3RyaW5nIiwiY2hhckF0IiwiY2FsY0xlbmd0aCIsImxlbmd0aCIsImlzVG9vQmlnIiwic2hpcExlbmd0aCIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsInkiLCJpc05laWdoYm9yaW5nIiwiY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMiLCJtYXAiLCJjb29yIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsIlNoaXAiLCJjcmVhdGVDb29yQXJyIiwidGltZXNIaXQiLCJhcnIiLCJhdHRhY2tTdGFnZSIsImluaXRBdHRhY2tTdGFnZSIsImluaXRHYW1lb3ZlciIsImF0dGFjayIsInVzZXJDbGlja0F0dGFjayIsImdhbWVCb2FyZERpdkNvbXB1dGVyIiwiaGlkZUZvcm0iLCJmb3JtIiwic2hvd0NvbXBCb2FyZCIsImNvbXBCb2FyZCIsInJlbW92ZSIsInB1Ymxpc2hEYXRhSWQiLCJkYXRhc2V0IiwiaW5pdEF0dGFja1N0YWdlVGlsZXMiLCJjcmVhdGVOZXdHYW1lQnRuIiwiYnRuIiwidGV4dENvbnRlbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsImNyZWF0ZUdhbWVPdmVyQWxlcnQiLCJoMSIsImgzIiwic2hvd0dhbWVPdmVyIiwibWFpbiIsIm5vdGlmaWNhdGlvbiIsInBsYWNlbWVudFN0YWdlIiwiaW5pdFBsYWNlbWVudFN0YWdlIiwidXNlckNsaWNrIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJhZGRJbnB1dExpc3RlbmVycyIsImZvcm1JbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5wdXQiLCJhZGRCdG5MaXN0ZW5lciIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsInBpY2tQbGFjZW1lbnQiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3IiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsIlVzZXJHYW1lQm9hcmQiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJHQiIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlldyIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlldyIsIlNoaXBJbmZvVXNlciIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInJlc2V0TnVtIiwiY3JlYXRlU2hpcEluZm8iLCJwdWJsaXNoU2hpcEluZm9DaGVjayIsInB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSIsImlzQ29tcGxldGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==