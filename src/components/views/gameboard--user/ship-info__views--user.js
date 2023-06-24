import ShipInfoUser from "./ship-info--user";
import * as userClick from "../../pub-subs/events"
import displayRadioValue from "../../../utils/display-radio-value";


const shipPlacement = {
  num: 0,
  updateNum(value) {
    
    this.num = value;
    console.log(this.num)
    userClick.input.publish();
  }
}


function createShipInfo() {
  const length = displayRadioValue("ship");

  const direction = displayRadioValue("direction");

  const {num} = shipPlacement

  return new ShipInfoUser(num, length, direction)
}

userClick.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));

userClick.input.subscribe(createShipInfo);

