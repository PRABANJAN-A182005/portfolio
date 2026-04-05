import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import portfolioSeed from "../data/portfolio.seed.js";
import Portfolio from "../models/Portfolio.js";

dotenv.config();

async function seedPortfolio() {
  const isConnected = await connectDB();

  if (!isConnected || mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected. Add a valid MONGO_URI before seeding.");
  }

  const portfolio = await Portfolio.findOneAndUpdate({}, portfolioSeed, {
    new: true,
    runValidators: true,
    upsert: true,
    setDefaultsOnInsert: true
  });

  console.log(`Portfolio seeded for ${portfolio.hero.name}.`);
}

seedPortfolio()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error(error.message);
    await mongoose.connection.close();
    process.exit(1);
  });

