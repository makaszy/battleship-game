import { direction } from "./direction";

test("direction func returns both vertical and horizontal", () => {
  const arr = [];
  for (let i = 0; i < 10; i += 1) {
    arr.push(direction());
  }
  expect(arr.includes("horizontal")).toBe(true)
  expect(arr.includes("vertical")).toBe(true)
})

