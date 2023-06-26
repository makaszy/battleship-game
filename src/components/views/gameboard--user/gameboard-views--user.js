import GameBoardViewUpdater from "../../common/gameboard-view-updater/gameboard-view-updater";
import { handleComputerAttack } from "../../pub-subs/attack--computer"

class GameBoardUserViewUpdater extends GameBoardViewUpdater {
 
  clearValidityView() {
    tiles = document.querySelectorAll("gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove()
    }
  }
 
  handlePlacementValidityView(obj) {
    if (!obj.valid) {
      obj.coordinates.forEach(coordinate => {
        const tile = document.querySelector(
          `.gameboard--${this.string} [data-id="${coordinate}"]`
        );
        tile.classList.add()  
      });

    }
  }
}

const user = "user";

const userViewUpdater = new GameBoardViewUpdater(user);

handleComputerAttack.subscribe(userViewUpdater.handleAttackView);

export default userViewUpdater;
