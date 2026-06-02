import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectMongo() {
  if (!env.mongoUrl) return false;
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable; continuing with in-memory fallback.");
    return false;
  }
}
