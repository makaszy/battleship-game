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

/***/ "./src/components/common/create-tiles/create-tiles.js":
/*!************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tiles.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _create_tile_create_single_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-tile/create-single-tile */ "./src/components/common/create-tiles/create-tile/create-single-tile.js");

function createTiles(div) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild((0,_create_tile_create_single_tile__WEBPACK_IMPORTED_MODULE_0__["default"])(i));
  }
}
/* harmony default export */ __webpack_exports__["default"] = (createTiles);

/***/ }),

/***/ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js":
/*!********************************************************************************!*\
  !*** ./src/components/common/gameboard-view-updater/gameboard-view-updater.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
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
    console.log("handleAttack");
    if (obj.sunk) {
      this.updateSunkTiles(obj);
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

  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */

  handleAttack = num => {
    console.log("pushed");
    for (let y = 0; y < this.ships.length; y += 1) {
      if (this.ships[y].coordinates.includes(+num)) {
        this.ships[y].hit();
        if (this.ships[y].isSunk()) {
          return this.pubSub.publish(Object.assign(this.isOver(), {
            tiles: this.ships[y].coordinates
          }));
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

  isOver() {
    return this.ships.every(ship => ship.sunk === true) ? {
      hit: true,
      sunk: true,
      gameover: true
    } : {
      hit: true,
      sunk: true
    };
  }
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

/***/ "./src/components/common/publish-data-id/get-data-id.js":
/*!**************************************************************!*\
  !*** ./src/components/common/publish-data-id/get-data-id.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");

function publishDataId() {
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_0__.userClick.publish(this.dataset.id);
}
/* harmony default export */ __webpack_exports__["default"] = (publishDataId);

/***/ }),

/***/ "./src/components/common/ship/create-coordinates-arr/create-coor-arr.js":
/*!******************************************************************************!*\
  !*** ./src/components/common/ship/create-coordinates-arr/create-coor-arr.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* Creates a coordinate arr for a ship object's coordinates property from shipInfo object */

function createCoorArr(obj) {
  const arr = [obj.tileNum];
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
    this.length = obj.length;
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
/* harmony import */ var _pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pub-subs/initialize */ "./src/components/pub-subs/initialize.js");
/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ "./src/components/common/create-tiles/create-event-tiles.js");
/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ "./src/components/common/create-tiles/create-tiles.js");
/* harmony import */ var _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/publish-data-id/get-data-id */ "./src/components/common/publish-data-id/get-data-id.js");
/* harmony import */ var _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../views/player--user/player--user */ "./src/components/views/player--user/player--user.js");
/* harmony import */ var _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../pub-subs/attack--user */ "./src/components/pub-subs/attack--user.js");
/* harmony import */ var _views_player_computer_player_computer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../views/player--computer/player--computer */ "./src/components/views/player--computer/player--computer.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ "./src/components/views/gameboard--user/gameboard--user.js");












const gameBoardDivUser = document.querySelector(".gameboard--user");
const gameBoardDivComputer = document.querySelector(".gameboard--computer");
(0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_5__["default"])(gameBoardDivUser);
(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_4__["default"])(gameBoardDivComputer, _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_6__["default"]);
const computerPlayer = new _views_player_computer_player_computer__WEBPACK_IMPORTED_MODULE_9__["default"](_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_10__.computerAttack);
_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_8__.userAttack.subscribe(computerPlayer.attack);
const userBoard = new _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_11__["default"](_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_10__.handleComputerAttack);
_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_10__.computerAttack.subscribe(userBoard.handleAttack);
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.initUserPlayer.publish();
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.initComputerGameboard.publish(true);

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
/* harmony export */   userAttack: function() { return /* binding */ userAttack; },
/* harmony export */   userClick: function() { return /* binding */ userClick; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const userClick = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const userAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const handleUserAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


/***/ }),

/***/ "./src/components/pub-subs/initialize.js":
/*!***********************************************!*\
  !*** ./src/components/pub-subs/initialize.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initComputerGameboard: function() { return /* binding */ initComputerGameboard; },
/* harmony export */   initUserPlayer: function() { return /* binding */ initUserPlayer; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const initComputerGameboard = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const initUserPlayer = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


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
function initCompGB(value) {
  if (value === true) {
    const computerBoard = new ComputerGameBoard(_pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.handleUserAttack);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    computerBoard.placeShip(1);
    _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_3__.userAttack.subscribe(computerBoard.handleAttack);
  }
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_4__.initComputerGameboard.subscribe(initCompGB);

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
    return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length));
  }
  return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11 - length).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__["default"])(11));
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


class UserGameBoard extends _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /* Calculates the max acceptable tile for a ship depending on its start (tileNum).
  for ex. If a ship is placed horizontally on tile 21 max would be 30  */

  static calcMax(obj) {
    if (obj.direction === "horizontal" && obj.tileNum > 10) {
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

  /* Checks if a ships coordinates are taken, if not places ship in shipsArr, otherwise returns false */

  placeShip(obj) {
    const ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__["default"](obj);
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {
      return Error("Ship couldn't be placed there");
    }
    this.ships = ship;
    return "Ship Placed";
  }
}
/* harmony default export */ __webpack_exports__["default"] = (UserGameBoard);

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard-views--user.js":
/*!***********************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard-views--user.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");


const user = "user";
const userViewUpdater = new _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__["default"](user);
_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__.handleComputerAttack.subscribe(userViewUpdater.handleAttackView);
/* harmony default export */ __webpack_exports__["default"] = (userViewUpdater);

/***/ }),

/***/ "./src/components/views/player--computer/player--computer.js":
/*!*******************************************************************!*\
  !*** ./src/components/views/player--computer/player--computer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ "./src/components/common/player/player.js");
/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/get-random-num */ "./src/utils/get-random-num.js");


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
  _pub_subs_attack_user__WEBPACK_IMPORTED_MODULE_2__.userClick.subscribe(player.attack);
}
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_1__.initUserPlayer.subscribe(initPlayer);
/* harmony default export */ __webpack_exports__["default"] = (UserPlayer);

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
/* harmony import */ var _components_layout_layout_attack_stage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/layout/layout--attack-stage */ "./src/components/layout/layout--attack-stage.js");

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLElBQUk2QixLQUFLLENBQUMsZ0NBQWdDLENBQUM7RUFDbkQsQ0FBQztBQUNIO0FBRUEsU0FBU2dELFVBQVVBLENBQUEsRUFBRztFQUNwQixNQUFNQyxNQUFNLEdBQUcsSUFBSUYsVUFBVSxDQUFDL0IsNkRBQVUsQ0FBQztFQUN6Q1gsNERBQVMsQ0FBQ1AsU0FBUyxDQUFDbUQsTUFBTSxDQUFDekIsTUFBTSxDQUFDO0FBQ3BDO0FBRUFULGdFQUFjLENBQUNqQixTQUFTLENBQUNrRCxVQUFVLENBQUM7QUFFcEMsK0RBQWVELFVBQVU7Ozs7Ozs7Ozs7O0FDM0J6QixTQUFTWixZQUFZQSxDQUFDSyxHQUFHLEVBQUU7RUFDekIsT0FBT1UsSUFBSSxDQUFDQyxLQUFLLENBQUNELElBQUksQ0FBQ0UsTUFBTSxDQUFDLENBQUMsR0FBR1osR0FBRyxDQUFDO0FBQ3hDO0FBRUEsK0RBQWVMLFlBQVk7Ozs7OztVQ0ozQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBLDhDQUE4Qzs7Ozs7V0NBOUM7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2dhbWVib2FyZC12aWV3LXVwZGF0ZXIvZ2FtZWJvYXJkLXZpZXctdXBkYXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcGxheWVyL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHViLXN1Yi9wdWItc3ViLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWJsaXNoLWRhdGEtaWQvZ2V0LWRhdGEtaWQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvY3JlYXRlLWNvb3JkaW5hdGVzLWFyci9jcmVhdGUtY29vci1hcnIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3NoaXAvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1hdHRhY2stc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvaW5pdGlhbGl6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL2dhbWVib2FyZC0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9nYW1lYm9hcmRfX3ZpZXdzLS1jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLWNvbXB1dGVyL3NoaXAtaW5mby9nZXQtcmFuZG9tLXRpbGUtbnVtL2dldC1yYW5kb20tdGlsZS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS1jb21wdXRlci9zaGlwLWluZm8vc2hpcC1pbmZvLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9wbGF5ZXItLWNvbXB1dGVyL3BsYXllci0tY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvcGxheWVyLS11c2VyL3BsYXllci0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZ2V0LXJhbmRvbS1udW0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSBmcm9tIFwiLi9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlRXZlbnRUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudFRpbGVzO1xuIiwiaW1wb3J0IGNyZWF0ZVNpbmdsZVRpbGUgZnJvbSBcIi4vY3JlYXRlLXNpbmdsZS10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGNyZWF0ZVNpbmdsZVRpbGUoaWQpO1xuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJmdW5jdGlvbiBjcmVhdGVTaW5nbGVUaWxlKGlkKSB7XG4gIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBpZClcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZVRpbGU7IiwiaW1wb3J0IGNyZWF0ZVNpbmdsZVRpbGUgZnJvbSBcIi4vY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVRpbGVzKGRpdikge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVTaW5nbGVUaWxlKGkpKSA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlVGlsZXMiLCJjbGFzcyBHYW1lQm9hcmRWaWV3VXBkYXRlciB7XG4gIGNvbnN0cnVjdG9yKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIHVwZGF0ZVN1bmsodGlsZSkge1xuICAgIGlmICh0aWxlLmNsYXNzTGlzdC5jb250YWlucyhcImhpdFwiKSkge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVwbGFjZShcImhpdFwiLCBcInN1bmtcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LmFkZChcInN1bmtcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldFN0YXR1cyhvYmopIHtcbiAgICByZXR1cm4gb2JqLmhpdCA/IFwiaGl0XCIgOiBcIm1pc3NcIjtcbiAgfVxuXG4gIHVwZGF0ZVN1bmtUaWxlcyhvYmopIHtcbiAgICBvYmoudGlsZXMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgY29uc3QgdGlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuZ2FtZWJvYXJkLS0ke3RoaXMuc3RyaW5nfSBbZGF0YS1pZD1cIiR7ZWxlbWVudH1cIl1gXG4gICAgICApO1xuICAgICAgR2FtZUJvYXJkVmlld1VwZGF0ZXIudXBkYXRlU3Vuayh0aWxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUF0dGFja1ZpZXcgPSAob2JqKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJoYW5kbGVBdHRhY2tcIilcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke29iai50aWxlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlld1VwZGF0ZXIuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3VXBkYXRlcjtcbiIsImNsYXNzIEdhbWVCb2FyZCB7XG5cbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBzaGlwc0FyciA9IFtdO1xuXG4gIGdldCBzaGlwcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwc0FycjtcbiAgfVxuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBDaGVja3MgaWYgY29vcmRpbmF0ZXMgYWxyZWFkeSBoYXZlIGEgc2hpcCBvbiB0aGVtICovXG5cbiAgaXNUYWtlbihjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIG51bSBzZWxlY3RlZCBieSBwbGF5ZXIgaGFzIGEgc2hpcCwgaWYgaGl0IGNoZWNrcyBpZiBzaGlwIGlzIHN1bmssIGlmIHN1bmsgY2hlY2tzIGlmIGdhbWUgaXMgb3ZlciAgKi9cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJwdXNoZWRcIik7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKE9iamVjdC5hc3NpZ24odGhpcy5pc092ZXIoKSwge1xuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKG51bSk7XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogQ2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpXG4gICAgICA/IHsgaGl0OiB0cnVlLCBzdW5rOiB0cnVlLCBnYW1lb3ZlcjogdHJ1ZSB9XG4gICAgICA6IHsgaGl0OiB0cnVlLCBzdW5rOiB0cnVlIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiY2xhc3MgUGxheWVyIHtcblxuICBwcmV2aW91c0F0dGFja3MgPSBbXVxuICBcbiAgZ2V0IGF0dGFja0FycigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c0F0dGFja3M7XG4gIH1cblxuICBzZXQgYXR0YWNrQXJyKHZhbHVlKSB7XG4gICAgdGhpcy5wcmV2aW91c0F0dGFja3MucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBpc05ldyh2YWx1ZSkge1xuICAgIHJldHVybiAhdGhpcy5hdHRhY2tBcnIuaW5jbHVkZXModmFsdWUpO1xuICB9XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsImltcG9ydCB7IHVzZXJDbGljayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLXVzZXJcIlxuXG5mdW5jdGlvbiBwdWJsaXNoRGF0YUlkKCkge1xuICB1c2VyQ2xpY2sucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwdWJsaXNoRGF0YUlkO1xuIiwiXG4vKiBDcmVhdGVzIGEgY29vcmRpbmF0ZSBhcnIgZm9yIGEgc2hpcCBvYmplY3QncyBjb29yZGluYXRlcyBwcm9wZXJ0eSBmcm9tIHNoaXBJbmZvIG9iamVjdCAqL1xuXG5mdW5jdGlvbiBjcmVhdGVDb29yQXJyKG9iaikge1xuICBjb25zdCBhcnIgPSBbb2JqLnRpbGVOdW1dXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxMCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvb3JBcnI7XG4iLCJpbXBvcnQgY3JlYXRlQ29vckFyciBmcm9tIFwiLi9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyclwiO1xuXG4vKiBDcmVhdGVzIHNoaXAgb2JqZWN0IGZyb20gc2hpcEluZm8gb2JqZWN0ICovXG5cbmNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICB0aGlzLmxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkX192aWV3cy0tY29tcHV0ZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tY29tcHV0ZXIvZ2FtZWJvYXJkLS1jb21wdXRlclwiO1xuXG5pbXBvcnQge2luaXRDb21wdXRlckdhbWVib2FyZCwgaW5pdFVzZXJQbGF5ZXIgfSBmcm9tIFwiLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5pbXBvcnQgY3JlYXRlRXZlbnRUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXNcIjtcbmltcG9ydCBjcmVhdGVUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZXNcIjtcbmltcG9ydCBwdWJsaXNoRGF0YUlkIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kYXRhLWlkL2dldC1kYXRhLWlkXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9wbGF5ZXItLXVzZXIvcGxheWVyLS11c2VyXCI7XG5pbXBvcnQgeyB1c2VyQ2xpY2ssIHVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCI7XG5pbXBvcnQgQ29tcHV0ZXJQbGF5ZXIgZnJvbSBcIi4uL3ZpZXdzL3BsYXllci0tY29tcHV0ZXIvcGxheWVyLS1jb21wdXRlclwiO1xuaW1wb3J0IHtcbiAgY29tcHV0ZXJBdHRhY2ssXG4gIGhhbmRsZUNvbXB1dGVyQXR0YWNrLFxufSBmcm9tIFwiLi4vcHViLXN1YnMvYXR0YWNrLS1jb21wdXRlclwiO1xuaW1wb3J0IFVzZXJHYW1lQm9hcmQgZnJvbSBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcblxuY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuY29uc3QgZ2FtZUJvYXJkRGl2Q29tcHV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tY29tcHV0ZXJcIik7XG5cbmNyZWF0ZVRpbGVzKGdhbWVCb2FyZERpdlVzZXIpO1xuXG5jcmVhdGVFdmVudFRpbGVzKGdhbWVCb2FyZERpdkNvbXB1dGVyLCBwdWJsaXNoRGF0YUlkKTtcblxuXG5jb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBDb21wdXRlclBsYXllcihjb21wdXRlckF0dGFjayk7XG51c2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclBsYXllci5hdHRhY2spO1xuXG5jb25zdCB1c2VyQm9hcmQgPSBuZXcgVXNlckdhbWVCb2FyZChoYW5kbGVDb21wdXRlckF0dGFjayk7XG5jb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG5cbmluaXRVc2VyUGxheWVyLnB1Ymxpc2goKVxuaW5pdENvbXB1dGVyR2FtZWJvYXJkLnB1Ymxpc2godHJ1ZSk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCB1c2VyQ2xpY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGhhbmRsZVVzZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7IHVzZXJBdHRhY2ssIGhhbmRsZVVzZXJBdHRhY2ssIHVzZXJDbGljayB9O1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBpbml0Q29tcHV0ZXJHYW1lYm9hcmQgPSBuZXcgUHViU3ViKCk7XG5jb25zdCBpbml0VXNlclBsYXllciA9IG5ldyBQdWJTdWIoKTtcblxuXG5cbmV4cG9ydCB7aW5pdFVzZXJQbGF5ZXIsIGluaXRDb21wdXRlckdhbWVib2FyZH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCBTaGlwSW5mbyBmcm9tIFwiLi9zaGlwLWluZm8vc2hpcC1pbmZvXCI7XG5pbXBvcnQgeyB1c2VyQXR0YWNrLCBoYW5kbGVVc2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuaW1wb3J0IHtpbml0Q29tcHV0ZXJHYW1lYm9hcmQsIH1mcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuXG5cbmNsYXNzIENvbXB1dGVyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcbiAgLyogUmVjcmVhdGVzIGEgcmFuZG9tIHNoaXAsIHVudGlsIGl0cyBjb29yZGluYXRlcyBhcmUgbm90IHRha2VuLiAqL1xuXG4gIHBsYWNlU2hpcChsZW5ndGgpIHtcbiAgICBsZXQgc2hpcEluZm8gPSBuZXcgU2hpcEluZm8obGVuZ3RoKTtcbiAgICBsZXQgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB3aGlsZSAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpKSB7XG4gICAgICBzaGlwSW5mbyA9IG5ldyBTaGlwSW5mbyhsZW5ndGgpO1xuICAgICAgc2hpcCA9IG5ldyBTaGlwKHNoaXBJbmZvKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdENvbXBHQih2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IHRydWUpIHtcbiAgICBjb25zdCBjb21wdXRlckJvYXJkID0gbmV3IENvbXB1dGVyR2FtZUJvYXJkKGhhbmRsZVVzZXJBdHRhY2spO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDEpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDEpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDEpO1xuICAgIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDEpO1xuICAgIHVzZXJBdHRhY2suc3Vic2NyaWJlKGNvbXB1dGVyQm9hcmQuaGFuZGxlQXR0YWNrKTtcbiAgfVxufVxuXG5pbml0Q29tcHV0ZXJHYW1lYm9hcmQuc3Vic2NyaWJlKGluaXRDb21wR0IpO1xuXG4iLCJpbXBvcnQgR2FtZUJvYXJkVmlld1VwZGF0ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQtdmlldy11cGRhdGVyL2dhbWVib2FyZC12aWV3LXVwZGF0ZXJcIjtcbmltcG9ydCB7IGhhbmRsZVVzZXJBdHRhY2sgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvYXR0YWNrLS11c2VyXCJcblxuY29uc3QgY29tcHV0ZXIgPSBcImNvbXB1dGVyXCI7XG5cbmNvbnN0IGNvbXB1dGVyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVmlld1VwZGF0ZXIoY29tcHV0ZXIpO1xuXG5oYW5kbGVVc2VyQXR0YWNrLnN1YnNjcmliZShjb21wdXRlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xuXG5leHBvcnQgZGVmYXVsdCBjb21wdXRlclZpZXdVcGRhdGVyO1xuIiwiaW1wb3J0IGdldFJhbmRvbU51bSBmcm9tIFwiLi4vLi4vLi4vLi4vLi4vdXRpbHMvZ2V0LXJhbmRvbS1udW1cIjtcblxuZnVuY3Rpb24gZ2V0UmFuZG9tRGlyZWN0aW9uKCkge1xuICByZXR1cm4gZ2V0UmFuZG9tTnVtKDIpID09PSAxID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFJhbmRvbURpcmVjdGlvbjtcbiIsImltcG9ydCBnZXRSYW5kb21OdW0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL2dldC1yYW5kb20tbnVtXCI7XG5cbi8qIENyZWF0ZSBhIHJhbmRvbSB0aWxlTnVtICovXG5cbmZ1bmN0aW9uIGdldFJhbmRvbVRpbGVOdW0obGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTEgLSBsZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gKyhnZXRSYW5kb21OdW0oMTEgLSBsZW5ndGgpLnRvU3RyaW5nKCkgKyBnZXRSYW5kb21OdW0oMTEpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmFuZG9tVGlsZU51bTtcbiIsIlxuaW1wb3J0IGdldFJhbmRvbURpcmVjdGlvbiBmcm9tIFwiLi9nZXQtcmFuZG9tLWRpcmVjdGlvbi9nZXQtcmFuZG9tLWRpcmVjdGlvblwiO1xuaW1wb3J0IGdldFJhbmRvbVRpbGVOdW0gZnJvbSBcIi4vZ2V0LXJhbmRvbS10aWxlLW51bS9nZXQtcmFuZG9tLXRpbGUtbnVtXCI7XG5cbmNsYXNzIFNoaXBJbmZvIHtcbiAgXG4gIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZ2V0UmFuZG9tRGlyZWN0aW9uKCk7XG4gICAgdGhpcy50aWxlTnVtID0gZ2V0UmFuZG9tVGlsZU51bSh0aGlzLmxlbmd0aCwgdGhpcy5kaXJlY3Rpb24pO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm87XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcblxuY2xhc3MgVXNlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIGEgc2hpcHMgY29vcmRpbmF0ZXMgYXJlIHRha2VuLCBpZiBub3QgcGxhY2VzIHNoaXAgaW4gc2hpcHNBcnIsIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlICovXG5cbiAgcGxhY2VTaGlwKG9iaikge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIGlmICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5jb25zdHJ1Y3Rvci5pc1Rvb0JpZyhvYmopKSB7XG4gICAgICByZXR1cm4gRXJyb3IoXCJTaGlwIGNvdWxkbid0IGJlIHBsYWNlZCB0aGVyZVwiKTtcbiAgICB9XG4gICAgdGhpcy5zaGlwcyA9IHNoaXA7XG4gICAgcmV0dXJuIFwiU2hpcCBQbGFjZWRcIjtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyR2FtZUJvYXJkO1xuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCJcblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVmlld1VwZGF0ZXIodXNlcik7XG5cbmhhbmRsZUNvbXB1dGVyQXR0YWNrLnN1YnNjcmliZSh1c2VyVmlld1VwZGF0ZXIuaGFuZGxlQXR0YWNrVmlldyk7XG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJWaWV3VXBkYXRlcjtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uLy4uL2NvbW1vbi9wbGF5ZXIvcGxheWVyXCI7XG5pbXBvcnQgZ2V0UmFuZG9tTnVtIGZyb20gXCIuLi8uLi8uLi91dGlscy9nZXQtcmFuZG9tLW51bVwiO1xuXG5jbGFzcyBDb21wdXRlclBsYXllciBleHRlbmRzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBhdHRhY2sgPSAoKSA9PiB7XG4gICAgbGV0IG51bSA9IGdldFJhbmRvbU51bSgxMDEpO1xuICAgIHdoaWxlICghc3VwZXIuaXNOZXcobnVtKSkge1xuICAgICAgbnVtID0gZ2V0UmFuZG9tTnVtKDEwMSk7XG4gICAgfVxuICAgIHN1cGVyLmF0dGFja0FyciA9IG51bTtcbiAgICB0aGlzLnB1YlN1Yi5wdWJsaXNoKG51bSlcbiAgICByZXR1cm4gbnVtXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcHV0ZXJQbGF5ZXI7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi8uLi9jb21tb24vcGxheWVyL3BsYXllclwiO1xuaW1wb3J0IHsgaW5pdFVzZXJQbGF5ZXIgfSBmcm9tIFwiLi4vLi4vcHViLXN1YnMvaW5pdGlhbGl6ZVwiO1xuaW1wb3J0IHsgdXNlckNsaWNrLCB1c2VyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tdXNlclwiO1xuXG5jbGFzcyBVc2VyUGxheWVyIGV4dGVuZHMgUGxheWVyIHtcbiBjb25zdHJ1Y3RvcihwdWJTdWIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG4gIFxuICBhdHRhY2sgPSAodmFsdWUpID0+IHtcbiAgICBpZiAoc3VwZXIuaXNOZXcodmFsdWUpKSB7XG4gICAgICBzdXBlci5hdHRhY2tBcnIgPSB2YWx1ZTtcbiAgICAgIHRoaXMucHViU3ViLnB1Ymxpc2godmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIGhhcyBhbHJlYWR5IGJlZW4gYXR0YWNrZWRcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFBsYXllcigpIHtcbiAgY29uc3QgcGxheWVyID0gbmV3IFVzZXJQbGF5ZXIodXNlckF0dGFjayk7XG4gIHVzZXJDbGljay5zdWJzY3JpYmUocGxheWVyLmF0dGFjayk7XG59XG5cbmluaXRVc2VyUGxheWVyLnN1YnNjcmliZShpbml0UGxheWVyKVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyUGxheWVyO1xuIiwiZnVuY3Rpb24gZ2V0UmFuZG9tTnVtKG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KVxufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSYW5kb21OdW0gIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07Il0sIm5hbWVzIjpbImNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImNyZWF0ZUV2ZW50VGlsZXMiLCJkaXYiLCJjYWxsYmFjayIsImkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVNpbmdsZVRpbGUiLCJpZCIsInRpbGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwiY3JlYXRlVGlsZXMiLCJHYW1lQm9hcmRWaWV3VXBkYXRlciIsImNvbnN0cnVjdG9yIiwic3RyaW5nIiwidXBkYXRlU3VuayIsImNvbnRhaW5zIiwicmVwbGFjZSIsImdldFN0YXR1cyIsIm9iaiIsImhpdCIsInVwZGF0ZVN1bmtUaWxlcyIsInRpbGVzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiaGFuZGxlQXR0YWNrVmlldyIsImNvbnNvbGUiLCJsb2ciLCJzdW5rIiwiR2FtZUJvYXJkIiwicHViU3ViIiwic2hpcHNBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZEFyciIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInkiLCJpbmNsdWRlcyIsImhhbmRsZUF0dGFjayIsIm51bSIsImlzU3VuayIsInB1Ymxpc2giLCJPYmplY3QiLCJhc3NpZ24iLCJpc092ZXIiLCJldmVyeSIsInNoaXAiLCJnYW1lb3ZlciIsIlBsYXllciIsInByZXZpb3VzQXR0YWNrcyIsImF0dGFja0FyciIsImlzTmV3IiwiUHViU3ViIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJ1bnN1YnNjcmliZSIsImZpbHRlciIsInN1YiIsInBheWxvYWQiLCJ1c2VyQ2xpY2siLCJwdWJsaXNoRGF0YUlkIiwiZGF0YXNldCIsImNyZWF0ZUNvb3JBcnIiLCJhcnIiLCJ0aWxlTnVtIiwiZGlyZWN0aW9uIiwiU2hpcCIsInRpbWVzSGl0IiwiaW5pdENvbXB1dGVyR2FtZWJvYXJkIiwiaW5pdFVzZXJQbGF5ZXIiLCJ1c2VyQXR0YWNrIiwiQ29tcHV0ZXJQbGF5ZXIiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwiVXNlckdhbWVCb2FyZCIsImdhbWVCb2FyZERpdlVzZXIiLCJnYW1lQm9hcmREaXZDb21wdXRlciIsImNvbXB1dGVyUGxheWVyIiwiYXR0YWNrIiwidXNlckJvYXJkIiwiaGFuZGxlVXNlckF0dGFjayIsIlNoaXBJbmZvIiwiQ29tcHV0ZXJHYW1lQm9hcmQiLCJwbGFjZVNoaXAiLCJzaGlwSW5mbyIsImluaXRDb21wR0IiLCJjb21wdXRlckJvYXJkIiwiY29tcHV0ZXIiLCJjb21wdXRlclZpZXdVcGRhdGVyIiwiZ2V0UmFuZG9tTnVtIiwiZ2V0UmFuZG9tRGlyZWN0aW9uIiwiZ2V0UmFuZG9tVGlsZU51bSIsInRvU3RyaW5nIiwiY2FsY01heCIsIm1heCIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJ1c2VyIiwidXNlclZpZXdVcGRhdGVyIiwiVXNlclBsYXllciIsImluaXRQbGF5ZXIiLCJwbGF5ZXIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iXSwic291cmNlUm9vdCI6IiJ9