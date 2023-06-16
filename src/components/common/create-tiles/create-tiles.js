import createSingleTile from "./create-tile/create-single-tile";

function createTiles(div) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild(createSingleTile(i)) ;
  }
}

export default createTiles