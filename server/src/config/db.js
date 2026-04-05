import mongoose from "mongoose";

let connectionPromise = null;
let hasWarnedMissingMongoUri = false;

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    if (!hasWarnedMissingMongoUri) {
      console.warn("MONGO_URI is not configured. Running with seed content only.");
      hasWarnedMissingMongoUri = true;
    }
    return false;
  }

  if (isDatabaseConnected()) {
    return true;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  try {
    connectionPromise = mongoose
      .connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      })
      .then(() => {
        console.log("MongoDB connected.");
        return true;
      });

    const isConnected = await connectionPromise;
    connectionPromise = null;
    return isConnected;
  } catch (error) {
    connectionPromise = null;

    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.disconnect();
      } catch (disconnectError) {
        console.error(`MongoDB disconnect cleanup failed: ${disconnectError.message}`);
      }
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}
