// create coordinate arr for ship placement

import createCoordinate from "../createCoordinate/createCoordinate";

function createRestCoor(arr, length, direction) {
  for (let i = 1; i < length; i += 1) {
    if (direction === "horizontal") {
      arr.push(arr[i - 1] + 1);
    } else {
      arr.push(arr[i - 1] + 10);
    }
  }
  return arr;
}

function checkIfFits(tileNum, length, direction) {
  if (direction === "horizontal") {
    let tensString = tileNum.toString().charAt(0); 
    tensString += "0";
    const max = +(tensString) + 10;
    if (tileNum + (length -1) <= max) {
      return true;
    }
  } else if (direction === "vertical") {
    if (tileNum + ((length - 1) * 10) < 100) {
      return true;
    }
  }
  return false
}


const createCoorArr = {
  
  random(length, direction) {
    const arr = [createCoordinate(length, direction)];
    return createRestCoor(arr, length, direction);
  },
  
  deliberate(tileNum, length, direction) {
    if (checkIfFits(tileNum, length, direction)) {
      const arr = [tileNum];
      return createRestCoor(arr, length, direction);
    } 
    return Error("Ship would not fit")
  }

}


export default createCoorArr;
