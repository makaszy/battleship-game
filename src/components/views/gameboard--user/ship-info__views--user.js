import ShipInfoUser from "./ship-info--user";
import * as userClick from "../../pub-subs/events";
import * as publishDomData from "../../common/publish-dom-data/publish-dom-data";
import displayRadioValue from "../../../utils/display-radio-value";

const shipPlacement = {
  num: 0,
  updateNum(value) {
    this.num = value;
    publishDomData.alertShipInfoChanges();
  },
};

function createShipInfo() {
  console.log("shipcreatedRUn");
  const { num } = shipPlacement;
  const length = displayRadioValue("ship");
  const direction = displayRadioValue("direction");
  return new ShipInfoUser(num, length, direction);
}

userClick.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));

userClick.input.subscribe(createShipInfo);
