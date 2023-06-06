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
const createCoorArr = {
  
  random(length, direction) {
    const arr = [createCoordinate(length, direction)];
    return createRestCoor(arr, length, direction);
  },
  
  deliberate(tileNum, length, direction) {
    const arr = [tileNum];
    return createRestCoor(arr, length, direction);
  }

}


export default createCoorArr;
