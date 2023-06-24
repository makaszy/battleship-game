import ShipInfoUser from "./ship-info--user";
import * as userClick from "../../pub-subs/events"


const shipPlacement = {
  num: null,
  updateNum(value) {
    console.log("updated")
    this.num = value;
    userClick.input.publish();
  }
}


function createShipInfo() {
  console.log("infoCreated")
  const length = document.querySelector("input[name=`ship`]").value

  const direction = document.querySelector("input[name=`direction`]").value

  const {num} = shipPlacement

  return new ShipInfoUser(num, length, direction)
}

userClick.pickPlacement.subscribe(shipPlacement.updateNum);

userClick.input.subscribe(createShipInfo);

