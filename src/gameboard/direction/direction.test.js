import { direction } from "./direction";

test("direction func returns both vertical and horizontal", () => {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push(direction());
  }
  expect(arr.includes("horizontal")).toBe(true)
  expect(arr.includes("vertical")).toBe(true)
})

