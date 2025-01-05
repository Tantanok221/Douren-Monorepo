import { Redis} from "@upstash/redis/cloudflare";

export function initRedis(url: string,token: string) {
  return new Redis({
    url,
    token,
  });
}

export async function cacheJsonResults(redis: Redis, redisKey: string, returnObj: {}) {
  const cachePipeline = redis.pipeline();
  cachePipeline.json.set(redisKey, "$", returnObj);
  cachePipeline.expire(redisKey, 600);
  await cachePipeline.exec();
}