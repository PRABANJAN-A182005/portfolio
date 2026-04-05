import mongoose from "mongoose";
import Message from "../models/Message.js";

export async function createMessage(req, res, next) {
  try {
    const { name, email, company, budget, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required."
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "MongoDB is not connected yet. Add MONGO_URI to store contact submissions."
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

