class GameBoardViewUpdater {
  constructor(string) {
    this.string = string
  }

  static updateSunk(tile) {
    if (tile.classList.contains("hit")) {
      tile.classList.replace("hit", "sunk");
    } else {
      tile.classList.add("sunk");
    }
  }

  static getStatus(obj) {
    return (obj.hit) ? "hit" : "miss";
  }

  updateSunkTiles(obj) {
    obj.tiles.forEach(element => {
      const tile = document.querySelector(`.gameboard--${this.string} data=${element}`);
      GameBoardViewUpdater.updateSunk(tile);
    });
  }
  

  receiveAttackView(obj) {
    if (obj.sunk) {
      this.updateSunkTiles(obj);
    } else {
      const tile = document.querySelector(`.gameboard--${this.string} data=${obj.tile}`);
      tile.classList.add(GameBoardViewUpdater.getStatus(obj))
    }
  }
}




export default GameBoardViewUpdater;