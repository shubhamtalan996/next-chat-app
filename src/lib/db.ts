import { Redis } from "@upstash/redis/nodejs";

export const db = Redis.fromEnv();
