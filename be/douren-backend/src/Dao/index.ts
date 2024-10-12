import {initDB} from "@pkg/database/db";
import {initRedis} from "@pkg/redis/redis";

export interface BaseDao {
  db: ReturnType<typeof initDB>
  redis: ReturnType<typeof initRedis>
}

