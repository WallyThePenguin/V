import { collectorsPlugin } from "https://56o7ytls75b35pbz4g2endtqzmic437lqtrdkwrhpsnsrlt7cq5q.arweave.net/7538TXL_Q768OeG0Ro5wyxAub-uE4jVaJ3ybKK5_FDs/src/types/mod.ts";
import { configs } from "./configs.ts";
import {
  BotWithCache,
  BotWithHelpersPlugin,
  Collection,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  enableCollectorsPlugin,
  enableHelpersPlugin,
  enablePermissionsPlugin,
  GatewayIntents,
} from "./deps.ts";
import { Command } from "./src/types/commands.ts";

// MAKE THE BASIC BOT OBJECT
const bot = enableCollectorsPlugin(
  enablePermissionsPlugin(
    enableCachePlugin(
      createBot({
        token: configs.token,
        botId: configs.botId,
        intents: GatewayIntents.GuildMembers,
        events: {},
      }),
    ),
  ),
  {
    collectionExpirationCheckInterval: 30000,
    defaultCollectorExpiration: 30000,
    disableEventHooks: ["interactionCreate"],
  },
);

// ENABLE ALL THE PLUGINS THAT WILL HELP MAKE IT EASIER TO CODE YOUR BOT
enableHelpersPlugin(bot);
enableCacheSweepers(bot as BotWithCache);

export interface BotClient
  extends BotWithCache<BotWithHelpersPlugin & collectorsPlugin> {
  commands: Collection<string, Command>;
}

// THIS IS THE BOT YOU WANT TO USE EVERYWHERE IN YOUR CODE! IT HAS EVERYTHING BUILT INTO IT!
export const Bot = bot as BotClient & collectorsPlugin;
// PREPARE COMMANDS HOLDER
Bot.commands = new Collection();
