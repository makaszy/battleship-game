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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _create_single_tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-single-tile */ \"./src/components/common/create-tiles/create-tile/create-single-tile.js\");\n\nfunction createSingleEventTile(id, callback) {\n  const tile = (0,_create_single_tile__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(id);\n  tile.addEventListener(\"dblclick\", callback);\n  return tile;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createSingleEventTile);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/create-tiles/create-tile/create-single-event-tile.js?");

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

/***/ "./src/components/common/get-data-id/get-data-id.js":
/*!**********************************************************!*\
  !*** ./src/components/common/get-data-id/get-data-id.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nfunction getDataId(event) {\n  return event.target.getAttribute(\"dataid\");\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (getDataId);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/get-data-id/get-data-id.js?");

/***/ }),

/***/ "./src/components/layout/layout--attack-stage.js":
/*!*******************************************************!*\
  !*** ./src/components/layout/layout--attack-stage.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ \"./src/components/common/create-tiles/create-event-tiles.js\");\n/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ \"./src/components/common/create-tiles/create-tiles.js\");\n/* harmony import */ var _common_get_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/get-data-id/get-data-id */ \"./src/components/common/get-data-id/get-data-id.js\");\n\n\n\nconst gameBoardDivUser = document.querySelector(\".gameboard--user\");\nconst gameBoardDivComputer = document.querySelector(\".gameboard--computer\");\n(0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(gameBoardDivUser);\n(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameBoardDivComputer, _common_get_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n\n//# sourceURL=webpack://battleship-game/./src/components/layout/layout--attack-stage.js?");

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