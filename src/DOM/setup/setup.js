import createTiles from "./createTiles/createTiles";

const gameBoardDivPlayer = document.querySelector(".gameboard--player");
const gameBoardDivPC = document.querySelector(".gameboard--pc")


createTiles(gameBoardDivPlayer);
createTiles(gameBoardDivPC);
