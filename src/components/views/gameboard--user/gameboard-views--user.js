import GameBoardViewUpdater from "../../common/gameboard-view-updater/gameboard-view-updater";
import { handleComputerAttack } from "../../pub-subs/attack--computer";
import * as userClick from "../../pub-subs/events";
import * as init from "../../pub-subs/initialize";

class GameBoardUserViewUpdater extends GameBoardViewUpdater {
  btn = document.querySelector('.placement-form__place-btn')
  
  /* when a ship is placed the radio input for that ship is hidden */
  static hideRadio(obj) {
    const radioInput = document.querySelector(`#ship-${obj.length}`);
    radioInput.classList.add("hidden");
    const radioLabel = document.querySelector([`[for="ship-${obj.length}"]`])
    radioLabel.classList.add("hidden");
  }

  /* when a ship is placed the next radio input is checked so that you can't place two of the same ships twice,
     when there are no more ships to place nextShipChecked will initialize the attack stage */
  static nextShipChecked() {
    const radio = document.querySelector(`:not(.hidden)[name="ship"]`)
    
    console.log(radio)
    if (radio === null) {
      console.log("yess")
      init.attackStage.publish();
      /* Place publish for layout attack stage here */
    } else {
      radio.setAttribute("checked", "")
    }
    
  }

 /* Clears the validity check of the previous selection from the user gameboard. If it passes the check it unlocks the place ship btn */
   clearValidityView = () => {
    const tiles = document.querySelectorAll(".gameboard__tile");
    tiles.forEach(tile => {
      tile.classList.remove("placement--valid");
      tile.classList.remove("placement--invalid");
    })
    this.btn.removeAttribute("disabled")
  }

 /* adds the visual class placement--valid/or placement--invalid based on the tileNum chosen by the user, disables the submit btn if it fails placement check */

  handlePlacementValidityView = (obj) => {
    this.clearValidityView();
    if (!obj.valid) {
      this.btn.setAttribute("disabled", "")
    }
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(
        `.gameboard--${this.string} [data-id="${coordinate}"]`
      );
      if (obj.valid) {
        tile.classList.add("placement--valid")
      } else {
        tile.classList.add("placement--invalid")
      }
    })
  }

  handlePlacementView = (obj) => {
    this.clearValidityView();
    this.constructor.hideRadio(obj)
    this.constructor.nextShipChecked();
    obj.coordinates.forEach(coordinate => {
      const tile = document.querySelector(
        `.gameboard--${this.string} [data-id="${coordinate}"]`
      )
      tile.classList.add("placement--ship")
    })
  }
}




const user = "user";

const userViewUpdater = new GameBoardUserViewUpdater(user);

handleComputerAttack.subscribe(userViewUpdater.handleAttackView);
userClick.validityViews.subscribe(userViewUpdater.handlePlacementValidityView)
userClick.createShipView.subscribe(userViewUpdater.handlePlacementView)

export default userViewUpdater;
