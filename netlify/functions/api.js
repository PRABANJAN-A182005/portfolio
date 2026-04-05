import serverless from "serverless-http";
import app from "../../server/src/app.js";
import { connectDB } from "../../server/src/config/db.js";

let connectionPromise;

function ensureDatabaseConnection() {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  return connectionPromise;
}

const expressHandler = serverless(app);

export async function handler(event, context) {
  await ensureDatabaseConnection();
  return expressHandler(event, context);
}
