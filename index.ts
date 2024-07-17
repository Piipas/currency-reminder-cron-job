import redis from "./config/redis-client";
import axios from "axios";
import { schedule } from "node-cron";
import { db } from "./config/prisma-client";
import env from "config/envalid-init";
import { customAction } from "lib/custom-action";

const getTimeseries = async () => {
  try {
    const request_url = `https://api.currencybeacon.com/v1/convert?api_key=${env.EXCHANGE_RATES_API_KEY}&from=${env.BASE_CURRENCY}&to=${env.TARGET_CURRENCY}&amount=1`;

    const {
      data: { response },
    } = await axios.get(request_url);

    const currentValue = response.value;
    const latestvalue = redis.get("currencyjob:lastupdatedvalue");

    console.log(latestvalue, currentValue);

    await redis.set("currencyjob:lastupdatedvalue", currentValue);
    await redis.set("currencyjob:previousvalue", Number(latestvalue));

    console.log(`${env.BASE_CURRENCY} > ${env.TARGET_CURRENCY} values stored successfully!`);
    console.log(latestvalue, currentValue);

    const guilds = await db.guild.findMany({
      where: { AND: [{ target: { lte: currentValue } }] },
    });

    if (guilds.length) {
      // Execute the custom action provided by app owner
      customAction(guilds, currentValue);
    } else {
      console.log("Unlucky");
    }
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
};

schedule("*/10 * * * *", getTimeseries);
// getTimeseries();
