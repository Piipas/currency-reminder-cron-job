import { bool, cleanEnv, num, str, url } from "envalid";

const env = cleanEnv(process.env, {
  // Exchange rates api
  EXCHANGE_RATES_API_KEY: str(),

  // Custom Environment Variables
  BASE_CURRENCY: str({ example: "USD" }),
  TARGET_CURRENCY: str({ example: "MAD" }),
  TARGET_VALUE: num(),
});

export default env;
