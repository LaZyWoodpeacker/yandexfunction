import { Context } from "telegraf";

export namespace SessionBotTypes {
  export interface ISessionBotSession {
    payload?: string | object | number;
    tag?: string;
    step?: number;
  }
  export interface ISessionBotBase {
    getSession: (
      id: string | undefined | number
    ) => Promise<ISessionBotSession>;
    setSession: (
      id: string | number | undefined,
      dto: SessionBotTypes.ISessionBotSession
    ) => void;
  }
  interface SessionContext extends Context {
    session: ISessionBotSession;
  }
}
