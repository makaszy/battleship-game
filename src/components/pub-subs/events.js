import PubSub from "../common/pub-sub/pub-sub";

const attack = new PubSub();

const pickPlacement = new PubSub();

const input = new PubSub();

/* createShipInfo() publishes a shipInfo obj. gameboard.publishValidity is subscribed and checks whether a ship can be placed there */
const shipInfo = new PubSub();

/* gameboard.publishValidity publishes an obj with a boo. valid property and a list of coordinates.   */
const validityViews = new PubSub();

/* Files are imported * as userClick */

export {pickPlacement, attack, input, shipInfo, validityViews}