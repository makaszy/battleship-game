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
  /* const image = document.createElement("img")
  image.setAttribute("alt", "game over notification") */
  if (string === "user") {
    h3.textContent = "YOU LOST"; /* 
                                 image.setAttribute("src", "../src/images/game-over--loss.png") */
    div.classList.add("game-over-notification--loss"); /* 
                                                       image.classList.add("game-over-notification__image--loss"); */
  } else {
    h3.textContent = "YOU WON"; /* 
                                image.setAttribute("src", "../src/images/game-over--win.png") */
    div.classList.add("game-over-notification--win"); /* 
                                                      image.classList.add("game-over-notification__image--win"); */
  }

  div.appendChild(h1);
  div.appendChild(h3);
  div.appendChild(createNewGameBtn());
  /* div.appendChild(image); */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxJQUFJLENBQUMsRUFBRTtJQUN2QyxJQUFJc00sTUFBTSxDQUFDdE0sQ0FBQyxDQUFDLENBQUNxSixPQUFPLEVBQUU7TUFDckIsT0FBT2lELE1BQU0sQ0FBQ3RNLENBQUMsQ0FBQyxDQUFDNkIsS0FBSztJQUN4QjtFQUNKO0FBQ0Y7QUFFQSwrREFBZWlJLGlCQUFpQjs7Ozs7Ozs7Ozs7QUNmaEMsU0FBUzFCLFlBQVlBLENBQUM3RixHQUFHLEVBQUU7RUFDekIsT0FBTzBJLElBQUksQ0FBQ1MsS0FBSyxDQUFDVCxJQUFJLENBQUNVLE1BQU0sQ0FBQyxDQUFDLEdBQUdwSixHQUFHLENBQUM7QUFDeEM7QUFFQSwrREFBZTZGLFlBQVk7Ozs7OztVQ0ozQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTnFEO0FBQ0c7QUFFeERsSSwyRUFBbUIsQ0FBQ3FCLE9BQU8sQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wbGF5ZXIvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1hdHRhY2stc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tZGlyZWN0aW9uL2dldC1yYW5kb20tZGlyZWN0aW9uLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvc2hpcC1pbmZvL2dldC1yYW5kb20tdGlsZS1udW0vZ2V0LXJhbmRvbS10aWxlLW51bS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9zaGlwLWluZm8uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuLyogY3JlYXRlcyBzaW5nbGUgdGlsZSB3aXRoIGV2ZW50IGxpc3RlbmVyICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBpZClcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICB0aWxlLnRleHRDb250ZW50PSBcIlwiO1xuICByZXR1cm4gdGlsZTtcbn1cblxuLyogY3JlYXRlcyAxMDAgdGlsZXMgd2l0aCBldmVudCBsaXN0ZW5lcnMgKi9cblxuZnVuY3Rpb24gY3JlYXRlVGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGlsZXM7XG4iLCJpbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCJcblxuLyogY2xhc3MgdXNlZCB0byB1cGRhdGUgdGhlIERPTSBiYXNlZCBvbiBpdCdzIGNvcnJlc3BvbmRpbmcgZ2FtZWJvYXJkICovXG5cbmNsYXNzIEdhbWVCb2FyZFZpZXcge1xuXG4gIC8qIHN0cmluZyBpcyB1c2VkIHRvIHF1ZXJ5IHRoZSBjb3JyZWN0IGdhbWVib2FyZCwgaXMgY29tcHV0ZXIgb3IgdXNlciAqL1xuXG4gIGNvbnN0cnVjdG9yKHN0cmluZykgeyAgXG4gICAgaWYgKHN0cmluZyAhPT0gXCJjb21wdXRlclwiICYmIHN0cmluZyAhPT0gXCJ1c2VyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkdhbWVCb2FyZFZpZXcgY3JlYXRlZCB3aXRoIGluY29ycmVjdCBzdHJpbmdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgfVxuICB9XG5cbiAgLyogdXBkYXRlcyB0aWxlcyBjbGFzc2VzIGZyb20gaGl0IHRvIHN1bmsgKi9cblxuICBzdGF0aWMgdXBkYXRlU3Vuayh0aWxlKSB7XG4gICAgaWYgKHRpbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZXBsYWNlKFwiaGl0XCIsIFwic3Vua1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwic3Vua1wiKTtcbiAgICB9XG4gIH1cblxuICAvKiBnZXRzIHRpbGUgc3RhdHVzICovXG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiZ2FtZWJvYXJkX190aWxlLS1oaXRcIiA6IFwiZ2FtZWJvYXJkX190aWxlLS1taXNzXCI7XG4gIH1cblxuICAvKiBxdWVyeSB0aWxlIGJhc2VkIG9uIHN0cmluZyBhbmQgZGF0YS1pZCAqL1xuXG4gIHF1ZXJ5VGlsZSA9IGRhdGFJZCA9PiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZGF0YUlkfVwiXWApXG5cbiAgLyogb25jZSBhIHNoaXAgaXMgc3VuayByZXBsYWNlcyB0aGUgaGl0IGNsYXNzIHdpdGggc3VuayBjbGFzcyBvbiBhbGwgdGhlIHNoaXBzIHRpbGVzICovXG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gdGhpcy5xdWVyeVRpbGUoZWxlbWVudCk7XG4gICAgICBHYW1lQm9hcmRWaWV3LnVwZGF0ZVN1bmsodGlsZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiBsYWJlbHMgdGlsZXMgd2l0aCBoaXQsIG1pc3MsIHN1bmssIGNsYXNzZXMuIElmIGFsbCBzaGlwJ3Mgc3VuayBwdWJsaXNoZXMgdGhlIHN0cmluZyB0byBpbml0aWFsaXplIGdhbWUgb3ZlciBwdWIgc3ViICovXG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgICBpZiAob2JqLmdhbWVvdmVyKSB7XG4gICAgICAgIGluaXQuZ2FtZW92ZXIucHVibGlzaCh0aGlzLnN0cmluZylcbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLnF1ZXJ5VGlsZShvYmoudGlsZSk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlldy5nZXRTdGF0dXMob2JqKSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZFZpZXc7XG4iLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIC8qIHRoZSBwdWIgc3ViIHJlc3BvbnNpYmxlIGZvciBoYW5kbGluZyB0aGUgb3Bwb25lbnRzIGF0dGFjayAqL1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIgKi9cblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICAvKiBwcm9wZXJ0eSBhY2Nlc3NvciBmb3Igc2hpcHNBcnIsIGFjY2VwdHMgYm90aCBhcnJheXMgYW5kIHNpbmdsZSBvYmplY3RzICovXG5cbiAgc2V0IHNoaXBzKHZhbHVlKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICB0aGlzLnNoaXBzQXJyID0gdGhpcy5zaGlwc0Fyci5jb25jYXQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNoaXBzQXJyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qIHByb3BlcnR5IGFjY2Vzc29ycyBmb3IgbWlzc2VkQXJyICovXG5cbiAgZ2V0IG1pc3NlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5taXNzZWRBcnI7XG4gIH1cblxuICBzZXQgbWlzc2VkKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMubWlzc2VkLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yIChcIlRoZSBzYW1lIHRpbGUgd2FzIGF0dGFja2VkIHR3aWNlIVwiKVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gICAgLyogQ2FsY3VsYXRlcyB0aGUgbWF4IGFjY2VwdGFibGUgdGlsZSBmb3IgYSBzaGlwIGRlcGVuZGluZyBvbiBpdHMgc3RhcnQgKHRpbGVOdW0pLlxuICBmb3IgZXguIElmIGEgc2hpcCBpcyBwbGFjZWQgaG9yaXpvbnRhbGx5IG9uIHRpbGUgMjEgbWF4IHdvdWxkIGJlIDMwICAqL1xuXG4gIHN0YXRpYyBjYWxjTWF4KG9iaikge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBvYmoudGlsZU51bSA+IDEwKSB7XG4gICAgICBpZiAob2JqLnRpbGVOdW0gJSAxMCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqLnRpbGVOdW1cbiAgICAgIH1cbiAgICAgIGNvbnN0IG1heCA9ICtgJHtvYmoudGlsZU51bS50b1N0cmluZygpLmNoYXJBdCgwKX0wYCArIDEwO1xuICAgICAgcmV0dXJuIG1heDtcbiAgICB9XG4gICAgY29uc3QgbWF4ID0gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyAxMCA6IDEwMDtcbiAgICByZXR1cm4gbWF4O1xuICB9XG5cbiAgLyogQ2FsY3VsYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIGluIHRpbGUgbnVtYmVycy4gVGhlIG1pbnVzIC0xIGFjY291bnRzIGZvciB0aGUgdGlsZU51bSB0aGF0IGlzIGFkZGVkIGluIHRoZSBpc1Rvb0JpZyBmdW5jICovXG5cbiAgc3RhdGljIGNhbGNMZW5ndGgob2JqKSB7XG4gICAgcmV0dXJuIG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiXG4gICAgICA/IG9iai5sZW5ndGggLSAxXG4gICAgICA6IChvYmoubGVuZ3RoIC0gMSkgKiAxMDtcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiB0aGUgc2hpcCBwbGFjZW1lbnQgd291bGQgYmUgbGVnYWwsIG9yIGlmIHRoZSBzaGlwIGlzIHRvbyBiaWcgdG8gYmUgcGxhY2VkIG9uIHRoZSB0aWxlICovXG5cbiAgc3RhdGljIGlzVG9vQmlnKG9iaikge1xuICAgIGNvbnN0IG1heCA9IEdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IEdhbWVCb2FyZC5jYWxjTGVuZ3RoKG9iaik7XG4gICAgaWYgKG9iai50aWxlTnVtICsgc2hpcExlbmd0aCA8PSBtYXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKiBjaGVja3MgaWYgY29vcmRpbmF0ZXMgYWxyZWFkeSBoYXZlIGEgc2hpcCBvbiB0aGVtICovXG5cbiAgaXNUYWtlbihjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiByZXR1cm5zIHRydWUgaWYgYSBzaGlwIGlzIGFscmVhZHkgcGxhY2VkIG9uIHRpbGVzIG5laWdoYm9yaW5nIHBhc3NlZCBjb29yZGluYXRlcyAqL1xuXG4gIGlzTmVpZ2hib3JpbmcoY29vcmRpbmF0ZXMsIGRpcmVjdGlvbikge1xuICAgIGxldCBjb29yZGluYXRlc0FsbE5laWdoYm9ycyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAvLyBIb3Jpem9udGFsIFBsYWNlbWVudFxuICAgICAgLyogTEVGVCBhbmQgUklHSFQgKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAxKSB7XG4gICAgICAgIC8vIGxlZnQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlIG9uIHRoZSByaWdodFxuICAgICAgICBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5wdXNoKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICsgMSk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICUgMTAgPT09IDApIHtcbiAgICAgICAgLy8gcmlnaHQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlIG9uIHRoZSBsZWZ0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG5laXRoZXIgdGhlIGxlZnQgb3IgcmlnaHQgYm9yZGVyLCBhZGRzIGJvdGggbGVmdCBhbmQgcmlnaHQgdGlsZXNcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMucHVzaChcbiAgICAgICAgICBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAxXSArIDEsXG4gICAgICAgICAgY29vcmRpbmF0ZXNbMF0gLSAxXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvKiBUT1AgYW5kIEJPVFRPTSAqL1xuICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgIC8vIG5vIGNoZWNrcyBmb3IgdG9wIGFuZCBib3R0b20gYm9yZGVycywgc2luY2UgaW1wb3NzaWJsZSB0byBwbGFjZSBzaGlwIG91dHNpZGUgdGhlIGdyaWRcbiAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMTApLFxuICAgICAgICBjb29yZGluYXRlcy5tYXAoKGNvb3IpID0+IGNvb3IgLSAxMClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFZlcnRpY2FsIFBsYWNlbWVudFxuICAgICAgLyogTEVGVCBhbmQgUklHSFQgKi9cbiAgICAgIGlmIChjb29yZGluYXRlc1swXSAlIDEwID09PSAxKSB7XG4gICAgICAgIC8vIGxlZnQgYm9yZGVyIG9ubHkgYWRkcyB0aWxlcyBvbiB0aGUgcmlnaHRcbiAgICAgICAgY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMgPSBjb29yZGluYXRlc0FsbE5laWdoYm9ycy5jb25jYXQoXG4gICAgICAgICAgY29vcmRpbmF0ZXMubWFwKChjb29yKSA9PiBjb29yICsgMSlcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoY29vcmRpbmF0ZXNbMF0gJSAxMCA9PT0gMCkge1xuICAgICAgICAvLyByaWdodCBib3JkZXIgb25seSBhZGRzIHRpbGVzIG9uIHRoZSBsZWZ0XG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEpXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRoZSBsZWZ0IG9yIHJpZ2h0IGJvcmRlciwgYWRkcyBib3RoIGxlZnQgYW5kIHJpZ2h0IHRpbGVzXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzID0gY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMuY29uY2F0KFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciArIDEpLFxuICAgICAgICAgIGNvb3JkaW5hdGVzLm1hcCgoY29vcikgPT4gY29vciAtIDEpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICAvKiBUT1AgYW5kIEJPVFRPTSAqL1xuICAgICAgaWYgKGNvb3JkaW5hdGVzWzBdIDwgMTEpIHtcbiAgICAgICAgLy8gdG9wIGJvcmRlciwgYWRkcyBvbmx5IGJvdHRvbSB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxMCk7XG4gICAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdID4gOTApIHtcbiAgICAgICAgLy8gYm90dG9tIGJvcmRlciwgYWRkcyBvbmx5IHRvcCB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goY29vcmRpbmF0ZXNbMF0gLSAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBuZWl0aGVyIHRvcCBvciBib3R0b20gYm9yZGVyLCBhZGRzIHRoZSB0b3AgYW5kIGJvdHRvbSB0aWxlXG4gICAgICAgIGNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzLnB1c2goXG4gICAgICAgICAgY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV0gKyAxMCxcbiAgICAgICAgICBjb29yZGluYXRlc1swXSAtIDEwXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIGlmIHNoaXAgcGxhY2VkIG9uIG5laWdoYm9yaW5nIHRpbGVzIHJldHVybnMgdHJ1ZSAqL1xuICAgIHJldHVybiB0aGlzLmlzVGFrZW4oY29vcmRpbmF0ZXNBbGxOZWlnaGJvcnMpO1xuICB9XG5cbiAgLyogY2hlY2tzIGlmIHRoZSB0aGUgdGlsZSBudW0gc2VsZWN0ZWQgYnkgb3Bwb25lbnQgaGFzIGEgc2hpcCwgaWYgaGl0IGNoZWNrcyBpZiBzaGlwIGlzIHN1bmssIGlmIHN1bmsgY2hlY2tzIGlmIGdhbWUgaXMgb3ZlciwgZWxzZSBhZGRzIHRpbGUgbnVtIHRvIG1pc3NlZCBhcnJheSAgKi9cblxuXG4gIGhhbmRsZUF0dGFjayA9IChudW0pID0+IHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLmluY2x1ZGVzKCtudW0pKSB7XG4gICAgICAgIHRoaXMuc2hpcHNbeV0uaGl0KCk7XG4gICAgICAgIGlmICh0aGlzLnNoaXBzW3ldLmlzU3VuaygpKSB7XG4gICAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgICAgaGl0OiB0cnVlLFxuICAgICAgICAgICAgc3VuazogdHJ1ZSxcbiAgICAgICAgICAgIHRpbGVzOiB0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNPdmVyKClcbiAgICAgICAgICAgID8gdGhpcy5wdWJTdWIucHVibGlzaCh7IC4uLm9iaiwgLi4ueyBnYW1lb3ZlcjogdHJ1ZSB9IH0pXG4gICAgICAgICAgICA6IHRoaXMucHViU3ViLnB1Ymxpc2gob2JqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiB0cnVlLCBzdW5rOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5taXNzZWQgPSBudW07XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogY2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGNoZWNrID0gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKTtcbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsIi8qIHBsYXllciBiYXNlIGNsYXNzICovXG5cbmNsYXNzIFBsYXllciB7XG5cbiAgcHJldmlvdXNBdHRhY2tzID0gW11cbiAgXG4gIGdldCBhdHRhY2tBcnIoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJldmlvdXNBdHRhY2tzO1xuICB9XG5cbiAgc2V0IGF0dGFja0Fycih2YWx1ZSkge1xuICAgIHRoaXMucHJldmlvdXNBdHRhY2tzLnB1c2godmFsdWUpO1xuICB9XG5cbiAgaXNOZXcodmFsdWUpIHtcbiAgICByZXR1cm4gIXRoaXMuYXR0YWNrQXJyLmluY2x1ZGVzKHZhbHVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsImNsYXNzIFNoaXAge1xuICBcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgdGhpcy5sZW5ndGggPSArb2JqLmxlbmd0aDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gU2hpcC5jcmVhdGVDb29yQXJyKG9iaik7XG4gIH1cblxuICB0aW1lc0hpdCA9IDA7XG5cbiAgc3VuayA9IGZhbHNlO1xuXG4gIHN0YXRpYyBjcmVhdGVDb29yQXJyKG9iaikge1xuICAgIGNvbnN0IGFyciA9IFsrb2JqLnRpbGVOdW1dO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGhpdCgpIHtcbiAgICB0aGlzLnRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgaWYgKHRoaXMudGltZXNIaXQgPT09IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdW5rO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCJpbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZF9fdmlld3MtLWNvbXB1dGVyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvZ2FtZWJvYXJkLXZpZXdzLS11c2VyXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tdXNlci9wbGF5ZXItLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0IHsgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlLCBnYW1lb3ZlciBhcyBpbml0R2FtZW92ZXIgfSBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgYXR0YWNrIGFzIHVzZXJDbGlja0F0dGFjayB9IGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIjsgXG5cbmNvbnN0IGdhbWVCb2FyZERpdkNvbXB1dGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLWNvbXB1dGVyXCIpO1xuXG4vKiBoaWRlcyB0aGUgcGxhY2VtZW50IGZvcm0gKi9cblxuZnVuY3Rpb24gaGlkZUZvcm0oKSB7XG4gIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpdi0tcGxhY2VtZW50LWZvcm1cIik7XG4gIGZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbn1cblxuLyogc2hvdydzIHRoZSBjb21wdXRlcidzIGJvYXJkICovXG5cbmZ1bmN0aW9uIHNob3dDb21wQm9hcmQoKSB7XG4gIGNvbnN0IGNvbXBCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGl2LS1jb21wdXRlclwiKTtcbiAgY29tcEJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG59XG5cbi8qIHB1Ymxpc2ggdGhlIHRpbGUncyBkYXRhLWlkICovXG5cbmZ1bmN0aW9uIHB1Ymxpc2hEYXRhSWQoKSB7XG4gIGNvbnN0IHtpZH0gPSB0aGlzLmRhdGFzZXQ7XG4gIHVzZXJDbGlja0F0dGFjay5wdWJsaXNoKGlkKVxufVxuXG4vKiBjcmVhdGVzIHRpbGVzIGZvciB0aGUgdXNlciBnYW1lYm9hcmQsIGFuZCB0aWxlcyB3aXRoIGV2ZW50TGlzdGVuZXJzIGZvciB0aGUgY29tcHV0ZXIgZ2FtZWJvYXJkICovXG5cbmZ1bmN0aW9uIGluaXRBdHRhY2tTdGFnZVRpbGVzKCkge1xuICBjcmVhdGVUaWxlcyhnYW1lQm9hcmREaXZDb21wdXRlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIGNyZWF0ZXMgZ2FtZW92ZXIgbm90aWZpY2F0aW9uIGFuZCBuZXcgZ2FtZSBidG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlTmV3R2FtZUJ0bigpIHtcbiAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgYnRuLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gIGJ0bi50ZXh0Q29udGVudCA9IFwiTmV3IEdhbWVcIjtcbiAgYnRuLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19idG5cIilcbiAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbiAgcmV0dXJuIGJ0bjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR2FtZU92ZXJBbGVydChzdHJpbmcpIHtcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgXG4gIGNvbnN0IGgxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuICBoMS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faGVhZGluZ1wiKVxuICBoMS50ZXh0Q29udGVudCA9IFwiR0FNRSBPVkVSXCI7XG4gIGNvbnN0IGgzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICBoMy5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9fc3ViLWhlYWRpbmdcIik7XG4gIC8qIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKVxuICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJhbHRcIiwgXCJnYW1lIG92ZXIgbm90aWZpY2F0aW9uXCIpICovXG4gIGlmIChzdHJpbmcgPT09IFwidXNlclwiKSB7XG4gICAgaDMudGV4dENvbnRlbnQgPSBcIllPVSBMT1NUXCI7LyogXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vc3JjL2ltYWdlcy9nYW1lLW92ZXItLWxvc3MucG5nXCIpICovXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uLS1sb3NzXCIpOy8qIFxuICAgIGltYWdlLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXItbm90aWZpY2F0aW9uX19pbWFnZS0tbG9zc1wiKTsgKi9cbiAgfSBlbHNlIHtcbiAgICBoMy50ZXh0Q29udGVudCA9IFwiWU9VIFdPTlwiLyogXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiLi4vc3JjL2ltYWdlcy9nYW1lLW92ZXItLXdpbi5wbmdcIikgKi9cbiAgICBkaXYuY2xhc3NMaXN0LmFkZChcImdhbWUtb3Zlci1ub3RpZmljYXRpb24tLXdpblwiKTsvKiBcbiAgICBpbWFnZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyLW5vdGlmaWNhdGlvbl9faW1hZ2UtLXdpblwiKTsgKi9cbiAgfVxuICBkaXYuYXBwZW5kQ2hpbGQoaDEpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaDMpO1xuICBcbiAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZU5ld0dhbWVCdG4oKSk7XG4gIC8qIGRpdi5hcHBlbmRDaGlsZChpbWFnZSk7ICovXG4gIHJldHVybiBkaXY7XG59XG5cbmZ1bmN0aW9uIHNob3dHYW1lT3ZlcihzdHJpbmcpIHtcbiAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuICBjb25zdCBub3RpZmljYXRpb24gPSBjcmVhdGVHYW1lT3ZlckFsZXJ0KHN0cmluZyk7XG4gIG1haW4uYXBwZW5kQ2hpbGQobm90aWZpY2F0aW9uKTtcbn1cblxuLyogU3Vic2NyaWJlIHRvIGluaXRpYWxpemluZyBwdWItc3VicyAqL1xuXG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKHNob3dDb21wQm9hcmQpO1xuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0QXR0YWNrU3RhZ2VUaWxlcyk7XG5pbml0QXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGhpZGVGb3JtKTtcbmluaXRHYW1lb3Zlci5zdWJzY3JpYmUoc2hvd0dhbWVPdmVyKTtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8vc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi9sYXlvdXQtLWF0dGFjay1zdGFnZVwiO1xuaW1wb3J0IGNyZWF0ZVRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlc1wiO1xuaW1wb3J0IHtcbiAgcGxhY2VtZW50U3RhZ2UgYXMgaW5pdFBsYWNlbWVudFN0YWdlLFxuICBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UsXG59IGZyb20gXCIuLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG5mdW5jdGlvbiBoaWRlQ29tcEJvYXJkKCkge1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXYtLWNvbXB1dGVyXCIpO1xuICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG59XG5cbmZ1bmN0aW9uIGFkZElucHV0TGlzdGVuZXJzKCkge1xuICBjb25zdCBmb3JtSW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG4gIGZvcm1JbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEJ0bkxpc3RlbmVyKCkge1xuICBjb25zdCBwbGFjZVNoaXBCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYWNlbWVudC1mb3JtX19wbGFjZS1idG5cIik7XG4gIHBsYWNlU2hpcEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHVzZXJDbGljay5zaGlwUGxhY2VCdG4ucHVibGlzaCgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHVibGlzaERhdGFJZCgpIHtcbiAgY29uc3QgeyBpZCB9ID0gdGhpcy5kYXRhc2V0O1xuICB1c2VyQ2xpY2sucGlja1BsYWNlbWVudC5wdWJsaXNoKGlkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUGxhY2VtZW50VGlsZXMoKSB7XG4gIGNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcbiAgY3JlYXRlVGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERhdGFJZCk7XG59XG5cbi8qIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkICovXG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuICBjb25zdCB0aWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ2FtZWJvYXJkLS11c2VyIC5nYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGVzLmZvckVhY2goKHRpbGUpID0+IHtcbiAgICB0aWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRGF0YUlkKTtcbiAgfSk7XG59XG5cbi8qIGluaXRpYWxpemF0aW9uIHN1YnNjcmlwdGlvbnMgKi9cblxuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShhZGRCdG5MaXN0ZW5lcik7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGFkZElucHV0TGlzdGVuZXJzKTtcbmluaXRQbGFjZW1lbnRTdGFnZS5zdWJzY3JpYmUoaGlkZUNvbXBCb2FyZCk7XG5pbml0UGxhY2VtZW50U3RhZ2Uuc3Vic2NyaWJlKGNyZWF0ZVBsYWNlbWVudFRpbGVzKTtcbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUocmVtb3ZlRXZlbnRMaXN0ZW5lcnMpO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7Y29tcHV0ZXJBdHRhY2ssIGhhbmRsZUNvbXB1dGVyQXR0YWNrfSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgdXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlVXNlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHsgdXNlckF0dGFjaywgaGFuZGxlVXNlckF0dGFjayx9O1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBjcmVhdGVTaGlwSW5mbygpIHB1Ymxpc2hlcyBhIHNoaXBJbmZvIG9iai4gZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBpcyBzdWJzY3JpYmVkIGFuZCBjaGVja3Mgd2hldGhlciBhIHNoaXAgY2FuIGJlIHBsYWNlZCB0aGVyZSAqL1xuXG5jb25zdCBzaGlwSW5mbyA9IG5ldyBQdWJTdWIoKTtcblxuLyogZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBwdWJsaXNoZXMgYW4gb2JqIHdpdGggYSBib28uIHZhbGlkIHByb3BlcnR5IGFuZCBhIGxpc3Qgb2YgY29vcmRpbmF0ZXMuICovXG5cbmNvbnN0IHZhbGlkaXR5Vmlld3MgPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gcGxhY2Ugc2hpcCBidG4gaXMgcHJlc3NlZCBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB3aWxsIGNyZWF0ZSBzaGlwSW5mbyAqL1xuXG5jb25zdCBzaGlwUGxhY2VCdG4gPSBuZXcgUHViU3ViKCk7XG5cbi8qIFdoZW4gIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIGNyZWF0ZXMgdGhlIHNoaXBJbmZvLiBUaGUgZ2FtZWJvYXJkLnBsYWNlU2hpcCAqL1xuXG5jb25zdCBjcmVhdGVTaGlwID0gbmV3IFB1YlN1YigpO1xuXG4vKiBVc2VyR2FtZUJvYXJkLnB1Ymxpc2hQbGFjZVNoaXAgcHVibGlzaGVzIHNoaXAgY29vcmRpbmF0ZXMuIEdhbWVCb2FyZFVzZXJWaWV3LmhhbmRsZVBsYWNlbWVudFZpZXcgYWRkcyBwbGFjZW1lbnQtc2hpcCBjbGFzcyB0byB0aWxlcyAqL1xuXG5jb25zdCBjcmVhdGVTaGlwVmlldyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3MsIHNoaXBQbGFjZUJ0biwgY3JlYXRlU2hpcCwgY3JlYXRlU2hpcFZpZXd9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgcGxhY2VtZW50IHN0YWdlICovXG5cbmNvbnN0IHBsYWNlbWVudFN0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyB0aGUgYXR0YWNrIHN0YWdlICovXG5cbmNvbnN0IGF0dGFja1N0YWdlID0gbmV3IFB1YlN1YigpO1xuXG4vKiBpbml0aWFsaXplcyBnYW1lIG92ZXIgZGl2ICovXG5cbmNvbnN0IGdhbWVvdmVyID0gbmV3IFB1YlN1YigpO1xuXG5leHBvcnQgeyBhdHRhY2tTdGFnZSwgcGxhY2VtZW50U3RhZ2UsIGdhbWVvdmVyIH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcblxuLyogcmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLCBuZWlnaGJvcmluZyBvdGhlciBzaGlwcywgb3IgdG9vIGJpZyAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAoc3VwZXIuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCBzdXBlci5pc05laWdoYm9yaW5nKHNoaXAuY29vcmRpbmF0ZXMsIHNoaXAuZGlyZWN0aW9uKSB8fCBHYW1lQm9hcmQuaXNUb29CaWcoc2hpcEluZm8pICkge1xuICAgICAgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICAgIHNoaXAgPSBuZXcgU2hpcChzaGlwSW5mbyk7XG4gICAgfVxuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICB9XG59XG5cbi8qIGluaXRpYWxpemUgY29tcHV0ZXIgZ2FtZSBib2FyZCAqL1xuXG5cbmZ1bmN0aW9uIGluaXRDb21wR0IoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBDb21wdXRlckdhbWVCb2FyZChoYW5kbGVVc2VyQXR0YWNrKTtcbiAgICBjb25zdCBzaGlwc0FyciA9IFs1LCA0LCAzLCAyXVxuXG4gICAgc2hpcHNBcnIuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoc2hpcClcbiAgICB9KTtcbiAgICBcblxuICAgIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyQm9hcmQuaGFuZGxlQXR0YWNrKTsgXG59XG5cbmluaXQuYXR0YWNrU3RhZ2Uuc3Vic2NyaWJlKGluaXRDb21wR0IpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlldyBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmQtdmlld1wiO1xuaW1wb3J0IHsgaGFuZGxlVXNlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIjtcblxuY29uc3QgY29tcHV0ZXIgPSBcImNvbXB1dGVyXCI7XG5cbmNvbnN0IGNvbXB1dGVyVmlldyA9IG5ldyBHYW1lQm9hcmRWaWV3KGNvbXB1dGVyKTtcblxuaGFuZGxlVXNlckF0dGFjay5zdWJzY3JpYmUoY29tcHV0ZXJWaWV3LmhhbmRsZUF0dGFja1ZpZXcpO1xuXG4iLCJpbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG5mdW5jdGlvbiBnZXRSYW5kb21EaXJlY3Rpb24oKSB7XG4gIHJldHVybiBnZXRSYW5kb21OdW0oMikgPT09IDEgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tRGlyZWN0aW9uO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuLyogY3JlYXRlIGEgcmFuZG9tIHRpbGVOdW0gKi9cblxuZnVuY3Rpb24gZ2V0UmFuZG9tVGlsZU51bShsZW5ndGgsIGRpcmVjdGlvbikge1xuICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgIGxldCBudW0gPSArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gICAgd2hpbGUgKG51bSA8IDEgfHwgbnVtID4gMTAwKSB7XG4gICAgICBudW0gPSArKGdldFJhbmRvbU51bSgxMCkudG9TdHJpbmcoKSArIGdldFJhbmRvbU51bSgxMSAtIGxlbmd0aCkudG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJldHVybiBudW1cbiAgfVxuICAgbGV0IG51bSA9ICsoZ2V0UmFuZG9tTnVtKDExLSBsZW5ndGgpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkpO1xuICAgd2hpbGUgKG51bSA8IDEgfHwgbnVtID4gMTAwKSB7XG4gICAgbnVtID0gKyhnZXRSYW5kb21OdW0oMTApLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTEgLSBsZW5ndGgpLnRvU3RyaW5nKCkpO1xuICB9XG4gIHJldHVybiBudW1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tVGlsZU51bTtcbiIsIlxuaW1wb3J0IGdldFJhbmRvbURpcmVjdGlvbiBmcm9tIFwiLi9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvblwiO1xuaW1wb3J0IGdldFJhbmRvbVRpbGVOdW0gZnJvbSBcIi4vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtXCI7XG5cbmNsYXNzIFNoaXBJbmZvIHtcbiAgXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZ2V0UmFuZG9tRGlyZWN0aW9uKCk7XG4gICAgdGhpcy50aWxlTnVtID0gZ2V0UmFuZG9tVGlsZU51bSh0aGlzLmxlbmd0aCwgdGhpcy5kaXJlY3Rpb24pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvO1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi4vLi4vY29tbW9uL2dhbWVib2FyZC9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuLi8uLi9jb21tb24vc2hpcC9zaGlwXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjaywgY29tcHV0ZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IHsgYXR0YWNrU3RhZ2UgYXMgaW5pdEF0dGFja1N0YWdlLCBwbGFjZW1lbnRTdGFnZSBhcyBpbml0UGxhY2VtZW50U3RhZ2UgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcblxuY2xhc3MgVXNlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG5cbiAgLyogY2hlY2tzIHNoaXAgdmFsaWRpdHkgKi9cblxuICBpc1ZhbGlkID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIGlmIChzdXBlci5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IEdhbWVCb2FyZC5pc1Rvb0JpZyhvYmopIHx8IHN1cGVyLmlzTmVpZ2hib3Jpbmcoc2hpcC5jb29yZGluYXRlcywgb2JqLmRpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXN9IFxuICAgIH1cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgY29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMgfVxuICB9XG5cbiAgcHVibGlzaFZhbGlkaXR5ID0gKG9iaikgPT4ge1xuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBwbGFjZXMgc2hpcCBpbiBzaGlwc0FyciAqL1xuXG4gIHBsYWNlU2hpcCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gc2hpcDtcbiAgfVxuXG4gIHB1Ymxpc2hQbGFjZVNoaXAgPSAob2JqKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IHRoaXMucGxhY2VTaGlwKG9iailcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcFZpZXcucHVibGlzaCh7Y29vcmRpbmF0ZXM6IHNoaXAuY29vcmRpbmF0ZXMsIGxlbmd0aDogc2hpcC5sZW5ndGh9KVxuICB9XG59XG5cbi8qIGluaXRpYWxpemUgdXNlciBnYW1lIGJvYXJkICovXG5cbmZ1bmN0aW9uIGluaXRVc2VyR0IoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG4gIHVzZXJDbGljay5jcmVhdGVTaGlwLnN1YnNjcmliZSh1c2VyQm9hcmQucHVibGlzaFBsYWNlU2hpcCk7XG4gIGZ1bmN0aW9uIGluaXRIYW5kbGVBdHRhY2soKSB7XG4gICAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xuICB9XG4gIGluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdEhhbmRsZUF0dGFjaylcbn1cblxuaW5pdFBsYWNlbWVudFN0YWdlLnN1YnNjcmliZShpbml0VXNlckdCKVxuXG5cbiIsImltcG9ydCBHYW1lQm9hcmRWaWV3IGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC12aWV3XCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgaW5pdCBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5jbGFzcyBHYW1lQm9hcmRVc2VyVmlldyBleHRlbmRzIEdhbWVCb2FyZFZpZXcge1xuXG4gIGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxhY2VtZW50LWZvcm1fX3BsYWNlLWJ0blwiKTtcblxuICAvKiB3aGVuIGEgc2hpcCBpcyBwbGFjZWQgdGhlIHJhZGlvIGlucHV0IGZvciB0aGF0IHNoaXAgaXMgaGlkZGVuICovXG5cbiAgc3RhdGljIGhpZGVSYWRpbyhvYmopIHtcbiAgICBjb25zdCByYWRpb0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI3NoaXAtJHtvYmoubGVuZ3RofWApO1xuICAgIHJhZGlvSW5wdXQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICBjb25zdCByYWRpb0xhYmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihbYFtmb3I9XCJzaGlwLSR7b2JqLmxlbmd0aH1cIl1gXSk7XG4gICAgcmFkaW9MYWJlbC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICB9XG5cbiAgLyogd2hlbiBhIHNoaXAgaXMgcGxhY2VkIHRoZSBuZXh0IHJhZGlvIGlucHV0IGlzIGNoZWNrZWQgc28gdGhhdCB5b3UgY2FuJ3QgcGxhY2UgdHdvIG9mIHRoZSBzYW1lIHNoaXBzIHR3aWNlLFxuICAgICB3aGVuIHRoZXJlIGFyZSBubyBtb3JlIHNoaXBzIHRvIHBsYWNlIG5leHRTaGlwQ2hlY2tlZCB3aWxsIGluaXRpYWxpemUgdGhlIGF0dGFjayBzdGFnZSAqL1xuXG4gIHN0YXRpYyBuZXh0U2hpcENoZWNrZWQoKSB7XG4gICAgY29uc3QgcmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGA6bm90KC5oaWRkZW4pW25hbWU9XCJzaGlwXCJdYCk7XG4gICAgaWYgKHJhZGlvID09PSBudWxsKSB7XG4gICAgICBpbml0LmF0dGFja1N0YWdlLnB1Ymxpc2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaW8uY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyogY2xlYXJzIHRoZSB2YWxpZGl0eSBjaGVjayBvZiB0aGUgcHJldmlvdXMgc2VsZWN0aW9uIGZyb20gdGhlIHVzZXIgZ2FtZWJvYXJkLiBJZiBpdCBwYXNzZXMgdGhlIGNoZWNrIGl0IHVubG9ja3MgdGhlIHBsYWNlIHNoaXAgYnRuICovXG5cbiAgY2xlYXJWYWxpZGl0eVZpZXcgPSAoKSA9PiB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlKSA9PiB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZW1vdmUoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgIH0pO1xuICAgIHRoaXMuYnRuLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICB9O1xuXG4gIC8qIGFkZHMgdGhlIHZpc3VhbCBjbGFzcyBwbGFjZW1lbnQtLXZhbGlkIG9yIHBsYWNlbWVudC0taW52YWxpZCBiYXNlZCBvbiB0aGUgdGlsZU51bSBjaG9zZW4gYnkgdGhlIHVzZXIsIGRpc2FibGVzIHRoZSBzdWJtaXQgYnRuIGlmIGl0IGZhaWxzIHBsYWNlbWVudCBjaGVjayAqL1xuXG4gIGhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyA9IChvYmopID0+IHtcbiAgICB0aGlzLmNsZWFyVmFsaWRpdHlWaWV3KCk7XG4gICAgaWYgKCFvYmoudmFsaWQpIHtcbiAgICAgIHRoaXMuYnRuLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuICAgIH1cbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgaWYgKG9iai52YWxpZCkge1xuICAgICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJwbGFjZW1lbnQtLXZhbGlkXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1pbnZhbGlkXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGhhbmRsZVBsYWNlbWVudFZpZXcgPSAob2JqKSA9PiB7XG4gICAgdGhpcy5jbGVhclZhbGlkaXR5VmlldygpO1xuICAgIHRoaXMuY29uc3RydWN0b3IuaGlkZVJhZGlvKG9iaik7XG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5uZXh0U2hpcENoZWNrZWQoKTtcbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmRpbmF0ZSkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7Y29vcmRpbmF0ZX1cIl1gXG4gICAgICApO1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS1zaGlwXCIpO1xuICAgIH0pO1xuICB9O1xufVxuXG5jb25zdCB1c2VyID0gXCJ1c2VyXCI7XG5cbmNvbnN0IHVzZXJWaWV3ID0gbmV3IEdhbWVCb2FyZFVzZXJWaWV3KHVzZXIpO1xuXG4vKiBzdWJzY3JpcHRpb25zICovXG5cbmhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVBdHRhY2tWaWV3KTtcbnVzZXJDbGljay52YWxpZGl0eVZpZXdzLnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpO1xudXNlckNsaWNrLmNyZWF0ZVNoaXBWaWV3LnN1YnNjcmliZSh1c2VyVmlldy5oYW5kbGVQbGFjZW1lbnRWaWV3KTtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgdGlsZU51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy50aWxlTnVtID0gdmFsdWU7XG4gICAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbiAgfSxcbiAgcmVzZXROdW0oKSB7XG4gICAgdGhpcy50aWxlTnVtID0gMDtcbiAgfSxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBJbmZvKCkge1xuICBjb25zdCB7IHRpbGVOdW0gfSA9IHNoaXBQbGFjZW1lbnQ7XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIGNvbnN0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvVXNlcih0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbik7XG4gIHJldHVybiBzaGlwSW5mbztcbn1cblxuZnVuY3Rpb24gcHVibGlzaFNoaXBJbmZvQ2hlY2soKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKTtcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnB1Ymxpc2goc2hpcEluZm8pO1xufVxuXG5mdW5jdGlvbiBwdWJsaXNoU2hpcEluZm9DcmVhdGUoKSB7XG4gIGNvbnN0IHNoaXBJbmZvID0gY3JlYXRlU2hpcEluZm8oKTtcbiAgY29uc3QgaXNDb21wbGV0ZSA9IE9iamVjdC52YWx1ZXMoc2hpcEluZm8pLmV2ZXJ5KCh2YWx1ZSkgPT4ge1xuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSBudWxsICYmXG4gICAgICB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB2YWx1ZSAhPT0gZmFsc2UgJiZcbiAgICAgIHZhbHVlICE9PSAwXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9KTtcbiAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICB1c2VyQ2xpY2suY3JlYXRlU2hpcC5wdWJsaXNoKHNoaXBJbmZvKTtcbiAgICBzaGlwUGxhY2VtZW50LnJlc2V0TnVtKCk7XG4gIH1cbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xudXNlckNsaWNrLmlucHV0LnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DaGVjayk7XG51c2VyQ2xpY2suc2hpcFBsYWNlQnRuLnN1YnNjcmliZShwdWJsaXNoU2hpcEluZm9DcmVhdGUpO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vLi4vY29tbW9uL3BsYXllci9wbGF5ZXJcIjtcbmltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0IHthdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2V9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQge1xuICBjb21wdXRlckF0dGFjayxcbiAgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssXG59IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5cbmNsYXNzIENvbXB1dGVyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnB1YlN1YiA9IHB1YlN1YjtcbiAgfVxuXG4gIC8qIGhvbGRzIGluZm9ybWF0aW9uIG9uIGFueSBzaGlwIHRoYXQgd2FzIGZvdW5kICovXG5cbiAgZm91bmRTaGlwID0ge1xuICAgIGZvdW5kOiBmYWxzZSxcbiAgICBoaXQ6IGZhbHNlLFxuICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICBkaWZmZXJlbmNlOiBudWxsLFxuICAgIGVuZEZvdW5kOiBmYWxzZSxcbiAgICBlbmQ6IG51bGwsXG4gIH07XG5cbiAgLyogcmVjZWl2ZXMgaW5mb3JtYXRpb24gb24gdGhlIGxhc3QgYXR0YWNrIGFuZCBhZGp1c3RzIHRoZSBmb3VuZFNoaXAgb2JqZWN0IGFjY29yZGluZ2x5ICovXG5cbiAgd2FzQXR0YWNrU3VjY2VzcyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwID0ge1xuICAgICAgICBmb3VuZDogZmFsc2UsXG4gICAgICAgIGhpdDogZmFsc2UsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgZGlmZmVyZW5jZTogbnVsbCxcbiAgICAgICAgZW5kRm91bmQ6IGZhbHNlLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgJiYgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5wdXNoKG9iai50aWxlKTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IHRydWU7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5mb3VuZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChvYmouaGl0ICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSB0cnVlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMucHVzaChvYmoudGlsZSk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZSA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlID0gTWF0aC5hYnMoXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSBvYmoudGlsZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvYmouaGl0ID09PSBmYWxzZSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuZm91bmQgPT09IHRydWUgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9IGZhbHNlO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmZvdW5kU2hpcC5lbmQgPVxuICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKG9iai5oaXQgPT09IGZhbHNlICYmIHRoaXMuZm91bmRTaGlwLmZvdW5kID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmZvdW5kU2hpcC5oaXQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgLyogZ2VuZXJhdGVzIGEgY29vcmRpbmF0ZSAoZWl0aGVyIHRvcCwgYnRtLCBsZWZ0LCBvciByaWdodCkgdGhhdCBpcyBuZXh0IHRvIHRoZSBjb29yZGluYXRlIHBhc3NlZCAqL1xuXG4gIHN0YXRpYyByYW5kb21TaWRlQXR0YWNrKGNvb3JkaW5hdGUpIHtcbiAgICBjb25zdCBzaWRlcyA9IFsxLCAxMF07IC8vIGRhdGEgZGlmZmVyZW5jZSBmb3IgdmVydGljYWwgc2lkZXMgaXMgMTAsIGFuZCBob3Jpem9udGFsIHNpZGVzIGlzIDFcbiAgICBjb25zdCBvcGVyYXRvcnMgPSBbXG4gICAgICAvLyBhcnJheSBvZiBvcGVyYXRvcnMgKCssIC0pIHdoaWNoIGFyZSB1c2VkIHRvIGdlbmVyYXRlIGEgcmFuZG9tIG9wZXJhdG9yXG4gICAgICB7XG4gICAgICAgIHNpZ246IFwiK1wiLFxuICAgICAgICBtZXRob2QoYSwgYikge1xuICAgICAgICAgIHJldHVybiBhICsgYjtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHNpZ246IFwiLVwiLFxuICAgICAgICBtZXRob2QoYSwgYikge1xuICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXTtcbiAgICByZXR1cm4gb3BlcmF0b3JzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG9wZXJhdG9ycy5sZW5ndGgpXS5tZXRob2QoXG4gICAgICBjb29yZGluYXRlLFxuICAgICAgc2lkZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2lkZXMubGVuZ3RoKV1cbiAgICApOyAvLyBnZW5lcmF0ZXMgdGhlIGRhdGEgbnVtIG9mIGEgcmFuZG9tIHNpZGUgKGhvcml6b250YWwgbGVmdCA9IGhpdCBjb29yZGluYXRlIC0gMSAvIHZlcnRpY2FsIGJvdHRvbSA9IGhpdCBjb29yZGluYXRlICsxMCBldGMuKVxuICB9XG5cbiAgLyogY29tcHV0ZXIgYXR0YWNrIGxvZ2ljICovXG5cbiAgYXR0YWNrID0gKCkgPT4ge1xuICAgIGxldCBudW07XG4gICAgLyogQSkgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYnV0IHdhcyBvbmx5IGhpdCBvbmNlLCBzbyBpdCBpcyB1bmtub3duIHdoZXRoZXIgaXRzIGhvcml6b250YWwgb3IgdmVydGljYWwgKi9cbiAgICBpZiAodGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBudW0gPSBDb21wdXRlclBsYXllci5yYW5kb21TaWRlQXR0YWNrKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKTtcbiAgICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSB8fCBudW0gPiAxMDAgfHwgbnVtIDwgMSkge1xuICAgICAgICBudW0gPSBDb21wdXRlclBsYXllci5yYW5kb21TaWRlQXR0YWNrKHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzWzBdKTsgLy8gaWYgdGhlIGdlbmVyYXRlZCBudW0gd2FzIGFscmVhZHkgYXR0YWNrZWQsIG9yIGl0J3MgdG9vIGJpZyBvciB0b28gc21hbGwgdG8gYmUgb24gdGhlIGJvYXJkLCBpdCBnZW5lcmF0ZXMgdGhlIG51bSBhZ2FpblxuICAgICAgfVxuICAgIC8qIEIpIGlmIGEgc2hpcCB3YXMgZm91bmQsIGFuZCB3YXMgaGl0IG1vcmUgdGhhbiBvbmNlLCB3aXRoIHRoZSBsYXN0IGF0dGFjayBhbHNvIGJlaW5nIGEgaGl0ICovICBcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMubGVuZ3RoID4gMSAmJlxuICAgICAgdGhpcy5mb3VuZFNoaXAuaGl0ID09PSB0cnVlXG4gICAgKSB7XG4gICAgICAvKiBCKTEuIGlmIHRoZSBlbmQgb2YgdGhlIHNoaXAgd2FzIG5vdCBmb3VuZCAqL1xuICAgICAgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSBmYWxzZSkge1xuICAgICAgICBjb25zdCBuZXdDb29yID1cbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgcHJldkNvb3IgPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICBjb25zdCBjb29yRGlmZiA9IHRoaXMuZm91bmRTaGlwLmRpZmZlcmVuY2U7XG4gICAgICAgIGlmIChuZXdDb29yID4gcHJldkNvb3IpIHtcbiAgICAgICAgICBudW0gPSBuZXdDb29yICsgY29vckRpZmY7XG4gICAgICAgIH0gZWxzZSBpZiAobmV3Q29vciA8IHByZXZDb29yKSB7XG4gICAgICAgICAgbnVtID0gbmV3Q29vciAtIGNvb3JEaWZmO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudW0gPiAxMDAgfHwgbnVtIDwgMSB8fCAhc3VwZXIuaXNOZXcobnVtKSkgeyAvLyBmb3IgZWRnZSBjYXNlcywgYW5kIHNpdHVhdGlvbnMgaW4gd2hpY2ggdGhlIGVuZCB0aWxlIHdhcyBhbHJlYWR5IGF0dGFja2VkXG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuZW5kRm91bmQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9IG5ld0Nvb3I7XG4gICAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAgICAgKGEsIGIpID0+IGEgLSBiXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkgeyBcbiAgICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW1xuICAgICAgICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgXSArIGNvb3JEaWZmO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIGNvb3JEaWZmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgLyogQikyLiBpZiB0aGUgZW5kIG9mIHRoZSBzaGlwIHdhcyBmb3VuZCAqLyAgXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGNvb3JEaWZmID0gdGhpcy5mb3VuZFNoaXAuZGlmZmVyZW5jZTtcbiAgICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAgIChhLCBiKSA9PiBhIC0gYlxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICAgIG51bSA9XG4gICAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1t0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5sZW5ndGggLSAxXSArXG4gICAgICAgICAgICBjb29yRGlmZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudW0gPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSAtIGNvb3JEaWZmO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLyogQykgaWYgYSBzaGlwIHdhcyBmb3VuZCwgYW5kIHdhcyBoaXQgbW9yZSB0aGFuIG9uY2UsIHdpdGggdGhlIGxhc3QgYXR0YWNrIGJlaW5nIGEgbWlzcyAqLyAgXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCA+IDEgJiZcbiAgICAgIHRoaXMuZm91bmRTaGlwLmhpdCA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZEZvdW5kID0gdHJ1ZTtcbiAgICAgIHRoaXMuZm91bmRTaGlwLmVuZCA9XG4gICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgICAgdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXMgPSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlcy5zb3J0KFxuICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICk7XG4gICAgICBpZiAodGhpcy5mb3VuZFNoaXAuZW5kID09PSB0aGlzLmZvdW5kU2hpcC5jb29yZGluYXRlc1swXSkge1xuICAgICAgICBudW0gPVxuICAgICAgICAgIHRoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzW3RoaXMuZm91bmRTaGlwLmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdICtcbiAgICAgICAgICB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnVtID0gdGhpcy5mb3VuZFNoaXAuY29vcmRpbmF0ZXNbMF0gLSB0aGlzLmZvdW5kU2hpcC5kaWZmZXJlbmNlO1xuICAgICAgfVxuICAgIC8qIEQpIHNoaXAgd2FzIG5vdCBmb3VuZCAqLyAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgICAgd2hpbGUgKCFzdXBlci5pc05ldyhudW0pIHx8IG51bSA8IDEpIHtcbiAgICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qIFB1Ymxpc2ggYW5kIEFkZCB0byBhcnIgKi9cbiAgICBzdXBlci5hdHRhY2tBcnIgPSBudW07XG4gICAgdGhpcy5wdWJTdWIucHVibGlzaChudW0pO1xuICAgIHJldHVybiBudW07XG4gIH07XG59XG5cbmZ1bmN0aW9uIGluaXRDb21wUGxheWVyKCkge1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBDb21wdXRlclBsYXllcihjb21wdXRlckF0dGFjayk7XG4gIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyUGxheWVyLmF0dGFjayk7XG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclBsYXllci53YXNBdHRhY2tTdWNjZXNzKTtcbn1cblxuaW5pdEF0dGFja1N0YWdlLnN1YnNjcmliZShpbml0Q29tcFBsYXllcik7XG5cbmV4cG9ydCBkZWZhdWx0IENvbXB1dGVyUGxheWVyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgeyBhdHRhY2tTdGFnZSBhcyBpbml0QXR0YWNrU3RhZ2UgfWZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcblxuIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cbiAgXG4gIGF0dGFjayA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChzdXBlci5pc05ldyh2YWx1ZSkpIHtcbiAgICAgIHN1cGVyLmF0dGFja0FyciA9IHZhbHVlO1xuICAgICAgdGhpcy5wdWJTdWIucHVibGlzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGUgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZFwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbml0UGxheWVyKCkge1xuICBjb25zdCBwbGF5ZXIgPSBuZXcgVXNlclBsYXllcih1c2VyQXR0YWNrKTtcbiAgdXNlckNsaWNrLmF0dGFjay5zdWJzY3JpYmUocGxheWVyLmF0dGFjayk7XG59XG5cbmluaXRBdHRhY2tTdGFnZS5zdWJzY3JpYmUoaW5pdFBsYXllcilcblxuZXhwb3J0IGRlZmF1bHQgVXNlclBsYXllcjtcbiIsIlxuXG5mdW5jdGlvbiBkaXNwbGF5UmFkaW9WYWx1ZShuYW1lKSB7XG4gIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk5hbWUgaGFzIHRvIGJlIGEgc3RyaW5nIVwiKTtcbiAgfVxuICBjb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbbmFtZT1cIiR7bmFtZX1cIl1gKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGlucHV0c1tpXS5jaGVja2VkKSB7XG4gICAgICAgIHJldHVybiBpbnB1dHNbaV0udmFsdWUgXG4gICAgICB9ICAgICAgICAgXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheVJhZGlvVmFsdWUiLCJmdW5jdGlvbiBnZXRSYW5kb21OdW0obWF4KSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbU51bSAiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL2NvbXBvbmVudHMvbGF5b3V0L2xheW91dC0tcGxhY2VtZW50LXN0YWdlXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZVwiXG5cbmluaXQucGxhY2VtZW50U3RhZ2UucHVibGlzaCgpOyJdLCJuYW1lcyI6WyJjcmVhdGVUaWxlIiwiaWQiLCJjYWxsYmFjayIsInRpbGUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJhZGRFdmVudExpc3RlbmVyIiwidGV4dENvbnRlbnQiLCJjcmVhdGVUaWxlcyIsImRpdiIsImkiLCJhcHBlbmRDaGlsZCIsImluaXQiLCJHYW1lQm9hcmRWaWV3IiwiY29uc3RydWN0b3IiLCJzdHJpbmciLCJFcnJvciIsInVwZGF0ZVN1bmsiLCJjb250YWlucyIsInJlcGxhY2UiLCJnZXRTdGF0dXMiLCJvYmoiLCJoaXQiLCJxdWVyeVRpbGUiLCJkYXRhSWQiLCJxdWVyeVNlbGVjdG9yIiwidXBkYXRlU3Vua1RpbGVzIiwidGlsZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsImhhbmRsZUF0dGFja1ZpZXciLCJzdW5rIiwiZ2FtZW92ZXIiLCJwdWJsaXNoIiwiR2FtZUJvYXJkIiwicHViU3ViIiwic2hpcHNBcnIiLCJtaXNzZWRBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZCIsImluY2x1ZGVzIiwiY2FsY01heCIsImRpcmVjdGlvbiIsInRpbGVOdW0iLCJtYXgiLCJ0b1N0cmluZyIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJsZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1Rha2VuIiwiY29vcmRpbmF0ZXMiLCJ5IiwiaXNOZWlnaGJvcmluZyIsImNvb3JkaW5hdGVzQWxsTmVpZ2hib3JzIiwibWFwIiwiY29vciIsImhhbmRsZUF0dGFjayIsIm51bSIsImlzU3VuayIsImlzT3ZlciIsImNoZWNrIiwiZXZlcnkiLCJzaGlwIiwiUGxheWVyIiwicHJldmlvdXNBdHRhY2tzIiwiYXR0YWNrQXJyIiwiaXNOZXciLCJQdWJTdWIiLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInN1YnNjcmliZXIiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJTaGlwIiwiY3JlYXRlQ29vckFyciIsInRpbWVzSGl0IiwiYXJyIiwiYXR0YWNrU3RhZ2UiLCJpbml0QXR0YWNrU3RhZ2UiLCJpbml0R2FtZW92ZXIiLCJhdHRhY2siLCJ1c2VyQ2xpY2tBdHRhY2siLCJnYW1lQm9hcmREaXZDb21wdXRlciIsImhpZGVGb3JtIiwiZm9ybSIsInNob3dDb21wQm9hcmQiLCJjb21wQm9hcmQiLCJyZW1vdmUiLCJwdWJsaXNoRGF0YUlkIiwiZGF0YXNldCIsImluaXRBdHRhY2tTdGFnZVRpbGVzIiwiY3JlYXRlTmV3R2FtZUJ0biIsImJ0biIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVsb2FkIiwiY3JlYXRlR2FtZU92ZXJBbGVydCIsImgxIiwiaDMiLCJzaG93R2FtZU92ZXIiLCJtYWluIiwibm90aWZpY2F0aW9uIiwicGxhY2VtZW50U3RhZ2UiLCJpbml0UGxhY2VtZW50U3RhZ2UiLCJ1c2VyQ2xpY2siLCJoaWRlQ29tcEJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImFkZElucHV0TGlzdGVuZXJzIiwiZm9ybUlucHV0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbnB1dCIsImFkZEJ0bkxpc3RlbmVyIiwicGxhY2VTaGlwQnRuIiwic2hpcFBsYWNlQnRuIiwicGlja1BsYWNlbWVudCIsImNyZWF0ZVBsYWNlbWVudFRpbGVzIiwiZ2FtZUJvYXJkRGl2VXNlciIsInJlbW92ZUV2ZW50TGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbXB1dGVyQXR0YWNrIiwiaGFuZGxlQ29tcHV0ZXJBdHRhY2siLCJ1c2VyQXR0YWNrIiwiaGFuZGxlVXNlckF0dGFjayIsInNoaXBJbmZvIiwidmFsaWRpdHlWaWV3cyIsImNyZWF0ZVNoaXAiLCJjcmVhdGVTaGlwVmlldyIsIlNoaXBJbmZvIiwiQ29tcHV0ZXJHYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJpbml0Q29tcEdCIiwiY29tcHV0ZXIiLCJjb21wdXRlclZpZXciLCJnZXRSYW5kb21OdW0iLCJnZXRSYW5kb21EaXJlY3Rpb24iLCJnZXRSYW5kb21UaWxlTnVtIiwiVXNlckdhbWVCb2FyZCIsImlzVmFsaWQiLCJ2YWxpZCIsInB1Ymxpc2hWYWxpZGl0eSIsInB1Ymxpc2hQbGFjZVNoaXAiLCJpbml0VXNlckdCIiwidXNlckJvYXJkIiwiaW5pdEhhbmRsZUF0dGFjayIsIkdhbWVCb2FyZFVzZXJWaWV3IiwiaGlkZVJhZGlvIiwicmFkaW9JbnB1dCIsInJhZGlvTGFiZWwiLCJuZXh0U2hpcENoZWNrZWQiLCJyYWRpbyIsImNoZWNrZWQiLCJjbGVhclZhbGlkaXR5VmlldyIsInJlbW92ZUF0dHJpYnV0ZSIsImhhbmRsZVBsYWNlbWVudFZhbGlkaXR5VmlldyIsImNvb3JkaW5hdGUiLCJoYW5kbGVQbGFjZW1lbnRWaWV3IiwidXNlciIsInVzZXJWaWV3IiwiU2hpcEluZm9Vc2VyIiwiZGlzcGxheVJhZGlvVmFsdWUiLCJzaGlwUGxhY2VtZW50IiwidXBkYXRlTnVtIiwicmVzZXROdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwiaXNDb21wbGV0ZSIsIk9iamVjdCIsInZhbHVlcyIsInVuZGVmaW5lZCIsImJpbmQiLCJDb21wdXRlclBsYXllciIsImZvdW5kU2hpcCIsImZvdW5kIiwiZGlmZmVyZW5jZSIsImVuZEZvdW5kIiwiZW5kIiwid2FzQXR0YWNrU3VjY2VzcyIsIk1hdGgiLCJhYnMiLCJyYW5kb21TaWRlQXR0YWNrIiwic2lkZXMiLCJvcGVyYXRvcnMiLCJzaWduIiwibWV0aG9kIiwiYSIsImIiLCJmbG9vciIsInJhbmRvbSIsIm5ld0Nvb3IiLCJwcmV2Q29vciIsImNvb3JEaWZmIiwic29ydCIsImluaXRDb21wUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJVc2VyUGxheWVyIiwiaW5pdFBsYXllciIsInBsYXllciIsIm5hbWUiLCJpbnB1dHMiXSwic291cmNlUm9vdCI6IiJ9