import PubSub from "../common/pub-sub/pub-sub";

const initComputerGameboard = new PubSub();
const initUserPlayer = new PubSub();



export {initUserPlayer, initComputerGameboard}  ;