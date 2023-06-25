import * as userClick from "../../pub-subs/events";

/* triggers when a user picks a coordinate to attack */

function attack() {
  userClick.attack.publish(this.dataset.id);
}

/* triggers shipPlacement.updateNum in ship-info__views--user which stores the user's current ship placement pick. Once updated userClick.input.publish() is run */

function pickPlacement() {
  userClick.pickPlacement.publish(this.dataset.id);
}

/* triggers createShipInfo func in ship-info__views--user when user clicked an input */

function alertShipInfoChanges() {
  userClick.input.publish();
}

/* Files are imported * as publishDomData */

export { attack, pickPlacement, alertShipInfoChanges};
