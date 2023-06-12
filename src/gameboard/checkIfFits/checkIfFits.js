 
/* Checks if the location for a ship fits on the board */

function checkIfFits(obj) {
  if (obj.direction === "horizontal") {
    let tensString = obj.tileNum.toString().charAt(0); 
    tensString += "0";
    const max = +(tensString) + 10;
    if (obj.tileNum + (obj.length -1) <= max) {
      return true;
    }
  } else if (obj.direction === "vertical") {
    if (obj.tileNum + ((obj.length - 1) * 10) < 100) {
      return true;
    }
  }
  return false
}

export default checkIfFits