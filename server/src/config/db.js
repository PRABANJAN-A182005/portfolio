import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not configured. Running with seed content only.");
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

