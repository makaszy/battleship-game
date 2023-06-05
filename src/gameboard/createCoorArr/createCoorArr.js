// create coordinate arr for ship placement

import createCoordinate from "../createCoordinate/createCoordinate";

function createCoorArr(length, direction) {
  const arr = [createCoordinate(length, direction)];
  for (let i = 1; i < length; i += 1) {
    if (direction === "horizontal") { 
      arr.push(arr[i-1] + 1)
    } else { 
      arr.push(arr[i -1] + 10)
    };
  }
  return arr;
}

export default createCoorArr;
