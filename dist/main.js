/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/common/create-tiles/create-event-tiles.js":
/*!******************************************************************!*\
  !*** ./src/components/common/create-tiles/create-event-tiles.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _create_tile_create_single_event_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-tile/create-single-event-tile */ \"./src/components/common/create-tiles/create-tile/create-single-event-tile.js\");\n\nfunction createEventTiles(div, callback) {\n  for (let i = 1; i <= 100; i += 1) {\n    div.appendChild((0,_create_tile_create_single_event_tile__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(i, callback));\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createEventTiles);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/create-tiles/create-event-tiles.js?");

/***/ }),

/***/ "./src/components/common/create-tiles/create-tile/create-single-event-tile.js":
/*!************************************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tile/create-single-event-tile.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _create_single_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-single-tile */ \"./src/components/common/create-tiles/create-tile/create-single-tile.js\");\n\nfunction createSingleEventTile(id, callback) {\n  const tile = (0,_create_single_tile__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(id);\n  tile.addEventListener(\"click\", callback);\n  return tile;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createSingleEventTile);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/create-tiles/create-tile/create-single-event-tile.js?");

/***/ }),

/***/ "./src/components/common/create-tiles/create-tile/create-single-tile.js":
/*!******************************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tile/create-single-tile.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nfunction createSingleTile(id) {\n  const tile = document.createElement(\"div\");\n  tile.classList.add(\"gameboard__tile\");\n  tile.setAttribute(\"data-id\", id);\n  return tile;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createSingleTile);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/create-tiles/create-tile/create-single-tile.js?");

/***/ }),

/***/ "./src/components/common/create-tiles/create-tiles.js":
/*!************************************************************!*\
  !*** ./src/components/common/create-tiles/create-tiles.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _create_tile_create_single_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-tile/create-single-tile */ \"./src/components/common/create-tiles/create-tile/create-single-tile.js\");\n\nfunction createTiles(div) {\n  for (let i = 1; i <= 100; i += 1) {\n    div.appendChild((0,_create_tile_create_single_tile__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(i));\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createTiles);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/create-tiles/create-tiles.js?");

/***/ }),

/***/ "./src/components/common/player/player.js":
/*!************************************************!*\
  !*** ./src/components/common/player/player.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nclass Player {\n  previousAttacks = [];\n  get attackArr() {\n    return this.previousAttacks;\n  }\n  set attackArr(value) {\n    this.previousAttacks.push(value);\n  }\n  isNew(value) {\n    return !this.attackArr.includes(value);\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Player);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/player/player.js?");

/***/ }),

/***/ "./src/components/common/pub-sub/pub-sub.js":
/*!**************************************************!*\
  !*** ./src/components/common/pub-sub/pub-sub.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nclass PubSub {\n  constructor() {\n    this.subscribers = [];\n  }\n  subscribe(subscriber) {\n    if (typeof subscriber !== 'function') {\n      throw new Error(`${typeof subscriber} is not a valid argument, provide a function instead`);\n    }\n    this.subscribers.push(subscriber);\n  }\n  unsubscribe(subscriber) {\n    if (typeof subscriber !== 'function') {\n      throw new Error(`${typeof subscriber} is not a valid argument, provide a function instead`);\n    }\n    this.subscribers = this.subscribers.filter(sub => sub !== subscriber);\n  }\n  publish(payload) {\n    this.subscribers.forEach(subscriber => subscriber(payload));\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (PubSub);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/pub-sub/pub-sub.js?");

/***/ }),

/***/ "./src/components/common/publish-data-id/get-data-id.js":
/*!**************************************************************!*\
  !*** ./src/components/common/publish-data-id/get-data-id.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gameplay_attack_user__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../gameplay/attack--user */ \"./src/components/gameplay/attack--user.js\");\n\nfunction publishDataId() {\n  _gameplay_attack_user__WEBPACK_IMPORTED_MODULE_0__.userClick.publish(this.dataset.id);\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (publishDataId);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/publish-data-id/get-data-id.js?");

/***/ }),

/***/ "./src/components/gameplay/attack--user.js":
/*!*************************************************!*\
  !*** ./src/components/gameplay/attack--user.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   receiveUserAttack: function() { return /* binding */ receiveUserAttack; },\n/* harmony export */   userAttack: function() { return /* binding */ userAttack; },\n/* harmony export */   userClick: function() { return /* binding */ userClick; }\n/* harmony export */ });\n/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ \"./src/components/common/pub-sub/pub-sub.js\");\n\nconst userClick = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst userAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst receiveUserAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack://battleship-game/./src/components/gameplay/attack--user.js?");

/***/ }),

/***/ "./src/components/layout/layout--attack-stage.js":
/*!*******************************************************!*\
  !*** ./src/components/layout/layout--attack-stage.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ \"./src/components/common/create-tiles/create-event-tiles.js\");\n/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ \"./src/components/common/create-tiles/create-tiles.js\");\n/* harmony import */ var _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/publish-data-id/get-data-id */ \"./src/components/common/publish-data-id/get-data-id.js\");\n/* harmony import */ var _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/player--user/player--user */ \"./src/components/views/player--user/player--user.js\");\n/* harmony import */ var _gameplay_attack_user__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../gameplay/attack--user */ \"./src/components/gameplay/attack--user.js\");\n\n\n\n\n\nconst gameBoardDivUser = document.querySelector(\".gameboard--user\");\nconst gameBoardDivComputer = document.querySelector(\".gameboard--computer\");\nconst player = new _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_3__[\"default\"]();\n_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_4__.userClick.subscribe(player.attack);\n(0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(gameBoardDivUser);\n(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameBoardDivComputer, _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n//# sourceURL=webpack://battleship-game/./src/components/layout/layout--attack-stage.js?");

/***/ }),

/***/ "./src/components/views/player--user/player--user.js":
/*!***********************************************************!*\
  !*** ./src/components/views/player--user/player--user.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ \"./src/components/common/player/player.js\");\n\nclass UserPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  attack = value => {\n    if (super.isNew(value)) {\n      super.attackArr = value;\n      return value;\n    }\n    return Error(\"Tile has already been attacked\");\n  };\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (UserPlayer);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/player--user/player--user.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_layout_layout_attack_stage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/layout/layout--attack-stage */ \"./src/components/layout/layout--attack-stage.js\");\n\n\n//# sourceURL=webpack://battleship-game/./src/index.js?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;