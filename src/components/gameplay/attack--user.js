import PubSub from "../common/pub-sub/pub-sub";

const userClick = new PubSub();

const userAttack = new PubSub();

const handleUserAttack = new PubSub();

export { userAttack, handleUserAttack, userClick };
