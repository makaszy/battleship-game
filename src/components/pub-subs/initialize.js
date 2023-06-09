import PubSub from "../common/pub-sub/pub-sub";

/* initializes the placement stage */

const placementStage = new PubSub();

/* initializes the attack stage */

const attackStage = new PubSub();

/* initializes game over div */

const gameover = new PubSub();

export { attackStage, placementStage, gameover }  ;