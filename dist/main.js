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
  tile.textContent = "";
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
        coordinatesAllNeighbors.push(coordinates[coordinates.length - 1] + 10, coordinates[0] - 10);
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
  const form = document.querySelector(".div--placement-form");
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
  btn.textContent = "New Game";
  btn.classList.add("game-over-notification__btn", "loc-game-over-notification__btn");
  btn.addEventListener("click", () => {
    window.location.reload();
  });
  return btn;
}
function createGameOverAlert(string) {
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.classList.add("game-over-notification__heading", "loc-game-over-notification__heading");
  h1.textContent = "GAME OVER";
  const h3 = document.createElement("h3");
  h3.classList.add("game-over-notification__sub-heading", "loc-game-over-notification__sub-heading");
  if (string === "user") {
    h3.textContent = "YOU LOST";
    div.classList.add("game-over-notification--loss");
  } else {
    h3.textContent = "YOU WON";
    div.classList.add("game-over-notification--win");
  }
  div.appendChild(h1);
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
function increaseGap() {
  const main = document.querySelector("main");
  main.setAttribute("style", "gap: 20px");
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

/* removes anchor cursor from user gameboard */
function removeAnchor() {
  const gameboard = document.querySelector(".gameboard--user");
  gameboard.setAttribute("style", "cursor: auto");
}

/* initialization subscriptions */

_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(addBtnListener);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(addInputListeners);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(hideCompBoard);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.placementStage.subscribe(createPlacementTiles);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.attackStage.subscribe(removeEventListeners);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.attackStage.subscribe(removeAnchor);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_5__.attackStage.subscribe(increaseGap);

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
    while (super.isTaken(ship.coordinates) || super.isNeighboring(ship.coordinates, ship.direction) || _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isTooBig(shipInfo)) {
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
    let num = +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString());
    while (num < 1 || num > 100) {
      num = +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString());
    }
    return num;
  }
  let num = +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString());
  while (num < 1 || num > 100) {
    num = +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(10).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString());
  }
  return num;
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
    if (super.isTaken(ship.coordinates) || _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"].isTooBig(obj) || super.isNeighboring(ship.coordinates, obj.direction)) {
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
      while (!super.isNew(num) || num < 1) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBOztBQUVBLFNBQVNBLFVBQVVBLENBQUNDLEVBQUUsRUFBRUMsUUFBUSxFQUFFO0VBQ2hDLE1BQU1DLElBQUksR0FBR0MsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0VBQzFDRixJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGlCQUFpQixDQUFDO0VBQ3JDSixJQUFJLENBQUNLLFlBQVksQ0FBQyxTQUFTLEVBQUVQLEVBQUUsQ0FBQztFQUNoQ0UsSUFBSSxDQUFDTSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUVQLFFBQVEsQ0FBQztFQUN4Q0MsSUFBSSxDQUFDTyxXQUFXLEdBQUUsRUFBRTtFQUNwQixPQUFPUCxJQUFJO0FBQ2I7O0FBRUE7O0FBRUEsU0FBU1EsV0FBV0EsQ0FBQ0MsR0FBRyxFQUFFVixRQUFRLEVBQUU7RUFDbEMsS0FBSyxJQUFJVyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLElBQUksR0FBRyxFQUFFQSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hDRCxHQUFHLENBQUNFLFdBQVcsQ0FBQ2QsVUFBVSxDQUFDYSxDQUFDLEVBQUVYLFFBQVEsQ0FBQyxDQUFDO0VBQzFDO0FBQ0Y7QUFFQSwrREFBZVMsV0FBVzs7Ozs7Ozs7Ozs7O0FDcEJ1Qjs7QUFFakQ7O0FBRUEsTUFBTUssYUFBYSxDQUFDO0VBRWxCOztFQUVBQyxXQUFXQSxDQUFDQyxNQUFNLEVBQUU7SUFDbEIsSUFBSUEsTUFBTSxLQUFLLFVBQVUsSUFBSUEsTUFBTSxLQUFLLE1BQU0sRUFBRTtNQUM5QyxNQUFNLElBQUlDLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQztJQUNoRSxDQUFDLE1BQU07TUFDTCxJQUFJLENBQUNELE1BQU0sR0FBR0EsTUFBTTtJQUN0QjtFQUNGOztFQUVBOztFQUVBLE9BQU9FLFVBQVVBLENBQUNqQixJQUFJLEVBQUU7SUFDdEIsSUFBSUEsSUFBSSxDQUFDRyxTQUFTLENBQUNlLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNsQ2xCLElBQUksQ0FBQ0csU0FBUyxDQUFDZ0IsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7SUFDdkMsQ0FBQyxNQUFNO01BQ0xuQixJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUM1QjtFQUNGOztFQUVBOztFQUVBLE9BQU9nQixTQUFTQSxDQUFDQyxHQUFHLEVBQUU7SUFDcEIsT0FBT0EsR0FBRyxDQUFDQyxHQUFHLEdBQUcsc0JBQXNCLEdBQUcsdUJBQXVCO0VBQ25FOztFQUVBOztFQUVBQyxTQUFTLEdBQUdDLE1BQU0sSUFBSXZCLFFBQVEsQ0FBQ3dCLGFBQWEsQ0FBRSxlQUFjLElBQUksQ0FBQ1YsTUFBTyxjQUFhUyxNQUFPLElBQUcsQ0FBQzs7RUFFaEc7O0VBRUFFLGVBQWVBLENBQUNMLEdBQUcsRUFBRTtJQUNuQkEsR0FBRyxDQUFDTSxLQUFLLENBQUNDLE9BQU8sQ0FBRUMsT0FBTyxJQUFLO01BQzdCLE1BQU03QixJQUFJLEdBQUcsSUFBSSxDQUFDdUIsU0FBUyxDQUFDTSxPQUFPLENBQUM7TUFDcENoQixhQUFhLENBQUNJLFVBQVUsQ0FBQ2pCLElBQUksQ0FBQztJQUNoQyxDQUFDLENBQUM7RUFDSjs7RUFFQTs7RUFFQThCLGdCQUFnQixHQUFJVCxHQUFHLElBQUs7SUFDMUIsSUFBSUEsR0FBRyxDQUFDVSxJQUFJLEVBQUU7TUFDWixJQUFJLENBQUNMLGVBQWUsQ0FBQ0wsR0FBRyxDQUFDO01BQ3pCLElBQUlBLEdBQUcsQ0FBQ1csUUFBUSxFQUFFO1FBQ2hCcEIsMERBQWEsQ0FBQ3FCLE9BQU8sQ0FBQyxJQUFJLENBQUNsQixNQUFNLENBQUM7TUFDcEM7SUFDRixDQUFDLE1BQU07TUFDTCxNQUFNZixJQUFJLEdBQUcsSUFBSSxDQUFDdUIsU0FBUyxDQUFDRixHQUFHLENBQUNyQixJQUFJLENBQUM7TUFDckNBLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUNTLGFBQWEsQ0FBQ08sU0FBUyxDQUFDQyxHQUFHLENBQUMsQ0FBQztJQUNsRDtFQUNGLENBQUM7QUFDSDtBQUVBLCtEQUFlUixhQUFhOzs7Ozs7Ozs7OztBQzVENUIsTUFBTXFCLFNBQVMsQ0FBQztFQUVkOztFQUVBcEIsV0FBV0EsQ0FBQ3FCLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0QjtFQUVBQyxRQUFRLEdBQUcsRUFBRTtFQUViQyxTQUFTLEdBQUcsRUFBRTs7RUFFZDs7RUFFQSxJQUFJQyxLQUFLQSxDQUFBLEVBQUc7SUFDVixPQUFPLElBQUksQ0FBQ0YsUUFBUTtFQUN0Qjs7RUFFQTs7RUFFQSxJQUFJRSxLQUFLQSxDQUFDQyxLQUFLLEVBQUU7SUFDZixJQUFJQyxLQUFLLENBQUNDLE9BQU8sQ0FBQ0YsS0FBSyxDQUFDLEVBQUU7TUFDeEIsSUFBSSxDQUFDSCxRQUFRLEdBQUcsSUFBSSxDQUFDQSxRQUFRLENBQUNNLE1BQU0sQ0FBQ0gsS0FBSyxDQUFDO0lBQzdDLENBQUMsTUFBTTtNQUNMLElBQUksQ0FBQ0gsUUFBUSxDQUFDTyxJQUFJLENBQUNKLEtBQUssQ0FBQztJQUMzQjtFQUNGOztFQUVBOztFQUVBLElBQUlLLE1BQU1BLENBQUEsRUFBRztJQUNYLE9BQU8sSUFBSSxDQUFDUCxTQUFTO0VBQ3ZCO0VBRUEsSUFBSU8sTUFBTUEsQ0FBQ0wsS0FBSyxFQUFFO0lBQ2hCLElBQUksSUFBSSxDQUFDSyxNQUFNLENBQUNDLFFBQVEsQ0FBQ04sS0FBSyxDQUFDLEVBQUU7TUFDL0IsTUFBTSxJQUFJdkIsS0FBSyxDQUFFLG1DQUFtQyxDQUFDO0lBQ3ZEO0lBQ0EsSUFBSSxDQUFDcUIsU0FBUyxDQUFDTSxJQUFJLENBQUNKLEtBQUssQ0FBQztFQUM1Qjs7RUFFRTtBQUNKOztFQUVFLE9BQU9PLE9BQU9BLENBQUN6QixHQUFHLEVBQUU7SUFDbEIsSUFBSUEsR0FBRyxDQUFDMEIsU0FBUyxLQUFLLFlBQVksSUFBSTFCLEdBQUcsQ0FBQzJCLE9BQU8sR0FBRyxFQUFFLEVBQUU7TUFDdEQsSUFBSTNCLEdBQUcsQ0FBQzJCLE9BQU8sR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQzFCLE9BQU8zQixHQUFHLENBQUMyQixPQUFPO01BQ3BCO01BQ0EsTUFBTUMsR0FBRyxHQUFHLENBQUUsR0FBRTVCLEdBQUcsQ0FBQzJCLE9BQU8sQ0FBQ0UsUUFBUSxDQUFDLENBQUMsQ0FBQ0MsTUFBTSxDQUFDLENBQUMsQ0FBRSxHQUFFLEdBQUcsRUFBRTtNQUN4RCxPQUFPRixHQUFHO0lBQ1o7SUFDQSxNQUFNQSxHQUFHLEdBQUc1QixHQUFHLENBQUMwQixTQUFTLEtBQUssWUFBWSxHQUFHLEVBQUUsR0FBRyxHQUFHO0lBQ3JELE9BQU9FLEdBQUc7RUFDWjs7RUFFQTs7RUFFQSxPQUFPRyxVQUFVQSxDQUFDL0IsR0FBRyxFQUFFO0lBQ3JCLE9BQU9BLEdBQUcsQ0FBQzBCLFNBQVMsS0FBSyxZQUFZLEdBQ2pDMUIsR0FBRyxDQUFDZ0MsTUFBTSxHQUFHLENBQUMsR0FDZCxDQUFDaEMsR0FBRyxDQUFDZ0MsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFO0VBQzNCOztFQUVBOztFQUVBLE9BQU9DLFFBQVFBLENBQUNqQyxHQUFHLEVBQUU7SUFDbkIsTUFBTTRCLEdBQUcsR0FBR2YsU0FBUyxDQUFDWSxPQUFPLENBQUN6QixHQUFHLENBQUM7SUFDbEMsTUFBTWtDLFVBQVUsR0FBR3JCLFNBQVMsQ0FBQ2tCLFVBQVUsQ0FBQy9CLEdBQUcsQ0FBQztJQUM1QyxJQUFJQSxHQUFHLENBQUMyQixPQUFPLEdBQUdPLFVBQVUsSUFBSU4sR0FBRyxFQUFFO01BQ25DLE9BQU8sS0FBSztJQUNkO0lBQ0EsT0FBTyxJQUFJO0VBQ2I7O0VBRUE7O0VBRUFPLE9BQU9BLENBQUNDLFdBQVcsRUFBRTtJQUNuQixLQUFLLElBQUkvQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcrQyxXQUFXLENBQUNKLE1BQU0sRUFBRTNDLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDOUMsS0FBSyxJQUFJZ0QsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHLElBQUksQ0FBQ3BCLEtBQUssQ0FBQ2UsTUFBTSxFQUFFSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzdDLElBQUksSUFBSSxDQUFDcEIsS0FBSyxDQUFDb0IsQ0FBQyxDQUFDLENBQUNELFdBQVcsQ0FBQ1osUUFBUSxDQUFDWSxXQUFXLENBQUMvQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1VBQ3RELE9BQU8sSUFBSTtRQUNiO01BQ0Y7SUFDRjtJQUNBLE9BQU8sS0FBSztFQUNkOztFQUVBOztFQUVBaUQsYUFBYUEsQ0FBQ0YsV0FBVyxFQUFFVixTQUFTLEVBQUU7SUFDcEMsSUFBSWEsdUJBQXVCLEdBQUcsRUFBRTtJQUNoQyxJQUFJYixTQUFTLEtBQUssWUFBWSxFQUFFO01BQzlCO01BQ0E7TUFDQSxJQUFJVSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUM3QjtRQUNBRyx1QkFBdUIsQ0FBQ2pCLElBQUksQ0FBQ2MsV0FBVyxDQUFDQSxXQUFXLENBQUNKLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDdkUsQ0FBQyxNQUFNLElBQUlJLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUN6RDtRQUNBTyx1QkFBdUIsQ0FBQ2pCLElBQUksQ0FBQ2MsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNsRCxDQUFDLE1BQU07UUFDTDtRQUNBRyx1QkFBdUIsQ0FBQ2pCLElBQUksQ0FDMUJjLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUN2Q0ksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQ25CLENBQUM7TUFDSDtNQUNBO01BQ0FHLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ2xCLE1BQU07TUFDdEQ7TUFDQWUsV0FBVyxDQUFDSSxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUNwQ0wsV0FBVyxDQUFDSSxHQUFHLENBQUVDLElBQUksSUFBS0EsSUFBSSxHQUFHLEVBQUUsQ0FDckMsQ0FBQztJQUNILENBQUMsTUFBTTtNQUNMO01BQ0E7TUFDQSxJQUFJTCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtRQUM3QjtRQUNBRyx1QkFBdUIsR0FBR0EsdUJBQXVCLENBQUNsQixNQUFNLENBQ3REZSxXQUFXLENBQUNJLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsQ0FBQyxDQUNwQyxDQUFDO01BQ0gsQ0FBQyxNQUFNLElBQUlMLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQ3BDO1FBQ0FHLHVCQUF1QixHQUFHQSx1QkFBdUIsQ0FBQ2xCLE1BQU0sQ0FDdERlLFdBQVcsQ0FBQ0ksR0FBRyxDQUFFQyxJQUFJLElBQUtBLElBQUksR0FBRyxDQUFDLENBQ3BDLENBQUM7TUFDSCxDQUFDLE1BQU07UUFDTDtRQUNBRix1QkFBdUIsR0FBR0EsdUJBQXVCLENBQUNsQixNQUFNLENBQ3REZSxXQUFXLENBQUNJLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQ25DTCxXQUFXLENBQUNJLEdBQUcsQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLEdBQUcsQ0FBQyxDQUNwQyxDQUFDO01BQ0g7TUFDQTtNQUNBLElBQUlMLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDdkI7UUFDQUcsdUJBQXVCLENBQUNqQixJQUFJLENBQUNjLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ3hFLENBQUMsTUFBTSxJQUFJSSxXQUFXLENBQUNBLFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuRDtRQUNBTyx1QkFBdUIsQ0FBQ2pCLElBQUksQ0FBQ2MsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNuRCxDQUFDLE1BQU07UUFDTDtRQUNBRyx1QkFBdUIsQ0FBQ2pCLElBQUksQ0FDMUJjLFdBQVcsQ0FBQ0EsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUN4Q0ksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQ25CLENBQUM7TUFDSDtJQUNGO0lBQ0E7SUFDQSxPQUFPLElBQUksQ0FBQ0QsT0FBTyxDQUFDSSx1QkFBdUIsQ0FBQztFQUM5Qzs7RUFFQTs7RUFHQUcsWUFBWSxHQUFJQyxHQUFHLElBQUs7SUFDdEIsS0FBSyxJQUFJTixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUcsSUFBSSxDQUFDcEIsS0FBSyxDQUFDZSxNQUFNLEVBQUVLLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDN0MsSUFBSSxJQUFJLENBQUNwQixLQUFLLENBQUNvQixDQUFDLENBQUMsQ0FBQ0QsV0FBVyxDQUFDWixRQUFRLENBQUMsQ0FBQ21CLEdBQUcsQ0FBQyxFQUFFO1FBQzVDLElBQUksQ0FBQzFCLEtBQUssQ0FBQ29CLENBQUMsQ0FBQyxDQUFDcEMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxJQUFJLENBQUNnQixLQUFLLENBQUNvQixDQUFDLENBQUMsQ0FBQ08sTUFBTSxDQUFDLENBQUMsRUFBRTtVQUMxQixNQUFNNUMsR0FBRyxHQUFHO1lBQ1ZDLEdBQUcsRUFBRSxJQUFJO1lBQ1RTLElBQUksRUFBRSxJQUFJO1lBQ1ZKLEtBQUssRUFBRSxJQUFJLENBQUNXLEtBQUssQ0FBQ29CLENBQUMsQ0FBQyxDQUFDRDtVQUN2QixDQUFDO1VBQ0QsT0FBTyxJQUFJLENBQUNTLE1BQU0sQ0FBQyxDQUFDLEdBQ2hCLElBQUksQ0FBQy9CLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO1lBQUUsR0FBR1osR0FBRztZQUFFLEdBQUc7Y0FBRVcsUUFBUSxFQUFFO1lBQUs7VUFBRSxDQUFDLENBQUMsR0FDdEQsSUFBSSxDQUFDRyxNQUFNLENBQUNGLE9BQU8sQ0FBQ1osR0FBRyxDQUFDO1FBQzlCO1FBQ0EsT0FBTyxJQUFJLENBQUNjLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO1VBQUVqQyxJQUFJLEVBQUVnRSxHQUFHO1VBQUUxQyxHQUFHLEVBQUUsSUFBSTtVQUFFUyxJQUFJLEVBQUU7UUFBTSxDQUFDLENBQUM7TUFDbkU7SUFDRjtJQUNBLElBQUksQ0FBQ2EsTUFBTSxHQUFHb0IsR0FBRztJQUVqQixPQUFPLElBQUksQ0FBQzdCLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDO01BQUVqQyxJQUFJLEVBQUVnRSxHQUFHO01BQUUxQyxHQUFHLEVBQUUsS0FBSztNQUFFUyxJQUFJLEVBQUU7SUFBTSxDQUFDLENBQUM7RUFDcEUsQ0FBQzs7RUFFRDs7RUFFQW1DLE1BQU0sR0FBR0EsQ0FBQSxLQUFNO0lBQ2IsTUFBTUMsS0FBSyxHQUFHLElBQUksQ0FBQzdCLEtBQUssQ0FBQzhCLEtBQUssQ0FBRUMsSUFBSSxJQUFLQSxJQUFJLENBQUN0QyxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQzVELE9BQU9vQyxLQUFLO0VBQ2QsQ0FBQztBQUNIO0FBRUEsK0RBQWVqQyxTQUFTOzs7Ozs7Ozs7OztBQzFMeEI7O0FBRUEsTUFBTW9DLE1BQU0sQ0FBQztFQUVYQyxlQUFlLEdBQUcsRUFBRTtFQUVwQixJQUFJQyxTQUFTQSxDQUFBLEVBQUc7SUFDZCxPQUFPLElBQUksQ0FBQ0QsZUFBZTtFQUM3QjtFQUVBLElBQUlDLFNBQVNBLENBQUNqQyxLQUFLLEVBQUU7SUFDbkIsSUFBSSxDQUFDZ0MsZUFBZSxDQUFDNUIsSUFBSSxDQUFDSixLQUFLLENBQUM7RUFDbEM7RUFFQWtDLEtBQUtBLENBQUNsQyxLQUFLLEVBQUU7SUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDaUMsU0FBUyxDQUFDM0IsUUFBUSxDQUFDTixLQUFLLENBQUM7RUFDeEM7QUFDRjtBQUVBLCtEQUFlK0IsTUFBTTs7Ozs7Ozs7Ozs7QUNuQnJCLE1BQU1JLE1BQU0sQ0FBQztFQUNYNUQsV0FBV0EsQ0FBQSxFQUFFO0lBQ1gsSUFBSSxDQUFDNkQsV0FBVyxHQUFHLEVBQUU7RUFDdkI7RUFFQUMsU0FBU0EsQ0FBQ0MsVUFBVSxFQUFFO0lBQ3BCLElBQUcsT0FBT0EsVUFBVSxLQUFLLFVBQVUsRUFBQztNQUNsQyxNQUFNLElBQUk3RCxLQUFLLENBQUUsR0FBRSxPQUFPNkQsVUFBVyxzREFBcUQsQ0FBQztJQUM3RjtJQUNBLElBQUksQ0FBQ0YsV0FBVyxDQUFDaEMsSUFBSSxDQUFDa0MsVUFBVSxDQUFDO0VBQ25DO0VBRUFDLFdBQVdBLENBQUNELFVBQVUsRUFBRTtJQUN0QixJQUFHLE9BQU9BLFVBQVUsS0FBSyxVQUFVLEVBQUM7TUFDbEMsTUFBTSxJQUFJN0QsS0FBSyxDQUFFLEdBQUUsT0FBTzZELFVBQVcsc0RBQXFELENBQUM7SUFDN0Y7SUFDQSxJQUFJLENBQUNGLFdBQVcsR0FBRyxJQUFJLENBQUNBLFdBQVcsQ0FBQ0ksTUFBTSxDQUFDQyxHQUFHLElBQUlBLEdBQUcsS0FBSUgsVUFBVSxDQUFDO0VBQ3RFO0VBRUE1QyxPQUFPQSxDQUFDZ0QsT0FBTyxFQUFFO0lBQ2YsSUFBSSxDQUFDTixXQUFXLENBQUMvQyxPQUFPLENBQUNpRCxVQUFVLElBQUlBLFVBQVUsQ0FBQ0ksT0FBTyxDQUFDLENBQUM7RUFDN0Q7QUFDRjtBQUVBLCtEQUFlUCxNQUFNOzs7Ozs7Ozs7OztBQ3hCckIsTUFBTVEsSUFBSSxDQUFDO0VBRVRwRSxXQUFXQSxDQUFDTyxHQUFHLEVBQUU7SUFDZixJQUFJLENBQUNnQyxNQUFNLEdBQUcsQ0FBQ2hDLEdBQUcsQ0FBQ2dDLE1BQU07SUFDekIsSUFBSSxDQUFDSSxXQUFXLEdBQUd5QixJQUFJLENBQUNDLGFBQWEsQ0FBQzlELEdBQUcsQ0FBQztFQUM1QztFQUVBK0QsUUFBUSxHQUFHLENBQUM7RUFFWnJELElBQUksR0FBRyxLQUFLO0VBRVosT0FBT29ELGFBQWFBLENBQUM5RCxHQUFHLEVBQUU7SUFDeEIsTUFBTWdFLEdBQUcsR0FBRyxDQUFDLENBQUNoRSxHQUFHLENBQUMyQixPQUFPLENBQUM7SUFDMUIsS0FBSyxJQUFJdEMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHVyxHQUFHLENBQUNnQyxNQUFNLEVBQUUzQyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ3RDLElBQUlXLEdBQUcsQ0FBQzBCLFNBQVMsS0FBSyxZQUFZLEVBQUU7UUFDbENzQyxHQUFHLENBQUMxQyxJQUFJLENBQUMwQyxHQUFHLENBQUMzRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzFCLENBQUMsTUFBTTtRQUNMMkUsR0FBRyxDQUFDMUMsSUFBSSxDQUFDMEMsR0FBRyxDQUFDM0UsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUMzQjtJQUNGO0lBQ0EsT0FBTzJFLEdBQUc7RUFDWjtFQUVBL0QsR0FBR0EsQ0FBQSxFQUFHO0lBQ0osSUFBSSxDQUFDOEQsUUFBUSxJQUFJLENBQUM7RUFDcEI7RUFFQW5CLE1BQU1BLENBQUEsRUFBRztJQUNQLElBQUksSUFBSSxDQUFDbUIsUUFBUSxLQUFLLElBQUksQ0FBQy9CLE1BQU0sRUFBRTtNQUNqQyxJQUFJLENBQUN0QixJQUFJLEdBQUcsSUFBSTtJQUNsQjtJQUNBLE9BQU8sSUFBSSxDQUFDQSxJQUFJO0VBQ2xCO0FBQ0Y7QUFFQSwrREFBZW1ELElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkM4QztBQUNUO0FBQ0U7QUFDZDtBQUNRO0FBQ0Y7QUFDWTtBQUNvQztBQUNuQztBQUUvRCxNQUFNUyxvQkFBb0IsR0FBRzFGLFFBQVEsQ0FBQ3dCLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQzs7QUFFM0U7O0FBRUEsU0FBU21FLFFBQVFBLENBQUEsRUFBRztFQUNsQixNQUFNQyxJQUFJLEdBQUc1RixRQUFRLENBQUN3QixhQUFhLENBQUMsc0JBQXNCLENBQUM7RUFDM0RvRSxJQUFJLENBQUMxRixTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDOUI7O0FBRUE7O0FBRUEsU0FBUzBGLGFBQWFBLENBQUEsRUFBRztFQUN2QixNQUFNQyxTQUFTLEdBQUc5RixRQUFRLENBQUN3QixhQUFhLENBQUMsZ0JBQWdCLENBQUM7RUFDMURzRSxTQUFTLENBQUM1RixTQUFTLENBQUM2RixNQUFNLENBQUMsUUFBUSxDQUFDO0FBQ3RDOztBQUVBOztBQUVBLFNBQVNDLGFBQWFBLENBQUEsRUFBRztFQUN2QixNQUFNO0lBQUNuRztFQUFFLENBQUMsR0FBRyxJQUFJLENBQUNvRyxPQUFPO0VBQ3pCUixvREFBZSxDQUFDekQsT0FBTyxDQUFDbkMsRUFBRSxDQUFDO0FBQzdCOztBQUVBOztBQUVBLFNBQVNxRyxvQkFBb0JBLENBQUEsRUFBRztFQUM5QjNGLDZFQUFXLENBQUNtRixvQkFBb0IsRUFBRU0sYUFBYSxDQUFDO0FBQ2xEOztBQUVBOztBQUVBLFNBQVNHLGdCQUFnQkEsQ0FBQSxFQUFHO0VBQzFCLE1BQU1DLEdBQUcsR0FBR3BHLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztFQUM1Q21HLEdBQUcsQ0FBQ2hHLFlBQVksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO0VBQ2xDZ0csR0FBRyxDQUFDOUYsV0FBVyxHQUFHLFVBQVU7RUFDNUI4RixHQUFHLENBQUNsRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxpQ0FBaUMsQ0FBQztFQUNuRmlHLEdBQUcsQ0FBQy9GLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO0lBQ2xDZ0csTUFBTSxDQUFDQyxRQUFRLENBQUNDLE1BQU0sQ0FBQyxDQUFDO0VBQzFCLENBQUMsQ0FBQztFQUNGLE9BQU9ILEdBQUc7QUFDWjtBQUVBLFNBQVNJLG1CQUFtQkEsQ0FBQzFGLE1BQU0sRUFBRTtFQUNuQyxNQUFNTixHQUFHLEdBQUdSLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztFQUN6QyxNQUFNd0csRUFBRSxHQUFHekcsUUFBUSxDQUFDQyxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ3ZDd0csRUFBRSxDQUFDdkcsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUNBQWlDLEVBQUUscUNBQXFDLENBQUM7RUFDMUZzRyxFQUFFLENBQUNuRyxXQUFXLEdBQUcsV0FBVztFQUM1QixNQUFNb0csRUFBRSxHQUFHMUcsUUFBUSxDQUFDQyxhQUFhLENBQUMsSUFBSSxDQUFDO0VBQ3ZDeUcsRUFBRSxDQUFDeEcsU0FBUyxDQUFDQyxHQUFHLENBQUMscUNBQXFDLEVBQUUseUNBQXlDLENBQUM7RUFDbEcsSUFBSVcsTUFBTSxLQUFLLE1BQU0sRUFBRTtJQUNyQjRGLEVBQUUsQ0FBQ3BHLFdBQVcsR0FBRyxVQUFVO0lBQzNCRSxHQUFHLENBQUNOLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLDhCQUE4QixDQUFDO0VBQ25ELENBQUMsTUFBTTtJQUNMdUcsRUFBRSxDQUFDcEcsV0FBVyxHQUFHLFNBQVM7SUFDMUJFLEdBQUcsQ0FBQ04sU0FBUyxDQUFDQyxHQUFHLENBQUMsNkJBQTZCLENBQUM7RUFDbEQ7RUFDQUssR0FBRyxDQUFDRSxXQUFXLENBQUMrRixFQUFFLENBQUM7RUFDbkJqRyxHQUFHLENBQUNFLFdBQVcsQ0FBQ2dHLEVBQUUsQ0FBQztFQUVuQmxHLEdBQUcsQ0FBQ0UsV0FBVyxDQUFDeUYsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0VBQ25DLE9BQU8zRixHQUFHO0FBQ1o7QUFFQSxTQUFTbUcsWUFBWUEsQ0FBQzdGLE1BQU0sRUFBRTtFQUM1QixNQUFNOEYsSUFBSSxHQUFHNUcsUUFBUSxDQUFDd0IsYUFBYSxDQUFDLE1BQU0sQ0FBQztFQUMzQyxNQUFNcUYsWUFBWSxHQUFHTCxtQkFBbUIsQ0FBQzFGLE1BQU0sQ0FBQztFQUNoRDhGLElBQUksQ0FBQ2xHLFdBQVcsQ0FBQ21HLFlBQVksQ0FBQztBQUNoQzs7QUFFQTs7QUFFQXZCLDZEQUFlLENBQUNYLFNBQVMsQ0FBQ2tCLGFBQWEsQ0FBQztBQUN4Q1AsNkRBQWUsQ0FBQ1gsU0FBUyxDQUFDdUIsb0JBQW9CLENBQUM7QUFDL0NaLDZEQUFlLENBQUNYLFNBQVMsQ0FBQ2dCLFFBQVEsQ0FBQztBQUNuQ0osMERBQVksQ0FBQ1osU0FBUyxDQUFDZ0MsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRitCO0FBQ2pCO0FBQ007QUFDeEI7QUFDOEI7QUFJOUI7QUFDZ0I7QUFFaEQsU0FBU00sYUFBYUEsQ0FBQSxFQUFHO0VBQ3ZCLE1BQU1DLGFBQWEsR0FBR2xILFFBQVEsQ0FBQ3dCLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztFQUM5RDBGLGFBQWEsQ0FBQ2hILFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN2QztBQUVBLFNBQVNnSCxXQUFXQSxDQUFBLEVBQUc7RUFDckIsTUFBTVAsSUFBSSxHQUFHNUcsUUFBUSxDQUFDd0IsYUFBYSxDQUFDLE1BQU0sQ0FBQztFQUMzQ29GLElBQUksQ0FBQ3hHLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDO0FBRXpDO0FBRUEsU0FBU2dILGlCQUFpQkEsQ0FBQSxFQUFHO0VBQzNCLE1BQU1DLFVBQVUsR0FBR3JILFFBQVEsQ0FBQ3NILGdCQUFnQixDQUFDLHdCQUF3QixDQUFDO0VBQ3RFRCxVQUFVLENBQUMxRixPQUFPLENBQUU0RixLQUFLLElBQUs7SUFDNUJBLEtBQUssQ0FBQ2xILGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQ3BDMkcsbURBQWUsQ0FBQ2hGLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQztFQUNKLENBQUMsQ0FBQztBQUNKO0FBRUEsU0FBU3dGLGNBQWNBLENBQUEsRUFBRztFQUN4QixNQUFNQyxZQUFZLEdBQUd6SCxRQUFRLENBQUN3QixhQUFhLENBQUMsNEJBQTRCLENBQUM7RUFDekVpRyxZQUFZLENBQUNwSCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUMzQzJHLDBEQUFzQixDQUFDaEYsT0FBTyxDQUFDLENBQUM7RUFDbEMsQ0FBQyxDQUFDO0FBQ0o7QUFFQSxTQUFTZ0UsYUFBYUEsQ0FBQSxFQUFHO0VBQ3ZCLE1BQU07SUFBRW5HO0VBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQ29HLE9BQU87RUFDM0JlLDJEQUF1QixDQUFDaEYsT0FBTyxDQUFDbkMsRUFBRSxDQUFDO0FBQ3JDO0FBRUEsU0FBUytILG9CQUFvQkEsQ0FBQSxFQUFHO0VBQzlCLE1BQU1DLGdCQUFnQixHQUFHN0gsUUFBUSxDQUFDd0IsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBQ25FakIsNkVBQVcsQ0FBQ3NILGdCQUFnQixFQUFFN0IsYUFBYSxDQUFDO0FBQzlDOztBQUVBOztBQUVBLFNBQVM4QixvQkFBb0JBLENBQUEsRUFBRztFQUM5QixNQUFNcEcsS0FBSyxHQUFHMUIsUUFBUSxDQUFDc0gsZ0JBQWdCLENBQUMsbUNBQW1DLENBQUM7RUFDNUU1RixLQUFLLENBQUNDLE9BQU8sQ0FBRTVCLElBQUksSUFBSztJQUN0QkEsSUFBSSxDQUFDZ0ksbUJBQW1CLENBQUMsT0FBTyxFQUFFL0IsYUFBYSxDQUFDO0VBQ2xELENBQUMsQ0FBQztBQUNKOztBQUVBO0FBQ0EsU0FBU2dDLFlBQVlBLENBQUEsRUFBRztFQUN0QixNQUFNQyxTQUFTLEdBQUdqSSxRQUFRLENBQUN3QixhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFDNUR5RyxTQUFTLENBQUM3SCxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztBQUNqRDs7QUFJQTs7QUFFQTJHLGdFQUFrQixDQUFDcEMsU0FBUyxDQUFDNkMsY0FBYyxDQUFDO0FBQzVDVCxnRUFBa0IsQ0FBQ3BDLFNBQVMsQ0FBQ3lDLGlCQUFpQixDQUFDO0FBQy9DTCxnRUFBa0IsQ0FBQ3BDLFNBQVMsQ0FBQ3NDLGFBQWEsQ0FBQztBQUMzQ0YsZ0VBQWtCLENBQUNwQyxTQUFTLENBQUNpRCxvQkFBb0IsQ0FBQztBQUNsRHRDLDZEQUFlLENBQUNYLFNBQVMsQ0FBQ21ELG9CQUFvQixDQUFDO0FBQy9DeEMsNkRBQWUsQ0FBQ1gsU0FBUyxDQUFDcUQsWUFBWSxDQUFDO0FBQ3ZDMUMsNkRBQWUsQ0FBQ1gsU0FBUyxDQUFDd0MsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekVTO0FBRS9DLE1BQU1lLGNBQWMsR0FBRyxJQUFJekQsK0RBQU0sQ0FBQyxDQUFDO0FBRW5DLE1BQU0wRCxvQkFBb0IsR0FBRyxJQUFJMUQsK0RBQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0pNO0FBRS9DLE1BQU0yRCxVQUFVLEdBQUcsSUFBSTNELCtEQUFNLENBQUMsQ0FBQztBQUUvQixNQUFNNEQsZ0JBQWdCLEdBQUcsSUFBSTVELCtEQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKVTtBQUUvQyxNQUFNZSxNQUFNLEdBQUcsSUFBSWYsK0RBQU0sQ0FBQyxDQUFDO0FBRTNCLE1BQU1rRCxhQUFhLEdBQUcsSUFBSWxELCtEQUFNLENBQUMsQ0FBQztBQUVsQyxNQUFNOEMsS0FBSyxHQUFHLElBQUk5QywrREFBTSxDQUFDLENBQUM7O0FBRTFCOztBQUVBLE1BQU02RCxRQUFRLEdBQUcsSUFBSTdELCtEQUFNLENBQUMsQ0FBQzs7QUFFN0I7O0FBRUEsTUFBTThELGFBQWEsR0FBRyxJQUFJOUQsK0RBQU0sQ0FBQyxDQUFDOztBQUVsQzs7QUFFQSxNQUFNaUQsWUFBWSxHQUFHLElBQUlqRCwrREFBTSxDQUFDLENBQUM7O0FBRWpDOztBQUVBLE1BQU0rRCxVQUFVLEdBQUcsSUFBSS9ELCtEQUFNLENBQUMsQ0FBQzs7QUFFL0I7O0FBRUEsTUFBTWdFLGNBQWMsR0FBRyxJQUFJaEUsK0RBQU0sQ0FBQyxDQUFDOztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVCK0M7O0FBRS9DOztBQUVBLE1BQU1xQyxjQUFjLEdBQUcsSUFBSXJDLCtEQUFNLENBQUMsQ0FBQzs7QUFFbkM7O0FBRUEsTUFBTVksV0FBVyxHQUFHLElBQUlaLCtEQUFNLENBQUMsQ0FBQzs7QUFFaEM7O0FBRUEsTUFBTTFDLFFBQVEsR0FBRyxJQUFJMEMsK0RBQU0sQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1o0QjtBQUNmO0FBQ0c7QUFDOEI7QUFDekI7QUFHbEQsTUFBTWtFLGlCQUFpQixTQUFTMUcsbUVBQVMsQ0FBQztFQUUxQzs7RUFFRTJHLFNBQVNBLENBQUN4RixNQUFNLEVBQUU7SUFDaEIsSUFBSWtGLFFBQVEsR0FBRyxJQUFJSSw0REFBUSxDQUFDdEYsTUFBTSxDQUFDO0lBQ25DLElBQUlnQixJQUFJLEdBQUcsSUFBSWEseURBQUksQ0FBQ3FELFFBQVEsQ0FBQztJQUM3QixPQUFPLEtBQUssQ0FBQy9FLE9BQU8sQ0FBQ2EsSUFBSSxDQUFDWixXQUFXLENBQUMsSUFBSSxLQUFLLENBQUNFLGFBQWEsQ0FBQ1UsSUFBSSxDQUFDWixXQUFXLEVBQUVZLElBQUksQ0FBQ3RCLFNBQVMsQ0FBQyxJQUFJYixtRUFBUyxDQUFDb0IsUUFBUSxDQUFDaUYsUUFBUSxDQUFDLEVBQUc7TUFDaElBLFFBQVEsR0FBRyxJQUFJSSw0REFBUSxDQUFDdEYsTUFBTSxDQUFDO01BQy9CZ0IsSUFBSSxHQUFHLElBQUlhLHlEQUFJLENBQUNxRCxRQUFRLENBQUM7SUFDM0I7SUFDQSxJQUFJLENBQUNqRyxLQUFLLEdBQUcrQixJQUFJO0VBQ25CO0FBQ0Y7O0FBRUE7O0FBR0EsU0FBU3lFLFVBQVVBLENBQUEsRUFBRztFQUNsQixNQUFNM0IsYUFBYSxHQUFHLElBQUl5QixpQkFBaUIsQ0FBQ04sbUVBQWdCLENBQUM7RUFDN0QsTUFBTWxHLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztFQUU3QkEsUUFBUSxDQUFDUixPQUFPLENBQUV5QyxJQUFJLElBQUs7SUFDekI4QyxhQUFhLENBQUMwQixTQUFTLENBQUN4RSxJQUFJLENBQUM7RUFDL0IsQ0FBQyxDQUFDO0VBR0ZnRSw2REFBVSxDQUFDekQsU0FBUyxDQUFDdUMsYUFBYSxDQUFDcEQsWUFBWSxDQUFDO0FBQ3BEO0FBRUFuRCw2REFBZ0IsQ0FBQ2dFLFNBQVMsQ0FBQ2tFLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3JDNEI7QUFDSDtBQUUvRCxNQUFNQyxRQUFRLEdBQUcsVUFBVTtBQUUzQixNQUFNQyxZQUFZLEdBQUcsSUFBSW5JLHdFQUFhLENBQUNrSSxRQUFRLENBQUM7QUFFaERULG1FQUFnQixDQUFDMUQsU0FBUyxDQUFDb0UsWUFBWSxDQUFDbEgsZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7OztBQ1BNO0FBRS9ELFNBQVNvSCxrQkFBa0JBLENBQUEsRUFBRztFQUM1QixPQUFPRCxpRUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxZQUFZLEdBQUcsVUFBVTtBQUMxRDtBQUVBLCtEQUFlQyxrQkFBa0I7Ozs7Ozs7Ozs7OztBQ044Qjs7QUFFL0Q7O0FBRUEsU0FBU0MsZ0JBQWdCQSxDQUFDOUYsTUFBTSxFQUFFTixTQUFTLEVBQUU7RUFDM0MsSUFBSUEsU0FBUyxLQUFLLFlBQVksRUFBRTtJQUM5QixJQUFJaUIsR0FBRyxHQUFHLEVBQUVpRixpRUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDL0YsUUFBUSxDQUFDLENBQUMsR0FBRytGLGlFQUFZLENBQUMsRUFBRSxHQUFHNUYsTUFBTSxDQUFDLENBQUNILFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0UsT0FBT2MsR0FBRyxHQUFHLENBQUMsSUFBSUEsR0FBRyxHQUFHLEdBQUcsRUFBRTtNQUMzQkEsR0FBRyxHQUFHLEVBQUVpRixpRUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDL0YsUUFBUSxDQUFDLENBQUMsR0FBRytGLGlFQUFZLENBQUMsRUFBRSxHQUFHNUYsTUFBTSxDQUFDLENBQUNILFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDN0U7SUFDQSxPQUFPYyxHQUFHO0VBQ1o7RUFDQyxJQUFJQSxHQUFHLEdBQUcsRUFBRWlGLGlFQUFZLENBQUMsRUFBRSxHQUFFNUYsTUFBTSxDQUFDLENBQUNILFFBQVEsQ0FBQyxDQUFDLEdBQUcrRixpRUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDL0YsUUFBUSxDQUFDLENBQUMsQ0FBQztFQUM5RSxPQUFPYyxHQUFHLEdBQUcsQ0FBQyxJQUFJQSxHQUFHLEdBQUcsR0FBRyxFQUFFO0lBQzVCQSxHQUFHLEdBQUcsRUFBRWlGLGlFQUFZLENBQUMsRUFBRSxDQUFDLENBQUMvRixRQUFRLENBQUMsQ0FBQyxHQUFHK0YsaUVBQVksQ0FBQyxFQUFFLEdBQUc1RixNQUFNLENBQUMsQ0FBQ0gsUUFBUSxDQUFDLENBQUMsQ0FBQztFQUM3RTtFQUNBLE9BQU9jLEdBQUc7QUFDWjtBQUVBLCtEQUFlbUYsZ0JBQWdCOzs7Ozs7Ozs7Ozs7O0FDbEI4QztBQUNKO0FBRXpFLE1BQU1SLFFBQVEsQ0FBQztFQUViN0gsV0FBV0EsQ0FBQ3VDLE1BQU0sRUFBRTtJQUNsQixJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtJQUNwQixJQUFJLENBQUNOLFNBQVMsR0FBR21HLHNGQUFrQixDQUFDLENBQUM7SUFDckMsSUFBSSxDQUFDbEcsT0FBTyxHQUFHbUcsb0ZBQWdCLENBQUMsSUFBSSxDQUFDOUYsTUFBTSxFQUFFLElBQUksQ0FBQ04sU0FBUyxDQUFDO0VBQzlEO0FBQ0Y7QUFFQSwrREFBZTRGLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7QUNia0M7QUFDZjtBQUM2QztBQUMwQjtBQUM5RDtBQUVuRCxNQUFNUyxhQUFhLFNBQVNsSCxtRUFBUyxDQUFDO0VBRXBDOztFQUVBbUgsT0FBTyxHQUFJaEksR0FBRyxJQUFLO0lBQ2pCLE1BQU1nRCxJQUFJLEdBQUcsSUFBSWEseURBQUksQ0FBQzdELEdBQUcsQ0FBQztJQUMxQixJQUFJLEtBQUssQ0FBQ21DLE9BQU8sQ0FBQ2EsSUFBSSxDQUFDWixXQUFXLENBQUMsSUFBSXZCLG1FQUFTLENBQUNvQixRQUFRLENBQUNqQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUNzQyxhQUFhLENBQUNVLElBQUksQ0FBQ1osV0FBVyxFQUFFcEMsR0FBRyxDQUFDMEIsU0FBUyxDQUFDLEVBQUU7TUFDdEgsT0FBTztRQUFFdUcsS0FBSyxFQUFFLEtBQUs7UUFBRTdGLFdBQVcsRUFBRVksSUFBSSxDQUFDWjtNQUFXLENBQUM7SUFDdkQ7SUFDQSxPQUFPO01BQUU2RixLQUFLLEVBQUUsSUFBSTtNQUFFN0YsV0FBVyxFQUFFWSxJQUFJLENBQUNaO0lBQVksQ0FBQztFQUN2RCxDQUFDO0VBRUQ4RixlQUFlLEdBQUlsSSxHQUFHLElBQUs7SUFDekI0RiwyREFBdUIsQ0FBQ2hGLE9BQU8sQ0FBQyxJQUFJLENBQUNvSCxPQUFPLENBQUNoSSxHQUFHLENBQUMsQ0FBQztFQUNwRCxDQUFDOztFQUVEOztFQUVBd0gsU0FBUyxHQUFJeEgsR0FBRyxJQUFLO0lBQ25CLE1BQU1nRCxJQUFJLEdBQUcsSUFBSWEseURBQUksQ0FBQzdELEdBQUcsQ0FBQztJQUMxQixJQUFJLENBQUNpQixLQUFLLEdBQUcrQixJQUFJO0lBQ2pCLE9BQU9BLElBQUk7RUFDYixDQUFDO0VBRURtRixnQkFBZ0IsR0FBSW5JLEdBQUcsSUFBSztJQUMxQixNQUFNZ0QsSUFBSSxHQUFHLElBQUksQ0FBQ3dFLFNBQVMsQ0FBQ3hILEdBQUcsQ0FBQztJQUNoQzRGLDREQUF3QixDQUFDaEYsT0FBTyxDQUFDO01BQUN3QixXQUFXLEVBQUVZLElBQUksQ0FBQ1osV0FBVztNQUFFSixNQUFNLEVBQUVnQixJQUFJLENBQUNoQjtJQUFNLENBQUMsQ0FBQztFQUN4RixDQUFDO0FBQ0g7O0FBRUE7O0FBRUEsU0FBU29HLFVBQVVBLENBQUEsRUFBRztFQUNwQixNQUFNQyxTQUFTLEdBQUcsSUFBSU4sYUFBYSxDQUFDaEIsMkVBQW9CLENBQUM7RUFDekRuQixzREFBa0IsQ0FBQ3JDLFNBQVMsQ0FBQzhFLFNBQVMsQ0FBQ0gsZUFBZSxDQUFDO0VBQ3ZEdEMsd0RBQW9CLENBQUNyQyxTQUFTLENBQUM4RSxTQUFTLENBQUNGLGdCQUFnQixDQUFDO0VBQzFELFNBQVNHLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQzFCeEIscUVBQWMsQ0FBQ3ZELFNBQVMsQ0FBQzhFLFNBQVMsQ0FBQzNGLFlBQVksQ0FBQztFQUNsRDtFQUNBd0IsNkRBQWUsQ0FBQ1gsU0FBUyxDQUFDK0UsZ0JBQWdCLENBQUM7QUFDN0M7QUFFQTNDLGdFQUFrQixDQUFDcEMsU0FBUyxDQUFDNkUsVUFBVSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNoRDBCO0FBQ0s7QUFDcEI7QUFDRDtBQUVsRCxNQUFNRyxpQkFBaUIsU0FBUy9JLHdFQUFhLENBQUM7RUFFNUN3RixHQUFHLEdBQUdwRyxRQUFRLENBQUN3QixhQUFhLENBQUMsNEJBQTRCLENBQUM7O0VBRTFEOztFQUVBLE9BQU9vSSxTQUFTQSxDQUFDeEksR0FBRyxFQUFFO0lBQ3BCLE1BQU15SSxVQUFVLEdBQUc3SixRQUFRLENBQUN3QixhQUFhLENBQUUsU0FBUUosR0FBRyxDQUFDZ0MsTUFBTyxFQUFDLENBQUM7SUFDaEV5RyxVQUFVLENBQUMzSixTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDbEMsTUFBTTJKLFVBQVUsR0FBRzlKLFFBQVEsQ0FBQ3dCLGFBQWEsQ0FBQyxDQUFFLGNBQWFKLEdBQUcsQ0FBQ2dDLE1BQU8sSUFBRyxDQUFDLENBQUM7SUFDekUwRyxVQUFVLENBQUM1SixTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDcEM7O0VBRUE7QUFDRjs7RUFFRSxPQUFPNEosZUFBZUEsQ0FBQSxFQUFHO0lBQ3ZCLE1BQU1DLEtBQUssR0FBR2hLLFFBQVEsQ0FBQ3dCLGFBQWEsQ0FBRSw0QkFBMkIsQ0FBQztJQUNsRSxJQUFJd0ksS0FBSyxLQUFLLElBQUksRUFBRTtNQUNsQnJKLDZEQUFnQixDQUFDcUIsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQyxNQUFNO01BQ0xnSSxLQUFLLENBQUNDLE9BQU8sR0FBRyxJQUFJO0lBQ3RCO0VBQ0Y7O0VBRUE7O0VBRUFDLGlCQUFpQixHQUFHQSxDQUFBLEtBQU07SUFDeEIsTUFBTXhJLEtBQUssR0FBRzFCLFFBQVEsQ0FBQ3NILGdCQUFnQixDQUFDLGtCQUFrQixDQUFDO0lBQzNENUYsS0FBSyxDQUFDQyxPQUFPLENBQUU1QixJQUFJLElBQUs7TUFDdEJBLElBQUksQ0FBQ0csU0FBUyxDQUFDNkYsTUFBTSxDQUFDLGtCQUFrQixDQUFDO01BQ3pDaEcsSUFBSSxDQUFDRyxTQUFTLENBQUM2RixNQUFNLENBQUMsb0JBQW9CLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxDQUFDSyxHQUFHLENBQUMrRCxlQUFlLENBQUMsVUFBVSxDQUFDO0VBQ3RDLENBQUM7O0VBRUQ7O0VBRUFDLDJCQUEyQixHQUFJaEosR0FBRyxJQUFLO0lBQ3JDLElBQUksQ0FBQzhJLGlCQUFpQixDQUFDLENBQUM7SUFDeEIsSUFBSSxDQUFDOUksR0FBRyxDQUFDaUksS0FBSyxFQUFFO01BQ2QsSUFBSSxDQUFDakQsR0FBRyxDQUFDaEcsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDdkM7SUFDQWdCLEdBQUcsQ0FBQ29DLFdBQVcsQ0FBQzdCLE9BQU8sQ0FBRTBJLFVBQVUsSUFBSztNQUN0QyxNQUFNdEssSUFBSSxHQUFHQyxRQUFRLENBQUN3QixhQUFhLENBQ2hDLGVBQWMsSUFBSSxDQUFDVixNQUFPLGNBQWF1SixVQUFXLElBQ3JELENBQUM7TUFDRCxJQUFJakosR0FBRyxDQUFDaUksS0FBSyxFQUFFO1FBQ2J0SixJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLGtCQUFrQixDQUFDO01BQ3hDLENBQUMsTUFBTTtRQUNMSixJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLG9CQUFvQixDQUFDO01BQzFDO0lBQ0YsQ0FBQyxDQUFDO0VBQ0osQ0FBQztFQUVEbUssbUJBQW1CLEdBQUlsSixHQUFHLElBQUs7SUFDN0IsSUFBSSxDQUFDOEksaUJBQWlCLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUNySixXQUFXLENBQUMrSSxTQUFTLENBQUN4SSxHQUFHLENBQUM7SUFDL0IsSUFBSSxDQUFDUCxXQUFXLENBQUNrSixlQUFlLENBQUMsQ0FBQztJQUNsQzNJLEdBQUcsQ0FBQ29DLFdBQVcsQ0FBQzdCLE9BQU8sQ0FBRTBJLFVBQVUsSUFBSztNQUN0QyxNQUFNdEssSUFBSSxHQUFHQyxRQUFRLENBQUN3QixhQUFhLENBQ2hDLGVBQWMsSUFBSSxDQUFDVixNQUFPLGNBQWF1SixVQUFXLElBQ3JELENBQUM7TUFDRHRLLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0VBQ0osQ0FBQztBQUNIO0FBRUEsTUFBTW9LLElBQUksR0FBRyxNQUFNO0FBRW5CLE1BQU1DLFFBQVEsR0FBRyxJQUFJYixpQkFBaUIsQ0FBQ1ksSUFBSSxDQUFDOztBQUU1Qzs7QUFFQXBDLDJFQUFvQixDQUFDeEQsU0FBUyxDQUFDNkYsUUFBUSxDQUFDM0ksZ0JBQWdCLENBQUM7QUFDekRtRiwyREFBdUIsQ0FBQ3JDLFNBQVMsQ0FBQzZGLFFBQVEsQ0FBQ0osMkJBQTJCLENBQUM7QUFDdkVwRCw0REFBd0IsQ0FBQ3JDLFNBQVMsQ0FBQzZGLFFBQVEsQ0FBQ0YsbUJBQW1CLENBQUM7Ozs7Ozs7Ozs7O0FDakZoRSxNQUFNRyxZQUFZLENBQUM7RUFDakI1SixXQUFXQSxDQUFFa0MsT0FBTyxFQUFFSyxNQUFNLEVBQUVOLFNBQVMsRUFBRTtJQUN2QyxJQUFJLENBQUNDLE9BQU8sR0FBRyxDQUFDQSxPQUFPO0lBQ3ZCLElBQUksQ0FBQ0ssTUFBTSxHQUFHLENBQUNBLE1BQU07SUFDckIsSUFBSSxDQUFDTixTQUFTLEdBQUdBLFNBQVM7RUFDNUI7QUFDRjtBQUVBLCtEQUFlMkgsWUFBWTs7Ozs7Ozs7Ozs7Ozs7QUNSa0I7QUFDeUI7QUFDaEI7QUFFdEQsTUFBTUUsYUFBYSxHQUFHO0VBQ3BCNUgsT0FBTyxFQUFFLENBQUM7RUFDVjZILFNBQVNBLENBQUN0SSxLQUFLLEVBQUU7SUFDZixJQUFJLENBQUNTLE9BQU8sR0FBR1QsS0FBSztJQUNwQjBFLG1EQUFlLENBQUNoRixPQUFPLENBQUMsQ0FBQztFQUMzQixDQUFDO0VBQ0Q2SSxRQUFRQSxDQUFBLEVBQUc7SUFDVCxJQUFJLENBQUM5SCxPQUFPLEdBQUcsQ0FBQztFQUNsQjtBQUNGLENBQUM7QUFFRCxTQUFTK0gsY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU07SUFBRS9IO0VBQVEsQ0FBQyxHQUFHNEgsYUFBYTtFQUNqQyxNQUFNdkgsTUFBTSxHQUFHc0gsc0VBQWlCLENBQUMsTUFBTSxDQUFDO0VBQ3hDLE1BQU01SCxTQUFTLEdBQUc0SCxzRUFBaUIsQ0FBQyxXQUFXLENBQUM7RUFDaEQsTUFBTXBDLFFBQVEsR0FBRyxJQUFJbUMsdURBQVksQ0FBQzFILE9BQU8sRUFBRUssTUFBTSxFQUFFTixTQUFTLENBQUM7RUFDN0QsT0FBT3dGLFFBQVE7QUFDakI7QUFFQSxTQUFTeUMsb0JBQW9CQSxDQUFBLEVBQUc7RUFDOUIsTUFBTXpDLFFBQVEsR0FBR3dDLGNBQWMsQ0FBQyxDQUFDO0VBQ2pDOUQsc0RBQWtCLENBQUNoRixPQUFPLENBQUNzRyxRQUFRLENBQUM7QUFDdEM7QUFFQSxTQUFTMEMscUJBQXFCQSxDQUFBLEVBQUc7RUFDL0IsTUFBTTFDLFFBQVEsR0FBR3dDLGNBQWMsQ0FBQyxDQUFDO0VBQ2pDLE1BQU1HLFVBQVUsR0FBR0MsTUFBTSxDQUFDQyxNQUFNLENBQUM3QyxRQUFRLENBQUMsQ0FBQ25FLEtBQUssQ0FBRTdCLEtBQUssSUFBSztJQUMxRCxJQUNFQSxLQUFLLEtBQUssSUFBSSxJQUNkQSxLQUFLLEtBQUs4SSxTQUFTLElBQ25COUksS0FBSyxLQUFLLEtBQUssSUFDZkEsS0FBSyxLQUFLLENBQUMsRUFDWDtNQUNBLE9BQU8sSUFBSTtJQUNiO0lBQ0EsT0FBTyxLQUFLO0VBQ2QsQ0FBQyxDQUFDO0VBQ0YsSUFBSTJJLFVBQVUsRUFBRTtJQUNkakUsd0RBQW9CLENBQUNoRixPQUFPLENBQUNzRyxRQUFRLENBQUM7SUFDdENxQyxhQUFhLENBQUNFLFFBQVEsQ0FBQyxDQUFDO0VBQzFCO0FBQ0Y7QUFFQTdELDJEQUF1QixDQUFDckMsU0FBUyxDQUFDZ0csYUFBYSxDQUFDQyxTQUFTLENBQUNTLElBQUksQ0FBQ1YsYUFBYSxDQUFDLENBQUM7QUFDOUUzRCxtREFBZSxDQUFDckMsU0FBUyxDQUFDb0csb0JBQW9CLENBQUM7QUFDL0MvRCwwREFBc0IsQ0FBQ3JDLFNBQVMsQ0FBQ3FHLHFCQUFxQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDakRQO0FBQ1M7QUFDQTtBQUNnQjtBQUloQztBQUV6QyxNQUFNTSxjQUFjLFNBQVNqSCw2REFBTSxDQUFDO0VBQ2xDeEQsV0FBV0EsQ0FBQ3FCLE1BQU0sRUFBRTtJQUNsQixLQUFLLENBQUMsQ0FBQztJQUNQLElBQUksQ0FBQ0EsTUFBTSxHQUFHQSxNQUFNO0VBQ3RCOztFQUVBOztFQUVBcUosU0FBUyxHQUFHO0lBQ1ZDLEtBQUssRUFBRSxLQUFLO0lBQ1puSyxHQUFHLEVBQUUsS0FBSztJQUNWbUMsV0FBVyxFQUFFLEVBQUU7SUFDZmlJLFVBQVUsRUFBRSxJQUFJO0lBQ2hCQyxRQUFRLEVBQUUsS0FBSztJQUNmQyxHQUFHLEVBQUU7RUFDUCxDQUFDOztFQUVEOztFQUVBQyxnQkFBZ0IsR0FBSXhLLEdBQUcsSUFBSztJQUMxQixJQUFJQSxHQUFHLENBQUNVLElBQUksRUFBRTtNQUNaLElBQUksQ0FBQ3lKLFNBQVMsR0FBRztRQUNmQyxLQUFLLEVBQUUsS0FBSztRQUNabkssR0FBRyxFQUFFLEtBQUs7UUFDVm1DLFdBQVcsRUFBRSxFQUFFO1FBQ2ZpSSxVQUFVLEVBQUUsSUFBSTtRQUNoQkMsUUFBUSxFQUFFO01BQ1osQ0FBQztJQUNILENBQUMsTUFBTSxJQUFJdEssR0FBRyxDQUFDQyxHQUFHLElBQUksSUFBSSxDQUFDa0ssU0FBUyxDQUFDQyxLQUFLLEtBQUssS0FBSyxFQUFFO01BQ3BELElBQUksQ0FBQ0QsU0FBUyxDQUFDL0gsV0FBVyxDQUFDZCxJQUFJLENBQUN0QixHQUFHLENBQUNyQixJQUFJLENBQUM7TUFDekMsSUFBSSxDQUFDd0wsU0FBUyxDQUFDbEssR0FBRyxHQUFHLElBQUk7TUFDekIsSUFBSSxDQUFDa0ssU0FBUyxDQUFDQyxLQUFLLEdBQUcsSUFBSTtJQUM3QixDQUFDLE1BQU0sSUFBSXBLLEdBQUcsQ0FBQ0MsR0FBRyxJQUFJLElBQUksQ0FBQ2tLLFNBQVMsQ0FBQ0MsS0FBSyxLQUFLLElBQUksRUFBRTtNQUNuRCxJQUFJLENBQUNELFNBQVMsQ0FBQ2xLLEdBQUcsR0FBRyxJQUFJO01BQ3pCLElBQUksQ0FBQ2tLLFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ2QsSUFBSSxDQUFDdEIsR0FBRyxDQUFDckIsSUFBSSxDQUFDO01BQ3pDLElBQUksSUFBSSxDQUFDd0wsU0FBUyxDQUFDRSxVQUFVLEtBQUssSUFBSSxFQUFFO1FBQ3RDLElBQUksQ0FBQ0YsU0FBUyxDQUFDRSxVQUFVLEdBQUdJLElBQUksQ0FBQ0MsR0FBRyxDQUNsQyxJQUFJLENBQUNQLFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBR3BDLEdBQUcsQ0FBQ3JCLElBQ3RDLENBQUM7TUFDSDtJQUNGLENBQUMsTUFBTSxJQUNMcUIsR0FBRyxDQUFDQyxHQUFHLEtBQUssS0FBSyxJQUNqQixJQUFJLENBQUNrSyxTQUFTLENBQUNDLEtBQUssS0FBSyxJQUFJLElBQzdCLElBQUksQ0FBQ0QsU0FBUyxDQUFDL0gsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxFQUNyQztNQUNBLElBQUksQ0FBQ21JLFNBQVMsQ0FBQ2xLLEdBQUcsR0FBRyxLQUFLO01BQzFCLElBQUksQ0FBQ2tLLFNBQVMsQ0FBQ0csUUFBUSxHQUFHLElBQUk7TUFFOUIsSUFBSSxDQUFDSCxTQUFTLENBQUNJLEdBQUcsR0FDaEIsSUFBSSxDQUFDSixTQUFTLENBQUMvSCxXQUFXLENBQUMsSUFBSSxDQUFDK0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsTUFBTSxJQUFJaEMsR0FBRyxDQUFDQyxHQUFHLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQ2tLLFNBQVMsQ0FBQ0MsS0FBSyxLQUFLLElBQUksRUFBRTtNQUM3RCxJQUFJLENBQUNELFNBQVMsQ0FBQ2xLLEdBQUcsR0FBRyxLQUFLO0lBQzVCO0VBQ0YsQ0FBQzs7RUFFRDs7RUFFQSxPQUFPMEssZ0JBQWdCQSxDQUFDMUIsVUFBVSxFQUFFO0lBQ2xDLE1BQU0yQixLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QixNQUFNQyxTQUFTLEdBQUc7SUFDaEI7SUFDQTtNQUNFQyxJQUFJLEVBQUUsR0FBRztNQUNUQyxNQUFNQSxDQUFDQyxDQUFDLEVBQUVDLENBQUMsRUFBRTtRQUNYLE9BQU9ELENBQUMsR0FBR0MsQ0FBQztNQUNkO0lBQ0YsQ0FBQyxFQUNEO01BQ0VILElBQUksRUFBRSxHQUFHO01BQ1RDLE1BQU1BLENBQUNDLENBQUMsRUFBRUMsQ0FBQyxFQUFFO1FBQ1gsT0FBT0QsQ0FBQyxHQUFHQyxDQUFDO01BQ2Q7SUFDRixDQUFDLENBQ0Y7SUFDRCxPQUFPSixTQUFTLENBQUNKLElBQUksQ0FBQ1MsS0FBSyxDQUFDVCxJQUFJLENBQUNVLE1BQU0sQ0FBQyxDQUFDLEdBQUdOLFNBQVMsQ0FBQzdJLE1BQU0sQ0FBQyxDQUFDLENBQUMrSSxNQUFNLENBQ25FOUIsVUFBVSxFQUNWMkIsS0FBSyxDQUFDSCxJQUFJLENBQUNTLEtBQUssQ0FBQ1QsSUFBSSxDQUFDVSxNQUFNLENBQUMsQ0FBQyxHQUFHUCxLQUFLLENBQUM1SSxNQUFNLENBQUMsQ0FDaEQsQ0FBQyxDQUFDLENBQUM7RUFDTDs7RUFFQTs7RUFFQW9DLE1BQU0sR0FBR0EsQ0FBQSxLQUFNO0lBQ2IsSUFBSXpCLEdBQUc7SUFDUDtJQUNBLElBQUksSUFBSSxDQUFDd0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDSixNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzNDVyxHQUFHLEdBQUd1SCxjQUFjLENBQUNTLGdCQUFnQixDQUFDLElBQUksQ0FBQ1IsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3BFLE9BQU8sQ0FBQyxLQUFLLENBQUNnQixLQUFLLENBQUNULEdBQUcsQ0FBQyxJQUFJQSxHQUFHLEdBQUcsR0FBRyxJQUFJQSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1FBQ2hEQSxHQUFHLEdBQUd1SCxjQUFjLENBQUNTLGdCQUFnQixDQUFDLElBQUksQ0FBQ1IsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4RTtNQUNGO0lBQ0EsQ0FBQyxNQUFNLElBQ0wsSUFBSSxDQUFDK0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxJQUNyQyxJQUFJLENBQUNtSSxTQUFTLENBQUNsSyxHQUFHLEtBQUssSUFBSSxFQUMzQjtNQUNBO01BQ0EsSUFBSSxJQUFJLENBQUNrSyxTQUFTLENBQUNHLFFBQVEsS0FBSyxLQUFLLEVBQUU7UUFDckMsTUFBTWMsT0FBTyxHQUNYLElBQUksQ0FBQ2pCLFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQyxJQUFJLENBQUMrSCxTQUFTLENBQUMvSCxXQUFXLENBQUNKLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkUsTUFBTXFKLFFBQVEsR0FDWixJQUFJLENBQUNsQixTQUFTLENBQUMvSCxXQUFXLENBQUMsSUFBSSxDQUFDK0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDSixNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLE1BQU1zSixRQUFRLEdBQUcsSUFBSSxDQUFDbkIsU0FBUyxDQUFDRSxVQUFVO1FBQzFDLElBQUllLE9BQU8sR0FBR0MsUUFBUSxFQUFFO1VBQ3RCMUksR0FBRyxHQUFHeUksT0FBTyxHQUFHRSxRQUFRO1FBQzFCLENBQUMsTUFBTSxJQUFJRixPQUFPLEdBQUdDLFFBQVEsRUFBRTtVQUM3QjFJLEdBQUcsR0FBR3lJLE9BQU8sR0FBR0UsUUFBUTtRQUMxQjtRQUNBLElBQUkzSSxHQUFHLEdBQUcsR0FBRyxJQUFJQSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDUyxLQUFLLENBQUNULEdBQUcsQ0FBQyxFQUFFO1VBQUU7VUFDL0MsSUFBSSxDQUFDd0gsU0FBUyxDQUFDRyxRQUFRLEdBQUcsSUFBSTtVQUM5QixJQUFJLENBQUNILFNBQVMsQ0FBQ0ksR0FBRyxHQUFHYSxPQUFPO1VBQzVCLElBQUksQ0FBQ2pCLFNBQVMsQ0FBQy9ILFdBQVcsR0FBRyxJQUFJLENBQUMrSCxTQUFTLENBQUMvSCxXQUFXLENBQUNtSixJQUFJLENBQzFELENBQUNQLENBQUMsRUFBRUMsQ0FBQyxLQUFLRCxDQUFDLEdBQUdDLENBQ2hCLENBQUM7VUFDRCxJQUFJLElBQUksQ0FBQ2QsU0FBUyxDQUFDSSxHQUFHLEtBQUssSUFBSSxDQUFDSixTQUFTLENBQUMvSCxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeERPLEdBQUcsR0FDRCxJQUFJLENBQUN3SCxTQUFTLENBQUMvSCxXQUFXLENBQ3hCLElBQUksQ0FBQytILFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsQ0FDdEMsR0FBR3NKLFFBQVE7VUFDaEIsQ0FBQyxNQUFNO1lBQ0wzSSxHQUFHLEdBQUcsSUFBSSxDQUFDd0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHa0osUUFBUTtVQUNoRDtRQUNGO1FBQ0Y7TUFDQSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUNuQixTQUFTLENBQUNHLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDM0MsTUFBTWdCLFFBQVEsR0FBRyxJQUFJLENBQUNuQixTQUFTLENBQUNFLFVBQVU7UUFDMUMsSUFBSSxDQUFDRixTQUFTLENBQUMvSCxXQUFXLEdBQUcsSUFBSSxDQUFDK0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDbUosSUFBSSxDQUMxRCxDQUFDUCxDQUFDLEVBQUVDLENBQUMsS0FBS0QsQ0FBQyxHQUFHQyxDQUNoQixDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUNkLFNBQVMsQ0FBQ0ksR0FBRyxLQUFLLElBQUksQ0FBQ0osU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1VBQ3hETyxHQUFHLEdBQ0QsSUFBSSxDQUFDd0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLElBQUksQ0FBQytILFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUNqRXNKLFFBQVE7UUFDWixDQUFDLE1BQU07VUFDTDNJLEdBQUcsR0FBRyxJQUFJLENBQUN3SCxTQUFTLENBQUMvSCxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUdrSixRQUFRO1FBQ2hEO01BQ0Y7TUFDRjtJQUNBLENBQUMsTUFBTSxJQUNMLElBQUksQ0FBQ25CLFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsSUFDckMsSUFBSSxDQUFDbUksU0FBUyxDQUFDbEssR0FBRyxLQUFLLEtBQUssRUFDNUI7TUFDQSxJQUFJLENBQUNrSyxTQUFTLENBQUNHLFFBQVEsR0FBRyxJQUFJO01BQzlCLElBQUksQ0FBQ0gsU0FBUyxDQUFDSSxHQUFHLEdBQ2hCLElBQUksQ0FBQ0osU0FBUyxDQUFDL0gsV0FBVyxDQUFDLElBQUksQ0FBQytILFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsQ0FBQztNQUNuRSxJQUFJLENBQUNtSSxTQUFTLENBQUMvSCxXQUFXLEdBQUcsSUFBSSxDQUFDK0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDbUosSUFBSSxDQUMxRCxDQUFDUCxDQUFDLEVBQUVDLENBQUMsS0FBS0QsQ0FBQyxHQUFHQyxDQUNoQixDQUFDO01BQ0QsSUFBSSxJQUFJLENBQUNkLFNBQVMsQ0FBQ0ksR0FBRyxLQUFLLElBQUksQ0FBQ0osU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3hETyxHQUFHLEdBQ0QsSUFBSSxDQUFDd0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLElBQUksQ0FBQytILFNBQVMsQ0FBQy9ILFdBQVcsQ0FBQ0osTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUNqRSxJQUFJLENBQUNtSSxTQUFTLENBQUNFLFVBQVU7TUFDN0IsQ0FBQyxNQUFNO1FBQ0wxSCxHQUFHLEdBQUcsSUFBSSxDQUFDd0gsU0FBUyxDQUFDL0gsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQytILFNBQVMsQ0FBQ0UsVUFBVTtNQUNqRTtNQUNGO0lBQ0EsQ0FBQyxNQUFNO01BQ0wxSCxHQUFHLEdBQUdpRixpRUFBWSxDQUFDLEdBQUcsQ0FBQztNQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDeEUsS0FBSyxDQUFDVCxHQUFHLENBQUMsSUFBSUEsR0FBRyxHQUFHLENBQUMsRUFBRTtRQUNuQ0EsR0FBRyxHQUFHaUYsaUVBQVksQ0FBQyxHQUFHLENBQUM7TUFDekI7SUFDRjtJQUNBO0lBQ0EsS0FBSyxDQUFDekUsU0FBUyxHQUFHUixHQUFHO0lBQ3JCLElBQUksQ0FBQzdCLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDK0IsR0FBRyxDQUFDO0lBQ3hCLE9BQU9BLEdBQUc7RUFDWixDQUFDO0FBQ0g7QUFFQSxTQUFTNkksY0FBY0EsQ0FBQSxFQUFHO0VBQ3hCLE1BQU1DLGNBQWMsR0FBRyxJQUFJdkIsY0FBYyxDQUFDcEQscUVBQWMsQ0FBQztFQUN6REUsNkRBQVUsQ0FBQ3pELFNBQVMsQ0FBQ2tJLGNBQWMsQ0FBQ3JILE1BQU0sQ0FBQztFQUMzQzJDLDJFQUFvQixDQUFDeEQsU0FBUyxDQUFDa0ksY0FBYyxDQUFDakIsZ0JBQWdCLENBQUM7QUFDakU7QUFFQXRHLDZEQUFlLENBQUNYLFNBQVMsQ0FBQ2lJLGNBQWMsQ0FBQztBQUV6QywrREFBZXRCLGNBQWM7Ozs7Ozs7Ozs7Ozs7OztBQ3pMbUI7QUFDMEI7QUFDakI7QUFDUDtBQUVsRCxNQUFNd0IsVUFBVSxTQUFTekksNkRBQU0sQ0FBQztFQUUvQnhELFdBQVdBLENBQUNxQixNQUFNLEVBQUU7SUFDakIsS0FBSyxDQUFDLENBQUM7SUFDUCxJQUFJLENBQUNBLE1BQU0sR0FBR0EsTUFBTTtFQUN0QjtFQUVBc0QsTUFBTSxHQUFJbEQsS0FBSyxJQUFLO0lBQ2xCLElBQUksS0FBSyxDQUFDa0MsS0FBSyxDQUFDbEMsS0FBSyxDQUFDLEVBQUU7TUFDdEIsS0FBSyxDQUFDaUMsU0FBUyxHQUFHakMsS0FBSztNQUN2QixJQUFJLENBQUNKLE1BQU0sQ0FBQ0YsT0FBTyxDQUFDTSxLQUFLLENBQUM7TUFDMUIsT0FBT0EsS0FBSztJQUNkO0lBQ0EsTUFBTSxJQUFJdkIsS0FBSyxDQUFDLGdDQUFnQyxDQUFDO0VBQ25ELENBQUM7QUFDSDtBQUVBLFNBQVNnTSxVQUFVQSxDQUFBLEVBQUc7RUFDcEIsTUFBTUMsTUFBTSxHQUFHLElBQUlGLFVBQVUsQ0FBQzFFLDZEQUFVLENBQUM7RUFDekNwQixvREFBZ0IsQ0FBQ3JDLFNBQVMsQ0FBQ3FJLE1BQU0sQ0FBQ3hILE1BQU0sQ0FBQztBQUMzQztBQUVBRiw2REFBZSxDQUFDWCxTQUFTLENBQUNvSSxVQUFVLENBQUM7QUFFckMsK0RBQWVELFVBQVU7Ozs7Ozs7Ozs7O0FDM0J6QixTQUFTcEMsaUJBQWlCQSxDQUFDdUMsSUFBSSxFQUFFO0VBQy9CLElBQUksT0FBT0EsSUFBSSxLQUFLLFFBQVEsRUFBRTtJQUM1QixNQUFNLElBQUlsTSxLQUFLLENBQUMsMEJBQTBCLENBQUM7RUFDN0M7RUFDQSxNQUFNbU0sTUFBTSxHQUFHbE4sUUFBUSxDQUFDc0gsZ0JBQWdCLENBQUUsVUFBUzJGLElBQUssSUFBRyxDQUFDO0VBRTVELEtBQUssSUFBSXhNLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3lNLE1BQU0sQ0FBQzlKLE1BQU0sRUFBRTNDLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDdkMsSUFBSXlNLE1BQU0sQ0FBQ3pNLENBQUMsQ0FBQyxDQUFDd0osT0FBTyxFQUFFO01BQ3JCLE9BQU9pRCxNQUFNLENBQUN6TSxDQUFDLENBQUMsQ0FBQzZCLEtBQUs7SUFDeEI7RUFDSjtBQUNGO0FBRUEsK0RBQWVvSSxpQkFBaUI7Ozs7Ozs7Ozs7O0FDZmhDLFNBQVMxQixZQUFZQSxDQUFDaEcsR0FBRyxFQUFFO0VBQ3pCLE9BQU82SSxJQUFJLENBQUNTLEtBQUssQ0FBQ1QsSUFBSSxDQUFDVSxNQUFNLENBQUMsQ0FBQyxHQUFHdkosR0FBRyxDQUFDO0FBQ3hDO0FBRUEsK0RBQWVnRyxZQUFZOzs7Ozs7VUNKM0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQSw4Q0FBOEM7Ozs7O1dDQTlDO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05xRDtBQUNHO0FBRXhEckksMkVBQW1CLENBQUNxQixPQUFPLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcGxheWVyL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHViLXN1Yi9wdWItc3ViLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tYXR0YWNrLXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mb19fdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2dldC1yYW5kb20tbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGNyZWF0ZXMgc2luZ2xlIHRpbGUgd2l0aCBldmVudCBsaXN0ZW5lciAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgdGlsZS50ZXh0Q29udGVudD0gXCJcIjtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbi8qIGNyZWF0ZXMgMTAwIHRpbGVzIHdpdGggZXZlbnQgbGlzdGVuZXJzICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlVGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVRpbGVzO1xuIiwiaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbi8qIGNsYXNzIHVzZWQgdG8gdXBkYXRlIHRoZSBET00gYmFzZWQgb24gaXQncyBjb3JyZXNwb25kaW5nIGdhbWVib2FyZCAqL1xuXG5jbGFzcyBHYW1lQm9hcmRWaWV3IHtcblxuICAvKiBzdHJpbmcgaXMgdXNlZCB0byBxdWVyeSB0aGUgY29ycmVjdCBnYW1lYm9hcmQsIGlzIGNvbXB1dGVyIG9yIHVzZXIgKi9cblxuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHsgIFxuICAgIGlmIChzdHJpbmcgIT09IFwiY29tcHV0ZXJcIiAmJiBzdHJpbmcgIT09IFwidXNlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lQm9hcmRWaWV3IGNyZWF0ZWQgd2l0aCBpbmNvcnJlY3Qgc3RyaW5nXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qIHVwZGF0ZXMgdGlsZXMgY2xhc3NlcyBmcm9tIGhpdCB0byBzdW5rICovXG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgLyogZ2V0cyB0aWxlIHN0YXR1cyAqL1xuXG4gIHN0YXRpYyBnZXRTdGF0dXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai5oaXQgPyBcImdhbWVib2FyZF9fdGlsZS0taGl0XCIgOiBcImdhbWVib2FyZF9fdGlsZS0tbWlzc1wiO1xuICB9XG5cbiAgLyogcXVlcnkgdGlsZSBiYXNlZCBvbiBzdHJpbmcgYW5kIGRhdGEtaWQgKi9cblxuICBxdWVyeVRpbGUgPSBkYXRhSWQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2RhdGFJZH1cIl1gKVxuXG4gIC8qIG9uY2UgYSBzaGlwIGlzIHN1bmsgcmVwbGFjZXMgdGhlIGhpdCBjbGFzcyB3aXRoIHN1bmsgY2xhc3Mgb24gYWxsIHRoZSBzaGlwcyB0aWxlcyAqL1xuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMucXVlcnlUaWxlKGVsZW1lbnQpO1xuICAgICAgR2FtZUJvYXJkVmlldy51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogbGFiZWxzIHRpbGVzIHdpdGggaGl0LCBtaXNzLCBzdW5rLCBjbGFzc2VzLiBJZiBhbGwgc2hpcCdzIHN1bmsgcHVibGlzaGVzIHRoZSBzdHJpbmcgdG8gaW5pdGlhbGl6ZSBnYW1lIG92ZXIgcHViIHN1YiAqL1xuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUob2JqLnRpbGUpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXcuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3O1xuIiwiY2xhc3MgR2FtZUJvYXJkIHtcblxuICAvKiB0aGUgcHViIHN1YiByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgdGhlIG9wcG9uZW50cyBhdHRhY2sgKi9cblxuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIHNoaXBzQXJyID0gW107XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyICovXG5cbiAgZ2V0IHNoaXBzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzQXJyO1xuICB9XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyLCBhY2NlcHRzIGJvdGggYXJyYXlzIGFuZCBzaW5nbGUgb2JqZWN0cyAqL1xuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvcnMgZm9yIG1pc3NlZEFyciAqL1xuXG4gIGdldCBtaXNzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlzc2VkQXJyO1xuICB9XG5cbiAgc2V0IG1pc3NlZCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLm1pc3NlZC5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciAoXCJUaGUgc2FtZSB0aWxlIHdhcyBhdHRhY2tlZCB0d2ljZSFcIilcbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaCh2YWx1ZSk7XG4gIH1cblxuICAgIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBHYW1lQm9hcmQuY2FsY01heChvYmopO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogcmV0dXJucyB0cnVlIGlmIGEgc2hpcCBpcyBhbHJlYWR5IHBsYWNlZCBvbiB0aWxlcyBuZWlnaGJvcmluZyBwYXNzZWQgY29vcmRpbmF0ZXMgKi9cblxuICBpc05laWdoYm9yaW5nKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgLy8gSG9yaXpvbnRhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEpO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAvLyBubyBjaGVja3MgZm9yIHRvcCBhbmQgYm90dG9tIGJvcmRlcnMsIHNpbmNlIGltcG9zc2libGUgdG8gcGxhY2Ugc2hpcCBvdXRzaWRlIHRoZSBncmlkXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEwKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMTApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWZXJ0aWNhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKSxcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA8IDExKSB7XG4gICAgICAgIC8vIHRvcCBib3JkZXIsIGFkZHMgb25seSBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSA+IDkwKSB7XG4gICAgICAgIC8vIGJvdHRvbSBib3JkZXIsIGFkZHMgb25seSB0b3AgdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0b3Agb3IgYm90dG9tIGJvcmRlciwgYWRkcyB0aGUgdG9wIGFuZCBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTAsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxMFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBpZiBzaGlwIHBsYWNlZCBvbiBuZWlnaGJvcmluZyB0aWxlcyByZXR1cm5zIHRydWUgKi9cbiAgICByZXR1cm4gdGhpcy5pc1Rha2VuKGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiB0aGUgdGhlIHRpbGUgbnVtIHNlbGVjdGVkIGJ5IG9wcG9uZW50IGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIsIGVsc2UgYWRkcyB0aWxlIG51bSB0byBtaXNzZWQgYXJyYXkgICovXG5cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgICAgIGhpdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1bms6IHRydWUsXG4gICAgICAgICAgICB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiB0aGlzLmlzT3ZlcigpXG4gICAgICAgICAgICA/IHRoaXMucHViU3ViLnB1Ymxpc2goeyAuLi5vYmosIC4uLnsgZ2FtZW92ZXI6IHRydWUgfSB9KVxuICAgICAgICAgICAgOiB0aGlzLnB1YlN1Yi5wdWJsaXNoKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkID0gbnVtO1xuXG4gICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogZmFsc2UsIHN1bms6IGZhbHNlIH0pO1xuICB9O1xuXG4gIC8qIGNhbGxlZCB3aGVuIGEgc2hpcCBpcyBzdW5rLCByZXR1cm5zIEEpIEdBTUUgT1ZFUiBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3IgQikgU1VOSyBpZiB0aGVyZSdzIG1vcmUgc2hpcHMgbGVmdCAqL1xuXG4gIGlzT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjaGVjayA9IHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCIvKiBwbGF5ZXIgYmFzZSBjbGFzcyAqL1xuXG5jbGFzcyBQbGF5ZXIge1xuXG4gIHByZXZpb3VzQXR0YWNrcyA9IFtdXG4gIFxuICBnZXQgYXR0YWNrQXJyKCkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzQXR0YWNrcztcbiAgfVxuXG4gIHNldCBhdHRhY2tBcnIodmFsdWUpIHtcbiAgICB0aGlzLnByZXZpb3VzQXR0YWNrcy5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGlzTmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuICF0aGlzLmF0dGFja0Fyci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgXG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFNoaXAuY3JlYXRlQ29vckFycihvYmopO1xuICB9XG5cbiAgdGltZXNIaXQgPSAwO1xuXG4gIHN1bmsgPSBmYWxzZTtcblxuICBzdGF0aWMgY3JlYXRlQ29vckFycihvYmopIHtcbiAgICBjb25zdCBhcnIgPSBbK29iai50aWxlTnVtXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSwgZ2FtZW92ZXIgYXMgaW5pdEdhbWVvdmVyIH0gZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IGF0dGFjayBhcyB1c2VyQ2xpY2tBdHRhY2sgfSBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCI7IFxuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuLyogaGlkZXMgdGhlIHBsYWNlbWVudCBmb3JtICovXG5cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLXBsYWNlbWVudC1mb3JtXCIpO1xuICBmb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbi8qIHNob3cncyB0aGUgY29tcHV0ZXIncyBib2FyZCAqL1xuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG4vKiBwdWJsaXNoIHRoZSB0aWxlJ3MgZGF0YS1pZCAqL1xuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7aWR9ID0gdGhpcy5kYXRhc2V0O1xuICB1c2VyQ2xpY2tBdHRhY2sucHVibGlzaChpZClcbn1cblxuLyogY3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuXG5mdW5jdGlvbiBpbml0QXR0YWNrU3RhZ2VUaWxlcygpIHtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2Q29tcHV0ZXIsIHB1Ymxpc2hEYXRhSWQpO1xufVxuXG4vKiBjcmVhdGVzIGdhbWVvdmVyIG5vdGlmaWNhdGlvbiBhbmQgbmV3IGdhbWUgYnRuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0dhbWVCdG4oKSB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICBidG4udGV4dENvbnRlbnQgPSBcIk5ldyBHYW1lXCI7XG4gIGJ0bi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9fYnRuXCIsIFwibG9jLWdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2J0blwiKVxuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xuICByZXR1cm4gYnRuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyBcbiAgY29uc3QgaDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gIGgxLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19oZWFkaW5nXCIsIFwibG9jLWdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2hlYWRpbmdcIilcbiAgaDEudGV4dENvbnRlbnQgPSBcIkdBTUUgT1ZFUlwiO1xuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIsIFwibG9jLWdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICBpZiAoc3RyaW5nID09PSBcInVzZXJcIikge1xuICAgIGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbi0tbG9zc1wiKTtcbiAgfSBlbHNlIHtcbiAgICBoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uLS13aW5cIik7XG4gIH1cbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcbiAgZGl2LmFwcGVuZENoaWxkKGgzKTtcbiAgXG4gIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVOZXdHYW1lQnRuKCkpO1xuICByZXR1cm4gZGl2O1xufVxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cbi8qIFN1YnNjcmliZSB0byBpbml0aWFsaXppbmcgcHViLXN1YnMgKi9cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEF0dGFja1N0YWdlVGlsZXMpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSk7XG5pbml0R2FtZW92ZXIuc3Vic2NyaWJlKHNob3dHYW1lT3Zlcik7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7XG4gIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSxcbiAgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlLFxufSBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBpbmNyZWFzZUdhcCgpIHtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICBtYWluLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZ2FwOiAyMHB4XCIpXG5cbn1cblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkQnRuTGlzdGVuZXIoKSB7XG4gIGNvbnN0IHBsYWNlU2hpcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcbiAgcGxhY2VTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7IGlkIH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGljay5waWNrUGxhY2VtZW50LnB1Ymxpc2goaWQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZW1lbnRUaWxlcygpIHtcbiAgY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuICBjcmVhdGVUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQgKi9cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmQtLXVzZXIgLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgIHRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEYXRhSWQpO1xuICB9KTtcbn1cblxuLyogcmVtb3ZlcyBhbmNob3IgY3Vyc29yIGZyb20gdXNlciBnYW1lYm9hcmQgKi9cbmZ1bmN0aW9uIHJlbW92ZUFuY2hvcigpIHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLXVzZXJcIik7XG4gIGdhbWVib2FyZC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImN1cnNvcjogYXV0b1wiKTtcbn1cblxuXG5cbi8qIGluaXRpYWxpemF0aW9uIHN1YnNjcmlwdGlvbnMgKi9cblxuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRCdG5MaXN0ZW5lcik7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZElucHV0TGlzdGVuZXJzKTtcbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoaGlkZUNvbXBCb2FyZCk7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGNyZWF0ZVBsYWNlbWVudFRpbGVzKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUocmVtb3ZlRXZlbnRMaXN0ZW5lcnMpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShyZW1vdmVBbmNob3IpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbmNyZWFzZUdhcCk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCB1c2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVVc2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrLH07XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgcGlja1BsYWNlbWVudCA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaW5wdXQgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGNyZWF0ZVNoaXBJbmZvKCkgcHVibGlzaGVzIGEgc2hpcEluZm8gb2JqLiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IGlzIHN1YnNjcmliZWQgYW5kIGNoZWNrcyB3aGV0aGVyIGEgc2hpcCBjYW4gYmUgcGxhY2VkIHRoZXJlICovXG5cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gKi9cblxuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICovXG5cbmNvbnN0IHNoaXBQbGFjZUJ0biA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiAgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgY3JlYXRlcyB0aGUgc2hpcEluZm8uIFRoZSBnYW1lYm9hcmQucGxhY2VTaGlwICovXG5cbmNvbnN0IGNyZWF0ZVNoaXAgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFVzZXJHYW1lQm9hcmQucHVibGlzaFBsYWNlU2hpcCBwdWJsaXNoZXMgc2hpcCBjb29yZGluYXRlcy4gR2FtZUJvYXJkVXNlclZpZXcuaGFuZGxlUGxhY2VtZW50VmlldyBhZGRzIHBsYWNlbWVudC1zaGlwIGNsYXNzIHRvIHRpbGVzICovXG5cbmNvbnN0IGNyZWF0ZVNoaXBWaWV3ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0LCBzaGlwSW5mbywgdmFsaWRpdHlWaWV3cywgc2hpcFBsYWNlQnRuLCBjcmVhdGVTaGlwLCBjcmVhdGVTaGlwVmlld30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBwbGFjZW1lbnQgc3RhZ2UgKi9cblxuY29uc3QgcGxhY2VtZW50U3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBhdHRhY2sgc3RhZ2UgKi9cblxuY29uc3QgYXR0YWNrU3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIGdhbWUgb3ZlciBkaXYgKi9cblxuY29uc3QgZ2FtZW92ZXIgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IGF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSwgZ2FtZW92ZXIgfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IFNoaXBJbmZvIGZyb20gXCIuL3NoaXAtaW5mby9zaGlwLWluZm9cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cblxuY2xhc3MgQ29tcHV0ZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4vKiByZWNyZWF0ZXMgYSByYW5kb20gc2hpcCwgdW50aWwgaXRzIGNvb3JkaW5hdGVzIGFyZSBub3QgdGFrZW4sIG5laWdoYm9yaW5nIG90aGVyIHNoaXBzLCBvciB0b28gYmlnICovXG5cbiAgcGxhY2VTaGlwKGxlbmd0aCkge1xuICAgIGxldCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIHdoaWxlIChzdXBlci5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHN1cGVyLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgc2hpcC5kaXJlY3Rpb24pIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhzaGlwSW5mbykgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSBjb21wdXRlciBnYW1lIGJvYXJkICovXG5cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbnN0IHNoaXBzQXJyID0gWzUsIDQsIDMsIDJdXG5cbiAgICBzaGlwc0Fyci5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwKVxuICAgIH0pO1xuICAgIFxuXG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFZpZXcoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXcuaGFuZGxlQXR0YWNrVmlldyk7XG5cbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBjcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgbGV0IG51bSA9ICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgICB3aGlsZSAobnVtIDwgMSB8fCBudW0gPiAxMDApIHtcbiAgICAgIG51bSA9ICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bVxuICB9XG4gICBsZXQgbnVtID0gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG4gICB3aGlsZSAobnVtIDwgMSB8fCBudW0gPiAxMDApIHtcbiAgICBudW0gPSArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuIG51bVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21UaWxlTnVtO1xuIiwiXG5pbXBvcnQgZ2V0UmFuZG9tRGlyZWN0aW9uIGZyb20gXCIuL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uXCI7XG5pbXBvcnQgZ2V0UmFuZG9tVGlsZU51bSBmcm9tIFwiLi9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW1cIjtcblxuY2xhc3MgU2hpcEluZm8ge1xuICBcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBnZXRSYW5kb21EaXJlY3Rpb24oKTtcbiAgICB0aGlzLnRpbGVOdW0gPSBnZXRSYW5kb21UaWxlTnVtKHRoaXMubGVuZ3RoLCB0aGlzLmRpcmVjdGlvbik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm87XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuICAvKiBjaGVja3Mgc2hpcCB2YWxpZGl0eSAqL1xuXG4gIGlzVmFsaWQgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHN1cGVyLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgR2FtZUJvYXJkLmlzVG9vQmlnKG9iaikgfHwgc3VwZXIuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSB1c2VyIGdhbWUgYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdFVzZXJHQigpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0SGFuZGxlQXR0YWNrKVxufVxuXG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGluaXRVc2VyR0IpXG5cblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3IGV4dGVuZHMgR2FtZUJvYXJkVmlldyB7XG5cbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgcmFkaW8gaW5wdXQgZm9yIHRoYXQgc2hpcCBpcyBoaWRkZW4gKi9cblxuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG5cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKTtcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiBjbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cblxuICBjbGVhclZhbGlkaXR5VmlldyA9ICgpID0+IHtcbiAgICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkX190aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSk7XG4gICAgdGhpcy5idG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gIH07XG5cbiAgLyogYWRkcyB0aGUgdmlzdWFsIGNsYXNzIHBsYWNlbWVudC0tdmFsaWQgb3IgcGxhY2VtZW50LS1pbnZhbGlkIGJhc2VkIG9uIHRoZSB0aWxlTnVtIGNob3NlbiBieSB0aGUgdXNlciwgZGlzYWJsZXMgdGhlIHN1Ym1pdCBidG4gaWYgaXQgZmFpbHMgcGxhY2VtZW50IGNoZWNrICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBpZiAoIW9iai52YWxpZCkge1xuICAgICAgdGhpcy5idG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICBpZiAob2JqLnZhbGlkKSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIik7XG4gICAgfSk7XG4gIH07XG59XG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXcgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXcodXNlcik7XG5cbi8qIHN1YnNjcmlwdGlvbnMgKi9cblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5Vmlldyk7XG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcpO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICB9LFxuICByZXNldE51bSgpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSAwO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgcmV0dXJuIHNoaXBJbmZvO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICBjb25zdCBpc0NvbXBsZXRlID0gT2JqZWN0LnZhbHVlcyhzaGlwSW5mbykuZXZlcnkoKHZhbHVlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHZhbHVlICE9PSBmYWxzZSAmJlxuICAgICAgdmFsdWUgIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNDb21wbGV0ZSkge1xuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwLnB1Ymxpc2goc2hpcEluZm8pO1xuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTtcbiAgfVxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSk7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQge2F0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZX0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7XG4gIGNvbXB1dGVyQXR0YWNrLFxuICBoYW5kbGVDb21wdXRlckF0dGFjayxcbn0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgLyogaG9sZHMgaW5mb3JtYXRpb24gb24gYW55IHNoaXAgdGhhdCB3YXMgZm91bmQgKi9cblxuICBmb3VuZFNoaXAgPSB7XG4gICAgZm91bmQ6IGZhbHNlLFxuICAgIGhpdDogZmFsc2UsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgIGVuZDogbnVsbCxcbiAgfTtcblxuICAvKiByZWNlaXZlcyBpbmZvcm1hdGlvbiBvbiB0aGUgbGFzdCBhdHRhY2sgYW5kIGFkanVzdHMgdGhlIGZvdW5kU2hpcCBvYmplY3QgYWNjb3JkaW5nbHkgKi9cblxuICB3YXNBdHRhY2tTdWNjZXNzID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy5mb3VuZFNoaXAgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgICAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgICAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPSBNYXRoLmFicyhcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIG9iai50aWxlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9iai5oaXQgPT09IGZhbHNlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gZmFsc2U7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKiBnZW5lcmF0ZXMgYSBjb29yZGluYXRlIChlaXRoZXIgdG9wLCBidG0sIGxlZnQsIG9yIHJpZ2h0KSB0aGF0IGlzIG5leHQgdG8gdGhlIGNvb3JkaW5hdGUgcGFzc2VkICovXG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICAvKiBjb21wdXRlciBhdHRhY2sgbG9naWMgKi9cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogUHVibGlzaCBhbmQgQWRkIHRvIGFyciAqL1xuICAgIHN1cGVyLmF0dGFja0FyciA9IG51bTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wUGxheWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcHV0ZXJQbGF5ZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSB9ZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuXG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0UGxheWVyKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUGxheWVyO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsImZ1bmN0aW9uIGdldFJhbmRvbU51bShtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tTnVtICIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4vY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5wdWJsaXNoKCk7Il0sIm5hbWVzIjpbImNyZWF0ZVRpbGUiLCJpZCIsImNhbGxiYWNrIiwidGlsZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0ZXh0Q29udGVudCIsImNyZWF0ZVRpbGVzIiwiZGl2IiwiaSIsImFwcGVuZENoaWxkIiwiaW5pdCIsIkdhbWVCb2FyZFZpZXciLCJjb25zdHJ1Y3RvciIsInN0cmluZyIsIkVycm9yIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInF1ZXJ5VGlsZSIsImRhdGFJZCIsInF1ZXJ5U2VsZWN0b3IiLCJ1cGRhdGVTdW5rVGlsZXMiLCJ0aWxlcyIsImZvckVhY2giLCJlbGVtZW50IiwiaGFuZGxlQXR0YWNrVmlldyIsInN1bmsiLCJnYW1lb3ZlciIsInB1Ymxpc2giLCJHYW1lQm9hcmQiLCJwdWJTdWIiLCJzaGlwc0FyciIsIm1pc3NlZEFyciIsInNoaXBzIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJjb25jYXQiLCJwdXNoIiwibWlzc2VkIiwiaW5jbHVkZXMiLCJjYWxjTWF4IiwiZGlyZWN0aW9uIiwidGlsZU51bSIsIm1heCIsInRvU3RyaW5nIiwiY2hhckF0IiwiY2FsY0xlbmd0aCIsImxlbmd0aCIsImlzVG9vQmlnIiwic2hpcExlbmd0aCIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsInkiLCJpc05laWdoYm9yaW5nIiwiY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMiLCJtYXAiLCJjb29yIiwiaGFuZGxlQXR0YWNrIiwibnVtIiwiaXNTdW5rIiwiaXNPdmVyIiwiY2hlY2siLCJldmVyeSIsInNoaXAiLCJQbGF5ZXIiLCJwcmV2aW91c0F0dGFja3MiLCJhdHRhY2tBcnIiLCJpc05ldyIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsIlNoaXAiLCJjcmVhdGVDb29yQXJyIiwidGltZXNIaXQiLCJhcnIiLCJhdHRhY2tTdGFnZSIsImluaXRBdHRhY2tTdGFnZSIsImluaXRHYW1lb3ZlciIsImF0dGFjayIsInVzZXJDbGlja0F0dGFjayIsImdhbWVCb2FyZERpdkNvbXB1dGVyIiwiaGlkZUZvcm0iLCJmb3JtIiwic2hvd0NvbXBCb2FyZCIsImNvbXBCb2FyZCIsInJlbW92ZSIsInB1Ymxpc2hEYXRhSWQiLCJkYXRhc2V0IiwiaW5pdEF0dGFja1N0YWdlVGlsZXMiLCJjcmVhdGVOZXdHYW1lQnRuIiwiYnRuIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsInNob3dHYW1lT3ZlciIsIm1haW4iLCJub3RpZmljYXRpb24iLCJwbGFjZW1lbnRTdGFnZSIsImluaXRQbGFjZW1lbnRTdGFnZSIsInVzZXJDbGljayIsImhpZGVDb21wQm9hcmQiLCJjb21wdXRlckJvYXJkIiwiaW5jcmVhc2VHYXAiLCJhZGRJbnB1dExpc3RlbmVycyIsImZvcm1JbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5wdXQiLCJhZGRCdG5MaXN0ZW5lciIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsInBpY2tQbGFjZW1lbnQiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW1vdmVBbmNob3IiLCJnYW1lYm9hcmQiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3IiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsIlVzZXJHYW1lQm9hcmQiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJHQiIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlldyIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlldyIsIlNoaXBJbmZvVXNlciIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInJlc2V0TnVtIiwiY3JlYXRlU2hpcEluZm8iLCJwdWJsaXNoU2hpcEluZm9DaGVjayIsInB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSIsImlzQ29tcGxldGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==