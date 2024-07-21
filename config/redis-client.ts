import { createClient, RedisClientType } from "redis";
import env from "./envalid-init";

const redis: any = createClient({ url: env.REDIS_URL });

// Error handling
redis.on("error", (err: any) => {
  console.error("Redis error:", err);
});

// Connection state handling
redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("ready", () => {
  console.log("Redis is ready");
});

redis.on("end", () => {
  console.log("Redis connection closed");
});

redis.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

// Connect the client
redis.connect().catch(console.error);

export default redis;
