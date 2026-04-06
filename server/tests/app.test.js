import assert from "node:assert/strict";
import test, { afterEach, beforeEach } from "node:test";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import portfolioSeed from "../src/data/portfolio.seed.js";
import Message from "../src/models/Message.js";
import Portfolio from "../src/models/Portfolio.js";
import {
  resetMailerForTesting,
  setTransportFactoryForTesting
} from "../src/services/contactMailer.js";

const originalReadyState = mongoose.connection.readyState;
const originalFindOne = Portfolio.findOne;
const originalFindOneAndUpdate = Portfolio.findOneAndUpdate;
const originalCreate = Message.create;
const originalMailEnv = {
  CONTACT_INBOX: process.env.CONTACT_INBOX,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM
};

function restoreMailEnv() {
  Object.entries(originalMailEnv).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
      return;
    }

    process.env[key] = value;
  });
}

beforeEach(() => {
  mongoose.connection.readyState = 0;
  Portfolio.findOne = originalFindOne;
  Portfolio.findOneAndUpdate = originalFindOneAndUpdate;
  Message.create = originalCreate;
  resetMailerForTesting();
  restoreMailEnv();
});

afterEach(() => {
  mongoose.connection.readyState = originalReadyState;
  Portfolio.findOne = originalFindOne;
  Portfolio.findOneAndUpdate = originalFindOneAndUpdate;
  Message.create = originalCreate;
  resetMailerForTesting();
  restoreMailEnv();
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

test("GET /api/portfolio normalizes malformed project arrays from database content", async () => {
  mongoose.connection.readyState = 1;
  Portfolio.findOne = () => ({
    lean: async () => ({
      ...portfolioSeed,
      projects: [
        {
          ...portfolioSeed.projects[0],
          stack: "MongoDB Express.js React.js",
          metrics: "Dynamic routing Category-based posts RESTful CRUD APIs",
          links: ""
        }
      ],
      skills: [
        {
          ...portfolioSeed.skills[0],
          items: "HTML CSS React.js"
        }
      ],
      experience: [
        {
          ...portfolioSeed.experience[0],
          achievements: "Observed how embedded systems work."
        }
      ]
    })
  });

  const response = await request(app).get("/api/portfolio");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body.data.projects[0].stack, portfolioSeed.projects[0].stack);
  assert.deepEqual(response.body.data.projects[0].metrics, portfolioSeed.projects[0].metrics);
  assert.deepEqual(response.body.data.projects[0].links, []);
  assert.deepEqual(response.body.data.skills[0].items, portfolioSeed.skills[0].items);
  assert.deepEqual(response.body.data.experience[0].achievements, portfolioSeed.experience[0].achievements);
});

test("PUT /api/portfolio preserves nested fields when only part of a section is updated", async () => {
  mongoose.connection.readyState = 1;

  let capturedUpdate;

  Portfolio.findOne = () => ({
    lean: async () => portfolioSeed
  });

  Portfolio.findOneAndUpdate = (filter, update) => {
    capturedUpdate = update;

    return {
      lean: async () => update
    };
  };

  const response = await request(app).put("/api/portfolio").send({
    hero: {
      name: "Updated Prabanjan"
    }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.hero.name, "Updated Prabanjan");
  assert.equal(response.body.data.hero.role, portfolioSeed.hero.role);
  assert.equal(capturedUpdate.hero.location, portfolioSeed.hero.location);
  assert.equal(capturedUpdate.projects[0].title, portfolioSeed.projects[0].title);
});

test("PUT /api/portfolio preserves existing project fields during partial project updates", async () => {
  mongoose.connection.readyState = 1;

  Portfolio.findOne = () => ({
    lean: async () => portfolioSeed
  });

  Portfolio.findOneAndUpdate = (filter, update) => ({
    lean: async () => update
  });

  const response = await request(app).put("/api/portfolio").send({
    projects: [
      {
        title: "Updated Blog Title"
      }
    ]
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.data.projects[0].title, "Updated Blog Title");
  assert.equal(response.body.data.projects[0].type, portfolioSeed.projects[0].type);
  assert.equal(response.body.data.projects[0].summary, portfolioSeed.projects[0].summary);
  assert.equal(response.body.data.projects[1].title, portfolioSeed.projects[1].title);
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

test("POST /api/messages returns a helpful error when MongoDB and email delivery are unavailable", async () => {
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
  assert.equal(response.body.emailDelivered, false);
  assert.equal(response.body.storedInDatabase, true);
  assert.equal(response.body.data.name, "Prabanjan");
  assert.equal(response.body.data.email, "prabanjan@example.com");
  assert.equal(response.body.data.company, "ElectroThrive");
  assert.equal(response.body.data.budget, "2500");
  assert.equal(response.body.data.message, "Build my portfolio please.");
  assert.match(response.body.warning, /email forwarding/i);
});

test("POST /api/messages emails the portfolio inbox even when MongoDB is disconnected", async () => {
  let capturedMail;

  process.env.CONTACT_INBOX = "prabanjan.offical@gmail.com";
  setTransportFactoryForTesting(() => ({
    sendMail: async (payload) => {
      capturedMail = payload;
      return {
        messageId: "mail_123"
      };
    }
  }));

  const response = await request(app).post("/api/messages").send({
    name: "Prabanjan",
    email: "prabanjan@example.com",
    company: "ElectroThrive",
    budget: "2500",
    message: "Please contact me about a frontend role."
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.emailDelivered, true);
  assert.equal(response.body.storedInDatabase, false);
  assert.equal(capturedMail.to, "prabanjan.offical@gmail.com");
  assert.equal(capturedMail.replyTo, "prabanjan@example.com");
  assert.match(capturedMail.subject, /Prabanjan/);
  assert.match(capturedMail.text, /frontend role/i);
});
