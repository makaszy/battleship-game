import getRandomDirection from "./get-random-direction";

test("getRandomDirection func returns both vertical and horizontal", () => {
  const arr = [];
  for (let i = 0; i < 10; i += 1) {
    arr.push(getRandomDirection());
  }
  expect(arr.includes("horizontal")).toBe(true);
  expect(arr.includes("vertical")).toBe(true);
});
