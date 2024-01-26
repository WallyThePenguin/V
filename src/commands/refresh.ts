import {
  ApplicationCommandTypes,
  getMember,
  InteractionResponseTypes,
} from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";
import { db } from "../database/mod.ts";
import { configs } from "../../configs.ts";
import log from "../utils/logger.ts";

createCommand({
  name: "refresh",
  description:
    "Refresh your profile, updating your subscription status to the bot.",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    const member = await getMember(
      Bot,
      configs.devGuildId,
      interaction.user.id,
    );
    if (!member) return log.warn("unable to get member object from guild.");
    //Understand Subscription Status
    let subscriptionStatus = 0 +
      (member.roles.includes(BigInt("1141612452245667870")) ? 1 : 0) +
      (member.roles.includes(BigInt("1141623970068701225")) ? 2 : 0) +
      (member.roles.includes(BigInt("899400099405365249")) ? 2 : 0) +
      (member.roles.includes(BigInt("1144356106198593717")) ? 2 : 0);
    if (subscriptionStatus > 1) subscriptionStatus = 2;
    //Update the Database
    if (!(await db.users.has(interaction.user.id.toString()))) {
      await db.users.create(interaction.user.id.toString(), {
        userid: interaction.user.id,
        rolelevel: subscriptionStatus,
        steamtries: 2,
      });
    } else {await db.users.update(interaction.user.id.toString(), {
        userid: interaction.user.id,
        rolelevel: subscriptionStatus,
      });}
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `Profile Refreshed. You are ${
            (subscriptionStatus > 0)
              ? `subscribed to ${
                (subscriptionStatus > 1) ? "Fast Lane." : "Right Lane."
              }`
              : "not subscribed."
          } ${
            (subscriptionStatus > 0)
              ? "If you haven't already, link your steam account by using the /link command."
              : ""
          } Time Took: ${ping}ms.`,
        },
      },
    );
  },
});
