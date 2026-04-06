import nodemailer from "nodemailer";

const DEFAULT_CONTACT_INBOX = "prabanjan.offical@gmail.com";

let cachedTransporter = null;
let cachedSignature = "";
let transportFactoryForTesting = null;

function getMailerSignature() {
  return [
    process.env.SMTP_HOST || "",
    process.env.SMTP_PORT || "",
    process.env.SMTP_USER || "",
    process.env.SMTP_SECURE || "",
    process.env.SMTP_FROM || ""
  ].join("|");
}

function createTransporter() {
  if (transportFactoryForTesting) {
    return transportFactoryForTesting();
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function getTransporter() {
  const nextSignature = getMailerSignature();

  if (!cachedTransporter || cachedSignature !== nextSignature) {
    cachedTransporter = createTransporter();
    cachedSignature = nextSignature;
  }

  return cachedTransporter;
}

function buildMessageText({ name, email, company, budget, message }) {
  return [
    "New portfolio contact submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "Not provided"}`,
    `Budget: ${budget || "Not provided"}`,
    "",
    "Message:",
    message
  ].join("\n");
}

export function getContactInbox() {
  return process.env.CONTACT_INBOX?.trim() || DEFAULT_CONTACT_INBOX;
}

export function isEmailDeliveryAvailable() {
  if (transportFactoryForTesting) {
    return true;
  }

  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendContactMessageNotification(payload) {
  const transporter = getTransporter();
  const inbox = getContactInbox();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || inbox,
    to: inbox,
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name}`,
    text: buildMessageText(payload)
  });

  return {
    delivered: true,
    recipient: inbox
  };
}

export function setTransportFactoryForTesting(factory) {
  transportFactoryForTesting = factory;
  cachedTransporter = null;
  cachedSignature = "";
}

export function resetMailerForTesting() {
  transportFactoryForTesting = null;
  cachedTransporter = null;
  cachedSignature = "";
}
