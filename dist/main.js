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
  btn.textContent = "Start New Game";
  btn.addEventListener("click", () => {
    window.location.reload();
  });
  btn.classList.add("game-over-notification__btn");
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
  const image = document.createElement("img");
  image.classList.add("game-over-notification__image");
  image.setAttribute("alt", "game over notification");
  if (string === "user") {
    h3.textContent = "YOU LOST";
    image.setAttribute("src", "../src/images/game-over--loss.png");
  } else {
    h3.textContent = "YOU WON";
    image.setAttribute("src", "../src/images/game-over--win.png");
  }
  div.appendChild(h3);
  div.appendChild(image);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQztBQUN4QztBQUVBLCtEQUFlK0YsWUFBWTs7Ozs7O1VDSjNCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEEsOENBQThDOzs7OztXQ0E5QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOcUQ7QUFDRztBQUV4RHBJLDJFQUFtQixDQUFDcUIsT0FBTyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3BsYXllci9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLWF0dGFjay1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2luaXRpYWxpemUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL3NoaXAtaW5mby5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby9zaGlwLWluZm8tLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9nZXQtcmFuZG9tLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXG4vKiBjcmVhdGVzIHNpbmdsZSB0aWxlIHdpdGggZXZlbnQgbGlzdGVuZXIgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG4vKiBjcmVhdGVzIDEwMCB0aWxlcyB3aXRoIGV2ZW50IGxpc3RlbmVycyAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVUaWxlcztcbiIsImltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuXG4vKiBjbGFzcyB1c2VkIHRvIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIGl0J3MgY29ycmVzcG9uZGluZyBnYW1lYm9hcmQgKi9cblxuY2xhc3MgR2FtZUJvYXJkVmlldyB7XG5cbiAgLyogc3RyaW5nIGlzIHVzZWQgdG8gcXVlcnkgdGhlIGNvcnJlY3QgZ2FtZWJvYXJkLCBpcyBjb21wdXRlciBvciB1c2VyICovXG5cbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7ICBcbiAgICBpZiAoc3RyaW5nICE9PSBcImNvbXB1dGVyXCIgJiYgc3RyaW5nICE9PSBcInVzZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2FtZUJvYXJkVmlldyBjcmVhdGVkIHdpdGggaW5jb3JyZWN0IHN0cmluZ1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICB9XG4gIH1cblxuICAvKiB1cGRhdGVzIHRpbGVzIGNsYXNzZXMgZnJvbSBoaXQgdG8gc3VuayAqL1xuXG4gIHN0YXRpYyB1cGRhdGVTdW5rKHRpbGUpIHtcbiAgICBpZiAodGlsZS5jbGFzc0xpc3QuY29udGFpbnMoXCJoaXRcIikpIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlcGxhY2UoXCJoaXRcIiwgXCJzdW5rXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJzdW5rXCIpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGdldHMgdGlsZSBzdGF0dXMgKi9cblxuICBzdGF0aWMgZ2V0U3RhdHVzKG9iaikge1xuICAgIHJldHVybiBvYmouaGl0ID8gXCJnYW1lYm9hcmRfX3RpbGUtLWhpdFwiIDogXCJnYW1lYm9hcmRfX3RpbGUtLW1pc3NcIjtcbiAgfVxuXG4gIC8qIHF1ZXJ5IHRpbGUgYmFzZWQgb24gc3RyaW5nIGFuZCBkYXRhLWlkICovXG5cbiAgcXVlcnlUaWxlID0gZGF0YUlkID0+IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtkYXRhSWR9XCJdYClcblxuICAvKiBvbmNlIGEgc2hpcCBpcyBzdW5rIHJlcGxhY2VzIHRoZSBoaXQgY2xhc3Mgd2l0aCBzdW5rIGNsYXNzIG9uIGFsbCB0aGUgc2hpcHMgdGlsZXMgKi9cblxuICB1cGRhdGVTdW5rVGlsZXMob2JqKSB7XG4gICAgb2JqLnRpbGVzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnF1ZXJ5VGlsZShlbGVtZW50KTtcbiAgICAgIEdhbWVCb2FyZFZpZXcudXBkYXRlU3Vuayh0aWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIGxhYmVscyB0aWxlcyB3aXRoIGhpdCwgbWlzcywgc3VuaywgY2xhc3Nlcy4gSWYgYWxsIHNoaXAncyBzdW5rIHB1Ymxpc2hlcyB0aGUgc3RyaW5nIHRvIGluaXRpYWxpemUgZ2FtZSBvdmVyIHB1YiBzdWIgKi9cblxuICBoYW5kbGVBdHRhY2tWaWV3ID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy51cGRhdGVTdW5rVGlsZXMob2JqKTtcbiAgICAgIGlmIChvYmouZ2FtZW92ZXIpIHtcbiAgICAgICAgaW5pdC5nYW1lb3Zlci5wdWJsaXNoKHRoaXMuc3RyaW5nKVxuICAgICAgfSBcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMucXVlcnlUaWxlKG9iai50aWxlKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChHYW1lQm9hcmRWaWV3LmdldFN0YXR1cyhvYmopKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkVmlldztcbiIsImNsYXNzIEdhbWVCb2FyZCB7XG5cbiAgLyogdGhlIHB1YiBzdWIgcmVzcG9uc2libGUgZm9yIGhhbmRsaW5nIHRoZSBvcHBvbmVudHMgYXR0YWNrICovXG5cbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBzaGlwc0FyciA9IFtdO1xuXG4gIG1pc3NlZEFyciA9IFtdO1xuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29yIGZvciBzaGlwc0FyciAqL1xuXG4gIGdldCBzaGlwcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwc0FycjtcbiAgfVxuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29yIGZvciBzaGlwc0FyciwgYWNjZXB0cyBib3RoIGFycmF5cyBhbmQgc2luZ2xlIG9iamVjdHMgKi9cblxuICBzZXQgc2hpcHModmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIgPSB0aGlzLnNoaXBzQXJyLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3JzIGZvciBtaXNzZWRBcnIgKi9cblxuICBnZXQgbWlzc2VkKCkge1xuICAgIHJldHVybiB0aGlzLm1pc3NlZEFycjtcbiAgfVxuXG4gIHNldCBtaXNzZWQodmFsdWUpIHtcbiAgICBpZiAodGhpcy5taXNzZWQuaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IgKFwiVGhlIHNhbWUgdGlsZSB3YXMgYXR0YWNrZWQgdHdpY2UhXCIpXG4gICAgfVxuICAgIHRoaXMubWlzc2VkQXJyLnB1c2godmFsdWUpO1xuICB9XG5cbiAgICAvKiBDYWxjdWxhdGVzIHRoZSBtYXggYWNjZXB0YWJsZSB0aWxlIGZvciBhIHNoaXAgZGVwZW5kaW5nIG9uIGl0cyBzdGFydCAodGlsZU51bSkuXG4gIGZvciBleC4gSWYgYSBzaGlwIGlzIHBsYWNlZCBob3Jpem9udGFsbHkgb24gdGlsZSAyMSBtYXggd291bGQgYmUgMzAgICovXG5cbiAgc3RhdGljIGNhbGNNYXgob2JqKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiICYmIG9iai50aWxlTnVtID4gMTApIHtcbiAgICAgIGlmIChvYmoudGlsZU51bSAlIDEwID09PSAwKSB7XG4gICAgICAgIHJldHVybiBvYmoudGlsZU51bVxuICAgICAgfVxuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gR2FtZUJvYXJkLmNhbGNNYXgob2JqKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gR2FtZUJvYXJkLmNhbGNMZW5ndGgob2JqKTtcbiAgICBpZiAob2JqLnRpbGVOdW0gKyBzaGlwTGVuZ3RoIDw9IG1heCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiBjb29yZGluYXRlcyBhbHJlYWR5IGhhdmUgYSBzaGlwIG9uIHRoZW0gKi9cblxuICBpc1Rha2VuKGNvb3JkaW5hdGVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKGNvb3JkaW5hdGVzW2ldKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qIHJldHVybnMgdHJ1ZSBpZiBhIHNoaXAgaXMgYWxyZWFkeSBwbGFjZWQgb24gdGlsZXMgbmVpZ2hib3JpbmcgcGFzc2VkIGNvb3JkaW5hdGVzICovXG5cbiAgaXNOZWlnaGJvcmluZyhjb29yZGluYXRlcywgZGlyZWN0aW9uKSB7XG4gICAgbGV0IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIC8vIEhvcml6b250YWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyByaWdodCBib3JkZXIgb25seSBhZGRzIHRpbGUgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgLy8gbm8gY2hlY2tzIGZvciB0b3AgYW5kIGJvdHRvbSBib3JkZXJzLCBzaW5jZSBpbXBvc3NpYmxlIHRvIHBsYWNlIHNoaXAgb3V0c2lkZSB0aGUgZ3JpZFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxMCksXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEwKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVmVydGljYWwgUGxhY2VtZW50XG4gICAgICAvKiBMRUZUIGFuZCBSSUdIVCAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDEpIHtcbiAgICAgICAgLy8gbGVmdCBib3JkZXIgb25seSBhZGRzIHRpbGVzIG9uIHRoZSByaWdodFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIGxlZnRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdGhlIGxlZnQgb3IgcmlnaHQgYm9yZGVyLCBhZGRzIGJvdGggbGVmdCBhbmQgcmlnaHQgdGlsZXNcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSksXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8qIFRPUCBhbmQgQk9UVE9NICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gPCAxMSkge1xuICAgICAgICAvLyB0b3AgYm9yZGVyLCBhZGRzIG9ubHkgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEwKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gPiA5MCkge1xuICAgICAgICAvLyBib3R0b20gYm9yZGVyLCBhZGRzIG9ubHkgdG9wIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1swXSAtIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdG9wIG9yIGJvdHRvbSBib3JkZXIsIGFkZHMgdGhlIHRvcCBhbmQgYm90dG9tIHRpbGVcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEwLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMTBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogaWYgc2hpcCBwbGFjZWQgb24gbmVpZ2hib3JpbmcgdGlsZXMgcmV0dXJucyB0cnVlICovXG4gICAgcmV0dXJuIHRoaXMuaXNUYWtlbihjb29yZGluYXRlc0FsbE5laWdoYm9ycyk7XG4gIH1cblxuICAvKiBjaGVja3MgaWYgdGhlIHRoZSB0aWxlIG51bSBzZWxlY3RlZCBieSBvcHBvbmVudCBoYXMgYSBzaGlwLCBpZiBoaXQgY2hlY2tzIGlmIHNoaXAgaXMgc3VuaywgaWYgc3VuayBjaGVja3MgaWYgZ2FtZSBpcyBvdmVyLCBlbHNlIGFkZHMgdGlsZSBudW0gdG8gbWlzc2VkIGFycmF5ICAqL1xuXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgICBoaXQ6IHRydWUsXG4gICAgICAgICAgICBzdW5rOiB0cnVlLFxuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pc092ZXIoKVxuICAgICAgICAgICAgPyB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgLi4ub2JqLCAuLi57IGdhbWVvdmVyOiB0cnVlIH0gfSlcbiAgICAgICAgICAgIDogdGhpcy5wdWJTdWIucHVibGlzaChvYmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZCA9IG51bTtcblxuICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IGZhbHNlLCBzdW5rOiBmYWxzZSB9KTtcbiAgfTtcblxuICAvKiBjYWxsZWQgd2hlbiBhIHNoaXAgaXMgc3VuaywgcmV0dXJucyBBKSBHQU1FIE9WRVIgaWYgYWxsIHNoaXBzIGFyZSBzdW5rIG9yIEIpIFNVTksgaWYgdGhlcmUncyBtb3JlIHNoaXBzIGxlZnQgKi9cblxuICBpc092ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgY2hlY2sgPSB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpO1xuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiLyogcGxheWVyIGJhc2UgY2xhc3MgKi9cblxuY2xhc3MgUGxheWVyIHtcblxuICBwcmV2aW91c0F0dGFja3MgPSBbXVxuICBcbiAgZ2V0IGF0dGFja0FycigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c0F0dGFja3M7XG4gIH1cblxuICBzZXQgYXR0YWNrQXJyKHZhbHVlKSB7XG4gICAgdGhpcy5wcmV2aW91c0F0dGFja3MucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBpc05ldyh2YWx1ZSkge1xuICAgIHJldHVybiAhdGhpcy5hdHRhY2tBcnIuaW5jbHVkZXModmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFB1YlN1YiB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpXG4gIH1cbiBcbiAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuZmlsdGVyKHN1YiA9PiBzdWIhPT0gc3Vic2NyaWJlcilcbiAgfVxuXG4gIHB1Ymxpc2gocGF5bG9hZCkge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIocGF5bG9hZCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiY2xhc3MgU2hpcCB7XG4gIFxuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9ICtvYmoubGVuZ3RoO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBTaGlwLmNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgc3RhdGljIGNyZWF0ZUNvb3JBcnIob2JqKSB7XG4gICAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMTApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5pbXBvcnQgY3JlYXRlVGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsIGdhbWVvdmVyIGFzIGluaXRHYW1lb3ZlciB9IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgeyBhdHRhY2sgYXMgdXNlckNsaWNrQXR0YWNrIH0gZnJvbSBcIi4uL3B1Yi1zdWJzL2V2ZW50c1wiOyBcblxuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cbi8qIGhpZGVzIHRoZSBwbGFjZW1lbnQgZm9ybSAqL1xuXG5mdW5jdGlvbiBoaWRlRm9ybSgpIHtcbiAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1wbGFjZW1lbnQtZm9ybVwiKTtcbiAgZm9ybS5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG4vKiBzaG93J3MgdGhlIGNvbXB1dGVyJ3MgYm9hcmQgKi9cblxuZnVuY3Rpb24gc2hvd0NvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcEJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbn1cblxuLyogcHVibGlzaCB0aGUgdGlsZSdzIGRhdGEtaWQgKi9cblxuZnVuY3Rpb24gcHVibGlzaERhdGFJZCgpIHtcbiAgY29uc3Qge2lkfSA9IHRoaXMuZGF0YXNldDtcbiAgdXNlckNsaWNrQXR0YWNrLnB1Ymxpc2goaWQpXG59XG5cbi8qIGNyZWF0ZXMgdGlsZXMgZm9yIHRoZSB1c2VyIGdhbWVib2FyZCwgYW5kIHRpbGVzIHdpdGggZXZlbnRMaXN0ZW5lcnMgZm9yIHRoZSBjb21wdXRlciBnYW1lYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdEF0dGFja1N0YWdlVGlsZXMoKSB7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogY3JlYXRlcyBnYW1lb3ZlciBub3RpZmljYXRpb24gYW5kIG5ldyBnYW1lIGJ0biAqL1xuXG5mdW5jdGlvbiBjcmVhdGVOZXdHYW1lQnRuKCkge1xuICBjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgYnRuLnRleHRDb250ZW50ID0gXCJTdGFydCBOZXcgR2FtZVwiO1xuICBidG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gIH0pO1xuICBidG4uY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2J0blwiKVxuICByZXR1cm4gYnRuO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZykge1xuICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25cIik7XG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBoMS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faGVhZGluZ1wiKTtcbiAgaDEudGV4dENvbnRlbnQgPSBcIkdBTUUgT1ZFUlwiO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDEpO1xuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIilcbiAgaW1hZ2UuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2ltYWdlXCIpXG4gIGltYWdlLnNldEF0dHJpYnV0ZShcImFsdFwiLCBcImdhbWUgb3ZlciBub3RpZmljYXRpb25cIilcbiAgaWYgKHN0cmluZyA9PT0gXCJ1c2VyXCIpIHtcbiAgICBoMy50ZXh0Q29udGVudCA9IFwiWU9VIExPU1RcIjtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCIuLi9zcmMvaW1hZ2VzL2dhbWUtb3Zlci0tbG9zcy5wbmdcIilcbiAgfSBlbHNlIHtcbiAgICBoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vc3JjL2ltYWdlcy9nYW1lLW92ZXItLXdpbi5wbmdcIilcbiAgfVxuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaW1hZ2UpXG4gIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVOZXdHYW1lQnRuKCkpO1xuICByZXR1cm4gZGl2O1xufVxuXG5mdW5jdGlvbiBzaG93R2FtZU92ZXIoc3RyaW5nKSB7XG4gIGNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbiAgY29uc3Qgbm90aWZpY2F0aW9uID0gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpO1xuICBtYWluLmFwcGVuZENoaWxkKG5vdGlmaWNhdGlvbik7XG59XG5cbi8qIFN1YnNjcmliZSB0byBpbml0aWFsaXppbmcgcHViLXN1YnMgKi9cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShzaG93Q29tcEJvYXJkKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEF0dGFja1N0YWdlVGlsZXMpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShoaWRlRm9ybSk7XG5pbml0R2FtZW92ZXIuc3Vic2NyaWJlKHNob3dHYW1lT3Zlcik7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4vbGF5b3V0LS1hdHRhY2stc3RhZ2VcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7XG4gIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSxcbiAgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlLFxufSBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIjtcblxuZnVuY3Rpb24gaGlkZUNvbXBCb2FyZCgpIHtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xufVxuXG5mdW5jdGlvbiBhZGRJbnB1dExpc3RlbmVycygpIHtcbiAgY29uc3QgZm9ybUlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VtZW50LWZvcm1fX2lucHV0XCIpO1xuICBmb3JtSW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRCdG5MaXN0ZW5lcigpIHtcbiAgY29uc3QgcGxhY2VTaGlwQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuICBwbGFjZVNoaXBCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB1c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnB1Ymxpc2goKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHsgaWQgfSA9IHRoaXMuZGF0YXNldDtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaChpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBsYWNlbWVudFRpbGVzKCkge1xuICBjb25zdCBnYW1lQm9hcmREaXZVc2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLXVzZXJcIik7XG4gIGNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdlVzZXIsIHB1Ymxpc2hEYXRhSWQpO1xufVxuXG4vKiBSZW1vdmVzIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB1c2VyIGdhbWVib2FyZCAqL1xuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcbiAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZC0tdXNlciAuZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgdGlsZS5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERhdGFJZCk7XG4gIH0pO1xufVxuXG4vKiBpbml0aWFsaXphdGlvbiBzdWJzY3JpcHRpb25zICovXG5cbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkQnRuTGlzdGVuZXIpO1xuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRJbnB1dExpc3RlbmVycyk7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGhpZGVDb21wQm9hcmQpO1xuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShjcmVhdGVQbGFjZW1lbnRUaWxlcyk7XG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKHJlbW92ZUV2ZW50TGlzdGVuZXJzKTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgY29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZUNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQge2NvbXB1dGVyQXR0YWNrLCBoYW5kbGVDb21wdXRlckF0dGFja30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssfTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cblxuY29uc3Qgc2hpcEluZm8gPSBuZXcgUHViU3ViKCk7XG5cbi8qIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgcHVibGlzaGVzIGFuIG9iaiB3aXRoIGEgYm9vLiB2YWxpZCBwcm9wZXJ0eSBhbmQgYSBsaXN0IG9mIGNvb3JkaW5hdGVzLiAqL1xuXG5jb25zdCB2YWxpZGl0eVZpZXdzID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuIHBsYWNlIHNoaXAgYnRuIGlzIHByZXNzZWQgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgd2lsbCBjcmVhdGUgc2hpcEluZm8gKi9cblxuY29uc3Qgc2hpcFBsYWNlQnRuID0gbmV3IFB1YlN1YigpO1xuXG4vKiBXaGVuICBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSBjcmVhdGVzIHRoZSBzaGlwSW5mby4gVGhlIGdhbWVib2FyZC5wbGFjZVNoaXAgKi9cblxuY29uc3QgY3JlYXRlU2hpcCA9IG5ldyBQdWJTdWIoKTtcblxuLyogVXNlckdhbWVCb2FyZC5wdWJsaXNoUGxhY2VTaGlwIHB1Ymxpc2hlcyBzaGlwIGNvb3JkaW5hdGVzLiBHYW1lQm9hcmRVc2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWaWV3IGFkZHMgcGxhY2VtZW50LXNoaXAgY2xhc3MgdG8gdGlsZXMgKi9cblxuY29uc3QgY3JlYXRlU2hpcFZpZXcgPSBuZXcgUHViU3ViKCk7XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHVzZXJDbGljayAqL1xuXG5leHBvcnQge3BpY2tQbGFjZW1lbnQsIGF0dGFjaywgaW5wdXQsIHNoaXBJbmZvLCB2YWxpZGl0eVZpZXdzLCBzaGlwUGxhY2VCdG4sIGNyZWF0ZVNoaXAsIGNyZWF0ZVNoaXBWaWV3fSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIHBsYWNlbWVudCBzdGFnZSAqL1xuXG5jb25zdCBwbGFjZW1lbnRTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG5jb25zdCBhdHRhY2tTdGFnZSA9IG5ldyBQdWJTdWIoKTtcblxuLyogaW5pdGlhbGl6ZXMgZ2FtZSBvdmVyIGRpdiAqL1xuXG5jb25zdCBnYW1lb3ZlciA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgYXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlLCBnYW1lb3ZlciB9ICA7IiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgU2hpcEluZm8gZnJvbSBcIi4vc2hpcC1pbmZvL3NoaXAtaW5mb1wiO1xuaW1wb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcblxuXG5jbGFzcyBDb21wdXRlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG5cbi8qIHJlY3JlYXRlcyBhIHJhbmRvbSBzaGlwLCB1bnRpbCBpdHMgY29vcmRpbmF0ZXMgYXJlIG5vdCB0YWtlbiwgbmVpZ2hib3Jpbmcgb3RoZXIgc2hpcHMsIG9yIHRvbyBiaWcgKi9cblxuICBwbGFjZVNoaXAobGVuZ3RoKSB7XG4gICAgbGV0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvKGxlbmd0aCk7XG4gICAgbGV0IHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgd2hpbGUgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCB0aGlzLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgc2hpcC5kaXJlY3Rpb24pIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhzaGlwSW5mbykgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSBjb21wdXRlciBnYW1lIGJvYXJkICovXG5cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbnN0IHNoaXBzQXJyID0gWzUsIDQsIDMsIDJdXG5cbiAgICBzaGlwc0Fyci5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwKVxuICAgIH0pO1xuICAgIFxuXG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFZpZXcoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXcuaGFuZGxlQXR0YWNrVmlldyk7XG5cbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBjcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgcmV0dXJuICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbVRpbGVOdW07XG4iLCJcbmltcG9ydCBnZXRSYW5kb21EaXJlY3Rpb24gZnJvbSBcIi4vZ2V0LXJhbmRvbS1kaXJlY3Rpb24vZ2V0LXJhbmRvbS1kaXJlY3Rpb25cIjtcbmltcG9ydCBnZXRSYW5kb21UaWxlTnVtIGZyb20gXCIuL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bVwiO1xuXG5jbGFzcyBTaGlwSW5mbyB7XG4gIFxuICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGdldFJhbmRvbURpcmVjdGlvbigpO1xuICAgIHRoaXMudGlsZU51bSA9IGdldFJhbmRvbVRpbGVOdW0odGhpcy5sZW5ndGgsIHRoaXMuZGlyZWN0aW9uKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mbztcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssIGNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UgYXMgaW5pdFBsYWNlbWVudFN0YWdlIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbmNsYXNzIFVzZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4gIC8qIGNoZWNrcyBzaGlwIHZhbGlkaXR5ICovXG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhvYmopIHx8IHRoaXMuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSB1c2VyIGdhbWUgYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdFVzZXJHQigpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0SGFuZGxlQXR0YWNrKVxufVxuXG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGluaXRVc2VyR0IpXG5cblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3IGV4dGVuZHMgR2FtZUJvYXJkVmlldyB7XG5cbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgcmFkaW8gaW5wdXQgZm9yIHRoYXQgc2hpcCBpcyBoaWRkZW4gKi9cblxuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG5cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKTtcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiBjbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cblxuICBjbGVhclZhbGlkaXR5VmlldyA9ICgpID0+IHtcbiAgICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkX190aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSk7XG4gICAgdGhpcy5idG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gIH07XG5cbiAgLyogYWRkcyB0aGUgdmlzdWFsIGNsYXNzIHBsYWNlbWVudC0tdmFsaWQgb3IgcGxhY2VtZW50LS1pbnZhbGlkIGJhc2VkIG9uIHRoZSB0aWxlTnVtIGNob3NlbiBieSB0aGUgdXNlciwgZGlzYWJsZXMgdGhlIHN1Ym1pdCBidG4gaWYgaXQgZmFpbHMgcGxhY2VtZW50IGNoZWNrICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBpZiAoIW9iai52YWxpZCkge1xuICAgICAgdGhpcy5idG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICBpZiAob2JqLnZhbGlkKSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIik7XG4gICAgfSk7XG4gIH07XG59XG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXcgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXcodXNlcik7XG5cbi8qIHN1YnNjcmlwdGlvbnMgKi9cblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5Vmlldyk7XG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcpO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICB9LFxuICByZXNldE51bSgpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSAwO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgcmV0dXJuIHNoaXBJbmZvO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICBjb25zdCBpc0NvbXBsZXRlID0gT2JqZWN0LnZhbHVlcyhzaGlwSW5mbykuZXZlcnkoKHZhbHVlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHZhbHVlICE9PSBmYWxzZSAmJlxuICAgICAgdmFsdWUgIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNDb21wbGV0ZSkge1xuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwLnB1Ymxpc2goc2hpcEluZm8pO1xuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTtcbiAgfVxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSk7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQge2F0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZX0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7XG4gIGNvbXB1dGVyQXR0YWNrLFxuICBoYW5kbGVDb21wdXRlckF0dGFjayxcbn0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgLyogaG9sZHMgaW5mb3JtYXRpb24gb24gYW55IHNoaXAgdGhhdCB3YXMgZm91bmQgKi9cblxuICBmb3VuZFNoaXAgPSB7XG4gICAgZm91bmQ6IGZhbHNlLFxuICAgIGhpdDogZmFsc2UsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgIGVuZDogbnVsbCxcbiAgfTtcblxuICAvKiByZWNlaXZlcyBpbmZvcm1hdGlvbiBvbiB0aGUgbGFzdCBhdHRhY2sgYW5kIGFkanVzdHMgdGhlIGZvdW5kU2hpcCBvYmplY3QgYWNjb3JkaW5nbHkgKi9cblxuICB3YXNBdHRhY2tTdWNjZXNzID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy5mb3VuZFNoaXAgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgICAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgICAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPSBNYXRoLmFicyhcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIG9iai50aWxlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9iai5oaXQgPT09IGZhbHNlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gZmFsc2U7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKiBnZW5lcmF0ZXMgYSBjb29yZGluYXRlIChlaXRoZXIgdG9wLCBidG0sIGxlZnQsIG9yIHJpZ2h0KSB0aGF0IGlzIG5leHQgdG8gdGhlIGNvb3JkaW5hdGUgcGFzc2VkICovXG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICAvKiBjb21wdXRlciBhdHRhY2sgbG9naWMgKi9cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogUHVibGlzaCBhbmQgQWRkIHRvIGFyciAqL1xuICAgIHN1cGVyLmF0dGFja0FyciA9IG51bTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wUGxheWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcHV0ZXJQbGF5ZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSB9ZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuXG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0UGxheWVyKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUGxheWVyO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsImZ1bmN0aW9uIGdldFJhbmRvbU51bShtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tTnVtICIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4vY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5wdWJsaXNoKCk7Il0sIm5hbWVzIjpbImNyZWF0ZVRpbGUiLCJpZCIsImNhbGxiYWNrIiwidGlsZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjcmVhdGVUaWxlcyIsImRpdiIsImkiLCJhcHBlbmRDaGlsZCIsImluaXQiLCJHYW1lQm9hcmRWaWV3IiwiY29uc3RydWN0b3IiLCJzdHJpbmciLCJFcnJvciIsInVwZGF0ZVN1bmsiLCJjb250YWlucyIsInJlcGxhY2UiLCJnZXRTdGF0dXMiLCJvYmoiLCJoaXQiLCJxdWVyeVRpbGUiLCJkYXRhSWQiLCJxdWVyeVNlbGVjdG9yIiwidXBkYXRlU3Vua1RpbGVzIiwidGlsZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsImhhbmRsZUF0dGFja1ZpZXciLCJzdW5rIiwiZ2FtZW92ZXIiLCJwdWJsaXNoIiwiR2FtZUJvYXJkIiwicHViU3ViIiwic2hpcHNBcnIiLCJtaXNzZWRBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZCIsImluY2x1ZGVzIiwiY2FsY01heCIsImRpcmVjdGlvbiIsInRpbGVOdW0iLCJtYXgiLCJ0b1N0cmluZyIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJsZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1Rha2VuIiwiY29vcmRpbmF0ZXMiLCJ5IiwiaXNOZWlnaGJvcmluZyIsImNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzIiwibWFwIiwiY29vciIsImhhbmRsZUF0dGFjayIsIm51bSIsImlzU3VuayIsImlzT3ZlciIsImNoZWNrIiwiZXZlcnkiLCJzaGlwIiwiUGxheWVyIiwicHJldmlvdXNBdHRhY2tzIiwiYXR0YWNrQXJyIiwiaXNOZXciLCJQdWJTdWIiLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInN1YnNjcmliZXIiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJTaGlwIiwiY3JlYXRlQ29vckFyciIsInRpbWVzSGl0IiwiYXJyIiwiYXR0YWNrU3RhZ2UiLCJpbml0QXR0YWNrU3RhZ2UiLCJpbml0R2FtZW92ZXIiLCJhdHRhY2siLCJ1c2VyQ2xpY2tBdHRhY2siLCJnYW1lQm9hcmREaXZDb21wdXRlciIsImhpZGVGb3JtIiwiZm9ybSIsInNob3dDb21wQm9hcmQiLCJjb21wQm9hcmQiLCJyZW1vdmUiLCJwdWJsaXNoRGF0YUlkIiwiZGF0YXNldCIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsInRleHRDb250ZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsImltYWdlIiwic2hvd0dhbWVPdmVyIiwibWFpbiIsIm5vdGlmaWNhdGlvbiIsInBsYWNlbWVudFN0YWdlIiwiaW5pdFBsYWNlbWVudFN0YWdlIiwidXNlckNsaWNrIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJhZGRJbnB1dExpc3RlbmVycyIsImZvcm1JbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5wdXQiLCJhZGRCdG5MaXN0ZW5lciIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsInBpY2tQbGFjZW1lbnQiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3IiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsIlVzZXJHYW1lQm9hcmQiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJHQiIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlldyIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlldyIsIlNoaXBJbmZvVXNlciIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInJlc2V0TnVtIiwiY3JlYXRlU2hpcEluZm8iLCJwdWJsaXNoU2hpcEluZm9DaGVjayIsInB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSIsImlzQ29tcGxldGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==