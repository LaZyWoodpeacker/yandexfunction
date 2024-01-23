import { YaBot } from "./types";
import { ConnectToYaBase } from "./services/ydb";
import { gitHubCommitBot } from "./services/telegram";
import { YaBotResponse, isTrigger, md5 } from "./utils";
import { GitHubClone } from "./services/github";

export async function handler(
  event: YaBot.FunctionsHttpEvent,
  context: YaBot.FunctionsHttpContext,
): Promise<YaBot.IResponse> {
  if (isTrigger(event)) {
    console.log("trigger");
    const base = await ConnectToYaBase();
    const configs = await base.configs();
    if (configs) {
      for (const config of configs) {
        try {
          const githubClone = await GitHubClone(
            process.env?.GITHUB_KEY,
            config.project,
          );
          if (!githubClone) throw new Error("no clones");
          const hash = md5(githubClone);
          const { send } = gitHubCommitBot(process.env.YF_BOT_KEY);
          if (config.hash !== hash) {
            await base.update(config.id, hash, githubClone);
            send(config.chatid, `Cloned:${config.project}`);
          } else {
            send(config.chatid, `No changes`);
          }
        } catch (e) {
          if (e.message === "githubapi request notfound") {
            await base.remove(config.id);
          } else {
            throw e;
          }
        }
      }
    }
    return YaBotResponse();
  } else {
    console.log("bot");
    const { botUpdate } = gitHubCommitBot(process.env.YF_BOT_KEY);
    await botUpdate(event.body);
    return YaBotResponse();
  }
}
