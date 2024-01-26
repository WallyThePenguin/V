import Steam from "https://deno.land/x/steam/mod.ts";
import { configs } from "../../configs.ts";
//Initiate STEAM API CLIENT
export const steam = new Steam(configs.steamID);

export async function userLookup(steamid: string) {
  return await steam.GetPlayerSummaries(steamid);
}
