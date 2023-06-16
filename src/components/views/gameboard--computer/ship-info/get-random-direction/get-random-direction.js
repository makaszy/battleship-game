import getRandomNum from "../../../../../utils/get-random-num";

function getRandomDirection() {
  return getRandomNum(2) === 1 ? "horizontal" : "vertical";
}

export default getRandomDirection;
