import { createClient } from "redis";
import env from "../validateEnv";

export const redisClient = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error(`❌ Redis error: ${err.message}`);
});

redisClient.on("connect", () => {
  console.log("🔗 Connected to Redis");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis client ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔁 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("🛑 Redis connection closed");
});
