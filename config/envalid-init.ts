import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(process.env, {
  // Exchange rates api
  EXCHANGE_RATES_API_KEY: str(),

  // Custom Environment Variables
  BASE_CURRENCY: str({ example: "USD" }),
  TARGET_CURRENCY: str({ example: "MAD" }),

  //Databases URLs
  DATABASE_URL: str(),
  REDIS_URL: str(),

  BOT_BASE_URL: url(),
});

export default env;
