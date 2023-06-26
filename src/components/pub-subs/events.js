import PubSub from "../common/pub-sub/pub-sub";

const attack = new PubSub();

const pickPlacement = new PubSub();

const input = new PubSub();

/* createShipInfo() publishes a shipInfo obj. gameboard.publishValidity is subscribed and checks whether a ship can be placed there */
const shipInfo = new PubSub();

/* gameboard.publishValidity publishes an obj with a boo. valid property and a list of coordinates.   */
const validityViews = new PubSub();

/* When place ship btn is pressed publishShipInfoCreate() will create shipInfo  */
const shipPlaceBtn = new PubSub();

/* When  publishShipInfoCreate() creates the shipInfo. The gameboard.placeShip  */
const createShip = new PubSub();

/* UserGameBoard.publishPlaceShip publishes ship coordinates. GameBoardUserViewUpdater.handlePlacementView adds placement-ship class to tiles  */
const createShipView = new PubSub();

/* Files are imported * as userClick */

export {pickPlacement, attack, input, shipInfo, validityViews, shipPlaceBtn, createShip, createShipView}