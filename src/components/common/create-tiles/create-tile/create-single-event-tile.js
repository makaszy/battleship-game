import createSingleTile from "./create-single-tile";

function createSingleEventTile(id, callback) {
  const tile = createSingleTile(id);
  tile.addEventListener("dblclick", callback);
  return tile;
}

export default createSingleEventTile