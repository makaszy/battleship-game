

function miss(obj) {
  const tile = document.querySelector(`gameboard--computer data=${obj.tile}`);
  tile.classList.add("miss");
}

function hit(obj) {
  const tile = document.querySelector(`gameboard--computer data=${obj.tile}`);
  tile.classList.add("hit");
}

function sunk(obj) {
  obj.tiles.forEach(element => {
    const tile = document.querySelector(`.gameboard--computer data=${element}`);
    tile.classList.remove("hit");
    tile.classList.add("sunk");
  });
}

function receiveAttack(obj ) {
  if (obj.sunk) {
    sunk(obj)
  } else if (obj.hit) {
    hit(obj)
  } else {
    miss(obj)
  }
}

export default receiveAttack;

