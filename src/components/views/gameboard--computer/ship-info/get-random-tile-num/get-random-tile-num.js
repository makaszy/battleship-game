import getRandomNum from "../../../../../utils/get-random-num";

/* create a random tileNum */

function getRandomTileNum(length, direction) {
  if (direction === "horizontal") {
    let num = +(getRandomNum(10).toString() + getRandomNum(11 - length).toString());
    while (num < 1 || num > 100) {
      num = +(getRandomNum(10).toString() + getRandomNum(11 - length).toString());
    }
    return num
  }
   let num = +(getRandomNum(11- length).toString() + getRandomNum(10).toString());
   while (num < 1 || num > 100) {
    num = +(getRandomNum(10).toString() + getRandomNum(11 - length).toString());
  }
  return num
}

export default getRandomTileNum;
