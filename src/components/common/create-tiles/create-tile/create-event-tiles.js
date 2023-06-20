import createSingleEventTile from "./create-single-event-tile";

function createEventTiles(div, callback) {
  for (let i = 1; i <= 100; i += 1) {
    div.appendChild(createSingleEventTile(i, callback)) ;
  }
}
export default createEventTiles