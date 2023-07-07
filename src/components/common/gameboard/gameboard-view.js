import * as init from "../../pub-subs/initialize"

class GameBoardView {

  /* string is used to query the correct gameboard, is computer or user */

  constructor(string) {  
    if (string !== "computer" && string !== "user") {
      throw new Error("GameBoardView created with incorrect string")
    } else {
      this.string = string;
    }
  }

  /* updates tiles classes from hit to sunk */

  static updateSunk(tile) {
    if (tile.classList.contains("hit")) {
      tile.classList.replace("hit", "sunk");
    } else {
      tile.classList.add("sunk");
    }
  }

  /* gets tile status */

  static getStatus(obj) {
    return obj.hit ? "hit" : "miss";
  }

  /* query tile based on string and data-id */

  queryTile = dataId => document.querySelector(`.gameboard--${this.string} [data-id="${dataId}"]`)

  /* once a ship is sunk replaces the hit class with sunk class on all the ships tiles */

  updateSunkTiles(obj) {
    obj.tiles.forEach((element) => {
      const tile = this.queryTile(element);
      GameBoardView.updateSunk(tile);
    });
  }

  /* labels tiles with hit, miss, sunk, classes. If all ship's sunk publishes the string to initialize game over pub sub */

  handleAttackView = (obj) => {
    if (obj.sunk) {
      this.updateSunkTiles(obj);
      if (obj.gameover) {
        init.gameover.publish(this.string)
      } 
    } else {
      const tile = this.queryTile(obj.tile);
      tile.classList.add(GameBoardView.getStatus(obj));
    }
  }
}

export default GameBoardView;
