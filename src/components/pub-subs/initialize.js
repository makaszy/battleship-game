import PubSub from "../common/pub-sub/pub-sub";

const computerGameboard = new PubSub();
const userPlayer = new PubSub();
const computerPlayer = new PubSub();



export {userPlayer, computerGameboard, computerPlayer}  ;