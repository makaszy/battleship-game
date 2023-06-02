
import { Ship } from "./ship"


test("Ship length test ex.1 ", () => {
  const ship = new Ship(3);
  
  expect(ship).toMatchObject({length: 3})
})


test("Ship length test ex.2 ", () => {
  const ship = new Ship(6);
  expect(ship).toMatchObject({length: 6})
})

test("Ship isSunk test ex.1 ", () => {
  const ship = new Ship(6);
  expect(ship.isSunk()).toBe(false)
})


test("Ship isSunk test ex.2 ", () => {
  const ship = new Ship(1);
  ship.hit()
  expect(ship.isSunk()).toBe(true)
})