import { dotEnvConfig } from "./deps.ts";

// Get the .env file that the user should have created, and get the token
const env = dotEnvConfig({ export: true, path: "./.env" });
const token = env.BOT_TOKEN || "";
const steamID = env.STEAM_API_KEY;

export interface Config {
  token: string;
  botId: bigint;
}

export const configs = {
  /** Get token from ENV variable */
  token,
  /** Get the BotId from the token */
  botId: BigInt(atob(token.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(env.DEV_GUILD_ID!),
  //
  steamID: steamID,
};
