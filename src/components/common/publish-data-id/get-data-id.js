
import * as userClick from "../../pub-subs/events"

function attack() {
  userClick.attack.publish(this.dataset.id);
}

function pickPlacement() {
  userClick.pickPlacement.publish(this.dataset.id)
}

/* Files are imported * as publishDataId */

export {attack, pickPlacement};
