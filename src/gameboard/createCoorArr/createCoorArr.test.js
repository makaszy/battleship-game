import createCoorArr from "./createCoorArr";

test("Func generates the right amount of coordinates ex.1", () => {
  expect(createCoorArr(3, "horizontal")).toHaveLength(3);
});

test("Func generates the right amount of coordinates ex.2", () => {
  expect(createCoorArr(5, "horizontal")).toHaveLength(5);
});

test("Func generates an array", () => {
  expect(Array.isArray(createCoorArr(5,"horizontal"))).toBe(true);
})

test("Func generates the right coordinates for vertical direction ex. 1", () => {
// subtract the generated number from each item in the arr
  const arr = createCoorArr(3, "vertical");
  const arr2 = arr.map(x => x - arr[0])
// when reduced to one number should equal 30
  expect(arr2.reduce((acc, red) => acc + red)).toBe(30)
});


test("Func generates the right coordinates for vertical direction ex. 2", () => {

  const arr = createCoorArr(4, "vertical");
  const arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(60)
});

test("Func generates the right coordinates for horizontal direction ex. 1", () => {

  const arr = createCoorArr(4, "horizontal");
  const arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(6)
});

test("Func generates the right coordinates for horizontal direction ex. 2", () => {

  const arr = createCoorArr(3, "horizontal");
  const arr2 = arr.map(x => x - arr[0])

  expect(arr2.reduce((acc, red) => acc + red)).toBe(3)
});