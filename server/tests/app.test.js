import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import portfolioSeed from "../src/data/portfolio.seed.js";
import Message from "../src/models/Message.js";
import Portfolio from "../src/models/Portfolio.js";

const originalReadyState = mongoose.connection.readyState;
const originalFindOne = Portfolio.findOne;
const originalCreate = Message.create;

beforeEach(() => {
  mongoose.connection.readyState = 0;
  Portfolio.findOne = originalFindOne;
  Message.create = originalCreate;
});

afterEach(() => {
  mongoose.connection.readyState = originalReadyState;
  Portfolio.findOne = originalFindOne;
  Message.create = originalCreate;
});

test("GET /api/health reports disconnected when MongoDB is unavailable", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    status: "ok",
    database: "disconnected"
  });
});

test("GET /health also works for Netlify function path routing", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    status: "ok",
    database: "disconnected"
  });
});

test("GET /api/portfolio falls back to seed content when disconnected", async () => {
  const response = await request(app).get("/api/portfolio");

  assert.equal(response.status, 200);
  assert.equal(response.body.source, "seed");
  assert.equal(response.body.data.hero.name, portfolioSeed.hero.name);
});

test("GET /portfolio falls back to seed content for function-mounted routing", async () => {
  const response = await request(app).get("/portfolio");

  assert.equal(response.status, 200);
  assert.equal(response.body.source, "seed");
  assert.equal(response.body.data.hero.name, portfolioSeed.hero.name);
});

test("GET /api/portfolio returns database content when MongoDB is connected", async () => {
  mongoose.connection.readyState = 1;
  Portfolio.findOne = () => ({
    lean: async () => ({
      ...portfolioSeed,
      hero: {
        ...portfolioSeed.hero,
        name: "Hosted Portfolio"
      }
    })
  });

  const response = await request(app).get("/api/portfolio");

  assert.equal(response.status, 200);
  assert.equal(response.body.source, "database");
  assert.equal(response.body.data.hero.name, "Hosted Portfolio");
});

test("POST /api/messages validates required fields", async () => {
  const response = await request(app).post("/api/messages").send({
    name: "",
    email: "invalid",
    message: ""
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Name, email, and message are required.");
});

test("POST /messages also validates required fields for function-mounted routing", async () => {
  const response = await request(app).post("/messages").send({
    name: "",
    email: "invalid",
    message: ""
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Name, email, and message are required.");
});

test("POST /api/messages validates email format", async () => {
  const response = await request(app).post("/api/messages").send({
    name: "Prabanjan",
    email: "not-an-email",
    message: "Hello"
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Please enter a valid email address.");
});

test("POST /api/messages returns a helpful error when MongoDB is not connected", async () => {
  const response = await request(app).post("/api/messages").send({
    name: "Prabanjan",
    email: "prabanjan@example.com",
    company: "ElectroThrive",
    budget: "1000",
    message: "I want to work together."
  });

  assert.equal(response.status, 503);
  assert.match(response.body.message, /temporarily unavailable/i);
});

test("POST /api/messages saves a normalized message when MongoDB is connected", async () => {
  mongoose.connection.readyState = 1;
  Message.create = async (payload) => ({
    _id: "message_123",
    ...payload
  });

  const response = await request(app).post("/api/messages").send({
    name: "  Prabanjan  ",
    email: " PRABANJAN@EXAMPLE.COM ",
    company: " ElectroThrive ",
    budget: " 2500 ",
    message: "  Build my portfolio please.  "
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.data.name, "Prabanjan");
  assert.equal(response.body.data.email, "prabanjan@example.com");
  assert.equal(response.body.data.company, "ElectroThrive");
  assert.equal(response.body.data.budget, "2500");
  assert.equal(response.body.data.message, "Build my portfolio please.");
});
