import { Markup } from "telegraf";
import { YaSessionsBot } from "../shared/lib/yabot";
import { GitHubService } from "./github.service";

export class GithubBot extends YaSessionsBot {
  constructor(
    token: string | undefined,
    base: GitHubService,
    authname: string | undefined
  ) {
    super(token, base, authname);
    this.telegram.setMyCommands([
      { command: "start", description: "start command" },
      { command: "addwatch", description: "Добавить Watcher" },
      { command: "delwatch", description: "Удалить Watcher" },
      { command: "check", description: "Проверить" },
    ]);
    this.use(async (ctx, next) => {
      await ctx.setChatMenuButton({
        type: "commands",
      });
      next();
    });
    this.use(async (ctx, next) => {
      const message = ctx.update?.message;
      switch (this.session.tag) {
        case "removeWatcher":
          if (this.session.step === 1) {
            if (message.text === "Отменить") {
              this.session.tag = "";
              this.session.step = 0;
              this.session.payload = "";
              this.saveSession();
            } else {
              ctx.reply(
                `Точно удалить ${message.text}`,
                Markup.keyboard([["Да", "Нет"]])
                  .oneTime()
                  .resize()
              );
              this.session.tag = "removeWatcher";
              this.session.step = 2;
              this.session.payload = message.text;
              this.saveSession();
            }
          } else if (this.session.step === 2) {
            if (message.text.toLowerCase() === "да") {
              base.removeWatch(this.session.payload);
            }
            this.session.tag = "";
            this.session.step = 0;
            this.session.payload = {};
            this.saveSession();
          }
          break;
        case "addWatcher":
          if (this.session.step === 1) {
            if (message.text === "Отменить") {
              this.session.tag = "";
              this.session.step = 0;
              this.session.payload = "";
              this.saveSession();
            } else {
              ctx.reply(
                `Точно добавить ${message.text}`,
                Markup.keyboard([["Да", "Нет"]])
                  .oneTime()
                  .resize()
              );
              this.session.tag = "addWatcher";
              this.session.step = 2;
              this.session.payload = message.text;
              this.saveSession();
            }
          } else if (this.session.step === 2) {
            if (message.text.toLowerCase() === "да") {
              base.setToWatch(
                this.session.payload,
                {},
                new Date().toISOString(),
                ctx.from?.id
              );
            }
            this.session.tag = "";
            this.session.step = 0;
            this.session.payload = {};
            this.saveSession();
          }
          break;
        default:
          await next();
      }
    });

    this.start(async (ctx) => {
      ctx.reply(
        `Hi im github informer\n${JSON.stringify(this.session, null, 2)}`
      );
      this.session.tag = "auth";
      this.session.step = 1;
      this.saveSession();
    });

    this.command("add", async (ctx) => {
      const commands = ctx.message.text.split(" ");
      if (commands.length > 1) {
        await base.setToWatch(
          commands[1],
          { count: 0, uniques: 0, lastdate: "2000-01-01T00:00:00Z" },
          "",
          String(ctx.from.id)
        );
      }
    });
    this.command("delwatch", async (ctx) => {
      const wathes = await base.getWatchRepos();
      const buttons = wathes.map((clone) => clone.id);
      this.session.tag = "removeWatcher";
      this.session.step = 1;
      this.saveSession();
      ctx.reply(
        "Удалить watcher",
        Markup.keyboard([...buttons, "Отменить"])
          .oneTime()
          .resize()
      );
    });
    this.command("addwatch", async (ctx) => {
      const repos = await base.getRepos();
      const buttons = repos.items
        .filter((rep) => !rep.private)
        .map((rep) => rep.name);
      this.session.tag = "addWatcher";
      this.session.step = 1;
      this.saveSession();
      ctx.reply(
        "Добавить watcher",
        Markup.keyboard([...buttons, "Отменить"])
          .oneTime()
          .resize()
      );
    });
    this.command("check", async (ctx) => {
      base.checkChanges((clone, changes) => {
        console.log(clone, changes);
        if (changes) ctx.reply(JSON.stringify(changes, null, 2));
        else ctx.reply("no changes");
      });
    });
  }
}
