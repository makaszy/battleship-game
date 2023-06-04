import getRandomNum from "../randomNum"

function direction() {
  return (getRandomNum(2) == 1) ? "horizontal" : "vertical"
}

export {direction}
