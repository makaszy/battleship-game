import getRandomNum from "../../randomNum";

/* Create a random tileNum */

function getRandomTileNum(length, direction) {
  if (direction === "horizontal") {
    return +(getRandomNum(11).toString() + getRandomNum(11 - length));
  }
  return +(getRandomNum(11 - length).toString() + getRandomNum(11));
}

export default getRandomTileNum;
