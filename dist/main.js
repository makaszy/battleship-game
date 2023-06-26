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
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; }
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

/***/ "./src/components/layout/layout--placement-stage.js":
/*!**********************************************************!*\
  !*** ./src/components/layout/layout--placement-stage.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ "./src/components/common/create-tiles/create-event-tiles.js");
/* harmony import */ var _views_gameboard_user_ship_info_views_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/ship-info__views--user */ "./src/components/views/gameboard--user/ship-info__views--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ "./src/components/views/gameboard--user/gameboard--user.js");
/* harmony import */ var _views_gameboard_user_gameboard_views_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/gameboard--user/gameboard-views--user */ "./src/components/views/gameboard--user/gameboard-views--user.js");
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");





const gameBoardDivUser = document.querySelector(".gameboard--user");
const inputs = document.querySelectorAll(".placement-form__input");
inputs.forEach(input => {
  input.addEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.alertShipInfoChanges);
});
(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_4__.pickPlacement);

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

/***/ "./src/components/pub-subs/events.js":
/*!*******************************************!*\
  !*** ./src/components/pub-subs/events.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attack: function() { return /* binding */ attack; },
/* harmony export */   input: function() { return /* binding */ input; },
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; },
/* harmony export */   shipInfo: function() { return /* binding */ shipInfo; },
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

/* Files are imported * as userClick */



/***/ }),

/***/ "./src/components/pub-subs/initialize.js":
/*!***********************************************!*\
  !*** ./src/components/pub-subs/initialize.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerGameboard: function() { return /* binding */ computerGameboard; },
/* harmony export */   computerPlayer: function() { return /* binding */ computerPlayer; },
/* harmony export */   userGameBoard: function() { return /* binding */ userGameBoard; },
/* harmony export */   userPlayer: function() { return /* binding */ userPlayer; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const computerGameboard = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const userPlayer = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const computerPlayer = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const userGameBoard = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();


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
    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {
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
    console.log("yeaah");
    console.log(this.isValid(obj));
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.validityViews.publish(this.isValid(obj));
  };

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
function initUserBoard() {
  const userBoard = new UserGameBoard(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.handleComputerAttack);
  _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.computerAttack.subscribe(userBoard.handleAttack);
}
function initPlacementBoard() {
  const userPlacementBoard = new UserGameBoard(_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_2__.handleComputerAttack);
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_4__.shipInfo.subscribe(userPlacementBoard.publishValidity);
}
initPlacementBoard();
_pub_subs_initialize__WEBPACK_IMPORTED_MODULE_3__.userGameBoard.subscribe(initUserBoard);

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard-views--user.js":
/*!***********************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard-views--user.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js");
/* harmony import */ var _pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pub-subs/attack--computer */ "./src/components/pub-subs/attack--computer.js");
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");



class GameBoardUserViewUpdater extends _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__["default"] {
  static clearValidityView() {
    const tiles = document.querySelectorAll(".gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove("placement--valid");
      tile.classList.remove("placement--invalid");
    });
  }

  /* adds the visual class placement--valid/or placement--invalid based on the tileNum chosen by the user */

  handlePlacementValidityView = obj => {
    this.constructor.clearValidityView();
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(`.gameboard--${this.string} [data-id="${coordinate}"]`);
      obj.valid ? tile.classList.add("placement--valid") : tile.classList.add("placement--invalid");
    });
  };
}
const user = "user";
const userViewUpdater = new GameBoardUserViewUpdater(user);
_pub_subs_attack_computer__WEBPACK_IMPORTED_MODULE_1__.handleComputerAttack.subscribe(userViewUpdater.handleAttackView);
_pub_subs_events__WEBPACK_IMPORTED_MODULE_2__.validityViews.subscribe(userViewUpdater.handlePlacementValidityView);
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
  }
};
function createShipInfo() {
  console.log("shipcreatedRun");
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
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.shipPlaceBtn.publish(shipInfo);
}
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.input.subscribe(publishShipInfoCheck);

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

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRTtJQUN2QyxJQUFJMkUsTUFBTSxDQUFDM0UsQ0FBQyxDQUFDLENBQUN5SCxPQUFPLEVBQUU7TUFDckIsT0FBTzlDLE1BQU0sQ0FBQzNFLENBQUMsQ0FBQyxDQUFDK0IsS0FBSztJQUN4QjtFQUNKO0FBQ0Y7QUFFQSwrREFBZWlGLGlCQUFpQjs7Ozs7O1VDZmhDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEEsOENBQThDOzs7OztXQ0E5QztXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtdGlsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjcmVhdGVTaW5nbGVFdmVudFRpbGUgZnJvbSBcIi4vY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50VGlsZXMoZGl2LCBjYWxsYmFjaykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSAxMDA7IGkgKz0gMSkge1xuICAgIGRpdi5hcHBlbmRDaGlsZChjcmVhdGVTaW5nbGVFdmVudFRpbGUoaSwgY2FsbGJhY2spKTtcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlRXZlbnRUaWxlcztcbiIsImltcG9ydCBjcmVhdGVTaW5nbGVUaWxlIGZyb20gXCIuL2NyZWF0ZS1zaW5nbGUtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVTaW5nbGVFdmVudFRpbGUoaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IHRpbGUgPSBjcmVhdGVTaW5nbGVUaWxlKGlkKTtcbiAgdGlsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2FsbGJhY2spO1xuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIiwiZnVuY3Rpb24gY3JlYXRlU2luZ2xlVGlsZShpZCkge1xuICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgdGlsZS5jbGFzc0xpc3QuYWRkKFwiZ2FtZWJvYXJkX190aWxlXCIpO1xuICB0aWxlLnNldEF0dHJpYnV0ZShcImRhdGEtaWRcIiwgaWQpXG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVUaWxlOyIsImNsYXNzIEdhbWVCb2FyZFZpZXdVcGRhdGVyIHtcbiAgY29uc3RydWN0b3Ioc3RyaW5nKSB7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gIH1cblxuICBzdGF0aWMgdXBkYXRlU3Vuayh0aWxlKSB7XG4gICAgaWYgKHRpbGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiaGl0XCIpKSB7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5yZXBsYWNlKFwiaGl0XCIsIFwic3Vua1wiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGlsZS5jbGFzc0xpc3QuYWRkKFwic3Vua1wiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZ2V0U3RhdHVzKG9iaikge1xuICAgIHJldHVybiBvYmouaGl0ID8gXCJoaXRcIiA6IFwibWlzc1wiO1xuICB9XG5cbiAgdXBkYXRlU3Vua1RpbGVzKG9iaikge1xuICAgIG9iai50aWxlcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5nYW1lYm9hcmQtLSR7dGhpcy5zdHJpbmd9IFtkYXRhLWlkPVwiJHtlbGVtZW50fVwiXWBcbiAgICAgICk7XG4gICAgICBHYW1lQm9hcmRWaWV3VXBkYXRlci51cGRhdGVTdW5rKHRpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlQXR0YWNrVmlldyA9IChvYmopID0+IHtcbiAgICBpZiAob2JqLnN1bmspIHtcbiAgICAgIHRoaXMudXBkYXRlU3Vua1RpbGVzKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke29iai50aWxlfVwiXWBcbiAgICAgICk7XG4gICAgICB0aWxlLmNsYXNzTGlzdC5hZGQoR2FtZUJvYXJkVmlld1VwZGF0ZXIuZ2V0U3RhdHVzKG9iaikpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmRWaWV3VXBkYXRlcjtcbiIsImNsYXNzIEdhbWVCb2FyZCB7XG5cbiAgY29uc3RydWN0b3IocHViU3ViKSB7XG4gICAgdGhpcy5wdWJTdWIgPSBwdWJTdWI7XG4gIH1cblxuICBzaGlwc0FyciA9IFtdO1xuXG4gIGdldCBzaGlwcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwc0FycjtcbiAgfVxuXG4gIHNldCBzaGlwcyh2YWx1ZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgdGhpcy5zaGlwc0FyciA9IHRoaXMuc2hpcHNBcnIuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaGlwc0Fyci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBtaXNzZWRBcnIgPSBbXTtcblxuICAvKiBDaGVja3MgaWYgY29vcmRpbmF0ZXMgYWxyZWFkeSBoYXZlIGEgc2hpcCBvbiB0aGVtICovXG5cbiAgaXNUYWtlbihjb29yZGluYXRlcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcyhjb29yZGluYXRlc1tpXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIG51bSBzZWxlY3RlZCBieSBwbGF5ZXIgaGFzIGEgc2hpcCwgaWYgaGl0IGNoZWNrcyBpZiBzaGlwIGlzIHN1bmssIGlmIHN1bmsgY2hlY2tzIGlmIGdhbWUgaXMgb3ZlciAgKi9cblxuICBoYW5kbGVBdHRhY2sgPSAobnVtKSA9PiB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLnNoaXBzLmxlbmd0aDsgeSArPSAxKSB7XG4gICAgICBpZiAodGhpcy5zaGlwc1t5XS5jb29yZGluYXRlcy5pbmNsdWRlcygrbnVtKSkge1xuICAgICAgICB0aGlzLnNoaXBzW3ldLmhpdCgpO1xuICAgICAgICBpZiAodGhpcy5zaGlwc1t5XS5pc1N1bmsoKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKE9iamVjdC5hc3NpZ24odGhpcy5pc092ZXIoKSwge1xuICAgICAgICAgICAgdGlsZXM6IHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnB1YlN1Yi5wdWJsaXNoKHsgdGlsZTogbnVtLCBoaXQ6IHRydWUsIHN1bms6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm1pc3NlZEFyci5wdXNoKG51bSk7XG5cbiAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiBmYWxzZSwgc3VuazogZmFsc2UgfSk7XG4gIH07XG5cbiAgLyogQ2FsbGVkIHdoZW4gYSBzaGlwIGlzIHN1bmssIHJldHVybnMgQSkgR0FNRSBPVkVSIGlmIGFsbCBzaGlwcyBhcmUgc3VuayBvciBCKSBTVU5LIGlmIHRoZXJlJ3MgbW9yZSBzaGlwcyBsZWZ0ICovXG5cbiAgaXNPdmVyKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLnN1bmsgPT09IHRydWUpXG4gICAgICA/IHsgaGl0OiB0cnVlLCBzdW5rOiB0cnVlLCBnYW1lb3ZlcjogdHJ1ZSB9XG4gICAgICA6IHsgaGl0OiB0cnVlLCBzdW5rOiB0cnVlIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXN9O1xuIiwiXG4vKiBDcmVhdGVzIGEgY29vcmRpbmF0ZSBhcnIgZm9yIGEgc2hpcCBvYmplY3QncyBjb29yZGluYXRlcyBwcm9wZXJ0eSBmcm9tIHNoaXBJbmZvIG9iamVjdCAqL1xuXG5mdW5jdGlvbiBjcmVhdGVDb29yQXJyKG9iaikge1xuICBjb25zdCBhcnIgPSBbK29iai50aWxlTnVtXVxuICBmb3IgKGxldCBpID0gMTsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcnIucHVzaChhcnJbaSAtIDFdICsgMTApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb29yQXJyO1xuIiwiaW1wb3J0IGNyZWF0ZUNvb3JBcnIgZnJvbSBcIi4vY3JlYXRlLWNvb3JkaW5hdGVzLWFyci9jcmVhdGUtY29vci1hcnJcIjtcblxuLyogQ3JlYXRlcyBzaGlwIG9iamVjdCBmcm9tIHNoaXBJbmZvIG9iamVjdCAqL1xuXG5jbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Iob2JqKSB7XG4gICAgdGhpcy5sZW5ndGggPSArb2JqLmxlbmd0aDtcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gY3JlYXRlQ29vckFycihvYmopO1xuICB9XG5cbiAgdGltZXNIaXQgPSAwO1xuXG4gIHN1bmsgPSBmYWxzZTtcblxuICBoaXQoKSB7XG4gICAgdGhpcy50aW1lc0hpdCArPSAxO1xuICB9XG5cbiAgaXNTdW5rKCkge1xuICAgIGlmICh0aGlzLnRpbWVzSGl0ID09PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiaW1wb3J0IGNyZWF0ZUV2ZW50VGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC0tdXNlclwiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL2dhbWVib2FyZC12aWV3cy0tdXNlclwiXG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YVwiO1xuXG5jb25zdCBnYW1lQm9hcmREaXZVc2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5nYW1lYm9hcmQtLXVzZXJcIik7XG5cbmNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGxhY2VtZW50LWZvcm1fX2lucHV0XCIpO1xuXG5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKTtcbn0pO1xuXG5jcmVhdGVFdmVudFRpbGVzKGdhbWVCb2FyZERpdlVzZXIsIHB1Ymxpc2hEb21EYXRhLnBpY2tQbGFjZW1lbnQpO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaGFuZGxlQ29tcHV0ZXJBdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmV4cG9ydCB7Y29tcHV0ZXJBdHRhY2ssIGhhbmRsZUNvbXB1dGVyQXR0YWNrfSIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogY3JlYXRlU2hpcEluZm8oKSBwdWJsaXNoZXMgYSBzaGlwSW5mbyBvYmouIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgaXMgc3Vic2NyaWJlZCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBzaGlwIGNhbiBiZSBwbGFjZWQgdGhlcmUgKi9cbmNvbnN0IHNoaXBJbmZvID0gbmV3IFB1YlN1YigpO1xuXG4vKiBnYW1lYm9hcmQucHVibGlzaFZhbGlkaXR5IHB1Ymxpc2hlcyBhbiBvYmogd2l0aCBhIGJvby4gdmFsaWQgcHJvcGVydHkgYW5kIGEgbGlzdCBvZiBjb29yZGluYXRlcy4gICAqL1xuY29uc3QgdmFsaWRpdHlWaWV3cyA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dCwgc2hpcEluZm8sIHZhbGlkaXR5Vmlld3N9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBjb21wdXRlckdhbWVib2FyZCA9IG5ldyBQdWJTdWIoKTtcbmNvbnN0IHVzZXJQbGF5ZXIgPSBuZXcgUHViU3ViKCk7XG5jb25zdCBjb21wdXRlclBsYXllciA9IG5ldyBQdWJTdWIoKTtcbmNvbnN0IHVzZXJHYW1lQm9hcmQgPSBuZXcgUHViU3ViKCk7XG5cblxuXG5leHBvcnQge3VzZXJQbGF5ZXIsIGNvbXB1dGVyR2FtZWJvYXJkLCBjb21wdXRlclBsYXllciwgdXNlckdhbWVCb2FyZH0gIDsiLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4uLy4uL2NvbW1vbi9zaGlwL3NoaXBcIjtcbmltcG9ydCB7IGhhbmRsZUNvbXB1dGVyQXR0YWNrLCBjb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCI7XG5pbXBvcnQgKiBhcyBpbml0IGZyb20gXCIuLi8uLi9wdWItc3Vicy9pbml0aWFsaXplXCJcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgVXNlckdhbWVCb2FyZCBleHRlbmRzIEdhbWVCb2FyZCB7XG4gIC8qIENhbGN1bGF0ZXMgdGhlIG1heCBhY2NlcHRhYmxlIHRpbGUgZm9yIGEgc2hpcCBkZXBlbmRpbmcgb24gaXRzIHN0YXJ0ICh0aWxlTnVtKS5cbiAgZm9yIGV4LiBJZiBhIHNoaXAgaXMgcGxhY2VkIGhvcml6b250YWxseSBvbiB0aWxlIDIxIG1heCB3b3VsZCBiZSAzMCAgKi9cblxuICBzdGF0aWMgY2FsY01heChvYmopIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgJiYgb2JqLnRpbGVOdW0gPiAxMCkge1xuICAgICAgY29uc3QgbWF4ID0gK2Ake29iai50aWxlTnVtLnRvU3RyaW5nKCkuY2hhckF0KDApfTBgICsgMTA7XG4gICAgICByZXR1cm4gbWF4O1xuICAgIH1cbiAgICBjb25zdCBtYXggPSBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IDEwIDogMTAwO1xuICAgIHJldHVybiBtYXg7XG4gIH1cblxuICAvKiBDYWxjdWxhdGVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgaW4gdGlsZSBudW1iZXJzLiBUaGUgbWludXMgLTEgYWNjb3VudHMgZm9yIHRoZSB0aWxlTnVtIHRoYXQgaXMgYWRkZWQgaW4gdGhlIGlzVG9vQmlnIGZ1bmMgKi9cblxuICBzdGF0aWMgY2FsY0xlbmd0aChvYmopIHtcbiAgICByZXR1cm4gb2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgID8gb2JqLmxlbmd0aCAtIDFcbiAgICAgIDogKG9iai5sZW5ndGggLSAxKSAqIDEwO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBzaGlwIHBsYWNlbWVudCB3b3VsZCBiZSBsZWdhbCwgb3IgaWYgdGhlIHNoaXAgaXMgdG9vIGJpZyB0byBiZSBwbGFjZWQgb24gdGhlIHRpbGUgKi9cblxuICBzdGF0aWMgaXNUb29CaWcob2JqKSB7XG4gICAgY29uc3QgbWF4ID0gVXNlckdhbWVCb2FyZC5jYWxjTWF4KG9iaik7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IFVzZXJHYW1lQm9hcmQuY2FsY0xlbmd0aChvYmopO1xuICAgIGlmIChvYmoudGlsZU51bSArIHNoaXBMZW5ndGggPD0gbWF4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaXNWYWxpZCA9IChvYmopID0+IHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSkge1xuICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlc30gXG4gICAgfVxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjb29yZGluYXRlczogc2hpcC5jb29yZGluYXRlcyB9XG4gIH1cblxuICBwdWJsaXNoVmFsaWRpdHkgPSAob2JqKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJ5ZWFhaFwiKVxuICAgIGNvbnNvbGUubG9nKHRoaXMuaXNWYWxpZChvYmopKVxuICAgIHVzZXJDbGljay52YWxpZGl0eVZpZXdzLnB1Ymxpc2godGhpcy5pc1ZhbGlkKG9iaikpXG4gIH1cblxuICAvKiBDaGVja3MgaWYgYSBzaGlwcyBjb29yZGluYXRlcyBhcmUgdGFrZW4sIGlmIG5vdCBwbGFjZXMgc2hpcCBpbiBzaGlwc0Fyciwgb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UgKi9cblxuICBwbGFjZVNoaXAob2JqKSB7XG4gICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKG9iaik7XG4gICAgaWYgKHRoaXMuaXNUYWtlbihzaGlwLmNvb3JkaW5hdGVzKSB8fCB0aGlzLmNvbnN0cnVjdG9yLmlzVG9vQmlnKG9iaikpIHtcbiAgICAgIHJldHVybiBFcnJvcihcIlNoaXAgY291bGRuJ3QgYmUgcGxhY2VkIHRoZXJlXCIpO1xuICAgIH1cbiAgICB0aGlzLnNoaXBzID0gc2hpcDtcbiAgICByZXR1cm4gXCJTaGlwIFBsYWNlZFwiO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRVc2VyQm9hcmQoKSB7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcbiAgY29tcHV0ZXJBdHRhY2suc3Vic2NyaWJlKHVzZXJCb2FyZC5oYW5kbGVBdHRhY2spO1xufVxuXG5mdW5jdGlvbiBpbml0UGxhY2VtZW50Qm9hcmQoKSB7XG4gIGNvbnN0IHVzZXJQbGFjZW1lbnRCb2FyZCA9IG5ldyBVc2VyR2FtZUJvYXJkKGhhbmRsZUNvbXB1dGVyQXR0YWNrKTtcblxuICBcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnN1YnNjcmliZSh1c2VyUGxhY2VtZW50Qm9hcmQucHVibGlzaFZhbGlkaXR5KTsgXG59XG5pbml0UGxhY2VtZW50Qm9hcmQoKTtcbmluaXQudXNlckdhbWVCb2FyZC5zdWJzY3JpYmUoaW5pdFVzZXJCb2FyZClcblxuIiwiaW1wb3J0IEdhbWVCb2FyZFZpZXdVcGRhdGVyIGZyb20gXCIuLi8uLi9jb21tb24vZ2FtZWJvYXJkLXZpZXctdXBkYXRlci9nYW1lYm9hcmQtdmlldy11cGRhdGVyXCI7XG5pbXBvcnQgeyBoYW5kbGVDb21wdXRlckF0dGFjayB9IGZyb20gXCIuLi8uLi9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyXCJcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcblxuY2xhc3MgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyIGV4dGVuZHMgR2FtZUJvYXJkVmlld1VwZGF0ZXIge1xuIFxuICBzdGF0aWMgY2xlYXJWYWxpZGl0eVZpZXcoKSB7XG4gICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmdhbWVib2FyZF9fdGlsZVwiKTtcbiAgICB0aWxlcy5mb3JFYWNoKHRpbGUgPT4ge1xuICAgICAgdGlsZS5jbGFzc0xpc3QucmVtb3ZlKFwicGxhY2VtZW50LS12YWxpZFwiKTtcbiAgICAgIHRpbGUuY2xhc3NMaXN0LnJlbW92ZShcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KVxuICB9XG5cbiAvKiBhZGRzIHRoZSB2aXN1YWwgY2xhc3MgcGxhY2VtZW50LS12YWxpZC9vciBwbGFjZW1lbnQtLWludmFsaWQgYmFzZWQgb24gdGhlIHRpbGVOdW0gY2hvc2VuIGJ5IHRoZSB1c2VyICovXG5cbiAgaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3ID0gKG9iaikgPT4ge1xuICAgIHRoaXMuY29uc3RydWN0b3IuY2xlYXJWYWxpZGl0eVZpZXcoKTtcbiAgICBvYmouY29vcmRpbmF0ZXMuZm9yRWFjaChjb29yZGluYXRlID0+IHtcbiAgICAgIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmdhbWVib2FyZC0tJHt0aGlzLnN0cmluZ30gW2RhdGEtaWQ9XCIke2Nvb3JkaW5hdGV9XCJdYFxuICAgICAgKTtcbiAgICAgIChvYmoudmFsaWQpID8gdGlsZS5jbGFzc0xpc3QuYWRkKFwicGxhY2VtZW50LS12YWxpZFwiKSA6IHRpbGUuY2xhc3NMaXN0LmFkZChcInBsYWNlbWVudC0taW52YWxpZFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIFxuXG5cbn1cblxuY29uc3QgdXNlciA9IFwidXNlclwiO1xuXG5jb25zdCB1c2VyVmlld1VwZGF0ZXIgPSBuZXcgR2FtZUJvYXJkVXNlclZpZXdVcGRhdGVyKHVzZXIpO1xuXG5oYW5kbGVDb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlclZpZXdVcGRhdGVyLmhhbmRsZUF0dGFja1ZpZXcpO1xudXNlckNsaWNrLnZhbGlkaXR5Vmlld3Muc3Vic2NyaWJlKHVzZXJWaWV3VXBkYXRlci5oYW5kbGVQbGFjZW1lbnRWYWxpZGl0eVZpZXcpXG5cbmV4cG9ydCBkZWZhdWx0IHVzZXJWaWV3VXBkYXRlcjtcbiIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yICh0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMudGlsZU51bSA9ICt0aWxlTnVtO1xuICAgIHRoaXMubGVuZ3RoID0gK2xlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vLi4vY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YVwiO1xuaW1wb3J0IGRpc3BsYXlSYWRpb1ZhbHVlIGZyb20gXCIuLi8uLi8uLi91dGlscy9kaXNwbGF5LXJhZGlvLXZhbHVlXCI7XG5cbmNvbnN0IHNoaXBQbGFjZW1lbnQgPSB7XG4gIHRpbGVOdW06IDAsXG4gIHVwZGF0ZU51bSh2YWx1ZSkge1xuICAgIHRoaXMudGlsZU51bSA9IHZhbHVlO1xuICAgIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKCk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwSW5mbygpIHtcbiAgY29uc29sZS5sb2coXCJzaGlwY3JlYXRlZFJ1blwiKTtcblxuICBjb25zdCB7IHRpbGVOdW0gfSA9IHNoaXBQbGFjZW1lbnQ7XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIGNvbnN0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvVXNlcih0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbilcbiAgcmV0dXJuIHNoaXBJbmZvXG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NoZWNrKCkge1xuICBjb25zdCBzaGlwSW5mbyA9IGNyZWF0ZVNoaXBJbmZvKClcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnB1Ymxpc2goc2hpcEluZm8pOyAgXG59XG5cbmZ1bmN0aW9uIHB1Ymxpc2hTaGlwSW5mb0NyZWF0ZSgpIHtcbiAgY29uc3Qgc2hpcEluZm8gPSBjcmVhdGVTaGlwSW5mbygpXG4gIHVzZXJDbGljay5zaGlwUGxhY2VCdG4ucHVibGlzaChzaGlwSW5mbyk7ICBcblxufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG5cbnVzZXJDbGljay5pbnB1dC5zdWJzY3JpYmUocHVibGlzaFNoaXBJbmZvQ2hlY2spO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsIkdhbWVCb2FyZFZpZXdVcGRhdGVyIiwiY29uc3RydWN0b3IiLCJzdHJpbmciLCJ1cGRhdGVTdW5rIiwiY29udGFpbnMiLCJyZXBsYWNlIiwiZ2V0U3RhdHVzIiwib2JqIiwiaGl0IiwidXBkYXRlU3Vua1RpbGVzIiwidGlsZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJoYW5kbGVBdHRhY2tWaWV3Iiwic3VuayIsIkdhbWVCb2FyZCIsInB1YlN1YiIsInNoaXBzQXJyIiwic2hpcHMiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImNvbmNhdCIsInB1c2giLCJtaXNzZWRBcnIiLCJpc1Rha2VuIiwiY29vcmRpbmF0ZXMiLCJsZW5ndGgiLCJ5IiwiaW5jbHVkZXMiLCJoYW5kbGVBdHRhY2siLCJudW0iLCJpc1N1bmsiLCJwdWJsaXNoIiwiT2JqZWN0IiwiYXNzaWduIiwiaXNPdmVyIiwiZXZlcnkiLCJzaGlwIiwiZ2FtZW92ZXIiLCJQdWJTdWIiLCJzdWJzY3JpYmVycyIsInN1YnNjcmliZSIsInN1YnNjcmliZXIiLCJFcnJvciIsInVuc3Vic2NyaWJlIiwiZmlsdGVyIiwic3ViIiwicGF5bG9hZCIsInVzZXJDbGljayIsImF0dGFjayIsImRhdGFzZXQiLCJwaWNrUGxhY2VtZW50IiwiYWxlcnRTaGlwSW5mb0NoYW5nZXMiLCJpbnB1dCIsImNyZWF0ZUNvb3JBcnIiLCJhcnIiLCJ0aWxlTnVtIiwiZGlyZWN0aW9uIiwiU2hpcCIsInRpbWVzSGl0IiwicHVibGlzaERvbURhdGEiLCJnYW1lQm9hcmREaXZVc2VyIiwiaW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsImNvbXB1dGVyQXR0YWNrIiwiaGFuZGxlQ29tcHV0ZXJBdHRhY2siLCJzaGlwSW5mbyIsInZhbGlkaXR5Vmlld3MiLCJjb21wdXRlckdhbWVib2FyZCIsInVzZXJQbGF5ZXIiLCJjb21wdXRlclBsYXllciIsInVzZXJHYW1lQm9hcmQiLCJpbml0IiwiVXNlckdhbWVCb2FyZCIsImNhbGNNYXgiLCJtYXgiLCJ0b1N0cmluZyIsImNoYXJBdCIsImNhbGNMZW5ndGgiLCJpc1Rvb0JpZyIsInNoaXBMZW5ndGgiLCJpc1ZhbGlkIiwidmFsaWQiLCJwdWJsaXNoVmFsaWRpdHkiLCJjb25zb2xlIiwibG9nIiwicGxhY2VTaGlwIiwiaW5pdFVzZXJCb2FyZCIsInVzZXJCb2FyZCIsImluaXRQbGFjZW1lbnRCb2FyZCIsInVzZXJQbGFjZW1lbnRCb2FyZCIsIkdhbWVCb2FyZFVzZXJWaWV3VXBkYXRlciIsImNsZWFyVmFsaWRpdHlWaWV3IiwicmVtb3ZlIiwiaGFuZGxlUGxhY2VtZW50VmFsaWRpdHlWaWV3IiwiY29vcmRpbmF0ZSIsInVzZXIiLCJ1c2VyVmlld1VwZGF0ZXIiLCJTaGlwSW5mb1VzZXIiLCJkaXNwbGF5UmFkaW9WYWx1ZSIsInNoaXBQbGFjZW1lbnQiLCJ1cGRhdGVOdW0iLCJjcmVhdGVTaGlwSW5mbyIsInB1Ymxpc2hTaGlwSW5mb0NoZWNrIiwicHVibGlzaFNoaXBJbmZvQ3JlYXRlIiwic2hpcFBsYWNlQnRuIiwiYmluZCIsIm5hbWUiLCJjaGVja2VkIl0sInNvdXJjZVJvb3QiOiIifQ==