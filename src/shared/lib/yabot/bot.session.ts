import { YaBot } from "./bot";
import { SessionBotTypes } from "./types";

declare global {
  interface Context {
    session: any;
  }
}

export class YaSessionsBot extends YaBot {
  readonly base: SessionBotTypes.ISessionBotBase;
  session: SessionBotTypes.ISessionBotSession;
  sessionId: number;
  constructor(
    token: string | undefined,
    base: SessionBotTypes.ISessionBotBase,
    authname: string | undefined
  ) {
    super(token, authname);
    this.base = base;
    this.use(async (ctx, next) => {
      this.sessionId = Number(ctx.chat?.id);
      const session = await this.base.getSession(this.sessionId);
      if (session) this.session = session;
      await next();
    });
  }
  async saveSession() {
    await this.base.setSession(this.sessionId, this.session);
  }
}
