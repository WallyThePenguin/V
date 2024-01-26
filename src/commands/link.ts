import {
  ApplicationCommandTypes,
  getMember,
  InteractionResponseTypes,
  MessageComponentTypes,
} from "../../deps.ts";
import { userLookup } from "../steam/mod.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { Bot as BotCollect } from "../../bot.ts";
import { createCommand } from "./mod.ts";
import { db } from "../database/mod.ts";
import { configs } from "../../configs.ts";
import log from "../utils/logger.ts";
import { sendInteractionResponse } from "https://deno.land/x/discordeno@17.0.0/mod.ts";
const timeoutEmbed = [{
  title: "Steam ID Link - Timeout",
  description: `Process timed out after 60 seconds`,
  color: 0,
}];
const modalInput = {};
const secondEmbed = {};
const thirdEmbed = {};

createCommand({
  name: "link",
  description: "Starts the process of linking your steam to your profile.",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    if (!(await db.users.has(interaction.user.id.toString()))) {
      await db.users.create(interaction.user.id.toString(), {
        userid: interaction.user.id,
        steamtries: 2,
      });
    }
    const user = await db.users.get(interaction.user.id.toString());
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    log.error("Trigger one");
    await BotCollect.helpers.sendPrivateInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [{
            title: "Steam Link Process",
            color: 0,
            description:
              `Hello <@${interaction.user.id}>. You have \`${user?.steamtries}\` tries to link your steam account. \nLets begin your linking process. \nPress the button below, and insert your Steam ID`,
          }],
          components: [{
            type: MessageComponentTypes.ActionRow,
            components: [{
              type: MessageComponentTypes.Button,
              label: "Press here to insert your Steam ID",
              customId: "1",
              style: 1,
              disabled: false,
            }],
          }],
        },
      },
    );
    log.error("Trigger2");
    const collector = await Bot.collectors.collect(
      "component",
      { id: interaction.id, defer: false },
    ).catch(log.error);
    log.error(`trigger2.5`);
    if (!collector) {
      return await Bot.helpers.editOriginalInteractionResponse(
        interaction.token,
        {
          embeds: timeoutEmbed,
          components: [{
            type: MessageComponentTypes.ActionRow,
            components: [{
              type: MessageComponentTypes.Button,
              label: "Timed out",
              customId: "timed out",
              style: 1,
              disabled: true,
            }],
          }],
        },
      );
    }
    log.error("Trigger3");
    if (collector.customId === "1") {
      log.info("Trigger4");
      Bot.helpers.sendInteractionResponse(
        collector.interaction.id,
        collector.interaction.token,
        {
          type: InteractionResponseTypes.Modal,
          data: {
            title: "Steam ID Verification",
            customId: "modal",
            components: [{
              type: MessageComponentTypes.ActionRow,
              components: [{
                type: MessageComponentTypes.InputText,
                required: true,
                label: "TYPE YOUR STEAM ID BELOW 765XXXXXXXXXXXXXX",
                placeholder: "765XXXXXXXXXXXXXX",
                minLength: 17,
                maxLength: 17,
                customId: "input",
                style: 1,
              }],
            }],
          },
        },
      );
    }
    const collector2 = await Bot.collectors.collect("modal", {
      id: "modal",
    }).catch(log.error);
    if (!collector2) {
      return await Bot.helpers.editOriginalInteractionResponse(
        interaction.token,
        {
          embeds: timeoutEmbed,
          components: [{
            type: MessageComponentTypes.ActionRow,
            components: [{
              type: MessageComponentTypes.Button,
              label: "Timed out",
              style: 1,
              disabled: true,
            }],
          }],
        },
      );
    }
    if (
      collector2.interaction.data?.components?.[0].type ==
        MessageComponentTypes.InputText
    ) {
      const collectCheck =
        collector2.interaction.data.components[0].components[0].value ?? "";
      log.warn(
        `${collectCheck}, ${collector2.interaction.data.components[0].value}`,
      );
      if (collectCheck == "") {
        return;
      }
      const steamData = await userLookup(collectCheck);
      await Bot.helpers.editOriginalInteractionResponse(interaction.token, {
        embeds: [{}],
      });
    } else return log.error("Issue with collector2 interaction data.");
  },
});
