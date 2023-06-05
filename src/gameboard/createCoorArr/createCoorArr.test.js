import { createCoorArr } from "./createCoorArr";

test("Func generates the right amount of coordinates ex.1", () => {
  expect(createCoorArr(3, "horizontal").length).toBe(3);
});

test("Func generates the right amount of coordinates ex.2", () => {
  expect(createCoorArr(5, "horizontal").length).toBe(5);
});

test("Func generates an array", () => {
  expect(Array.isArray(createCoorArr(5,"horizontal"))).toBe(true);
})

test("Func generates the right coordinates for vertical direction ex. 1", () => {

  let arr = createCoorArr(3, "vertical");
  let arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(30)
});


test("Func generates the right coordinates for vertical direction ex. 2", () => {

  let arr = createCoorArr(4, "vertical");
  let arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(60)
});

test("Func generates the right coordinates for horizontal direction ex. 1", () => {

  let arr = createCoorArr(4, "horizontal");
  let arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(6)
});

test("Func generates the right coordinates for horizontal direction ex. 2", () => {

  let arr = createCoorArr(3, "horizontal");
  let arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(3)
});