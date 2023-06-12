import createCoorArr from "./createCoorArr"

test("Func generates the right amount of coordinates ex.1", () => {
  expect(createCoorArr({ tileNum: 21, length: 3, direction: "horizontal",})).toHaveLength(3);
});

test("Func generates the right amount of coordinates ex.2", () => {
  expect(createCoorArr({tileNum: 31, length: 5, direction: "horizontal",})).toHaveLength(5);
});

test("Func generates an array", () => {
  expect(Array.isArray(createCoorArr({ tileNum: 21, length: 3, direction: "horizontal",}))).toBe(true);
});

test ("Func generate coordinates in deliberate horizontal cases ex.1 ", () => {
  expect(createCoorArr({tileNum: 54, length: 3, direction: "horizontal"})).toStrictEqual([54, 55, 56])
})

test ("Func generate coordinates in deliberate horizontal cases ex.2 ", () => {
  expect(createCoorArr({tileNum: 78, length: 3, direction: "horizontal"})).toStrictEqual([78, 79, 80])
})


test ("Func generate coordinates in deliberate vertical cases ex.2", () => {
  expect(createCoorArr({tileNum: 52, length: 5, direction: "vertical"})).toStrictEqual([52, 62, 72, 82, 92])
})

test ("Func generate coordinates in deliberate vertical cases ex.1 ", () => {
  expect(createCoorArr({tileNum: 62, length: 3, direction: "vertical"})).toStrictEqual([62, 72, 82,])
})


