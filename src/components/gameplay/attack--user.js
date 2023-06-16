import PubSub from "../common/pub-sub/pub-sub";

const userAttack = new PubSub();

const receiveUserAttack = new PubSub();

export { userAttack, receiveUserAttack };
