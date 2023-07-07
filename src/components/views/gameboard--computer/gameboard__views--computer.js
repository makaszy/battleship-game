import GameBoardView from "../../common/gameboard/gameboard-view";
import { handleUserAttack } from "../../pub-subs/attack--user";

const computer = "computer";

const computerViewUpdater = new GameBoardView(computer);

handleUserAttack.subscribe(computerViewUpdater.handleAttackView);

export default computerViewUpdater;
