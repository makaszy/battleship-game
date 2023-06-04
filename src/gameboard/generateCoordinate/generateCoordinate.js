import getRandomNum from "../randomNum"

function generateCoordinate(length, direction) {
  if (direction === "horizontal") {
    return +(getRandomNum(11).toString() + getRandomNum(11 - length))
  } else if (direction === "vertical") {
    return +(getRandomNum(11 - length).toString() + getRandomNum(11))
  }
}

export {generateCoordinate}