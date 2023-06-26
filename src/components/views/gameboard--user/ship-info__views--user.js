import ShipInfoUser from "./ship-info--user";
import * as userClick from "../../pub-subs/events";
import * as publishDomData from "../../common/publish-dom-data/publish-dom-data";
import displayRadioValue from "../../../utils/display-radio-value";

const shipPlacement = {
  tileNum: 0,
  updateNum(value) {
    this.tileNum = value;
    publishDomData.alertShipInfoChanges();
  },
};

function createShipInfo() {
  console.log("shipcreatedRun");

  const { tileNum } = shipPlacement;
  const length = displayRadioValue("ship");
  const direction = displayRadioValue("direction");

  const shipInfo = new ShipInfoUser(tileNum, length, direction)
  userClick.shipInfo.publish(shipInfo);
}

userClick.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));

userClick.input.subscribe(createShipInfo);
