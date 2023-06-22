import GameBoardViewUpdater from "../../common/gameboard-view-updater/gameboard-view-updater";
import { handleUserAttack } from "../../gameplay/attack--user";

const computer = "computer"

const computerViewUpdater = new GameBoardViewUpdater(computer);

handleUserAttack.subscribe(computerViewUpdater.handleAttackView)

export default computerViewUpdater;