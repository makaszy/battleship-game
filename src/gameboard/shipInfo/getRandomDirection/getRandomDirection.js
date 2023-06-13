import getRandomNum from "../../randomNum";

function getRandomDirection() {
  return getRandomNum(2) === 1 ? "horizontal" : "vertical";
}

export default getRandomDirection;
