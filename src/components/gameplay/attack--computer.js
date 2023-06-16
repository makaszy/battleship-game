import PubSub from "../common/pub-sub/pub-sub";

const computerAttack = new PubSub();

const receiveComputerAttack = new PubSub();

export {computerAttack, receiveComputerAttack}