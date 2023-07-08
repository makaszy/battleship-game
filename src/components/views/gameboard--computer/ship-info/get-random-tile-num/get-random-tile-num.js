import getRandomNum from "../../../../../utils/get-random-num";

/* create a random tileNum */

function getRandomTileNum(length, direction) {
  if (direction === "horizontal") {
    return +(getRandomNum(10).toString() + getRandomNum(11 - length).toString());
  }
  return +(getRandomNum(11- length).toString() + getRandomNum(10).toString());
}

export default getRandomTileNum;
