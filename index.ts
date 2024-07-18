import redis from "./config/redis-client";
import axios from "axios";
import { schedule } from "node-cron";
import { db } from "./config/prisma-client";
import env from "config/envalid-init";
import { customAction } from "lib/custom-action";

export const getTimeseries = async () => {
  try {
    const request_url = `https://api.currencybeacon.com/v1/convert?api_key=${env.EXCHANGE_RATES_API_KEY}&from=${env.BASE_CURRENCY}&to=${env.TARGET_CURRENCY}&amount=1`;

    const {
      data: { response },
    } = await axios.get(request_url);

    const currentValue = response.value;
    const latestvalue = await redis.get("currencyjob:lastupdatedvalue");

    await redis.set("currencyjob:lastupdatedvalue", currentValue);

    console.log(`${env.BASE_CURRENCY} > ${env.TARGET_CURRENCY} values stored successfully!`);

    const guilds = await db.guild.findMany({
      where: { AND: [{ target: { lte: currentValue } }, { target: { gt: Number(latestvalue) } }] },
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

schedule("0 * * * *", getTimeseries);
// getTimeseries();
