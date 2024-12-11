import { Limitable, MemoryAdapter } from "@limitable/ratelimit";

// Switch to redis for production
const adapter = new MemoryAdapter();

export const limitable = new Limitable({
  appId: "avermate",
  adapter: adapter,
  rules: {
    // Default window for read operations
    default: {
      // 10 minutes
      windowMs: 10 * 60 * 1000,
      maxRequest: 500,
    },

    // Restricted window for create, update, delete operations
    restricted: {
      // 10 minutes
      windowMs: 10 * 60 * 1000,
      maxRequest: 50,
    },
    // Use preset
    preset: {
      // 10 req/1h
      windowMs: 60 * 60 * 1000,
      maxRequest: 10,
    },
  },
});
