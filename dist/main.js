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

/***/ "./src/components/layout/layout--placement-stage.js":
/*!**********************************************************!*\
  !*** ./src/components/layout/layout--placement-stage.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ "./src/components/common/create-tiles/create-event-tiles.js");
/* harmony import */ var _views_gameboard_user_ship_info_views_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/ship-info__views--user */ "./src/components/views/gameboard--user/ship-info__views--user.js");
/* harmony import */ var _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/publish-dom-data/publish-dom-data */ "./src/components/common/publish-dom-data/publish-dom-data.js");



const gameBoardDivUser = document.querySelector(".gameboard--user");
const inputs = document.querySelectorAll(".placement-form__input");
inputs.forEach(input => {
  input.addEventListener("click", _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__.alertShipInfoChanges);
});
(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__.pickPlacement);

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
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; }
/* harmony export */ });
/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ "./src/components/common/pub-sub/pub-sub.js");

const attack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const pickPlacement = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();
const input = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__["default"]();

/* Files are imported * as userClick */



/***/ }),

/***/ "./src/components/views/gameboard--user/ship-info--user.js":
/*!*****************************************************************!*\
  !*** ./src/components/views/gameboard--user/ship-info--user.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class ShipInfoUser {
  constructor(num, length, direction) {
    this.num = num;
    this.length = length;
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
  num: 0,
  updateNum(value) {
    this.num = value;
    _common_publish_dom_data_publish_dom_data__WEBPACK_IMPORTED_MODULE_2__.alertShipInfoChanges();
  }
};
function createShipInfo() {
  console.log("shipcreatedRUn");
  const {
    num
  } = shipPlacement;
  const length = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__["default"])("ship");
  const direction = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__["default"])("direction");
  return new _ship_info_user__WEBPACK_IMPORTED_MODULE_0__["default"](num, length, direction);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS1ldmVudC10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLXRpbGUvY3JlYXRlLXNpbmdsZS10aWxlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Ymxpc2gtZG9tLWRhdGEvcHVibGlzaC1kb20tZGF0YS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9sYXlvdXQvbGF5b3V0LS1wbGFjZW1lbnQtc3RhZ2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvcHViLXN1YnMvZXZlbnRzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm8tLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mb19fdmlld3MtLXVzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSBmcm9tIFwiLi9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlRXZlbnRUaWxlcyhkaXYsIGNhbGxiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDsgaSArPSAxKSB7XG4gICAgZGl2LmFwcGVuZENoaWxkKGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpLCBjYWxsYmFjaykpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVFdmVudFRpbGVzO1xuIiwiaW1wb3J0IGNyZWF0ZVNpbmdsZVRpbGUgZnJvbSBcIi4vY3JlYXRlLXNpbmdsZS10aWxlXCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNpbmdsZUV2ZW50VGlsZShpZCwgY2FsbGJhY2spIHtcbiAgY29uc3QgdGlsZSA9IGNyZWF0ZVNpbmdsZVRpbGUoaWQpO1xuICB0aWxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYWxsYmFjayk7XG4gIHJldHVybiB0aWxlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJmdW5jdGlvbiBjcmVhdGVTaW5nbGVUaWxlKGlkKSB7XG4gIGNvbnN0IHRpbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICB0aWxlLmNsYXNzTGlzdC5hZGQoXCJnYW1lYm9hcmRfX3RpbGVcIik7XG4gIHRpbGUuc2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiLCBpZClcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZVRpbGU7IiwiY2xhc3MgUHViU3ViIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW11cbiAgfVxuXG4gIHN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcilcbiAgfVxuIFxuICB1bnN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgaWYodHlwZW9mIHN1YnNjcmliZXIgIT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGVvZiBzdWJzY3JpYmVyfSBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCwgcHJvdmlkZSBhIGZ1bmN0aW9uIGluc3RlYWRgKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVycy5maWx0ZXIoc3ViID0+IHN1YiE9PSBzdWJzY3JpYmVyKVxuICB9XG5cbiAgcHVibGlzaChwYXlsb2FkKSB7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlcihwYXlsb2FkKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJTdWI7XG4iLCJpbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiO1xuXG4vKiB0cmlnZ2VycyB3aGVuIGEgdXNlciBwaWNrcyBhIGNvb3JkaW5hdGUgdG8gYXR0YWNrICovXG5cbmZ1bmN0aW9uIGF0dGFjaygpIHtcbiAgdXNlckNsaWNrLmF0dGFjay5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hpY2ggc3RvcmVzIHRoZSB1c2VyJ3MgY3VycmVudCBzaGlwIHBsYWNlbWVudCBwaWNrLiBPbmNlIHVwZGF0ZWQgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKSBpcyBydW4gKi9cblxuZnVuY3Rpb24gcGlja1BsYWNlbWVudCgpIHtcbiAgdXNlckNsaWNrLnBpY2tQbGFjZW1lbnQucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG4vKiB0cmlnZ2VycyBjcmVhdGVTaGlwSW5mbyBmdW5jIGluIHNoaXAtaW5mb19fdmlld3MtLXVzZXIgd2hlbiB1c2VyIGNsaWNrZWQgYW4gaW5wdXQgKi9cblxuZnVuY3Rpb24gYWxlcnRTaGlwSW5mb0NoYW5nZXMoKSB7XG4gIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCk7XG59XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHB1Ymxpc2hEb21EYXRhICovXG5cbmV4cG9ydCB7IGF0dGFjaywgcGlja1BsYWNlbWVudCwgYWxlcnRTaGlwSW5mb0NoYW5nZXN9O1xuIiwiaW1wb3J0IGNyZWF0ZUV2ZW50VGlsZXMgZnJvbSBcIi4uL2NvbW1vbi9jcmVhdGUtdGlsZXMvY3JlYXRlLWV2ZW50LXRpbGVzXCI7XG5pbXBvcnQgXCIuLi92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlclwiO1xuaW1wb3J0ICogYXMgcHVibGlzaERvbURhdGEgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRvbS1kYXRhL3B1Ymxpc2gtZG9tLWRhdGFcIjtcblxuY29uc3QgZ2FtZUJvYXJkRGl2VXNlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2FtZWJvYXJkLS11c2VyXCIpO1xuXG5jb25zdCBpbnB1dHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBsYWNlbWVudC1mb3JtX19pbnB1dFwiKTtcblxuaW5wdXRzLmZvckVhY2goKGlucHV0KSA9PiB7XG4gIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcyk7XG59KTtcblxuY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRG9tRGF0YS5waWNrUGxhY2VtZW50KTtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSBcIi4uL2NvbW1vbi9wdWItc3ViL3B1Yi1zdWJcIjtcblxuY29uc3QgYXR0YWNrID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBwaWNrUGxhY2VtZW50ID0gbmV3IFB1YlN1YigpO1xuXG5jb25zdCBpbnB1dCA9IG5ldyBQdWJTdWIoKTtcblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgdXNlckNsaWNrICovXG5cbmV4cG9ydCB7cGlja1BsYWNlbWVudCwgYXR0YWNrLCBpbnB1dH0iLCJjbGFzcyBTaGlwSW5mb1VzZXIge1xuICBjb25zdHJ1Y3RvciAobnVtLCBsZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIHRoaXMubnVtID0gbnVtO1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcEluZm9Vc2VyO1xuXG4iLCJpbXBvcnQgU2hpcEluZm9Vc2VyIGZyb20gXCIuL3NoaXAtaW5mby0tdXNlclwiO1xuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIjtcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi8uLi9jb21tb24vcHVibGlzaC1kb20tZGF0YS9wdWJsaXNoLWRvbS1kYXRhXCI7XG5pbXBvcnQgZGlzcGxheVJhZGlvVmFsdWUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWVcIjtcblxuY29uc3Qgc2hpcFBsYWNlbWVudCA9IHtcbiAgbnVtOiAwLFxuICB1cGRhdGVOdW0odmFsdWUpIHtcbiAgICB0aGlzLm51bSA9IHZhbHVlO1xuICAgIHB1Ymxpc2hEb21EYXRhLmFsZXJ0U2hpcEluZm9DaGFuZ2VzKCk7XG4gIH0sXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVTaGlwSW5mbygpIHtcbiAgY29uc29sZS5sb2coXCJzaGlwY3JlYXRlZFJVblwiKTtcbiAgY29uc3QgeyBudW0gfSA9IHNoaXBQbGFjZW1lbnQ7XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIHJldHVybiBuZXcgU2hpcEluZm9Vc2VyKG51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xufVxuXG51c2VyQ2xpY2sucGlja1BsYWNlbWVudC5zdWJzY3JpYmUoc2hpcFBsYWNlbWVudC51cGRhdGVOdW0uYmluZChzaGlwUGxhY2VtZW50KSk7XG5cbnVzZXJDbGljay5pbnB1dC5zdWJzY3JpYmUoY3JlYXRlU2hpcEluZm8pO1xuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsIlB1YlN1YiIsImNvbnN0cnVjdG9yIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwdWJsaXNoIiwicGF5bG9hZCIsImZvckVhY2giLCJ1c2VyQ2xpY2siLCJhdHRhY2siLCJkYXRhc2V0IiwicGlja1BsYWNlbWVudCIsImFsZXJ0U2hpcEluZm9DaGFuZ2VzIiwiaW5wdXQiLCJwdWJsaXNoRG9tRGF0YSIsImdhbWVCb2FyZERpdlVzZXIiLCJxdWVyeVNlbGVjdG9yIiwiaW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsIlNoaXBJbmZvVXNlciIsIm51bSIsImxlbmd0aCIsImRpcmVjdGlvbiIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInZhbHVlIiwiY3JlYXRlU2hpcEluZm8iLCJjb25zb2xlIiwibG9nIiwiYmluZCIsIm5hbWUiLCJjaGVja2VkIl0sInNvdXJjZVJvb3QiOiIifQ==