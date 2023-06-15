import createTile from "./createTile/createTile";

function createTiles(div) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild(createTile(i)) ;
  }
}

export default createTiles