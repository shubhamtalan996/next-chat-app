import { Redis } from "@upstash/redis";
import { getEnvVariable } from "./utils";

export const db = new Redis({
  url: getEnvVariable(`UPSTASH_REDIS_REST_URL`),
  token: getEnvVariable(`UPSTASH_REDIS_REST_TOKEN`),
});
