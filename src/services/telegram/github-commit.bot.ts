import { Telegraf } from "telegraf";
import { ConnectToYaBase } from "../ydb";
import { uuid } from "../../utils";

export const gitHubCommitBot = (token) => {
  const bot = new Telegraf(token);

  const send = (chatid, message) => {
    bot.telegram.sendMessage(chatid, message);
  };

  bot.use(async (ctx, next) => {
    if (
      !(ctx.message && ctx.message.from.username === process.env.YF_BOT_MYNAME)
    ) {
      throw new Error("Unauthorized user");
    }
    await next();
  });

  bot.start((ctx) =>
    ctx.reply(
      `Hello. \nMy name Serverless Hello Telegram Bot \nI'm working on Cloud Function in the Yandex Cloud.`,
    ),
  );
  bot.help((ctx) => {
    ctx.reply(JSON.stringify(ctx.from, null, 2));
    const commands = ctx.message.text.split(" ");
    if (commands.length > 1) {
      ConnectToYaBase().then((base) => {
        base.add(uuid(Math.random()), String(ctx.from.id), commands[1]);
      });
    }
  });

  const botUpdate = async (message: string | undefined) => {
    if (!message) throw new Error("empty message");
    await bot.handleUpdate(JSON.parse(message));
  };
  return { botUpdate, send };
};
