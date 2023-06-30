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
  resetNum() {
    this.tileNum = 0;
  }
};

function createShipInfo() {
  const { tileNum } = shipPlacement;
  const length = displayRadioValue("ship");
  const direction = displayRadioValue("direction");
  const shipInfo = new ShipInfoUser(tileNum, length, direction)
  return shipInfo
}

function publishShipInfoCheck() {
  const shipInfo = createShipInfo()
  userClick.shipInfo.publish(shipInfo);  
}

function publishShipInfoCreate() {
  const shipInfo = createShipInfo()
  const isComplete = Object.values(shipInfo).every(value => {
    if (value !== null && value !== undefined && value !== false && value !== 0) {
      return true;
    } return false
  })
  if (isComplete) {
    userClick.createShip.publish(shipInfo); 
    shipPlacement.resetNum(); 
  }
}

userClick.pickPlacement.subscribe(shipPlacement.updateNum.bind(shipPlacement));

userClick.input.subscribe(publishShipInfoCheck);
userClick.shipPlaceBtn.subscribe(publishShipInfoCreate)
