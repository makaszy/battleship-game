import PubSub from "../common/pub-sub/pub-sub";

const placementStage = new PubSub();

/* initializes the attack stage */
const attackStage = new PubSub();

export { attackStage, placementStage }  ;