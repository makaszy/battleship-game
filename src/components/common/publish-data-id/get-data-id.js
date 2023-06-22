import { userClick } from "../../pub-subs/attack--user"

function publishDataId() {
  userClick.publish(this.dataset.id);
}

export default publishDataId;
