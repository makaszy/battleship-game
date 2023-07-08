import GameBoardView from "../../common/gameboard/gameboard-view";
import { handleUserAttack } from "../../pub-subs/attack--user";

const computer = "computer";

const computerView = new GameBoardView(computer);

handleUserAttack.subscribe(computerView.handleAttackView);

