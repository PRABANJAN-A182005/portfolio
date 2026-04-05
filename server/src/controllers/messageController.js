import { isDatabaseConnected } from "../config/db.js";
import Message from "../models/Message.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createMessage(req, res, next) {
  try {
    const name = req.body.name?.trim() || "";
    const email = req.body.email?.trim().toLowerCase() || "";
    const company = req.body.company?.trim() || "";
    const budget = req.body.budget?.trim() || "";
    const message = req.body.message?.trim() || "";

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required."
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message:
          "The contact form is temporarily unavailable because MongoDB is not connected. Use the contact email shown on the page or add MONGO_URI in hosting."
      });
    }

    const savedMessage = await Message.create({
      name,
      email,
      company,
      budget,
      message
    });

    return res.status(201).json({
      message: "Thanks for reaching out. Your message has been saved.",
      data: savedMessage
    });
  } catch (error) {
    return next(error);
  }
}
