import { isDatabaseConnected } from "../config/db.js";
import portfolioSeed from "../data/portfolio.seed.js";
import Portfolio from "../models/Portfolio.js";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function mergePortfolioContent(currentValue, incomingValue) {
  if (incomingValue === undefined) {
    return currentValue;
  }

  if (Array.isArray(incomingValue)) {
    if (!Array.isArray(currentValue) || incomingValue.length === 0) {
      return incomingValue;
    }

    const hasObjectItems = incomingValue.some((item) => isPlainObject(item));

    if (!hasObjectItems) {
      return incomingValue;
    }

    const mergedItems = currentValue.map((item, index) => {
      if (incomingValue[index] === undefined) {
        return item;
      }

      return mergePortfolioContent(item, incomingValue[index]);
    });

    return mergedItems.concat(incomingValue.slice(currentValue.length));
  }

  if (isPlainObject(currentValue) && isPlainObject(incomingValue)) {
    const mergedObject = { ...currentValue };

    Object.keys(incomingValue).forEach((key) => {
      mergedObject[key] = mergePortfolioContent(currentValue[key], incomingValue[key]);
    });

    return mergedObject;
  }

  return incomingValue;
}

export async function getPortfolio(req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      return res.status(200).json({
        source: "seed",
        message: "MongoDB is not connected yet. Showing portfolio content from the local seed file.",
        data: portfolioSeed
      });
    }

    const portfolio = await Portfolio.findOne().lean();

    if (!portfolio) {
      return res.status(200).json({
        source: "seed",
        message: "No portfolio document found. Run the seed script to load this portfolio content into MongoDB.",
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

    const existingPortfolio = (await Portfolio.findOne().lean()) || portfolioSeed;
    const mergedPortfolio = mergePortfolioContent(existingPortfolio, req.body);

    const portfolio = await Portfolio.findOneAndUpdate({}, mergedPortfolio, {
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
