import GameBoardViewUpdater from "../../common/gameboard-view-updater/gameboard-view-updater";
import { handleComputerAttack } from "../../gameplay/attack--computer";

const user = "user";

const userViewUpdater = new GameBoardViewUpdater(user);

handleComputerAttack.subscribe(userViewUpdater.handleAttackView)

export default userViewUpdater;