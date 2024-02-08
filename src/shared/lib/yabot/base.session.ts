import { YaBase } from "../yabase";
import { SessionBotTypes } from "./types";

const enum Defaults {
  TableName = "bot_sessions",
}

export class YaBotSessionBase
  extends YaBase
  implements SessionBotTypes.ISessionBotBase
{
  readonly emptySession = { payload: {}, tag: "", step: 0 };
  async getSession(
    id: string | number | undefined
  ): Promise<SessionBotTypes.ISessionBotSession> {
    if (!id) return this.emptySession;
    const result = await this.getOne(
      `select * from ${Defaults.TableName} where id='${id}'`
    );
    if (result && "data" in result) {
      return result.data as SessionBotTypes.ISessionBotSession;
    }
    return this.emptySession;
  }
  async setSession(
    id: string | number | undefined,
    dto: SessionBotTypes.ISessionBotSession
  ) {
    if (!(id && dto)) return;
    try {
      await this.execQuery(
        `insert into ${Defaults.TableName}(id,data) values('${id}','${JSON.stringify(dto)}')`
      );
    } catch (e) {
      if ((e.message = `Conflict with existing key`)) {
        await this.execQuery(
          `update ${Defaults.TableName} set data='${JSON.stringify(dto)}' where id='${id}'`
        );
      } else {
        throw e;
      }
    }
    return this.emptySession;
  }
}
