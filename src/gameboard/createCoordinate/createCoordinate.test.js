import createCoordinate  from "./createCoordinate";

test("createCoordinate test horizontal 1", () => {
  const arr = [];
  function isBelow(value) {
    return value <= 4;
  }
  for (let i = 0; i < 100; i += 1) {
    const coordinate = createCoordinate(6, "horizontal");
    arr.push(+coordinate.toString().slice(-1));
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test horizontal 2", () => {
  const arr = [];
  function isBelow(value) {
    return value <= 5;
  }

  for (let i = 0; i < 100; i += 1) {
    const coordinate = createCoordinate(5, "horizontal");
    arr.push(+coordinate.toString().slice(-1));
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test vertical 1", () => {
  const arr = [];
  function isBelow(value) {
    return value <= 4;
  }
  for (let i = 0; i < 100; i += 1) {
    const coordinate = createCoordinate(6, "vertical");
    if (coordinate >= 10) {
      // excludes values smaller than 10 since they would still be correct but result in a false positive for test
      arr.push(+coordinate.toString().slice(0, 1));
    }
  }
  expect(arr.every(isBelow)).toBe(true);
});

test("createCoordinate test vertical 2", () => {
  const arr = [];
  function isBelow(value) {
    return value <= 5;
  }
  for (let i = 0; i < 100; i += 1) {
    const coordinate = createCoordinate(5, "vertical");
    if (coordinate >= 10) {
      arr.push(+coordinate.toString().slice(0, 1));
    }
  }
  expect(arr.every(isBelow)).toBe(true);
});
