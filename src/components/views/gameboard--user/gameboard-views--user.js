import GameBoardViewUpdater from "../../common/gameboard-view-updater/gameboard-view-updater";
import { handleComputerAttack } from "../../pub-subs/attack--computer"
import * as userClick from "../../pub-subs/events"

class GameBoardUserViewUpdater extends GameBoardViewUpdater {
 
  static clearValidityView() {
    const tiles = document.querySelectorAll(".gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove("placement--valid");
      tile.classList.remove("placement--invalid");
    })
  }

 /* adds the visual class placement--valid/or placement--invalid based on the tileNum chosen by the user */

  handlePlacementValidityView = (obj) => {
    this.constructor.clearValidityView();
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(
        `.gameboard--${this.string} [data-id="${coordinate}"]`
      );
      (obj.valid) ? tile.classList.add("placement--valid") : tile.classList.add("placement--invalid");
    });
  }

  


}

const user = "user";

const userViewUpdater = new GameBoardUserViewUpdater(user);

handleComputerAttack.subscribe(userViewUpdater.handleAttackView);
userClick.validityViews.subscribe(userViewUpdater.handlePlacementValidityView)

export default userViewUpdater;
