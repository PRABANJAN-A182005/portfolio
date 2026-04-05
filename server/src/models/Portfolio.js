import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const statsSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const skillGroupSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    stack: {
      type: [String],
      default: []
    },
    metrics: {
      type: [String],
      default: []
    },
    links: {
      type: [linkSchema],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    period: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    achievements: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    hero: {
      name: { type: String, required: true, trim: true },
      role: { type: String, required: true, trim: true },
      tagline: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      availability: { type: String, required: true, trim: true },
      intro: { type: String, required: true, trim: true },
      highlights: { type: [String], default: [] },
      ctaPrimary: { type: String, default: "Explore Projects" },
      ctaSecondary: { type: String, default: "Contact Me" }
    },
    socials: {
      type: [linkSchema],
      default: []
    },
    stats: {
      type: [statsSchema],
      default: []
    },
    about: {
      title: { type: String, required: true, trim: true },
      paragraphs: { type: [String], default: [] },
      focus: { type: [String], default: [] }
    },
    skills: {
      type: [skillGroupSchema],
      default: []
    },
    projects: {
      type: [projectSchema],
      default: []
    },
    experience: {
      type: [experienceSchema],
      default: []
    },
    contact: {
      email: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      location: { type: String, required: true, trim: true },
      note: { type: String, required: true, trim: true },
      calendly: { type: String, required: true, trim: true }
    }
  },
  {
    timestamps: true
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;

