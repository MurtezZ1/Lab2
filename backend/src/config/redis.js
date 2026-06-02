import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = env.redisUrl ? createClient({ url: env.redisUrl }) : null;
let redisAvailable = false;

export async function connectRedis() {
  if (!redisClient) return false;
  try {
    await redisClient.connect();
    redisAvailable = true;
    console.log("Redis connected.");
    return true;
  } catch {
    redisAvailable = false;
    console.warn("Redis unavailable; continuing without cache.");
    return false;
  }
}

export async function cacheGet(key) {
  if (!redisAvailable || !redisClient?.isOpen) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    redisAvailable = false;
    return null;
  }
}

export async function cacheSet(key, value, ttlSeconds = 300) {
  if (!redisAvailable || !redisClient?.isOpen) return;
  try {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    redisAvailable = false;
  }
}
