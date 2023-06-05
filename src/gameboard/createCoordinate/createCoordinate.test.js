import { createCoordinate } from "./createCoordinate";

test("createCoordinate test horizontal 1", () => {
  let arr = [];
  function isBelow(value) {
    return value <= 4 ? true : false;
  }
  for (let i = 0; i < 100; i++) {
    let coordinate = createCoordinate(6, "horizontal");
    arr.push(+coordinate.toString().slice(-1));
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test horizontal 2", () => {
  let arr = [];
  function isBelow(value) {
    return value <= 5 ? true : false;
  }

  for (let i = 0; i < 100; i++) {
    let coordinate = createCoordinate(5, "horizontal");
    arr.push(+coordinate.toString().slice(-1));
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test vertical 1", () => {
  let arr = [];
  function isBelow(value) {
    return value <= 4 ? true : false;
  }
  for (let i = 0; i < 100; i++) {
    let coordinate = createCoordinate(6, "vertical");
    if (coordinate >= 10) {
      // excludes values smaller than 10 since they would still be correct but result in a false positive for test
      arr.push(+coordinate.toString().slice(0, 1));
    }
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test vertical 2", () => {
  let arr = [];
  function isBelow(value) {
    return value <= 5 ? true : false;
  }
  for (let i = 0; i < 100; i++) {
    let coordinate = createCoordinate(5, "vertical");
    if (coordinate >= 10) {
      arr.push(+coordinate.toString().slice(0, 1));
    }
  }
  expect(arr.every(isBelow)).toBe(true);
});
