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
/* harmony export */   attack: function() { return /* binding */ attack; },
/* harmony export */   pickPlacement: function() { return /* binding */ pickPlacement; }
/* harmony export */ });
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pub-subs/events */ "./src/components/pub-subs/events.js");

function attack() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.attack.publish(this.dataset.id);
}
function pickPlacement() {
  _pub_subs_events__WEBPACK_IMPORTED_MODULE_0__.pickPlacement.publish(this.dataset.id);
}

/* Files are imported * as publishDataId */



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
/* harmony import */ var _pub_subs_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../pub-subs/events */ "./src/components/pub-subs/events.js");




const gameBoardDivUser = document.querySelector(".gameboard--user");
const inputs = document.querySelectorAll(".placement-form__input");
inputs.forEach(input => {
  input.addEventListener("click", _pub_subs_events__WEBPACK_IMPORTED_MODULE_3__.input.publish());
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
/* harmony import */ var _utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../utils/display-radio-value */ "./src/utils/display-radio-value.js");



const shipPlacement = {
  num: 0,
  updateNum(value) {
    this.num = value;
    console.log(this.num);
    _pub_subs_events__WEBPACK_IMPORTED_MODULE_1__.input.publish();
  }
};
function createShipInfo() {
  const length = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__["default"])("ship");
  const direction = (0,_utils_display_radio_value__WEBPACK_IMPORTED_MODULE_2__["default"])("direction");
  const {
    num
  } = shipPlacement;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Y29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLWV2ZW50LXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtdGlsZS9jcmVhdGUtc2luZ2xlLXRpbGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvY29tbW9uL3B1Yi1zdWIvcHViLXN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9jb21tb24vcHVibGlzaC1kYXRhLWlkL2dldC1kYXRhLWlkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAtZ2FtZS8uL3NyYy9jb21wb25lbnRzL2xheW91dC9sYXlvdXQtLXBsYWNlbWVudC1zdGFnZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy9wdWItc3Vicy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lLy4vc3JjL2NvbXBvbmVudHMvdmlld3MvZ2FtZWJvYXJkLS11c2VyL3NoaXAtaW5mby0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvY29tcG9uZW50cy92aWV3cy9nYW1lYm9hcmQtLXVzZXIvc2hpcC1pbmZvX192aWV3cy0tdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvLi9zcmMvdXRpbHMvZGlzcGxheS1yYWRpby12YWx1ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC1nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLWdhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlU2luZ2xlRXZlbnRUaWxlIGZyb20gXCIuL2NyZWF0ZS10aWxlL2NyZWF0ZS1zaW5nbGUtZXZlbnQtdGlsZVwiO1xuXG5mdW5jdGlvbiBjcmVhdGVFdmVudFRpbGVzKGRpdiwgY2FsbGJhY2spIHtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTAwOyBpICs9IDEpIHtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGksIGNhbGxiYWNrKSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUV2ZW50VGlsZXM7XG4iLCJpbXBvcnQgY3JlYXRlU2luZ2xlVGlsZSBmcm9tIFwiLi9jcmVhdGUtc2luZ2xlLXRpbGVcIjtcblxuZnVuY3Rpb24gY3JlYXRlU2luZ2xlRXZlbnRUaWxlKGlkLCBjYWxsYmFjaykge1xuICBjb25zdCB0aWxlID0gY3JlYXRlU2luZ2xlVGlsZShpZCk7XG4gIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIHRpbGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNpbmdsZUV2ZW50VGlsZSIsImZ1bmN0aW9uIGNyZWF0ZVNpbmdsZVRpbGUoaWQpIHtcbiAgY29uc3QgdGlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIHRpbGUuY2xhc3NMaXN0LmFkZChcImdhbWVib2FyZF9fdGlsZVwiKTtcbiAgdGlsZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLWlkXCIsIGlkKVxuICByZXR1cm4gdGlsZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2luZ2xlVGlsZTsiLCJjbGFzcyBQdWJTdWIge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXVxuICB9XG5cbiAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChzdWJzY3JpYmVyKVxuICB9XG4gXG4gIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBpZih0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dHlwZW9mIHN1YnNjcmliZXJ9IGlzIG5vdCBhIHZhbGlkIGFyZ3VtZW50LCBwcm92aWRlIGEgZnVuY3Rpb24gaW5zdGVhZGApXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLmZpbHRlcihzdWIgPT4gc3ViIT09IHN1YnNjcmliZXIpXG4gIH1cblxuICBwdWJsaXNoKHBheWxvYWQpIHtcbiAgICB0aGlzLnN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyKHBheWxvYWQpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFB1YlN1YjtcbiIsIlxuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi8uLi9wdWItc3Vicy9ldmVudHNcIlxuXG5mdW5jdGlvbiBhdHRhY2soKSB7XG4gIHVzZXJDbGljay5hdHRhY2sucHVibGlzaCh0aGlzLmRhdGFzZXQuaWQpO1xufVxuXG5mdW5jdGlvbiBwaWNrUGxhY2VtZW50KCkge1xuICB1c2VyQ2xpY2sucGlja1BsYWNlbWVudC5wdWJsaXNoKHRoaXMuZGF0YXNldC5pZClcbn1cblxuLyogRmlsZXMgYXJlIGltcG9ydGVkICogYXMgcHVibGlzaERhdGFJZCAqL1xuXG5leHBvcnQge2F0dGFjaywgcGlja1BsYWNlbWVudH07XG4iLCJpbXBvcnQgY3JlYXRlRXZlbnRUaWxlcyBmcm9tIFwiLi4vY29tbW9uL2NyZWF0ZS10aWxlcy9jcmVhdGUtZXZlbnQtdGlsZXNcIjtcbmltcG9ydCBcIi4uL3ZpZXdzL2dhbWVib2FyZC0tdXNlci9zaGlwLWluZm9fX3ZpZXdzLS11c2VyXCJcbmltcG9ydCAqIGFzIHB1Ymxpc2hEYXRhSWQgZnJvbSBcIi4uL2NvbW1vbi9wdWJsaXNoLWRhdGEtaWQvZ2V0LWRhdGEtaWRcIlxuaW1wb3J0ICogYXMgdXNlckNsaWNrIGZyb20gXCIuLi9wdWItc3Vicy9ldmVudHNcIlxuXG5cbmNvbnN0IGdhbWVCb2FyZERpdlVzZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdhbWVib2FyZC0tdXNlclwiKTtcblxuY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZW1lbnQtZm9ybV9faW5wdXRcIilcblxuXG5pbnB1dHMuZm9yRWFjaCgoaW5wdXQpID0+IHtcbiAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHVzZXJDbGljay5pbnB1dC5wdWJsaXNoKCkpXG4gIFxufSk7XG5cblxuY3JlYXRlRXZlbnRUaWxlcyhnYW1lQm9hcmREaXZVc2VyLCBwdWJsaXNoRGF0YUlkLnBpY2tQbGFjZW1lbnQpXG5cblxuXG5cblxuIiwiaW1wb3J0IFB1YlN1YiBmcm9tIFwiLi4vY29tbW9uL3B1Yi1zdWIvcHViLXN1YlwiO1xuXG5jb25zdCBhdHRhY2sgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IHBpY2tQbGFjZW1lbnQgPSBuZXcgUHViU3ViKCk7XG5cbmNvbnN0IGlucHV0ID0gbmV3IFB1YlN1YigpO1xuXG4vKiBGaWxlcyBhcmUgaW1wb3J0ZWQgKiBhcyB1c2VyQ2xpY2sgKi9cblxuZXhwb3J0IHtwaWNrUGxhY2VtZW50LCBhdHRhY2ssIGlucHV0fSIsImNsYXNzIFNoaXBJbmZvVXNlciB7XG4gIGNvbnN0cnVjdG9yIChudW0sIGxlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgdGhpcy5udW0gPSBudW07XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwSW5mb1VzZXI7XG5cbiIsImltcG9ydCBTaGlwSW5mb1VzZXIgZnJvbSBcIi4vc2hpcC1pbmZvLS11c2VyXCI7XG5pbXBvcnQgKiBhcyB1c2VyQ2xpY2sgZnJvbSBcIi4uLy4uL3B1Yi1zdWJzL2V2ZW50c1wiXG5pbXBvcnQgZGlzcGxheVJhZGlvVmFsdWUgZnJvbSBcIi4uLy4uLy4uL3V0aWxzL2Rpc3BsYXktcmFkaW8tdmFsdWVcIjtcblxuXG5jb25zdCBzaGlwUGxhY2VtZW50ID0ge1xuICBudW06IDAsXG4gIHVwZGF0ZU51bSh2YWx1ZSkge1xuICAgIFxuICAgIHRoaXMubnVtID0gdmFsdWU7XG4gICAgY29uc29sZS5sb2codGhpcy5udW0pXG4gICAgdXNlckNsaWNrLmlucHV0LnB1Ymxpc2goKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVNoaXBJbmZvKCkge1xuICBjb25zdCBsZW5ndGggPSBkaXNwbGF5UmFkaW9WYWx1ZShcInNoaXBcIik7XG5cbiAgY29uc3QgZGlyZWN0aW9uID0gZGlzcGxheVJhZGlvVmFsdWUoXCJkaXJlY3Rpb25cIik7XG5cbiAgY29uc3Qge251bX0gPSBzaGlwUGxhY2VtZW50XG5cbiAgcmV0dXJuIG5ldyBTaGlwSW5mb1VzZXIobnVtLCBsZW5ndGgsIGRpcmVjdGlvbilcbn1cblxudXNlckNsaWNrLnBpY2tQbGFjZW1lbnQuc3Vic2NyaWJlKHNoaXBQbGFjZW1lbnQudXBkYXRlTnVtLmJpbmQoc2hpcFBsYWNlbWVudCkpO1xuXG51c2VyQ2xpY2suaW5wdXQuc3Vic2NyaWJlKGNyZWF0ZVNoaXBJbmZvKTtcblxuIiwiXG5cbmZ1bmN0aW9uIGRpc3BsYXlSYWRpb1ZhbHVlKG5hbWUpIHtcbiAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTmFtZSBoYXMgdG8gYmUgYSBzdHJpbmchXCIpO1xuICB9XG4gIGNvbnN0IGlucHV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtuYW1lPVwiJHtuYW1lfVwiXWApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoaW5wdXRzW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0c1tpXS52YWx1ZSBcbiAgICAgIH0gICAgICAgICBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaXNwbGF5UmFkaW9WYWx1ZSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJuYW1lcyI6WyJjcmVhdGVTaW5nbGVFdmVudFRpbGUiLCJjcmVhdGVFdmVudFRpbGVzIiwiZGl2IiwiY2FsbGJhY2siLCJpIiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVTaW5nbGVUaWxlIiwiaWQiLCJ0aWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsIlB1YlN1YiIsImNvbnN0cnVjdG9yIiwic3Vic2NyaWJlcnMiLCJzdWJzY3JpYmUiLCJzdWJzY3JpYmVyIiwiRXJyb3IiLCJwdXNoIiwidW5zdWJzY3JpYmUiLCJmaWx0ZXIiLCJzdWIiLCJwdWJsaXNoIiwicGF5bG9hZCIsImZvckVhY2giLCJ1c2VyQ2xpY2siLCJhdHRhY2siLCJkYXRhc2V0IiwicGlja1BsYWNlbWVudCIsInB1Ymxpc2hEYXRhSWQiLCJnYW1lQm9hcmREaXZVc2VyIiwicXVlcnlTZWxlY3RvciIsImlucHV0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpbnB1dCIsIlNoaXBJbmZvVXNlciIsIm51bSIsImxlbmd0aCIsImRpcmVjdGlvbiIsImRpc3BsYXlSYWRpb1ZhbHVlIiwic2hpcFBsYWNlbWVudCIsInVwZGF0ZU51bSIsInZhbHVlIiwiY29uc29sZSIsImxvZyIsImNyZWF0ZVNoaXBJbmZvIiwiYmluZCIsIm5hbWUiLCJjaGVja2VkIl0sInNvdXJjZVJvb3QiOiIifQ==