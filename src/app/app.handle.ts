import { YaFunction } from "./types";
import { isTrigger, YaBotResponse } from "./helpers";
import { YaBot } from "../shared/lib/yabot";
import { GithubBot } from "../features/github.bot";
import { GitHubService } from "../features/github.service";

export default async function (
  event: YaFunction.FunctionsHttpEvent,
  _context: YaFunction.FunctionsHttpContext
): Promise<YaFunction.IResponse> {
  if (isTrigger(event)) {
    console.log("trigger");
    const github = new GitHubService(
      process.env.GITHUB_KEY,
      process.env.GITHUB_USERNAME,
      process.env.YDB_ENDPOINT,
      process.env.YDB_DATABASE
    );
    github.checkChanges((clone, changes) => {
      const bot = new YaBot(process.env.YF_BOT_KEY).telegram.sendMessage(
        clone.watcherId,
        JSON.stringify(changes, null, 2)
      );
    });
    return YaBotResponse();
  } else {
    console.log("bot");
    const bot = new GithubBot(
      process.env.YF_BOT_KEY,
      new GitHubService(
        process.env.GITHUB_KEY,
        process.env.GITHUB_USERNAME,
        process.env.YDB_ENDPOINT,
        process.env.YDB_DATABASE
      ),
      process.env.YF_BOT_MYNAME
    );
    bot.update(event.body);
    return YaBotResponse();
  }
}
