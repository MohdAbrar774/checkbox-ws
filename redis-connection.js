import Redis from "ioredis";

function createRedisConnection(name = "redis") {
  const client = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,

    // Retry with backoff (prevents spam)
    retryStrategy(times) {
      const delay = Math.min(times * 100, 2000);
      console.log(`[${name}] retrying... attempt ${times}`);
      return delay;
    },

    // Avoid infinite request retry loops
    maxRetriesPerRequest: 3,

    enableReadyCheck: true,
    lazyConnect: false,
  });

  // ✅ MUST HAVE: prevents "Unhandled error event"
  client.on("error", (err) => {
    console.error(`❌ [${name}] Redis error:`, err.message);
  });

  client.on("connect", () => {
    console.log(`✅ [${name}] connected`);
  });

  client.on("reconnecting", () => {
    console.log(`🔄 [${name}] reconnecting...`);
  });

  client.on("close", () => {
    console.log(`⚠️ [${name}] connection closed`);
  });

  return client;
}

// Separate clients (correct for Pub/Sub)
export const redis      = createRedisConnection("main");
export const publisher  = createRedisConnection("publisher");
export const subscriber = createRedisConnection("subscriber");