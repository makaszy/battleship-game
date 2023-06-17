function addHitOrMissClass(obj, tile) {
  if (obj.hit) {
    tile.classList.add("hit")
  } else {
    tile.classList.add("miss")
  }
}

export default addHitOrMissClass;