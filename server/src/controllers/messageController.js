import { isDatabaseConnected } from "../config/db.js";
import Message from "../models/Message.js";
import {
  getContactInbox,
  isEmailDeliveryAvailable,
  sendContactMessageNotification
} from "../services/contactMailer.js";

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

    const databaseConnected = isDatabaseConnected();
    const emailDeliveryAvailable = isEmailDeliveryAvailable();
    const normalizedMessage = {
      name,
      email,
      company,
      budget,
      message
    };

    if (!databaseConnected && !emailDeliveryAvailable) {
      return res.status(503).json({
        message:
          "The contact form is temporarily unavailable because MongoDB or SMTP email delivery is not configured. Use the contact email shown on the page or finish the hosting setup."
      });
    }

    let emailDelivered = false;
    let savedMessage = null;
    let emailError = null;
    let saveError = null;

    if (emailDeliveryAvailable) {
      try {
        await sendContactMessageNotification(normalizedMessage);
        emailDelivered = true;
      } catch (error) {
        emailError = error;
      }
    }

    if (databaseConnected) {
      try {
        savedMessage = await Message.create(normalizedMessage);
      } catch (error) {
        saveError = error;
      }
    }

    if (!emailDelivered && !savedMessage) {
      return res.status(502).json({
        message: `The contact form could not deliver your message right now. Please email ${getContactInbox()} directly.`,
        details: emailError?.message || saveError?.message || "Unknown delivery error."
      });
    }

    if (saveError) {
      console.error(`Message storage failed: ${saveError.message}`);
    }

    if (emailError) {
      console.error(`Email delivery failed: ${emailError.message}`);
    }

    return res.status(201).json({
      message: emailDelivered
        ? `Thanks for reaching out. Your message has been sent to ${getContactInbox()}.`
        : "Thanks for reaching out. Your message has been saved.",
      warning:
        emailDelivered || !savedMessage
          ? saveError
            ? "Email was delivered, but MongoDB could not save a copy this time."
            : ""
          : emailDeliveryAvailable
            ? "MongoDB saved your message, but email forwarding could not deliver it this time."
            : "MongoDB saved your message, but email forwarding is not configured right now.",
      emailDelivered,
      storedInDatabase: Boolean(savedMessage),
      data: savedMessage
    });
  } catch (error) {
    return next(error);
  }
}
