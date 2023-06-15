import ComputerPlayer from "./computerPlayer";

const player = new ComputerPlayer();
  const arr = [];
  
  for (let i = 0; i < 100; i += 1) {
    arr.push(player.attack());
  }

test("Computer player returns a number smaller than 100", () => {
  function isBelow(value) {
    return value <= 100;
  }
  expect(arr.every(isBelow)).toBe(true)
})

test("Computer player returns numbers that don't repeat", () => {
  const duplicateNumberArr = arr.filter((element, index) => arr.indexOf(element) !== index);
  expect(duplicateNumberArr.length).toBe(0)
})

