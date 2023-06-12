
import Ship  from "./ship"


test("Ship length test ex.1 ", () => {
  const obj = {length: 3}
  const ship = new Ship(obj);
  
  expect(ship).toMatchObject({length: 3})
})


test("Ship length test ex.2 ", () => {
  const obj = {length: 6}
  const ship = new Ship(obj);
  expect(ship).toMatchObject({length: 6})
})

test("Ship isSunk test ex.1 ", () => {
  const obj = {length: 6}
  const ship = new Ship(obj);
  expect(ship.isSunk()).toBe(false)
})


test("Ship isSunk test ex.2 ", () => {
  const obj = {length: 1}
  const ship = new Ship(obj);
  ship.hit()
  expect(ship.isSunk()).toBe(true)
})