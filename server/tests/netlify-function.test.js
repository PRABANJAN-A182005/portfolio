import assert from "node:assert/strict";
import test from "node:test";

test("Netlify function exports a handler", async () => {
  const netlifyFunction = await import("../../netlify/functions/api.js");
  assert.equal(typeof netlifyFunction.handler, "function");
});

