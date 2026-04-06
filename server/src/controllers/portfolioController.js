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

function normalizeStringArray(value, fallback = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return [];
    }

    if (trimmedValue.includes(",")) {
      return trimmedValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return fallback.length ? fallback : [trimmedValue];
  }

  return fallback;
}

function normalizeLinkArray(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((link) => isPlainObject(link))
    .map((link) => ({
      label: String(link.label || "").trim(),
      url: String(link.url || "").trim()
    }))
    .filter((link) => link.label && link.url);
}

function normalizeStats(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((stat) => isPlainObject(stat))
    .map((stat) => ({
      value: String(stat.value || "").trim(),
      label: String(stat.label || "").trim()
    }))
    .filter((stat) => stat.value && stat.label);
}

function normalizeSkills(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((skillGroup, index) => {
    const fallbackSkillGroup =
      fallback.find((item) => item.category === skillGroup?.category) || fallback[index] || {};

    return {
      category: String(skillGroup?.category || fallbackSkillGroup.category || "").trim(),
      summary: String(skillGroup?.summary || fallbackSkillGroup.summary || "").trim(),
      items: normalizeStringArray(skillGroup?.items, fallbackSkillGroup.items || [])
    };
  });
}

function normalizeProjects(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((project, index) => {
    const fallbackProject =
      fallback.find((item) => item.title === project?.title) || fallback[index] || {};

    return {
      title: String(project?.title || fallbackProject.title || "").trim(),
      type: String(project?.type || fallbackProject.type || "").trim(),
      year: String(project?.year || fallbackProject.year || "").trim(),
      summary: String(project?.summary || fallbackProject.summary || "").trim(),
      stack: normalizeStringArray(project?.stack, fallbackProject.stack || []),
      metrics: normalizeStringArray(project?.metrics, fallbackProject.metrics || []),
      links: normalizeLinkArray(project?.links, fallbackProject.links || []),
      featured: typeof project?.featured === "boolean" ? project.featured : Boolean(fallbackProject.featured)
    };
  });
}

function normalizeExperience(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.map((item, index) => {
    const fallbackItem =
      fallback.find((entry) => entry.company === item?.company && entry.role === item?.role) || fallback[index] || {};

    return {
      company: String(item?.company || fallbackItem.company || "").trim(),
      role: String(item?.role || fallbackItem.role || "").trim(),
      period: String(item?.period || fallbackItem.period || "").trim(),
      summary: String(item?.summary || fallbackItem.summary || "").trim(),
      achievements: normalizeStringArray(item?.achievements, fallbackItem.achievements || [])
    };
  });
}

function normalizePortfolioContent(value) {
  const source = value || portfolioSeed;

  return {
    ...portfolioSeed,
    ...source,
    hero: {
      ...portfolioSeed.hero,
      ...source.hero,
      highlights: normalizeStringArray(source.hero?.highlights, portfolioSeed.hero.highlights)
    },
    socials: normalizeLinkArray(source.socials, portfolioSeed.socials),
    stats: normalizeStats(source.stats, portfolioSeed.stats),
    about: {
      ...portfolioSeed.about,
      ...source.about,
      paragraphs: normalizeStringArray(source.about?.paragraphs, portfolioSeed.about.paragraphs),
      focus: normalizeStringArray(source.about?.focus, portfolioSeed.about.focus)
    },
    skills: normalizeSkills(source.skills, portfolioSeed.skills),
    projects: normalizeProjects(source.projects, portfolioSeed.projects),
    experience: normalizeExperience(source.experience, portfolioSeed.experience),
    contact: {
      ...portfolioSeed.contact,
      ...source.contact
    }
  };
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
      data: normalizePortfolioContent(portfolio)
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
    const normalizedPortfolio = normalizePortfolioContent(mergedPortfolio);

    const portfolio = await Portfolio.findOneAndUpdate({}, normalizedPortfolio, {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true
    }).lean();

    return res.status(200).json({
      message: "Portfolio updated successfully.",
      source: "database",
      data: normalizePortfolioContent(portfolio)
    });
  } catch (error) {
    return next(error);
  }
}
