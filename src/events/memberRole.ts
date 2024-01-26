import { Bot } from "../../bot.ts";
import { db } from "../database/mod.ts";
import log from "../utils/logger.ts";

Bot.events.guildMemberUpdate = async (_bot, member, _user) => {
  if (!member) return;
  //Understand Subscription Status
  let subscriptionStatus = 0 +
    (member.roles.includes(BigInt("1141612452245667870")) ? 1 : 0) +
    (member.roles.includes(BigInt("1141623970068701225")) ? 2 : 0) +
    (member.roles.includes(BigInt("899400099405365249")) ? 2 : 0) +
    (member.roles.includes(BigInt("1144356106198593717")) ? 2 : 0);
  if (subscriptionStatus > 1) subscriptionStatus = 2;
  //Update the Database
  if (!(await db.users.has(_user.id.toString()))) {
    await db.users.create(_user.id.toString(), {
      userid: _user.id,
      rolelevel: subscriptionStatus,
      steamtries: 2,
    });
  } else {await db.users.update(_user.id.toString(), {
      userid: _user.id,
      rolelevel: subscriptionStatus,
    });}
  log.info(
    `[Guild Member Update] ${_user.username}#${_user.discriminator} updated.`,
  );
};
