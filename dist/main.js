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
  btn.classList.add("game-over-notification__btn");
  btn.addEventListener("click", () => {
    window.location.reload();
  });
  return btn;
}
function createGameOverAlert(string) {
  const div = document.createElement("div");
  const h1 = document.createElement("h1");
  h1.classList.add("game-over-notification__heading");
  h1.textContent = "GAME OVER";
  const h3 = document.createElement("h3");
  h3.classList.add("game-over-notification__sub-heading");
  const image = document.createElement("img");
  image.setAttribute("alt", "game over notification");
  if (string === "user") {
    h3.textContent = "YOU LOST";
    image.setAttribute("src", "../src/images/game-over--loss.png");
    div.classList.add("game-over-notification--loss");
    image.classList.add("game-over-notification__image--loss");
  } else {
    h3.textContent = "YOU WON";
    image.setAttribute("src", "../src/images/game-over--win.png");
    div.classList.add("game-over-notification--win");
    image.classList.add("game-over-notification__image--win");
  }
  div.appendChild(h1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlldy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcGxheWVyL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHViLXN1Yi9wdWItc3ViLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9zaGlwL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tYXR0YWNrLXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvL3NoaXAtaW5mb19fdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS1jb21wdXRlci9wbGF5ZXItLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2dldC1yYW5kb20tbnVtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGNyZWF0ZXMgc2luZ2xlIHRpbGUgd2l0aCBldmVudCBsaXN0ZW5lciAqL1xuXG5mdW5jdGlvbiBjcmVhdGVUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbi8qIGNyZWF0ZXMgMTAwIHRpbGVzIHdpdGggZXZlbnQgbGlzdGVuZXJzICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlVGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVRpbGVzO1xuIiwiaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbi8qIGNsYXNzIHVzZWQgdG8gdXBkYXRlIHRoZSBET00gYmFzZWQgb24gaXQncyBjb3JyZXNwb25kaW5nIGdhbWVib2FyZCAqL1xuXG5jbGFzcyBHYW1lQm9hcmRWaWV3IHtcblxuICAvKiBzdHJpbmcgaXMgdXNlZCB0byBxdWVyeSB0aGUgY29ycmVjdCBnYW1lYm9hcmQsIGlzIGNvbXB1dGVyIG9yIHVzZXIgKi9cblxuICBjb25zdHJ1Y3RvcihzdHJpbmcpIHsgIFxuICAgIGlmIChzdHJpbmcgIT09IFwiY29tcHV0ZXJcIiAmJiBzdHJpbmcgIT09IFwidXNlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHYW1lQm9hcmRWaWV3IGNyZWF0ZWQgd2l0aCBpbmNvcnJlY3Qgc3RyaW5nXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qIHVwZGF0ZXMgdGlsZXMgY2xhc3NlcyBmcm9tIGhpdCB0byBzdW5rICovXG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgLyogZ2V0cyB0aWxlIHN0YXR1cyAqL1xuXG4gIHN0YXRpYyBnZXRTdGF0dXMob2JqKSB7XG4gICAgcmV0dXJuIG9iai5oaXQgPyBcImdhbWVib2FyZF9fdGlsZS0taGl0XCIgOiBcImdhbWVib2FyZF9fdGlsZS0tbWlzc1wiO1xuICB9XG5cbiAgLyogcXVlcnkgdGlsZSBiYXNlZCBvbiBzdHJpbmcgYW5kIGRhdGEtaWQgKi9cblxuICBxdWVyeVRpbGUgPSBkYXRhSWQgPT4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2RhdGFJZH1cIl1gKVxuXG4gIC8qIG9uY2UgYSBzaGlwIGlzIHN1bmsgcmVwbGFjZXMgdGhlIGhpdCBjbGFzcyB3aXRoIHN1bmsgY2xhc3Mgb24gYWxsIHRoZSBzaGlwcyB0aWxlcyAqL1xuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IHRoaXMucXVlcnlUaWxlKGVsZW1lbnQpO1xuICAgICAgR2FtZUJvYXJkVmlldy51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyogbGFiZWxzIHRpbGVzIHdpdGggaGl0LCBtaXNzLCBzdW5rLCBjbGFzc2VzLiBJZiBhbGwgc2hpcCdzIHN1bmsgcHVibGlzaGVzIHRoZSBzdHJpbmcgdG8gaW5pdGlhbGl6ZSBnYW1lIG92ZXIgcHViIHN1YiAqL1xuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgaWYgKG9iai5zdW5rKSB7XG4gICAgICB0aGlzLnVwZGF0ZVN1bmtUaWxlcyhvYmopO1xuICAgICAgaWYgKG9iai5nYW1lb3Zlcikge1xuICAgICAgICBpbml0LmdhbWVvdmVyLnB1Ymxpc2godGhpcy5zdHJpbmcpXG4gICAgICB9IFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUob2JqLnRpbGUpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKEdhbWVCb2FyZFZpZXcuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3O1xuIiwiY2xhc3MgR2FtZUJvYXJkIHtcblxuICAvKiB0aGUgcHViIHN1YiByZXNwb25zaWJsZSBmb3IgaGFuZGxpbmcgdGhlIG9wcG9uZW50cyBhdHRhY2sgKi9cblxuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIHNoaXBzQXJyID0gW107XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyICovXG5cbiAgZ2V0IHNoaXBzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzQXJyO1xuICB9XG5cbiAgLyogcHJvcGVydHkgYWNjZXNzb3IgZm9yIHNoaXBzQXJyLCBhY2NlcHRzIGJvdGggYXJyYXlzIGFuZCBzaW5nbGUgb2JqZWN0cyAqL1xuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvcnMgZm9yIG1pc3NlZEFyciAqL1xuXG4gIGdldCBtaXNzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWlzc2VkQXJyO1xuICB9XG5cbiAgc2V0IG1pc3NlZCh2YWx1ZSkge1xuICAgIGlmICh0aGlzLm1pc3NlZC5pbmNsdWRlcyh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciAoXCJUaGUgc2FtZSB0aWxlIHdhcyBhdHRhY2tlZCB0d2ljZSFcIilcbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaCh2YWx1ZSk7XG4gIH1cblxuICAgIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgaWYgKG9iai50aWxlTnVtICUgMTAgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iai50aWxlTnVtXG4gICAgICB9XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBHYW1lQm9hcmQuY2FsY01heChvYmopO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogcmV0dXJucyB0cnVlIGlmIGEgc2hpcCBpcyBhbHJlYWR5IHBsYWNlZCBvbiB0aWxlcyBuZWlnaGJvcmluZyBwYXNzZWQgY29vcmRpbmF0ZXMgKi9cblxuICBpc05laWdoYm9yaW5nKGNvb3JkaW5hdGVzLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgLy8gSG9yaXpvbnRhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEpO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSAlIDEwID09PSAwKSB7XG4gICAgICAgIC8vIHJpZ2h0IGJvcmRlciBvbmx5IGFkZHMgdGlsZSBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxLFxuICAgICAgICAgIGNvb3JkaW5hdGVzWzBdIC0gMVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAvLyBubyBjaGVja3MgZm9yIHRvcCBhbmQgYm90dG9tIGJvcmRlcnMsIHNpbmNlIGltcG9zc2libGUgdG8gcGxhY2Ugc2hpcCBvdXRzaWRlIHRoZSBncmlkXG4gICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEwKSxcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yIC0gMTApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBWZXJ0aWNhbCBQbGFjZW1lbnRcbiAgICAgIC8qIExFRlQgYW5kIFJJR0hUICovXG4gICAgICBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMSkge1xuICAgICAgICAvLyBsZWZ0IGJvcmRlciBvbmx5IGFkZHMgdGlsZXMgb24gdGhlIHJpZ2h0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzWzBdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgbGVmdFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0aGUgbGVmdCBvciByaWdodCBib3JkZXIsIGFkZHMgYm90aCBsZWZ0IGFuZCByaWdodCB0aWxlc1xuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLmNvbmNhdChcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgKyAxKSxcbiAgICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgLyogVE9QIGFuZCBCT1RUT00gKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSA8IDExKSB7XG4gICAgICAgIC8vIHRvcCBib3JkZXIsIGFkZHMgb25seSBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTApO1xuICAgICAgfSBlbHNlIGlmIChjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSA+IDkwKSB7XG4gICAgICAgIC8vIGJvdHRvbSBib3JkZXIsIGFkZHMgb25seSB0b3AgdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzWzBdIC0gMTApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gbmVpdGhlciB0b3Agb3IgYm90dG9tIGJvcmRlciwgYWRkcyB0aGUgdG9wIGFuZCBib3R0b20gdGlsZVxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKFxuICAgICAgICAgIGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMTAsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxMFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBpZiBzaGlwIHBsYWNlZCBvbiBuZWlnaGJvcmluZyB0aWxlcyByZXR1cm5zIHRydWUgKi9cbiAgICByZXR1cm4gdGhpcy5pc1Rha2VuKGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzKTtcbiAgfVxuXG4gIC8qIGNoZWNrcyBpZiB0aGUgdGhlIHRpbGUgbnVtIHNlbGVjdGVkIGJ5IG9wcG9uZW50IGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIsIGVsc2UgYWRkcyB0aWxlIG51bSB0byBtaXNzZWQgYXJyYXkgICovXG5cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgICAgIGhpdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1bms6IHRydWUsXG4gICAgICAgICAgICB0aWxlczogdGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiB0aGlzLmlzT3ZlcigpXG4gICAgICAgICAgICA/IHRoaXMucHViU3ViLnB1Ymxpc2goeyAuLi5vYmosIC4uLnsgZ2FtZW92ZXI6IHRydWUgfSB9KVxuICAgICAgICAgICAgOiB0aGlzLnB1YlN1Yi5wdWJsaXNoKG9iaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogdHJ1ZSwgc3VuazogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubWlzc2VkID0gbnVtO1xuXG4gICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogZmFsc2UsIHN1bms6IGZhbHNlIH0pO1xuICB9O1xuXG4gIC8qIGNhbGxlZCB3aGVuIGEgc2hpcCBpcyBzdW5rLCByZXR1cm5zIEEpIEdBTUUgT1ZFUiBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3IgQikgU1VOSyBpZiB0aGVyZSdzIG1vcmUgc2hpcHMgbGVmdCAqL1xuXG4gIGlzT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBjaGVjayA9IHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuc3VuayA9PT0gdHJ1ZSk7XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCIvKiBwbGF5ZXIgYmFzZSBjbGFzcyAqL1xuXG5jbGFzcyBQbGF5ZXIge1xuXG4gIHByZXZpb3VzQXR0YWNrcyA9IFtdXG4gIFxuICBnZXQgYXR0YWNrQXJyKCkge1xuICAgIHJldHVybiB0aGlzLnByZXZpb3VzQXR0YWNrcztcbiAgfVxuXG4gIHNldCBhdHRhY2tBcnIodmFsdWUpIHtcbiAgICB0aGlzLnByZXZpb3VzQXR0YWNrcy5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIGlzTmV3KHZhbHVlKSB7XG4gICAgcmV0dXJuICF0aGlzLmF0dGFja0Fyci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgXG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFNoaXAuY3JlYXRlQ29vckFycihvYmopO1xuICB9XG5cbiAgdGltZXNIaXQgPSAwO1xuXG4gIHN1bmsgPSBmYWxzZTtcblxuICBzdGF0aWMgY3JlYXRlQ29vckFycihvYmopIHtcbiAgICBjb25zdCBhcnIgPSBbK29iai50aWxlTnVtXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmQtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSwgZ2FtZW92ZXIgYXMgaW5pdEdhbWVvdmVyIH0gZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IGF0dGFjayBhcyB1c2VyQ2xpY2tBdHRhY2sgfSBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCI7IFxuXG5jb25zdCBnYW1lQm9hcmREaXZDb21wdXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS1jb21wdXRlclwiKTtcblxuLyogaGlkZXMgdGhlIHBsYWNlbWVudCBmb3JtICovXG5cbmZ1bmN0aW9uIGhpZGVGb3JtKCkge1xuICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLXBsYWNlbWVudC1mb3JtXCIpO1xuICBmb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbi8qIHNob3cncyB0aGUgY29tcHV0ZXIncyBib2FyZCAqL1xuXG5mdW5jdGlvbiBzaG93Q29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXBCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xufVxuXG4vKiBwdWJsaXNoIHRoZSB0aWxlJ3MgZGF0YS1pZCAqL1xuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7aWR9ID0gdGhpcy5kYXRhc2V0O1xuICB1c2VyQ2xpY2tBdHRhY2sucHVibGlzaChpZClcbn1cblxuLyogY3JlYXRlcyB0aWxlcyBmb3IgdGhlIHVzZXIgZ2FtZWJvYXJkLCBhbmQgdGlsZXMgd2l0aCBldmVudExpc3RlbmVycyBmb3IgdGhlIGNvbXB1dGVyIGdhbWVib2FyZCAqL1xuXG5mdW5jdGlvbiBpbml0QXR0YWNrU3RhZ2VUaWxlcygpIHtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2Q29tcHV0ZXIsIHB1Ymxpc2hEYXRhSWQpO1xufVxuXG4vKiBjcmVhdGVzIGdhbWVvdmVyIG5vdGlmaWNhdGlvbiBhbmQgbmV3IGdhbWUgYnRuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0dhbWVCdG4oKSB7XG4gIGNvbnN0IGJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICBidG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0IE5ldyBHYW1lXCI7XG4gIGJ0bi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9fYnRuXCIpXG4gIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSk7XG4gIHJldHVybiBidG47XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKSB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IFxuICBjb25zdCBoMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgaDEuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2hlYWRpbmdcIilcbiAgaDEudGV4dENvbnRlbnQgPSBcIkdBTUUgT1ZFUlwiO1xuICBjb25zdCBoMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgaDMuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX3N1Yi1oZWFkaW5nXCIpO1xuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIilcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwiYWx0XCIsIFwiZ2FtZSBvdmVyIG5vdGlmaWNhdGlvblwiKVxuICBpZiAoc3RyaW5nID09PSBcInVzZXJcIikge1xuICAgIGgzLnRleHRDb250ZW50ID0gXCJZT1UgTE9TVFwiO1xuICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL3NyYy9pbWFnZXMvZ2FtZS1vdmVyLS1sb3NzLnBuZ1wiKVxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbi0tbG9zc1wiKTtcbiAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faW1hZ2UtLWxvc3NcIik7XG4gIH0gZWxzZSB7XG4gICAgaDMudGV4dENvbnRlbnQgPSBcIllPVSBXT05cIlxuICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcIi4uL3NyYy9pbWFnZXMvZ2FtZS1vdmVyLS13aW4ucG5nXCIpXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uLS13aW5cIik7XG4gICAgaW1hZ2UuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb25fX2ltYWdlLS13aW5cIik7XG4gIH1cbiAgZGl2LmFwcGVuZENoaWxkKGgxKTtcbiAgZGl2LmFwcGVuZENoaWxkKGgzKTtcbiAgZGl2LmFwcGVuZENoaWxkKGltYWdlKVxuICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlTmV3R2FtZUJ0bigpKTtcbiAgcmV0dXJuIGRpdjtcbn1cblxuZnVuY3Rpb24gc2hvd0dhbWVPdmVyKHN0cmluZykge1xuICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XG4gIGNvbnN0IG5vdGlmaWNhdGlvbiA9IGNyZWF0ZUdhbWVPdmVyQWxlcnQoc3RyaW5nKTtcbiAgbWFpbi5hcHBlbmRDaGlsZChub3RpZmljYXRpb24pO1xufVxuXG4vKiBTdWJzY3JpYmUgdG8gaW5pdGlhbGl6aW5nIHB1Yi1zdWJzICovXG5cbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoc2hvd0NvbXBCb2FyZCk7XG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRBdHRhY2tTdGFnZVRpbGVzKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaGlkZUZvcm0pO1xuaW5pdEdhbWVvdmVyLnN1YnNjcmliZShzaG93R2FtZU92ZXIpO1xuIiwiaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby9zaGlwLWluZm9fX3ZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuL2xheW91dC0tYXR0YWNrLXN0YWdlXCI7XG5pbXBvcnQgY3JlYXRlVGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGVzXCI7XG5pbXBvcnQge1xuICBwbGFjZW1lbnRTdGFnZSBhcyBpbml0UGxhY2VtZW50U3RhZ2UsXG4gIGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSxcbn0gZnJvbSBcIi4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbmZ1bmN0aW9uIGhpZGVDb21wQm9hcmQoKSB7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tY29tcHV0ZXJcIik7XG4gIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuZnVuY3Rpb24gYWRkSW5wdXRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IGZvcm1JbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcbiAgZm9ybUlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gYWRkQnRuTGlzdGVuZXIoKSB7XG4gIGNvbnN0IHBsYWNlU2hpcEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcbiAgcGxhY2VTaGlwQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdXNlckNsaWNrLnNoaXBQbGFjZUJ0bi5wdWJsaXNoKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICBjb25zdCB7IGlkIH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGljay5waWNrUGxhY2VtZW50LnB1Ymxpc2goaWQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQbGFjZW1lbnRUaWxlcygpIHtcbiAgY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuICBjcmVhdGVUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRGF0YUlkKTtcbn1cblxuLyogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQgKi9cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG4gIGNvbnN0IHRpbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5nYW1lYm9hcmQtLXVzZXIgLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZXMuZm9yRWFjaCgodGlsZSkgPT4ge1xuICAgIHRpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEYXRhSWQpO1xuICB9KTtcbn1cblxuLyogaW5pdGlhbGl6YXRpb24gc3Vic2NyaXB0aW9ucyAqL1xuXG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZEJ0bkxpc3RlbmVyKTtcbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoYWRkSW5wdXRMaXN0ZW5lcnMpO1xuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShoaWRlQ29tcEJvYXJkKTtcbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoY3JlYXRlUGxhY2VtZW50VGlsZXMpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShyZW1vdmVFdmVudExpc3RlbmVycyk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCB1c2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVVc2VyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrLH07XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgcGlja1BsYWNlbWVudCA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaW5wdXQgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGNyZWF0ZVNoaXBJbmZvKCkgcHVibGlzaGVzIGEgc2hpcEluZm8gb2JqLiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IGlzIHN1YnNjcmliZWQgYW5kIGNoZWNrcyB3aGV0aGVyIGEgc2hpcCBjYW4gYmUgcGxhY2VkIHRoZXJlICovXG5cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gKi9cblxuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiBwbGFjZSBzaGlwIGJ0biBpcyBwcmVzc2VkIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHdpbGwgY3JlYXRlIHNoaXBJbmZvICovXG5cbmNvbnN0IHNoaXBQbGFjZUJ0biA9IG5ldyBQdWJTdWIoKTtcblxuLyogV2hlbiAgcHVibGlzaFNoaXBJbmZvQ3JlYXRlKCkgY3JlYXRlcyB0aGUgc2hpcEluZm8uIFRoZSBnYW1lYm9hcmQucGxhY2VTaGlwICovXG5cbmNvbnN0IGNyZWF0ZVNoaXAgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFVzZXJHYW1lQm9hcmQucHVibGlzaFBsYWNlU2hpcCBwdWJsaXNoZXMgc2hpcCBjb29yZGluYXRlcy4gR2FtZUJvYXJkVXNlclZpZXcuaGFuZGxlUGxhY2VtZW50VmlldyBhZGRzIHBsYWNlbWVudC1zaGlwIGNsYXNzIHRvIHRpbGVzICovXG5cbmNvbnN0IGNyZWF0ZVNoaXBWaWV3ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0LCBzaGlwSW5mbywgdmFsaWRpdHlWaWV3cywgc2hpcFBsYWNlQnRuLCBjcmVhdGVTaGlwLCBjcmVhdGVTaGlwVmlld30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBwbGFjZW1lbnQgc3RhZ2UgKi9cblxuY29uc3QgcGxhY2VtZW50U3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIHRoZSBhdHRhY2sgc3RhZ2UgKi9cblxuY29uc3QgYXR0YWNrU3RhZ2UgPSBuZXcgUHViU3ViKCk7XG5cbi8qIGluaXRpYWxpemVzIGdhbWUgb3ZlciBkaXYgKi9cblxuY29uc3QgZ2FtZW92ZXIgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IGF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSwgZ2FtZW92ZXIgfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IFNoaXBJbmZvIGZyb20gXCIuL3NoaXAtaW5mby9zaGlwLWluZm9cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cblxuY2xhc3MgQ29tcHV0ZXJHYW1lQm9hcmQgZXh0ZW5kcyBHYW1lQm9hcmQge1xuXG4vKiByZWNyZWF0ZXMgYSByYW5kb20gc2hpcCwgdW50aWwgaXRzIGNvb3JkaW5hdGVzIGFyZSBub3QgdGFrZW4sIG5laWdoYm9yaW5nIG90aGVyIHNoaXBzLCBvciB0b28gYmlnICovXG5cbiAgcGxhY2VTaGlwKGxlbmd0aCkge1xuICAgIGxldCBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgIGxldCBzaGlwID0gbmV3IFNoaXAoc2hpcEluZm8pO1xuICAgIHdoaWxlIChzdXBlci5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHN1cGVyLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgc2hpcC5kaXJlY3Rpb24pIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhzaGlwSW5mbykgKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSBjb21wdXRlciBnYW1lIGJvYXJkICovXG5cblxuZnVuY3Rpb24gaW5pdENvbXBHQigpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbnN0IHNoaXBzQXJyID0gWzUsIDQsIDMsIDJdXG5cbiAgICBzaGlwc0Fyci5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBjb21wdXRlckJvYXJkLnBsYWNlU2hpcChzaGlwKVxuICAgIH0pO1xuICAgIFxuXG4gICAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJCb2FyZC5oYW5kbGVBdHRhY2spOyBcbn1cblxuaW5pdC5hdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdENvbXBHQik7XG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jb25zdCBjb21wdXRlciA9IFwiY29tcHV0ZXJcIjtcblxuY29uc3QgY29tcHV0ZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFZpZXcoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXcuaGFuZGxlQXR0YWNrVmlldyk7XG5cbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbmZ1bmN0aW9uIGdldFJhbmRvbURpcmVjdGlvbigpIHtcbiAgcmV0dXJuIGdldFJhbmRvbU51bSgyKSA9PT0gMSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21EaXJlY3Rpb247XG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG4vKiBjcmVhdGUgYSByYW5kb20gdGlsZU51bSAqL1xuXG5mdW5jdGlvbiBnZXRSYW5kb21UaWxlTnVtKGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgbGV0IG51bSA9ICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgICB3aGlsZSAobnVtIDwgMSB8fCBudW0gPiAxMDApIHtcbiAgICAgIG51bSA9ICsoZ2V0UmFuZG9tTnVtKDEwKS50b1N0cmluZygpICsgZ2V0UmFuZG9tTnVtKDExIC0gbGVuZ3RoKS50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bVxuICB9XG4gICBsZXQgbnVtID0gKyhnZXRSYW5kb21OdW0oMTEtIGxlbmd0aCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSk7XG4gICB3aGlsZSAobnVtIDwgMSB8fCBudW0gPiAxMDApIHtcbiAgICBudW0gPSArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuIG51bVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21UaWxlTnVtO1xuIiwiXG5pbXBvcnQgZ2V0UmFuZG9tRGlyZWN0aW9uIGZyb20gXCIuL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uXCI7XG5pbXBvcnQgZ2V0UmFuZG9tVGlsZU51bSBmcm9tIFwiLi9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW1cIjtcblxuY2xhc3MgU2hpcEluZm8ge1xuICBcbiAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBnZXRSYW5kb21EaXJlY3Rpb24oKTtcbiAgICB0aGlzLnRpbGVOdW0gPSBnZXRSYW5kb21UaWxlTnVtKHRoaXMubGVuZ3RoLCB0aGlzLmRpcmVjdGlvbik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm87XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsIHBsYWNlbWVudFN0YWdlIGFzIGluaXRQbGFjZW1lbnRTdGFnZSB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuICAvKiBjaGVja3Mgc2hpcCB2YWxpZGl0eSAqL1xuXG4gIGlzVmFsaWQgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHN1cGVyLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgR2FtZUJvYXJkLmlzVG9vQmlnKG9iaikgfHwgc3VwZXIuaXNOZWlnaGJvcmluZyhzaGlwLmNvb3JkaW5hdGVzLCBvYmouZGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyICovXG5cbiAgcGxhY2VTaGlwID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBzaGlwO1xuICB9XG5cbiAgcHVibGlzaFBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gdGhpcy5wbGFjZVNoaXAob2JqKVxuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwVmlldy5wdWJsaXNoKHtjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcywgbGVuZ3RoOiBzaGlwLmxlbmd0aH0pXG4gIH1cbn1cblxuLyogaW5pdGlhbGl6ZSB1c2VyIGdhbWUgYm9hcmQgKi9cblxuZnVuY3Rpb24gaW5pdFVzZXJHQigpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbiAgdXNlckNsaWNrLmNyZWF0ZVNoaXAuc3Vic2NyaWJlKHVzZXJCb2FyZC5wdWJsaXNoUGxhY2VTaGlwKTtcbiAgZnVuY3Rpb24gaW5pdEhhbmRsZUF0dGFjaygpIHtcbiAgICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG4gIH1cbiAgaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0SGFuZGxlQXR0YWNrKVxufVxuXG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGluaXRVc2VyR0IpXG5cblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXcgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLXZpZXdcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5cbmNsYXNzIEdhbWVCb2FyZFVzZXJWaWV3IGV4dGVuZHMgR2FtZUJvYXJkVmlldyB7XG5cbiAgYnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGFjZW1lbnQtZm9ybV9fcGxhY2UtYnRuXCIpO1xuXG4gIC8qIHdoZW4gYSBzaGlwIGlzIHBsYWNlZCB0aGUgcmFkaW8gaW5wdXQgZm9yIHRoYXQgc2hpcCBpcyBoaWRkZW4gKi9cblxuICBzdGF0aWMgaGlkZVJhZGlvKG9iaikge1xuICAgIGNvbnN0IHJhZGlvSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc2hpcC0ke29iai5sZW5ndGh9YCk7XG4gICAgcmFkaW9JbnB1dC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIGNvbnN0IHJhZGlvTGFiZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFtgW2Zvcj1cInNoaXAtJHtvYmoubGVuZ3RofVwiXWBdKTtcbiAgICByYWRpb0xhYmVsLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH1cblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIG5leHQgcmFkaW8gaW5wdXQgaXMgY2hlY2tlZCBzbyB0aGF0IHlvdSBjYW4ndCBwbGFjZSB0d28gb2YgdGhlIHNhbWUgc2hpcHMgdHdpY2UsXG4gICAgIHdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgc2hpcHMgdG8gcGxhY2UgbmV4dFNoaXBDaGVja2VkIHdpbGwgaW5pdGlhbGl6ZSB0aGUgYXR0YWNrIHN0YWdlICovXG5cbiAgc3RhdGljIG5leHRTaGlwQ2hlY2tlZCgpIHtcbiAgICBjb25zdCByYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYDpub3QoLmhpZGRlbilbbmFtZT1cInNoaXBcIl1gKTtcbiAgICBpZiAocmFkaW8gPT09IG51bGwpIHtcbiAgICAgIGluaXQuYXR0YWNrU3RhZ2UucHVibGlzaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByYWRpby5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKiBjbGVhcnMgdGhlIHZhbGlkaXR5IGNoZWNrIG9mIHRoZSBwcmV2aW91cyBzZWxlY3Rpb24gZnJvbSB0aGUgdXNlciBnYW1lYm9hcmQuIElmIGl0IHBhc3NlcyB0aGUgY2hlY2sgaXQgdW5sb2NrcyB0aGUgcGxhY2Ugc2hpcCBidG4gKi9cblxuICBjbGVhclZhbGlkaXR5VmlldyA9ICgpID0+IHtcbiAgICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkX190aWxlXCIpO1xuICAgIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgfSk7XG4gICAgdGhpcy5idG4ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gIH07XG5cbiAgLyogYWRkcyB0aGUgdmlzdWFsIGNsYXNzIHBsYWNlbWVudC0tdmFsaWQgb3IgcGxhY2VtZW50LS1pbnZhbGlkIGJhc2VkIG9uIHRoZSB0aWxlTnVtIGNob3NlbiBieSB0aGUgdXNlciwgZGlzYWJsZXMgdGhlIHN1Ym1pdCBidG4gaWYgaXQgZmFpbHMgcGxhY2VtZW50IGNoZWNrICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBpZiAoIW9iai52YWxpZCkge1xuICAgICAgdGhpcy5idG4uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgfVxuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICBpZiAob2JqLnZhbGlkKSB7XG4gICAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0tdmFsaWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLWludmFsaWRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgaGFuZGxlUGxhY2VtZW50VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5oaWRlUmFkaW8ob2JqKTtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5leHRTaGlwQ2hlY2tlZCgpO1xuICAgIG9iai5jb29yZGluYXRlcy5mb3JFYWNoKChjb29yZGluYXRlKSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtjb29yZGluYXRlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXNoaXBcIik7XG4gICAgfSk7XG4gIH07XG59XG5cbmNvbnN0IHVzZXIgPSBcInVzZXJcIjtcblxuY29uc3QgdXNlclZpZXcgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXcodXNlcik7XG5cbi8qIHN1YnNjcmlwdGlvbnMgKi9cblxuaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZhbGlkaXR5Vmlldyk7XG51c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcuc3Vic2NyaWJlKHVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcpO1xuIiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy50aWxlTnVtID0gK3RpbGVOdW07XG4gICAgdGhpcy5sZW5ndGggPSArbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xuICB9LFxuICByZXNldE51bSgpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSAwO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnN0IHsgdGlsZU51bSB9ID0gc2hpcFBsYWNlbWVudDtcbiAgY29uc3QgbGVuZ3RoID0gZGlzcGxheVJhZGlvVmFsdWUoXCJzaGlwXCIpO1xuICBjb25zdCBkaXJlY3Rpb24gPSBkaXNwbGF5UmFkaW9WYWx1ZShcImRpcmVjdGlvblwiKTtcbiAgY29uc3Qgc2hpcEluZm8gPSBuZXcgU2hpcEluZm9Vc2VyKHRpbGVOdW0sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgcmV0dXJuIHNoaXBJbmZvO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DaGVjaygpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICB1c2VyQ2xpY2suc2hpcEluZm8ucHVibGlzaChzaGlwSW5mbyk7XG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpO1xuICBjb25zdCBpc0NvbXBsZXRlID0gT2JqZWN0LnZhbHVlcyhzaGlwSW5mbykuZXZlcnkoKHZhbHVlKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IG51bGwgJiZcbiAgICAgIHZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHZhbHVlICE9PSBmYWxzZSAmJlxuICAgICAgdmFsdWUgIT09IDBcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pO1xuICBpZiAoaXNDb21wbGV0ZSkge1xuICAgIHVzZXJDbGljay5jcmVhdGVTaGlwLnB1Ymxpc2goc2hpcEluZm8pO1xuICAgIHNoaXBQbGFjZW1lbnQucmVzZXROdW0oKTtcbiAgfVxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NoZWNrKTtcbnVzZXJDbGljay5zaGlwUGxhY2VCdG4uc3Vic2NyaWJlKHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSk7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQge2F0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZX0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7XG4gIGNvbXB1dGVyQXR0YWNrLFxuICBoYW5kbGVDb21wdXRlckF0dGFjayxcbn0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcblxuY2xhc3MgQ29tcHV0ZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgLyogaG9sZHMgaW5mb3JtYXRpb24gb24gYW55IHNoaXAgdGhhdCB3YXMgZm91bmQgKi9cblxuICBmb3VuZFNoaXAgPSB7XG4gICAgZm91bmQ6IGZhbHNlLFxuICAgIGhpdDogZmFsc2UsXG4gICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgIGRpZmZlcmVuY2U6IG51bGwsXG4gICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgIGVuZDogbnVsbCxcbiAgfTtcblxuICAvKiByZWNlaXZlcyBpbmZvcm1hdGlvbiBvbiB0aGUgbGFzdCBhdHRhY2sgYW5kIGFkanVzdHMgdGhlIGZvdW5kU2hpcCBvYmplY3QgYWNjb3JkaW5nbHkgKi9cblxuICB3YXNBdHRhY2tTdWNjZXNzID0gKG9iaikgPT4ge1xuICAgIGlmIChvYmouc3Vuaykge1xuICAgICAgdGhpcy5mb3VuZFNoaXAgPSB7XG4gICAgICAgIGZvdW5kOiBmYWxzZSxcbiAgICAgICAgaGl0OiBmYWxzZSxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtdLFxuICAgICAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgICAgICBlbmRGb3VuZDogZmFsc2UsXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCAmJiB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnB1c2gob2JqLnRpbGUpO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmZvdW5kID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2UgPSBNYXRoLmFicyhcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIG9iai50aWxlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG9iai5oaXQgPT09IGZhbHNlICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9PT0gdHJ1ZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID0gZmFsc2U7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG5cbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAob2JqLmhpdCA9PT0gZmFsc2UgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvKiBnZW5lcmF0ZXMgYSBjb29yZGluYXRlIChlaXRoZXIgdG9wLCBidG0sIGxlZnQsIG9yIHJpZ2h0KSB0aGF0IGlzIG5leHQgdG8gdGhlIGNvb3JkaW5hdGUgcGFzc2VkICovXG5cbiAgc3RhdGljIHJhbmRvbVNpZGVBdHRhY2soY29vcmRpbmF0ZSkge1xuICAgIGNvbnN0IHNpZGVzID0gWzEsIDEwXTsgLy8gZGF0YSBkaWZmZXJlbmNlIGZvciB2ZXJ0aWNhbCBzaWRlcyBpcyAxMCwgYW5kIGhvcml6b250YWwgc2lkZXMgaXMgMVxuICAgIGNvbnN0IG9wZXJhdG9ycyA9IFtcbiAgICAgIC8vIGFycmF5IG9mIG9wZXJhdG9ycyAoKywgLSkgd2hpY2ggYXJlIHVzZWQgdG8gZ2VuZXJhdGUgYSByYW5kb20gb3BlcmF0b3JcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCIrXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc2lnbjogXCItXCIsXG4gICAgICAgIG1ldGhvZChhLCBiKSB7XG4gICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiBvcGVyYXRvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BlcmF0b3JzLmxlbmd0aCldLm1ldGhvZChcbiAgICAgIGNvb3JkaW5hdGUsXG4gICAgICBzaWRlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaWRlcy5sZW5ndGgpXVxuICAgICk7IC8vIGdlbmVyYXRlcyB0aGUgZGF0YSBudW0gb2YgYSByYW5kb20gc2lkZSAoaG9yaXpvbnRhbCBsZWZ0ID0gaGl0IGNvb3JkaW5hdGUgLSAxIC8gdmVydGljYWwgYm90dG9tID0gaGl0IGNvb3JkaW5hdGUgKzEwIGV0Yy4pXG4gIH1cblxuICAvKiBjb21wdXRlciBhdHRhY2sgbG9naWMgKi9cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bTtcbiAgICAvKiBBKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBidXQgd2FzIG9ubHkgaGl0IG9uY2UsIHNvIGl0IGlzIHVua25vd24gd2hldGhlciBpdHMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCAqL1xuICAgIGlmICh0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA+IDEwMCB8fCBudW0gPCAxKSB7XG4gICAgICAgIG51bSA9IENvbXB1dGVyUGxheWVyLnJhbmRvbVNpZGVBdHRhY2sodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0pOyAvLyBpZiB0aGUgZ2VuZXJhdGVkIG51bSB3YXMgYWxyZWFkeSBhdHRhY2tlZCwgb3IgaXQncyB0b28gYmlnIG9yIHRvbyBzbWFsbCB0byBiZSBvbiB0aGUgYm9hcmQsIGl0IGdlbmVyYXRlcyB0aGUgbnVtIGFnYWluXG4gICAgICB9XG4gICAgLyogQikgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGFsc28gYmVpbmcgYSBoaXQgKi8gIFxuICAgIH0gZWxzZSBpZiAoXG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggPiAxICYmXG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPT09IHRydWVcbiAgICApIHtcbiAgICAgIC8qIEIpMS4gaWYgdGhlIGVuZCBvZiB0aGUgc2hpcCB3YXMgbm90IGZvdW5kICovXG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IG5ld0Nvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBwcmV2Q29vciA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgaWYgKG5ld0Nvb3IgPiBwcmV2Q29vcikge1xuICAgICAgICAgIG51bSA9IG5ld0Nvb3IgKyBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIGlmIChuZXdDb29yIDwgcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG51bSA+IDEwMCB8fCBudW0gPCAxIHx8ICFzdXBlci5pc05ldyhudW0pKSB7IC8vIGZvciBlZGdlIGNhc2VzLCBhbmQgc2l0dWF0aW9ucyBpbiB3aGljaCB0aGUgZW5kIHRpbGUgd2FzIGFscmVhZHkgYXR0YWNrZWRcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5lbmRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID0gbmV3Q29vcjtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7IFxuICAgICAgICAgICAgbnVtID1cbiAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbXG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICBdICsgY29vckRpZmY7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAvKiBCKTIuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIGZvdW5kICovICBcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgY29vckRpZmYgPSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgICAgbnVtID1cbiAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICAgIGNvb3JEaWZmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51bSA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdIC0gY29vckRpZmY7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvKiBDKSBpZiBhIHNoaXAgd2FzIGZvdW5kLCBhbmQgd2FzIGhpdCBtb3JlIHRoYW4gb25jZSwgd2l0aCB0aGUgbGFzdCBhdHRhY2sgYmVpbmcgYSBtaXNzICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSBmYWxzZVxuICAgICkge1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kID1cbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcyA9IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLnNvcnQoXG4gICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgKTtcbiAgICAgIGlmICh0aGlzLmZvdW5kU2hpcC5lbmQgPT09IHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKSB7XG4gICAgICAgIG51bSA9XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gK1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICB9XG4gICAgLyogRCkgc2hpcCB3YXMgbm90IGZvdW5kICovICBcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB3aGlsZSAoIXN1cGVyLmlzTmV3KG51bSkgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBnZXRSYW5kb21OdW0oMTAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogUHVibGlzaCBhbmQgQWRkIHRvIGFyciAqL1xuICAgIHN1cGVyLmF0dGFja0FyciA9IG51bTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSk7XG4gICAgcmV0dXJuIG51bTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdENvbXBQbGF5ZXIoKSB7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IENvbXB1dGVyUGxheWVyKGNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJQbGF5ZXIuYXR0YWNrKTtcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLndhc0F0dGFja1N1Y2Nlc3MpO1xufVxuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wUGxheWVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ29tcHV0ZXJQbGF5ZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCB7IGF0dGFja1N0YWdlIGFzIGluaXRBdHRhY2tTdGFnZSB9ZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIjtcbmltcG9ydCB7IHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5cbmNsYXNzIFVzZXJQbGF5ZXIgZXh0ZW5kcyBQbGF5ZXIge1xuXG4gY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuICBcbiAgYXR0YWNrID0gKHZhbHVlKSA9PiB7XG4gICAgaWYgKHN1cGVyLmlzTmV3KHZhbHVlKSkge1xuICAgICAgc3VwZXIuYXR0YWNrQXJyID0gdmFsdWU7XG4gICAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZSBoYXMgYWxyZWFkeSBiZWVuIGF0dGFja2VkXCIpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRQbGF5ZXIoKSB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBVc2VyUGxheWVyKHVzZXJBdHRhY2spO1xuICB1c2VyQ2xpY2suYXR0YWNrLnN1YnNjcmliZShwbGF5ZXIuYXR0YWNrKTtcbn1cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0UGxheWVyKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUGxheWVyO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsImZ1bmN0aW9uIGdldFJhbmRvbU51bShtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tTnVtICIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2VcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4vY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuaW5pdC5wbGFjZW1lbnRTdGFnZS5wdWJsaXNoKCk7Il0sIm5hbWVzIjpbImNyZWF0ZVRpbGUiLCJpZCIsImNhbGxiYWNrIiwidGlsZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjcmVhdGVUaWxlcyIsImRpdiIsImkiLCJhcHBlbmRDaGlsZCIsImluaXQiLCJHYW1lQm9hcmRWaWV3IiwiY29uc3RydWN0b3IiLCJzdHJpbmciLCJFcnJvciIsInVwZGF0ZVN1bmsiLCJjb250YWlucyIsInJlcGxhY2UiLCJnZXRTdGF0dXMiLCJvYmoiLCJoaXQiLCJxdWVyeVRpbGUiLCJkYXRhSWQiLCJxdWVyeVNlbGVjdG9yIiwidXBkYXRlU3Vua1RpbGVzIiwidGlsZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsImhhbmRsZUF0dGFja1ZpZXciLCJzdW5rIiwiZ2FtZW92ZXIiLCJwdWJsaXNoIiwiR2FtZUJvYXJkIiwicHViU3ViIiwic2hpcHNBcnIiLCJtaXNzZWRBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZCIsImluY2x1ZGVzIiwiY2FsY01heCIsImRpcmVjdGlvbiIsInRpbGVOdW0iLCJtYXgiLCJ0b1N0cmluZyIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJsZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1Rha2VuIiwiY29vcmRpbmF0ZXMiLCJ5IiwiaXNOZWlnaGJvcmluZyIsImNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzIiwibWFwIiwiY29vciIsImhhbmRsZUF0dGFjayIsIm51bSIsImlzU3VuayIsImlzT3ZlciIsImNoZWNrIiwiZXZlcnkiLCJzaGlwIiwiUGxheWVyIiwicHJldmlvdXNBdHRhY2tzIiwiYXR0YWNrQXJyIiwiaXNOZXciLCJQdWJTdWIiLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInN1YnNjcmliZXIiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJTaGlwIiwiY3JlYXRlQ29vckFyciIsInRpbWVzSGl0IiwiYXJyIiwiYXR0YWNrU3RhZ2UiLCJpbml0QXR0YWNrU3RhZ2UiLCJpbml0R2FtZW92ZXIiLCJhdHRhY2siLCJ1c2VyQ2xpY2tBdHRhY2siLCJnYW1lQm9hcmREaXZDb21wdXRlciIsImhpZGVGb3JtIiwiZm9ybSIsInNob3dDb21wQm9hcmQiLCJjb21wQm9hcmQiLCJyZW1vdmUiLCJwdWJsaXNoRGF0YUlkIiwiZGF0YXNldCIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsInRleHRDb250ZW50Iiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJjcmVhdGVHYW1lT3ZlckFsZXJ0IiwiaDEiLCJoMyIsImltYWdlIiwic2hvd0dhbWVPdmVyIiwibWFpbiIsIm5vdGlmaWNhdGlvbiIsInBsYWNlbWVudFN0YWdlIiwiaW5pdFBsYWNlbWVudFN0YWdlIiwidXNlckNsaWNrIiwiaGlkZUNvbXBCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJhZGRJbnB1dExpc3RlbmVycyIsImZvcm1JbnB1dHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaW5wdXQiLCJhZGRCdG5MaXN0ZW5lciIsInBsYWNlU2hpcEJ0biIsInNoaXBQbGFjZUJ0biIsInBpY2tQbGFjZW1lbnQiLCJjcmVhdGVQbGFjZW1lbnRUaWxlcyIsImdhbWVCb2FyZERpdlVzZXIiLCJyZW1vdmVFdmVudExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwidXNlckF0dGFjayIsImhhbmRsZVVzZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjcmVhdGVTaGlwIiwiY3JlYXRlU2hpcFZpZXciLCJTaGlwSW5mbyIsIkNvbXB1dGVyR2FtZUJvYXJkIiwicGxhY2VTaGlwIiwiaW5pdENvbXBHQiIsImNvbXB1dGVyIiwiY29tcHV0ZXJWaWV3IiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsIlVzZXJHYW1lQm9hcmQiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJwdWJsaXNoUGxhY2VTaGlwIiwiaW5pdFVzZXJHQiIsInVzZXJCb2FyZCIsImluaXRIYW5kbGVBdHRhY2siLCJHYW1lQm9hcmRVc2VyVmlldyIsImhpZGVSYWRpbyIsInJhZGlvSW5wdXQiLCJyYWRpb0xhYmVsIiwibmV4dFNoaXBDaGVja2VkIiwicmFkaW8iLCJjaGVja2VkIiwiY2xlYXJWYWxpZGl0eVZpZXciLCJyZW1vdmVBdHRyaWJ1dGUiLCJoYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXciLCJjb29yZGluYXRlIiwiaGFuZGxlUGxhY2VtZW50VmlldyIsInVzZXIiLCJ1c2VyVmlldyIsIlNoaXBJbmZvVXNlciIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInJlc2V0TnVtIiwiY3JlYXRlU2hpcEluZm8iLCJwdWJsaXNoU2hpcEluZm9DaGVjayIsInB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSIsImlzQ29tcGxldGUiLCJPYmplY3QiLCJ2YWx1ZXMiLCJ1bmRlZmluZWQiLCJiaW5kIiwiQ29tcHV0ZXJQbGF5ZXIiLCJmb3VuZFNoaXAiLCJmb3VuZCIsImRpZmZlcmVuY2UiLCJlbmRGb3VuZCIsImVuZCIsIndhc0F0dGFja1N1Y2Nlc3MiLCJNYXRoIiwiYWJzIiwicmFuZG9tU2lkZUF0dGFjayIsInNpZGVzIiwib3BlcmF0b3JzIiwic2lnbiIsIm1ldGhvZCIsImEiLCJiIiwiZmxvb3IiLCJyYW5kb20iLCJuZXdDb29yIiwicHJldkNvb3IiLCJjb29yRGlmZiIsInNvcnQiLCJpbml0Q29tcFBsYXllciIsImNvbXB1dGVyUGxheWVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJuYW1lIiwiaW5wdXRzIl0sInNvdXJjZVJvb3QiOiIifQ==