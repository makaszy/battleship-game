import UserPlayer from "./player--user";

test("Player attack method returns a tile number", () => {
  const player = new UserPlayer();
  expect(player.attack(32)).toBe(32);
  expect(player.attack(42)).toBe(42);
  expect(player.attack(32)).toStrictEqual(
    Error("Tile has already been attacked")
  );
});
