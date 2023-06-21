import PubSub from "../common/pub-sub/pub-sub";

const userClick = new PubSub();

const userAttack = new PubSub();

const receiveUserAttack = new PubSub();

export { userAttack, receiveUserAttack, userClick };
