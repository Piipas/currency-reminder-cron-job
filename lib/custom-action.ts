import { Guild } from "@prisma/client";
import axios from "axios";

export const customAction = async (guilds: Guild[], value: number) => {
  try {
    await axios.post(`http://localhost:5556/send-message/${value}`, { guilds });
  } catch (error) {
    console.log(error);
  }
};
