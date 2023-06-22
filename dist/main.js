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

/***/ "./src/components/common/gameboard-view-updater/gameboard-view-updater.js":
/*!********************************************************************************!*\
  !*** ./src/components/common/gameboard-view-updater/gameboard-view-updater.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nclass GameBoardViewUpdater {\n  constructor(string) {\n    this.string = string;\n  }\n  static updateSunk(tile) {\n    if (tile.classList.contains(\"hit\")) {\n      tile.classList.replace(\"hit\", \"sunk\");\n    } else {\n      tile.classList.add(\"sunk\");\n    }\n  }\n  static getStatus(obj) {\n    return obj.hit ? \"hit\" : \"miss\";\n  }\n  updateSunkTiles(obj) {\n    obj.tiles.forEach(element => {\n      const tile = document.querySelector(`.gameboard--${this.string} [data-id=\"${element}\"]`);\n      GameBoardViewUpdater.updateSunk(tile);\n    });\n  }\n  handleAttackView = obj => {\n    console.log(\"handleAttack\");\n    if (obj.sunk) {\n      this.updateSunkTiles(obj);\n    } else {\n      const tile = document.querySelector(`.gameboard--${this.string} [data-id=\"${obj.tile}\"]`);\n      tile.classList.add(GameBoardViewUpdater.getStatus(obj));\n    }\n  };\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameBoardViewUpdater);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/gameboard-view-updater/gameboard-view-updater.js?");

/***/ }),

/***/ "./src/components/common/gameboard/gameboard.js":
/*!******************************************************!*\
  !*** ./src/components/common/gameboard/gameboard.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nclass GameBoard {\n  constructor(pubSub) {\n    this.pubSub = pubSub;\n  }\n  shipsArr = [];\n  get ships() {\n    return this.shipsArr;\n  }\n  set ships(value) {\n    if (Array.isArray(value)) {\n      this.shipsArr = this.shipsArr.concat(value);\n    } else {\n      this.shipsArr.push(value);\n    }\n  }\n  missedArr = [];\n\n  /* Checks if coordinates already have a ship on them */\n\n  isTaken(coordinates) {\n    for (let i = 0; i < coordinates.length; i += 1) {\n      for (let y = 0; y < this.ships.length; y += 1) {\n        if (this.ships[y].coordinates.includes(coordinates[i])) {\n          return true;\n        }\n      }\n    }\n    return false;\n  }\n\n  /* Checks if the num selected by player has a ship, if hit checks if ship is sunk, if sunk checks if game is over  */\n\n  handleAttack = num => {\n    console.log(\"pushed\");\n    for (let y = 0; y < this.ships.length; y += 1) {\n      if (this.ships[y].coordinates.includes(+num)) {\n        this.ships[y].hit();\n        if (this.ships[y].isSunk()) {\n          return this.pubSub.publish(Object.assign(this.isOver(), {\n            tiles: this.ships[y].coordinates\n          }));\n        }\n        return this.pubSub.publish({\n          tile: num,\n          hit: true,\n          sunk: false\n        });\n      }\n    }\n    this.missedArr.push(num);\n    return this.pubSub.publish({\n      tile: num,\n      hit: false,\n      sunk: false\n    });\n  };\n\n  /* Called when a ship is sunk, returns A) GAME OVER if all ships are sunk or B) SUNK if there's more ships left */\n\n  isOver() {\n    return this.ships.every(ship => ship.sunk === true) ? {\n      hit: true,\n      sunk: true,\n      gameover: true\n    } : {\n      hit: true,\n      sunk: true\n    };\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (GameBoard);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/gameboard/gameboard.js?");

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

/***/ "./src/components/common/ship/create-coordinates-arr/create-coor-arr.js":
/*!******************************************************************************!*\
  !*** ./src/components/common/ship/create-coordinates-arr/create-coor-arr.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* Creates a coordinate arr for a ship object's coordinates property from shipInfo object */\n\nfunction createCoorArr(obj) {\n  const arr = [obj.tileNum];\n  for (let i = 1; i < obj.length; i += 1) {\n    if (obj.direction === \"horizontal\") {\n      arr.push(arr[i - 1] + 1);\n    } else {\n      arr.push(arr[i - 1] + 10);\n    }\n  }\n  return arr;\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (createCoorArr);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/ship/create-coordinates-arr/create-coor-arr.js?");

/***/ }),

/***/ "./src/components/common/ship/ship.js":
/*!********************************************!*\
  !*** ./src/components/common/ship/ship.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _create_coordinates_arr_create_coor_arr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-coordinates-arr/create-coor-arr */ \"./src/components/common/ship/create-coordinates-arr/create-coor-arr.js\");\n\n\n/* Creates ship object from shipInfo object */\n\nclass Ship {\n  constructor(obj) {\n    this.length = obj.length;\n    this.coordinates = (0,_create_coordinates_arr_create_coor_arr__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(obj);\n  }\n  timesHit = 0;\n  sunk = false;\n  hit() {\n    this.timesHit += 1;\n  }\n  isSunk() {\n    if (this.timesHit === this.length) {\n      this.sunk = true;\n    }\n    return this.sunk;\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (Ship);\n\n//# sourceURL=webpack://battleship-game/./src/components/common/ship/ship.js?");

/***/ }),

/***/ "./src/components/gameplay/attack--computer.js":
/*!*****************************************************!*\
  !*** ./src/components/gameplay/attack--computer.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   computerAttack: function() { return /* binding */ computerAttack; },\n/* harmony export */   handleComputerAttack: function() { return /* binding */ handleComputerAttack; }\n/* harmony export */ });\n/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ \"./src/components/common/pub-sub/pub-sub.js\");\n\nconst computerAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst handleComputerAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack://battleship-game/./src/components/gameplay/attack--computer.js?");

/***/ }),

/***/ "./src/components/gameplay/attack--user.js":
/*!*************************************************!*\
  !*** ./src/components/gameplay/attack--user.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleUserAttack: function() { return /* binding */ handleUserAttack; },\n/* harmony export */   userAttack: function() { return /* binding */ userAttack; },\n/* harmony export */   userClick: function() { return /* binding */ userClick; }\n/* harmony export */ });\n/* harmony import */ var _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/pub-sub/pub-sub */ \"./src/components/common/pub-sub/pub-sub.js\");\n\nconst userClick = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst userAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\nconst handleUserAttack = new _common_pub_sub_pub_sub__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n\n\n//# sourceURL=webpack://battleship-game/./src/components/gameplay/attack--user.js?");

/***/ }),

/***/ "./src/components/layout/layout--attack-stage.js":
/*!*******************************************************!*\
  !*** ./src/components/layout/layout--attack-stage.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _views_gameboard_computer_gameboard_views_computer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/gameboard--computer/gameboard__views--computer */ \"./src/components/views/gameboard--computer/gameboard__views--computer.js\");\n/* harmony import */ var _views_gameboard_user_gameboard_views_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/gameboard--user/gameboard-views--user */ \"./src/components/views/gameboard--user/gameboard-views--user.js\");\n/* harmony import */ var _common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/create-tiles/create-event-tiles */ \"./src/components/common/create-tiles/create-event-tiles.js\");\n/* harmony import */ var _common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/create-tiles/create-tiles */ \"./src/components/common/create-tiles/create-tiles.js\");\n/* harmony import */ var _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/publish-data-id/get-data-id */ \"./src/components/common/publish-data-id/get-data-id.js\");\n/* harmony import */ var _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../views/player--user/player--user */ \"./src/components/views/player--user/player--user.js\");\n/* harmony import */ var _gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../gameplay/attack--user */ \"./src/components/gameplay/attack--user.js\");\n/* harmony import */ var _views_gameboard_computer_gameboard_computer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../views/gameboard--computer/gameboard--computer */ \"./src/components/views/gameboard--computer/gameboard--computer.js\");\n/* harmony import */ var _views_player_computer_player_computer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../views/player--computer/player--computer */ \"./src/components/views/player--computer/player--computer.js\");\n/* harmony import */ var _gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../gameplay/attack--computer */ \"./src/components/gameplay/attack--computer.js\");\n/* harmony import */ var _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../views/gameboard--user/gameboard--user */ \"./src/components/views/gameboard--user/gameboard--user.js\");\n\n\n\n\n\n\n\n\n\n\n\nconst gameBoardDivUser = document.querySelector(\".gameboard--user\");\nconst gameBoardDivComputer = document.querySelector(\".gameboard--computer\");\n(0,_common_create_tiles_create_tiles__WEBPACK_IMPORTED_MODULE_3__[\"default\"])(gameBoardDivUser);\n(0,_common_create_tiles_create_event_tiles__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(gameBoardDivComputer, _common_publish_data_id_get_data_id__WEBPACK_IMPORTED_MODULE_4__[\"default\"]);\nconst player = new _views_player_user_player_user__WEBPACK_IMPORTED_MODULE_5__[\"default\"](_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__.userAttack);\nconst computerBoard = new _views_gameboard_computer_gameboard_computer__WEBPACK_IMPORTED_MODULE_7__[\"default\"](_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__.handleUserAttack);\ncomputerBoard.placeShip(1);\ncomputerBoard.placeShip(1);\ncomputerBoard.placeShip(1);\ncomputerBoard.placeShip(1);\nconsole.log(computerBoard.ships);\n_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__.userClick.subscribe(player.attack);\n_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__.userAttack.subscribe(computerBoard.handleAttack);\nconst computerPlayer = new _views_player_computer_player_computer__WEBPACK_IMPORTED_MODULE_8__[\"default\"](_gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_9__.computerAttack);\nconst userBoard = new _views_gameboard_user_gameboard_user__WEBPACK_IMPORTED_MODULE_10__[\"default\"](_gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_9__.handleComputerAttack);\n_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_6__.userAttack.subscribe(computerPlayer.attack);\n_gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_9__.computerAttack.subscribe(userBoard.handleAttack);\n\n//# sourceURL=webpack://battleship-game/./src/components/layout/layout--attack-stage.js?");

/***/ }),

/***/ "./src/components/views/gameboard--computer/gameboard--computer.js":
/*!*************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/gameboard--computer.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard */ \"./src/components/common/gameboard/gameboard.js\");\n/* harmony import */ var _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/ship/ship */ \"./src/components/common/ship/ship.js\");\n/* harmony import */ var _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship-info/ship-info */ \"./src/components/views/gameboard--computer/ship-info/ship-info.js\");\n\n\n\nclass ComputerGameBoard extends _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  /* Recreates a random ship, until its coordinates are not taken. */\n\n  placeShip(length) {\n    let shipInfo = new _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__[\"default\"](length);\n    let ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](shipInfo);\n    while (this.isTaken(ship.coordinates)) {\n      shipInfo = new _ship_info_ship_info__WEBPACK_IMPORTED_MODULE_2__[\"default\"](length);\n      ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](shipInfo);\n    }\n    ;\n    this.ships = ship;\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (ComputerGameBoard);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--computer/gameboard--computer.js?");

/***/ }),

/***/ "./src/components/views/gameboard--computer/gameboard__views--computer.js":
/*!********************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/gameboard__views--computer.js ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ \"./src/components/common/gameboard-view-updater/gameboard-view-updater.js\");\n/* harmony import */ var _gameplay_attack_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../gameplay/attack--user */ \"./src/components/gameplay/attack--user.js\");\n\n\nconst computer = \"computer\";\nconst computerViewUpdater = new _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__[\"default\"](computer);\n_gameplay_attack_user__WEBPACK_IMPORTED_MODULE_1__.handleUserAttack.subscribe(computerViewUpdater.handleAttackView);\n/* harmony default export */ __webpack_exports__[\"default\"] = (computerViewUpdater);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--computer/gameboard__views--computer.js?");

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js":
/*!*********************************************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js ***!
  \*********************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../utils/get-random-num */ \"./src/utils/get-random-num.js\");\n\nfunction getRandomDirection() {\n  return (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(2) === 1 ? \"horizontal\" : \"vertical\";\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (getRandomDirection);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js?");

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js":
/*!*******************************************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js ***!
  \*******************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../utils/get-random-num */ \"./src/utils/get-random-num.js\");\n\n\n/* Create a random tileNum */\n\nfunction getRandomTileNum(length, direction) {\n  if (direction === \"horizontal\") {\n    return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(11).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(11 - length));\n  }\n  return +((0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(11 - length).toString() + (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(11));\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (getRandomTileNum);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js?");

/***/ }),

/***/ "./src/components/views/gameboard--computer/ship-info/ship-info.js":
/*!*************************************************************************!*\
  !*** ./src/components/views/gameboard--computer/ship-info/ship-info.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _get_random_direction_get_random_direction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-random-direction/get-random-direction */ \"./src/components/views/gameboard--computer/ship-info/get-random-direction/get-random-direction.js\");\n/* harmony import */ var _get_random_tile_num_get_random_tile_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./get-random-tile-num/get-random-tile-num */ \"./src/components/views/gameboard--computer/ship-info/get-random-tile-num/get-random-tile-num.js\");\n\n\nclass ShipInfo {\n  constructor(length) {\n    this.length = length;\n    this.direction = (0,_get_random_direction_get_random_direction__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n    this.tileNum = (0,_get_random_tile_num_get_random_tile_num__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(this.length, this.direction);\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (ShipInfo);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--computer/ship-info/ship-info.js?");

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard--user.js":
/*!*****************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard--user.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard/gameboard */ \"./src/components/common/gameboard/gameboard.js\");\n/* harmony import */ var _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/ship/ship */ \"./src/components/common/ship/ship.js\");\n\n\nclass UserGameBoard extends _common_gameboard_gameboard__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  /* Calculates the max acceptable tile for a ship depending on its start (tileNum).\n  for ex. If a ship is placed horizontally on tile 21 max would be 30  */\n\n  static calcMax(obj) {\n    if (obj.direction === \"horizontal\" && obj.tileNum > 10) {\n      const max = +`${obj.tileNum.toString().charAt(0)}0` + 10;\n      return max;\n    }\n    const max = obj.direction === \"horizontal\" ? 10 : 100;\n    return max;\n  }\n\n  /* Calculates the length of the ship in tile numbers. The minus -1 accounts for the tileNum that is added in the isTooBig func */\n\n  static calcLength(obj) {\n    return obj.direction === \"horizontal\" ? obj.length - 1 : (obj.length - 1) * 10;\n  }\n\n  /* Checks if the ship placement would be legal, or if the ship is too big to be placed on the tile */\n\n  static isTooBig(obj) {\n    const max = UserGameBoard.calcMax(obj);\n    const shipLength = UserGameBoard.calcLength(obj);\n    if (obj.tileNum + shipLength <= max) {\n      return false;\n    }\n    return true;\n  }\n\n  /* Checks if a ships coordinates are taken, if not places ship in shipsArr, otherwise returns false */\n\n  placeShip(obj) {\n    const ship = new _common_ship_ship__WEBPACK_IMPORTED_MODULE_1__[\"default\"](obj);\n    if (this.isTaken(ship.coordinates) || this.constructor.isTooBig(obj)) {\n      return Error(\"Ship couldn't be placed there\");\n    }\n    this.ships = ship;\n    return \"Ship Placed\";\n  }\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (UserGameBoard);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--user/gameboard--user.js?");

/***/ }),

/***/ "./src/components/views/gameboard--user/gameboard-views--user.js":
/*!***********************************************************************!*\
  !*** ./src/components/views/gameboard--user/gameboard-views--user.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/gameboard-view-updater/gameboard-view-updater */ \"./src/components/common/gameboard-view-updater/gameboard-view-updater.js\");\n/* harmony import */ var _gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../gameplay/attack--computer */ \"./src/components/gameplay/attack--computer.js\");\n\n\nconst user = \"user\";\nconst userViewUpdater = new _common_gameboard_view_updater_gameboard_view_updater__WEBPACK_IMPORTED_MODULE_0__[\"default\"](user);\n_gameplay_attack_computer__WEBPACK_IMPORTED_MODULE_1__.handleComputerAttack.subscribe(userViewUpdater.handleAttackView);\n/* harmony default export */ __webpack_exports__[\"default\"] = (userViewUpdater);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/gameboard--user/gameboard-views--user.js?");

/***/ }),

/***/ "./src/components/views/player--computer/player--computer.js":
/*!*******************************************************************!*\
  !*** ./src/components/views/player--computer/player--computer.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ \"./src/components/common/player/player.js\");\n/* harmony import */ var _utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../utils/get-random-num */ \"./src/utils/get-random-num.js\");\n\n\nclass ComputerPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(pubSub) {\n    super();\n    this.pubSub = pubSub;\n  }\n  attack = () => {\n    let num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(101);\n    while (!super.isNew(num)) {\n      num = (0,_utils_get_random_num__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(101);\n    }\n    super.attackArr = num;\n    this.pubSub.publish(num);\n    return num;\n  };\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (ComputerPlayer);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/player--computer/player--computer.js?");

/***/ }),

/***/ "./src/components/views/player--user/player--user.js":
/*!***********************************************************!*\
  !*** ./src/components/views/player--user/player--user.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _common_player_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/player/player */ \"./src/components/common/player/player.js\");\n\nclass UserPlayer extends _common_player_player__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor(pubSub) {\n    super();\n    this.pubSub = pubSub;\n  }\n  attack = value => {\n    if (super.isNew(value)) {\n      super.attackArr = value;\n      this.pubSub.publish(value);\n      return value;\n    }\n    throw new Error(\"Tile has already been attacked\");\n  };\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (UserPlayer);\n\n//# sourceURL=webpack://battleship-game/./src/components/views/player--user/player--user.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_layout_layout_attack_stage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/layout/layout--attack-stage */ \"./src/components/layout/layout--attack-stage.js\");\n\n\n//# sourceURL=webpack://battleship-game/./src/index.js?");

/***/ }),

/***/ "./src/utils/get-random-num.js":
/*!*************************************!*\
  !*** ./src/utils/get-random-num.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\nfunction getRandomNum(max) {\n  return Math.floor(Math.random() * max);\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (getRandomNum);\n\n//# sourceURL=webpack://battleship-game/./src/utils/get-random-num.js?");

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