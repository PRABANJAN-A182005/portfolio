import { isDatabaseConnected } from "../config/db.js";
import portfolioSeed from "../data/portfolio.seed.js";
import Portfolio from "../models/Portfolio.js";

export async function getPortfolio(req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      return res.status(200).json({
        source: "seed",
        message: "MongoDB is not connected yet. Showing starter portfolio content.",
        data: portfolioSeed
      });
    }

    const portfolio = await Portfolio.findOne().lean();

    if (!portfolio) {
      return res.status(200).json({
        source: "seed",
        message: "No portfolio document found. Run the seed script to load starter content into MongoDB.",
        data: portfolioSeed
      });
    }

    return res.status(200).json({
      source: "database",
      data: portfolio
    });
  } catch (error) {
    return next(error);
  }
}

export async function upsertPortfolio(req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: "MongoDB is not connected. Add MONGO_URI before updating portfolio content."
      });
    }

    const portfolio = await Portfolio.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true
    }).lean();

    return res.status(200).json({
      message: "Portfolio updated successfully.",
      source: "database",
      data: portfolio
    });
  } catch (error) {
    return next(error);
  }
}
