import addHitOrMissClass from "../../common/add-hit-or-miss-class/add-hit-or-miss-class";

function addSunkClass(obj) {
  obj.tiles.forEach(element => {
    const tile = document.querySelector(`.gameboard--computer data=${element}`);
    tile.classList.remove("hit");
    tile.classList.add("sunk");
  });
}

function receiveAttack(obj ) {
  if (obj.sunk) {
    addSunkClass(obj)
  } else {
    const tile = document.querySelector(`gameboard--computer data=${obj.tile}`);
    addHitOrMissClass(obj, tile)
  }
}

export default receiveAttack;

