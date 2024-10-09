import {initDB} from "@pkg/database/db";
import {initRedis} from "@pkg/redis/redis";

export interface BaseDao {
  db: ReturnType<typeof initDB>
  redis: ReturnType<typeof initRedis>

  Fetch(params: unknown): Promise<unknown>

  Create(schema: unknown): Promise<unknown>

  Delete(schema: unknown): Promise<unknown>

  Update(schema: unknown): Promise<unknown>
}

