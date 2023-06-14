import ComputerPlayer from "./computerPlayer";

test("Computer player returns a number smaller than 100", () => {
  const player = new ComputerPlayer();
  let arr = [];
  function isBelow(value) {
    return value > 100
  }
  for (let i = 0; i< 100; i++) {
    arr.push(player.attack());
  }

  expect(arr.every(isBelow)).toBe(true)
})