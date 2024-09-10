import postgres from "postgres";
import { config } from "dotenv";
import { Redis } from "@upstash/redis";
export function initRedis() {
  config();
  const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
  return redis;
}
