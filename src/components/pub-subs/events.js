import PubSub from "../common/pub-sub/pub-sub";

const attack = new PubSub();

const pickPlacement = new PubSub();

const input = new PubSub();

/* Files are imported * as userClick */

export {pickPlacement, attack, input}