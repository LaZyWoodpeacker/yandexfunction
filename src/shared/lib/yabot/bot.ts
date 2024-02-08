import { Telegraf } from "telegraf";

export class YaBot extends Telegraf {
  constructor(
    token: string | undefined,
    authname: string | undefined = undefined
  ) {
    if (!token) throw new Error("ho bot token");
    super(token);
    if (authname) {
      this.use(async (ctx, next) => {
        if (!(ctx.message && ctx.message.from.username === authname))
          throw new Error("Unauthorized user");
        await next();
      });
    }
  }
  async update(body: string | undefined) {
    if (!body) throw new Error("empty message");
    await this.handleUpdate(JSON.parse(body));
  }
}
