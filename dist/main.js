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

/***/ "./src/DOM/setup/createTiles/createTile/createTile.js":
/*!************************************************************!*\
  !*** ./src/DOM/setup/createTiles/createTile/createTile.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nfunction createTile(id) {\n  const tile = document.createElement(\"div\");\n  tile.classList.add(\"gameboard__tile\");\n  tile.setAttribute(\"id\", id);\n  return tile;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createTile);\n\n//# sourceURL=webpack://battleship-game/./src/DOM/setup/createTiles/createTile/createTile.js?");

/***/ }),

/***/ "./src/DOM/setup/createTiles/createTiles.js":
/*!**************************************************!*\
  !*** ./src/DOM/setup/createTiles/createTiles.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _createTile_createTile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createTile/createTile */ \"./src/DOM/setup/createTiles/createTile/createTile.js\");\n\nfunction createTiles(div) {\n  for (let i = 1; i <= 100; i += 1) {\n    div.appendChild((0,_createTile_createTile__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(i));\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createTiles);\n\n//# sourceURL=webpack://battleship-game/./src/DOM/setup/createTiles/createTiles.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _DOM_setup_createTiles_createTiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOM/setup/createTiles/createTiles */ \"./src/DOM/setup/createTiles/createTiles.js\");\n\nconst gameBoardDivPlayer = document.querySelector(\".gameboard--player\");\nconst gameBoardDivPC = document.querySelector(\".gameboard--pc\");\n(0,_DOM_setup_createTiles_createTiles__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameBoardDivPlayer);\n(0,_DOM_setup_createTiles_createTiles__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(gameBoardDivPC);\n\n//# sourceURL=webpack://battleship-game/./src/index.js?");

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