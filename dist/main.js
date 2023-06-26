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
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");




const gameBoardDivUser = document.querySelector(".gameboard--user");
const inputs = document.querySelectorAll(".placement-form__input");
inputs.forEach(input => {
  input.addEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_3__.alertShipInfoChanges);
});
(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_3__.pickPlacement);

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
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.shipInfo.publish(shipInfo);
}
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));
_pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.input.subscribe(createShipInfo);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9jcmVhdGUtY29vcmRpbmF0ZXMtYXJyL2NyZWF0ZS1jb29yLWFyci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vc2hpcC9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9hdHRhY2stLWNvbXB1dGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3B1Yi1zdWJzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9pbml0aWFsaXplLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIGZyb20gXCIuL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50VGlsZXM7XG4iLCJpbXBvcnQgY3JlYXRlU2luZ2xlVGlsZSBmcm9tIFwiLi9jcmVhdGUtc2luZ2xlLXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gY3JlYXRlU2luZ2xlVGlsZShpZCk7XG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImZ1bmN0aW9uIGNyZWF0ZVNpbmdsZVRpbGUoaWQpIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlVGlsZTsiLCJjbGFzcyBHYW1lQm9hcmQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YlN1Yikge1xuICAgIHRoaXMucHViU3ViID0gcHViU3ViO1xuICB9XG5cbiAgc2hpcHNBcnIgPSBbXTtcblxuICBnZXQgc2hpcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHNBcnI7XG4gIH1cblxuICBzZXQgc2hpcHModmFsdWUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIgPSB0aGlzLnNoaXBzQXJyLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hpcHNBcnIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbWlzc2VkQXJyID0gW107XG5cbiAgLyogQ2hlY2tzIGlmIGNvb3JkaW5hdGVzIGFscmVhZHkgaGF2ZSBhIHNoaXAgb24gdGhlbSAqL1xuXG4gIGlzVGFrZW4oY29vcmRpbmF0ZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2hpcHMubGVuZ3RoOyB5ICs9IDEpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoY29vcmRpbmF0ZXNbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyogQ2hlY2tzIGlmIHRoZSBudW0gc2VsZWN0ZWQgYnkgcGxheWVyIGhhcyBhIHNoaXAsIGlmIGhpdCBjaGVja3MgaWYgc2hpcCBpcyBzdW5rLCBpZiBzdW5rIGNoZWNrcyBpZiBnYW1lIGlzIG92ZXIgICovXG5cbiAgaGFuZGxlQXR0YWNrID0gKG51bSkgPT4ge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaGlwcy5sZW5ndGg7IHkgKz0gMSkge1xuICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uY29vcmRpbmF0ZXMuaW5jbHVkZXMoK251bSkpIHtcbiAgICAgICAgdGhpcy5zaGlwc1t5XS5oaXQoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcHNbeV0uaXNTdW5rKCkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaChPYmplY3QuYXNzaWduKHRoaXMuaXNPdmVyKCksIHtcbiAgICAgICAgICAgIHRpbGVzOiB0aGlzLnNoaXBzW3ldLmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdWJTdWIucHVibGlzaCh7IHRpbGU6IG51bSwgaGl0OiB0cnVlLCBzdW5rOiBmYWxzZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5taXNzZWRBcnIucHVzaChudW0pO1xuXG4gICAgcmV0dXJuIHRoaXMucHViU3ViLnB1Ymxpc2goeyB0aWxlOiBudW0sIGhpdDogZmFsc2UsIHN1bms6IGZhbHNlIH0pO1xuICB9O1xuXG4gIC8qIENhbGxlZCB3aGVuIGEgc2hpcCBpcyBzdW5rLCByZXR1cm5zIEEpIEdBTUUgT1ZFUiBpZiBhbGwgc2hpcHMgYXJlIHN1bmsgb3IgQikgU1VOSyBpZiB0aGVyZSdzIG1vcmUgc2hpcHMgbGVmdCAqL1xuXG4gIGlzT3ZlcigpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5zdW5rID09PSB0cnVlKVxuICAgICAgPyB7IGhpdDogdHJ1ZSwgc3VuazogdHJ1ZSwgZ2FtZW92ZXI6IHRydWUgfVxuICAgICAgOiB7IGhpdDogdHJ1ZSwgc3VuazogdHJ1ZSB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNsYXNzIFB1YlN1YiB7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdXG4gIH1cblxuICBzdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpXG4gIH1cbiBcbiAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgIGlmKHR5cGVvZiBzdWJzY3JpYmVyICE9PSAnZnVuY3Rpb24nKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0eXBlb2Ygc3Vic2NyaWJlcn0gaXMgbm90IGEgdmFsaWQgYXJndW1lbnQsIHByb3ZpZGUgYSBmdW5jdGlvbiBpbnN0ZWFkYClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuZmlsdGVyKHN1YiA9PiBzdWIhPT0gc3Vic2NyaWJlcilcbiAgfVxuXG4gIHB1Ymxpc2gocGF5bG9hZCkge1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIocGF5bG9hZCkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcblxuLyogdHJpZ2dlcnMgd2hlbiBhIHVzZXIgcGlja3MgYSBjb29yZGluYXRlIHRvIGF0dGFjayAqL1xuXG5mdW5jdGlvbiBhdHRhY2soKSB7XG4gIHVzZXJDbGljay5hdHRhY2sucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBzaGlwUGxhY2VtZW50LnVwZGF0ZU51bSBpbiBzaGlwLWluZm9fX3ZpZXdzLS11c2VyIHdoaWNoIHN0b3JlcyB0aGUgdXNlcidzIGN1cnJlbnQgc2hpcCBwbGFjZW1lbnQgcGljay4gT25jZSB1cGRhdGVkIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCkgaXMgcnVuICovXG5cbmZ1bmN0aW9uIHBpY2tQbGFjZW1lbnQoKSB7XG4gIHVzZXJDbGljay5waWNrUGxhY2VtZW50LnB1Ymxpc2godGhpcy5kYXRhc2V0LmlkKTtcbn1cblxuLyogdHJpZ2dlcnMgY3JlYXRlU2hpcEluZm8gZnVuYyBpbiBzaGlwLWluZm9fX3ZpZXdzLS11c2VyIHdoZW4gdXNlciBjbGlja2VkIGFuIGlucHV0ICovXG5cbmZ1bmN0aW9uIGFsZXJ0U2hpcEluZm9DaGFuZ2VzKCkge1xuICB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpO1xufVxuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyBwdWJsaXNoRG9tRGF0YSAqL1xuXG5leHBvcnQgeyBhdHRhY2ssIHBpY2tQbGFjZW1lbnQsIGFsZXJ0U2hpcEluZm9DaGFuZ2VzfTtcbiIsIlxuLyogQ3JlYXRlcyBhIGNvb3JkaW5hdGUgYXJyIGZvciBhIHNoaXAgb2JqZWN0J3MgY29vcmRpbmF0ZXMgcHJvcGVydHkgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuZnVuY3Rpb24gY3JlYXRlQ29vckFycihvYmopIHtcbiAgY29uc3QgYXJyID0gWytvYmoudGlsZU51bV1cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAob2JqLmRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGFyci5wdXNoKGFycltpIC0gMV0gKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJyLnB1c2goYXJyW2kgLSAxXSArIDEwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29vckFycjtcbiIsImltcG9ydCBjcmVhdGVDb29yQXJyIGZyb20gXCIuL2NyZWF0ZS1jb29yZGluYXRlcy1hcnIvY3JlYXRlLWNvb3ItYXJyXCI7XG5cbi8qIENyZWF0ZXMgc2hpcCBvYmplY3QgZnJvbSBzaGlwSW5mbyBvYmplY3QgKi9cblxuY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKG9iaikge1xuICAgIHRoaXMubGVuZ3RoID0gK29iai5sZW5ndGg7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IGNyZWF0ZUNvb3JBcnIob2JqKTtcbiAgfVxuXG4gIHRpbWVzSGl0ID0gMDtcblxuICBzdW5rID0gZmFsc2U7XG5cbiAgaGl0KCkge1xuICAgIHRoaXMudGltZXNIaXQgKz0gMTtcbiAgfVxuXG4gIGlzU3VuaygpIHtcbiAgICBpZiAodGhpcy50aW1lc0hpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1bms7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsImltcG9ydCBjcmVhdGVFdmVudFRpbGVzIGZyb20gXCIuLi9jb21tb24vY3JlYXRlLXRpbGVzL2NyZWF0ZS1ldmVudC10aWxlc1wiO1xuaW1wb3J0IFwiLi4vdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXJcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9nYW1lYm9hcmQtLXVzZXJcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5cbmNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcblxuY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG5cbmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMpO1xufSk7XG5cbmNyZWF0ZUV2ZW50VGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERvbURhdGEucGlja1BsYWNlbWVudCk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyQXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBoYW5kbGVDb21wdXRlckF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuZXhwb3J0IHtjb21wdXRlckF0dGFjaywgaGFuZGxlQ29tcHV0ZXJBdHRhY2t9IiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBjcmVhdGVTaGlwSW5mbygpIHB1Ymxpc2hlcyBhIHNoaXBJbmZvIG9iai4gZ2FtZWJvYXJkLnB1Ymxpc2hWYWxpZGl0eSBpcyBzdWJzY3JpYmVkIGFuZCBjaGVja3Mgd2hldGhlciBhIHNoaXAgY2FuIGJlIHBsYWNlZCB0aGVyZSAqL1xuY29uc3Qgc2hpcEluZm8gPSBuZXcgUHViU3ViKCk7XG5cbi8qIGdhbWVib2FyZC5wdWJsaXNoVmFsaWRpdHkgcHVibGlzaGVzIGFuIG9iaiB3aXRoIGEgYm9vLiB2YWxpZCBwcm9wZXJ0eSBhbmQgYSBsaXN0IG9mIGNvb3JkaW5hdGVzLiAgICovXG5jb25zdCB2YWxpZGl0eVZpZXdzID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0LCBzaGlwSW5mbywgdmFsaWRpdHlWaWV3c30iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGNvbXB1dGVyR2FtZWJvYXJkID0gbmV3IFB1YlN1YigpO1xuY29uc3QgdXNlclBsYXllciA9IG5ldyBQdWJTdWIoKTtcbmNvbnN0IGNvbXB1dGVyUGxheWVyID0gbmV3IFB1YlN1YigpO1xuY29uc3QgdXNlckdhbWVCb2FyZCA9IG5ldyBQdWJTdWIoKTtcblxuXG5cbmV4cG9ydCB7dXNlclBsYXllciwgY29tcHV0ZXJHYW1lYm9hcmQsIGNvbXB1dGVyUGxheWVyLCB1c2VyR2FtZUJvYXJkfSAgOyIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4uLy4uL2NvbW1vbi9nYW1lYm9hcmQvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi4vLi4vY29tbW9uL3NoaXAvc2hpcFwiO1xuaW1wb3J0IHsgaGFuZGxlQ29tcHV0ZXJBdHRhY2ssIGNvbXB1dGVyQXR0YWNrIH0gZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2F0dGFjay0tY29tcHV0ZXJcIjtcbmltcG9ydCAqIGFzIGluaXQgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2luaXRpYWxpemVcIlxuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5jbGFzcyBVc2VyR2FtZUJvYXJkIGV4dGVuZHMgR2FtZUJvYXJkIHtcbiAgLyogQ2FsY3VsYXRlcyB0aGUgbWF4IGFjY2VwdGFibGUgdGlsZSBmb3IgYSBzaGlwIGRlcGVuZGluZyBvbiBpdHMgc3RhcnQgKHRpbGVOdW0pLlxuICBmb3IgZXguIElmIGEgc2hpcCBpcyBwbGFjZWQgaG9yaXpvbnRhbGx5IG9uIHRpbGUgMjEgbWF4IHdvdWxkIGJlIDMwICAqL1xuXG4gIHN0YXRpYyBjYWxjTWF4KG9iaikge1xuICAgIGlmIChvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiAmJiBvYmoudGlsZU51bSA+IDEwKSB7XG4gICAgICBjb25zdCBtYXggPSArYCR7b2JqLnRpbGVOdW0udG9TdHJpbmcoKS5jaGFyQXQoMCl9MGAgKyAxMDtcbiAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGNvbnN0IG1heCA9IG9iai5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gMTAgOiAxMDA7XG4gICAgcmV0dXJuIG1heDtcbiAgfVxuXG4gIC8qIENhbGN1bGF0ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBpbiB0aWxlIG51bWJlcnMuIFRoZSBtaW51cyAtMSBhY2NvdW50cyBmb3IgdGhlIHRpbGVOdW0gdGhhdCBpcyBhZGRlZCBpbiB0aGUgaXNUb29CaWcgZnVuYyAqL1xuXG4gIHN0YXRpYyBjYWxjTGVuZ3RoKG9iaikge1xuICAgIHJldHVybiBvYmouZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIlxuICAgICAgPyBvYmoubGVuZ3RoIC0gMVxuICAgICAgOiAob2JqLmxlbmd0aCAtIDEpICogMTA7XG4gIH1cblxuICAvKiBDaGVja3MgaWYgdGhlIHNoaXAgcGxhY2VtZW50IHdvdWxkIGJlIGxlZ2FsLCBvciBpZiB0aGUgc2hpcCBpcyB0b28gYmlnIHRvIGJlIHBsYWNlZCBvbiB0aGUgdGlsZSAqL1xuXG4gIHN0YXRpYyBpc1Rvb0JpZyhvYmopIHtcbiAgICBjb25zdCBtYXggPSBVc2VyR2FtZUJvYXJkLmNhbGNNYXgob2JqKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gVXNlckdhbWVCb2FyZC5jYWxjTGVuZ3RoKG9iaik7XG4gICAgaWYgKG9iai50aWxlTnVtICsgc2hpcExlbmd0aCA8PSBtYXgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpc1ZhbGlkID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChvYmopO1xuICAgIGlmICh0aGlzLmlzVGFrZW4oc2hpcC5jb29yZGluYXRlcykgfHwgdGhpcy5jb25zdHJ1Y3Rvci5pc1Rvb0JpZyhvYmopKSB7XG4gICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UsIGNvb3JkaW5hdGVzOiBzaGlwLmNvb3JkaW5hdGVzfSBcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGNvb3JkaW5hdGVzOiBzaGlwLmNvb3JkaW5hdGVzIH1cbiAgfVxuXG4gIHB1Ymxpc2hWYWxpZGl0eSA9IChvYmopID0+IHtcbiAgICBjb25zb2xlLmxvZyhcInllYWFoXCIpXG4gICAgY29uc29sZS5sb2codGhpcy5pc1ZhbGlkKG9iaikpXG4gICAgdXNlckNsaWNrLnZhbGlkaXR5Vmlld3MucHVibGlzaCh0aGlzLmlzVmFsaWQob2JqKSlcbiAgfVxuXG4gIC8qIENoZWNrcyBpZiBhIHNoaXBzIGNvb3JkaW5hdGVzIGFyZSB0YWtlbiwgaWYgbm90IHBsYWNlcyBzaGlwIGluIHNoaXBzQXJyLCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZSAqL1xuXG4gIHBsYWNlU2hpcChvYmopIHtcbiAgICBjb25zdCBzaGlwID0gbmV3IFNoaXAob2JqKTtcbiAgICBpZiAodGhpcy5pc1Rha2VuKHNoaXAuY29vcmRpbmF0ZXMpIHx8IHRoaXMuY29uc3RydWN0b3IuaXNUb29CaWcob2JqKSkge1xuICAgICAgcmV0dXJuIEVycm9yKFwiU2hpcCBjb3VsZG4ndCBiZSBwbGFjZWQgdGhlcmVcIik7XG4gICAgfVxuICAgIHRoaXMuc2hpcHMgPSBzaGlwO1xuICAgIHJldHVybiBcIlNoaXAgUGxhY2VkXCI7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVzZXJCb2FyZCgpIHtcbiAgY29uc3QgdXNlckJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuICBjb21wdXRlckF0dGFjay5zdWJzY3JpYmUodXNlckJvYXJkLmhhbmRsZUF0dGFjayk7XG59XG5cbmZ1bmN0aW9uIGluaXRQbGFjZW1lbnRCb2FyZCgpIHtcbiAgY29uc3QgdXNlclBsYWNlbWVudEJvYXJkID0gbmV3IFVzZXJHYW1lQm9hcmQoaGFuZGxlQ29tcHV0ZXJBdHRhY2spO1xuXG4gIFxuICB1c2VyQ2xpY2suc2hpcEluZm8uc3Vic2NyaWJlKHVzZXJQbGFjZW1lbnRCb2FyZC5wdWJsaXNoVmFsaWRpdHkpOyBcbn1cbmluaXRQbGFjZW1lbnRCb2FyZCgpO1xuaW5pdC51c2VyR2FtZUJvYXJkLnN1YnNjcmliZShpbml0VXNlckJvYXJkKVxuXG4iLCJjbGFzcyBTaGlwSW5mb1VzZXIge1xuICBjb25zdHJ1Y3RvciAodGlsZU51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICB0aGlzLnRpbGVOdW0gPSArdGlsZU51bTtcbiAgICB0aGlzLmxlbmd0aCA9ICtsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mb1VzZXI7XG5cbiIsImltcG9ydCBTaGlwSW5mb1VzZXIgZnJvbSBcIi4vc2hpcC1pbmZvLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uLy4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICB0aWxlTnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLnRpbGVOdW0gPSB2YWx1ZTtcbiAgICBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcygpO1xuICB9LFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnNvbGUubG9nKFwic2hpcGNyZWF0ZWRSdW5cIik7XG5cbiAgY29uc3QgeyB0aWxlTnVtIH0gPSBzaGlwUGxhY2VtZW50O1xuICBjb25zdCBsZW5ndGggPSBkaXNwbGF5UmFkaW9WYWx1ZShcInNoaXBcIik7XG4gIGNvbnN0IGRpcmVjdGlvbiA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwiZGlyZWN0aW9uXCIpO1xuXG4gIGNvbnN0IHNoaXBJbmZvID0gbmV3IFNoaXBJbmZvVXNlcih0aWxlTnVtLCBsZW5ndGgsIGRpcmVjdGlvbilcbiAgdXNlckNsaWNrLnNoaXBJbmZvLnB1Ymxpc2goc2hpcEluZm8pO1xufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG5cbnVzZXJDbGljay5pbnB1dC5zdWJzY3JpYmUoY3JlYXRlU2hpcEluZm8pO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsIkdhbWVCb2FyZCIsImNvbnN0cnVjdG9yIiwicHViU3ViIiwic2hpcHNBcnIiLCJzaGlwcyIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwicHVzaCIsIm1pc3NlZEFyciIsImlzVGFrZW4iLCJjb29yZGluYXRlcyIsImxlbmd0aCIsInkiLCJpbmNsdWRlcyIsImhhbmRsZUF0dGFjayIsIm51bSIsImhpdCIsImlzU3VuayIsInB1Ymxpc2giLCJPYmplY3QiLCJhc3NpZ24iLCJpc092ZXIiLCJ0aWxlcyIsInN1bmsiLCJldmVyeSIsInNoaXAiLCJnYW1lb3ZlciIsIlB1YlN1YiIsInN1YnNjcmliZXJzIiwic3Vic2NyaWJlIiwic3Vic2NyaWJlciIsIkVycm9yIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwYXlsb2FkIiwiZm9yRWFjaCIsInVzZXJDbGljayIsImF0dGFjayIsImRhdGFzZXQiLCJwaWNrUGxhY2VtZW50IiwiYWxlcnRTaGlwSW5mb0NoYW5nZXMiLCJpbnB1dCIsImNyZWF0ZUNvb3JBcnIiLCJvYmoiLCJhcnIiLCJ0aWxlTnVtIiwiZGlyZWN0aW9uIiwiU2hpcCIsInRpbWVzSGl0IiwicHVibGlzaERvbURhdGEiLCJnYW1lQm9hcmREaXZVc2VyIiwicXVlcnlTZWxlY3RvciIsImlucHV0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjb21wdXRlckF0dGFjayIsImhhbmRsZUNvbXB1dGVyQXR0YWNrIiwic2hpcEluZm8iLCJ2YWxpZGl0eVZpZXdzIiwiY29tcHV0ZXJHYW1lYm9hcmQiLCJ1c2VyUGxheWVyIiwiY29tcHV0ZXJQbGF5ZXIiLCJ1c2VyR2FtZUJvYXJkIiwiaW5pdCIsIlVzZXJHYW1lQm9hcmQiLCJjYWxjTWF4IiwibWF4IiwidG9TdHJpbmciLCJjaGFyQXQiLCJjYWxjTGVuZ3RoIiwiaXNUb29CaWciLCJzaGlwTGVuZ3RoIiwiaXNWYWxpZCIsInZhbGlkIiwicHVibGlzaFZhbGlkaXR5IiwiY29uc29sZSIsImxvZyIsInBsYWNlU2hpcCIsImluaXRVc2VyQm9hcmQiLCJ1c2VyQm9hcmQiLCJpbml0UGxhY2VtZW50Qm9hcmQiLCJ1c2VyUGxhY2VtZW50Qm9hcmQiLCJTaGlwSW5mb1VzZXIiLCJkaXNwbGF5UmFkaW9WYWx1ZSIsInNoaXBQbGFjZW1lbnQiLCJ1cGRhdGVOdW0iLCJjcmVhdGVTaGlwSW5mbyIsImJpbmQiLCJuYW1lIiwiY2hlY2tlZCJdLCJzb3VyY2VSb290IjoiIn0=