import postgres from "postgres";
import { config } from "dotenv";
import { Redis } from "@upstash/redis/cloudflare";
export function initRedis() {
  config();
  const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
  return redis;
}
export async function cacheJsonResults(redis: Redis, redisKey: string, returnObj: {}) {
  const cachePipeline = redis.pipeline();
  cachePipeline.json.set(redisKey, "$", returnObj);
  cachePipeline.expire(redisKey, 600);
  await cachePipeline.exec();
}