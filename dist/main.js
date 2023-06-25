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

/***/ "./src/components/common/publish-data-id/get-data-id.js":
/*!**************************************************************!*\
  !*** ./src/components/common/publish-data-id/get-data-id.js ***!
  \**************************************************************/
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
/* harmony import */ var _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/publish-data-id/get-data-id */ "./src/components/common/publish-data-id/get-data-id.js");



const gameBoardDivUser = document.querySelector(".gameboard--user");
const inputs = document.querySelectorAll(".placement-form__input");
inputs.forEach(input => {
  input.addEventListener("click", _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__.alertShipInfoChanges);
});
(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__["default"])(gameBoardDivUser, _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__.pickPlacement);

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
/* harmony import */ var _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/publish-data-id/get-data-id */ "./src/components/common/publish-data-id/get-data-id.js");
/* harmony import */ var _utils_display_radio_value__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../utils/display-radio-value */ "./src/utils/display-radio-value.js");




const shipPlacement = {
  num: 0,
  updateNum(value) {
    this.num = value;
    _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__.alertShipInfoChanges();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHVibGlzaC1kYXRhLWlkL2dldC1kYXRhLWlkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIGZyb20gXCIuL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50VGlsZXM7XG4iLCJpbXBvcnQgY3JlYXRlU2luZ2xlVGlsZSBmcm9tIFwiLi9jcmVhdGUtc2luZ2xlLXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gY3JlYXRlU2luZ2xlVGlsZShpZCk7XG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImZ1bmN0aW9uIGNyZWF0ZVNpbmdsZVRpbGUoaWQpIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlVGlsZTsiLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsImltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCI7XG5cbi8qIHRyaWdnZXJzIHdoZW4gYSB1c2VyIHBpY2tzIGEgY29vcmRpbmF0ZSB0byBhdHRhY2sgKi9cblxuZnVuY3Rpb24gYXR0YWNrKCkge1xuICB1c2VyQ2xpY2suYXR0YWNrLnB1Ymxpc2godGhpcy5kYXRhc2V0LmlkKTtcbn1cblxuLyogdHJpZ2dlcnMgc2hpcFBsYWNlbWVudC51cGRhdGVOdW0gaW4gc2hpcC1pbmZvX192aWV3cy0tdXNlciB3aGljaCBzdG9yZXMgdGhlIHVzZXIncyBjdXJyZW50IHNoaXAgcGxhY2VtZW50IHBpY2suIE9uY2UgdXBkYXRlZCB1c2VyQ2xpY2suaW5wdXQucHVibGlzaCgpIGlzIHJ1biAqL1xuXG5mdW5jdGlvbiBwaWNrUGxhY2VtZW50KCkge1xuICB1c2VyQ2xpY2sucGlja1BsYWNlbWVudC5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZCk7XG59XG5cbi8qIHRyaWdnZXJzIGNyZWF0ZVNoaXBJbmZvIGZ1bmMgaW4gc2hpcC1pbmZvX192aWV3cy0tdXNlciB3aGVuIHVzZXIgY2xpY2tlZCBhbiBpbnB1dCAqL1xuXG5mdW5jdGlvbiBhbGVydFNoaXBJbmZvQ2hhbmdlcygpIHtcbiAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbn1cblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgcHVibGlzaERvbURhdGEgKi9cblxuZXhwb3J0IHsgYXR0YWNrLCBwaWNrUGxhY2VtZW50LCBhbGVydFNoaXBJbmZvQ2hhbmdlc307XG4iLCJpbXBvcnQgY3JlYXRlRXZlbnRUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXNcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyXCI7XG5pbXBvcnQgKiBhcyBwdWJsaXNoRG9tRGF0YSBmcm9tIFwiLi4vY29tbW9uL3B1Ymxpc2gtZGF0YS1pZC9nZXQtZGF0YS1pZFwiO1xuXG5cbmNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcblxuY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIik7XG5cbmlucHV0cy5mb3JFYWNoKChpbnB1dCkgPT4ge1xuICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcHVibGlzaERvbURhdGEuYWxlcnRTaGlwSW5mb0NoYW5nZXMpO1xufSk7XG5cbmNyZWF0ZUV2ZW50VGlsZXMoZ2FtZUJvYXJkRGl2VXNlciwgcHVibGlzaERvbURhdGEucGlja1BsYWNlbWVudCk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gXCIuLi9jb21tb24vcHViLXN1Yi9wdWItc3ViXCI7XG5cbmNvbnN0IGF0dGFjayA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgcGlja1BsYWNlbWVudCA9IG5ldyBQdWJTdWIoKTtcblxuY29uc3QgaW5wdXQgPSBuZXcgUHViU3ViKCk7XG5cbi8qIEZpbGVzIGFyZSBpbXBvcnRlZCAqIGFzIHVzZXJDbGljayAqL1xuXG5leHBvcnQge3BpY2tQbGFjZW1lbnQsIGF0dGFjaywgaW5wdXR9IiwiY2xhc3MgU2hpcEluZm9Vc2VyIHtcbiAgY29uc3RydWN0b3IgKG51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICB0aGlzLm51bSA9IG51bTtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvblxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXBJbmZvVXNlcjtcblxuIiwiaW1wb3J0IFNoaXBJbmZvVXNlciBmcm9tIFwiLi9zaGlwLWluZm8tLXVzZXJcIjtcbmltcG9ydCAqIGFzIHVzZXJDbGljayBmcm9tIFwiLi4vLi4vcHViLXN1YnMvZXZlbnRzXCJcbmltcG9ydCAqIGFzIHB1Ymxpc2hEb21EYXRhIGZyb20gXCIuLi8uLi9jb21tb24vcHVibGlzaC1kYXRhLWlkL2dldC1kYXRhLWlkXCJcbmltcG9ydCBkaXNwbGF5UmFkaW9WYWx1ZSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZVwiO1xuXG5cbmNvbnN0IHNoaXBQbGFjZW1lbnQgPSB7XG4gIG51bTogMCxcbiAgdXBkYXRlTnVtKHZhbHVlKSB7XG4gICAgdGhpcy5udW0gPSB2YWx1ZTtcbiAgICBwdWJsaXNoRG9tRGF0YS5hbGVydFNoaXBJbmZvQ2hhbmdlcygpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlU2hpcEluZm8oKSB7XG4gIGNvbnNvbGUubG9nKFwic2hpcGNyZWF0ZWRSVW5cIilcbiAgY29uc3Qge251bX0gPSBzaGlwUGxhY2VtZW50XG4gIGNvbnN0IGxlbmd0aCA9IGRpc3BsYXlSYWRpb1ZhbHVlKFwic2hpcFwiKTtcbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG4gIHJldHVybiBuZXcgU2hpcEluZm9Vc2VyKG51bSwgbGVuZ3RoLCBkaXJlY3Rpb24pICBcbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKGNyZWF0ZVNoaXBJbmZvKTtcblxuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsIlB1YlN1YiIsImNvbnN0cnVjdG9yIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwdWJsaXNoIiwicGF5bG9hZCIsImZvckVhY2giLCJ1c2VyQ2xpY2siLCJhdHRhY2siLCJkYXRhc2V0IiwicGlja1BsYWNlbWVudCIsImFsZXJ0U2hpcEluZm9DaGFuZ2VzIiwiaW5wdXQiLCJwdWJsaXNoRG9tRGF0YSIsImdhbWVCb2FyZERpdlVzZXIiLCJxdWVyeVNlbGVjdG9yIiwiaW5wdXRzIiwicXVlcnlTZWxlY3RvckFsbCIsIlNoaXBJbmZvVXNlciIsIm51bSIsImxlbmd0aCIsImRpcmVjdGlvbiIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInZhbHVlIiwiY3JlYXRlU2hpcEluZm8iLCJjb25zb2xlIiwibG9nIiwiYmluZCIsIm5hbWUiLCJjaGVja2VkIl0sInNvdXJjZVJvb3QiOiIifQ==