import serverless from "serverless-http";
import app from "../../server/src/app.js";
import { connectDB } from "../../server/src/config/db.js";

const expressHandler = serverless(app);

export async function handler(event, context) {
  await connectDB();
  return expressHandler(event, context);
}
