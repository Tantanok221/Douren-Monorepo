import { Redis } from '@upstash/redis/cloudflare'


export const initRedis = (token:string) =>{
  const redis = new Redis({
    url: 'https://optimal-hermit-55485.upstash.io',
    token
  })  
  return redis
}

export async function cacheJsonResults(redis: Redis, redisKey: string, returnObj: {}) {
  const cachePipeline = redis.pipeline();
  cachePipeline.json.set(redisKey, "$", returnObj);
  cachePipeline.expire(redisKey, 600);
  await cachePipeline.exec();
}