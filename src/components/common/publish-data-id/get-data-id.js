import { userClick } from "../../pub-subs/attack--user"

function attack() {
  userClick.publish(this.dataset.id);
}

export {attack};
