import mongoose from "mongoose";
import { env } from "./env.js";

let mongoAvailable = false;

export async function connectMongo() {
  if (!env.mongoUrl) return false;
  try {
    await mongoose.connect(env.mongoUrl);
    mongoAvailable = true;
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    mongoAvailable = false;
    console.warn("MongoDB unavailable; continuing with in-memory fallback.");
    return false;
  }
}

export function getMongoStatus() {
  return {
    configured: Boolean(env.mongoUrl),
    connected: mongoAvailable && mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
  };
}
