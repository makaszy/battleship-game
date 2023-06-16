import PubSub from "./pub-sub";

test("Non function returns error when subscribed", () => {
  const pubSub = new PubSub();
  const num = 3;
 
  expect(() => {pubSub.subscribe(num)}).toThrow()
})