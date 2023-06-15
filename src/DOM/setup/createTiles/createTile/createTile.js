function createTile(id) {
  const tile = document.createElement("div");
  tile.classList.add("gameboard__tile");
  tile.setAttribute("id", id);
  return tile;
}

export default createTile;