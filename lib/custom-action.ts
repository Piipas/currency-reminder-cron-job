import { Guild } from "@prisma/client";
import axios from "axios";
import env from "config/envalid-init";

export const customAction = async (guilds: Guild[], value: number) => {
  try {
    await axios.post(`${env.BOT_BASE_URL}/send-message/${value}`, { guilds });
  } catch (error) {
    console.log(error);
  }
};
