const getSignInLink = require("./sign-in");

test("Returns Sign-in page for AdhereLive", () => {
  expect(getSignInLink("en-US")).toBe("/sign-in");
});
