import createCoorArr from "./createCoorArr";

test("Func generates the right amount of coordinates ex.1", () => {
  expect(createCoorArr.random(3, "horizontal")).toHaveLength(3);
});

test("Func generates the right amount of coordinates ex.2", () => {
  expect(createCoorArr.random(5, "horizontal")).toHaveLength(5);
});

test("Func generates an array", () => {
  expect(Array.isArray(createCoorArr.random(5, "horizontal"))).toBe(true);
});

test("Func generates the right coordinates for vertical direction ex. 1", () => {
  // subtract the generated number from each item in the arr
  const arr = createCoorArr.random(3, "vertical");
  const arr2 = arr.map((x) => x - arr[0]);
  // when reduced to one number should equal 30
  expect(arr2.reduce((acc, red) => acc + red)).toBe(30);
});

test("Func generates the right coordinates for vertical direction ex. 2", () => {
  const arr = createCoorArr.random(4, "vertical");
  const arr2 = arr.map((x) => x - arr[0]);

  expect(arr2.reduce((acc, red) => acc + red)).toBe(60);
});

test("Func generates the right coordinates for horizontal direction ex. 1", () => {
  const arr = createCoorArr.random(4, "horizontal");
  const arr2 = arr.map((x) => x - arr[0]);

  expect(arr2.reduce((acc, red) => acc + red)).toBe(6);
});

test("Func generates the right coordinates for horizontal direction ex. 2", () => {
  const arr = createCoorArr.random(3, "horizontal");
  const arr2 = arr.map((x) => x - arr[0]);

  expect(arr2.reduce((acc, red) => acc + red)).toBe(3);
});


test ("Func generate coordinates in deliberate horizontal cases ex.1 ", () => {
  expect(createCoorArr.deliberate(54, 3, "horizontal")).toStrictEqual([54, 55, 56])
})

test ("Func generate coordinates in deliberate horizontal cases ex.2 ", () => {
  expect(createCoorArr.deliberate(78, 3, "horizontal")).toStrictEqual([78, 79, 80])
})

test ("Func throwsError in incorrect deliberate horizontal cases ex.1 ", () => {
  expect(createCoorArr.deliberate(79, 3, "horizontal")).toStrictEqual( Error("Ship would not fit"))
})

test ("Func generate coordinates in deliberate vertical cases ex.1 ", () => {
  expect(createCoorArr.deliberate(78, 3, "vertical")).toStrictEqual([78, 88, 98])
})


test ("Func generate coordinates in deliberate vertical cases ex.2 ", () => {
  expect(createCoorArr.deliberate(52, 5, "vertical")).toStrictEqual([52, 62, 72, 82, 92])
})

test ("Func generate coordinates in deliberate vertical cases ex.1 ", () => {
  expect(createCoorArr.deliberate(52, 5, "vertical")).toStrictEqual([52, 62, 72, 82, 92])
})

test ("Func throwsError in incorrect deliberate vertical cases ex.1 ", () => {
  expect(createCoorArr.deliberate(99, 3, "vertical")).toStrictEqual( Error("Ship would not fit"))
})


test ("Func throwsError in incorrect deliberate vertical cases ex.2 ", () => {
  expect(createCoorArr.deliberate(80, 3, "vertical")).toStrictEqual( Error("Ship would not fit"))
})
