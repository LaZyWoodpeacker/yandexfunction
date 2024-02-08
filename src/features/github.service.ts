import { YaBotSessionBase } from "../shared/lib/yabot";
import { YaGithubBot } from "./types";

const enum Defaults {
  TableName = "bot_clones",
}

export class GitHubService extends YaBotSessionBase {
  readonly gitApiKey: string;
  readonly gitHubUsername: string;
  constructor(
    gitApiKey: string | undefined,
    gitHubUsername: string | undefined,
    endpoint: string | undefined,
    database: string | undefined
  ) {
    if (!(gitApiKey && gitHubUsername && endpoint && database))
      throw new Error("GitHubService init error");
    super(endpoint, database);
    this.gitApiKey = gitApiKey;
    this.gitHubUsername = gitHubUsername;
  }

  async gitApi(query, method = "GET") {
    const response = await fetch(query, {
      method,
      headers: {
        Authorization: "Bearer " + this.gitApiKey,
      },
    });
    if (response.status === 404) throw new Error("githubapi request notfound");
    if (!response.ok) throw new Error("wrong githubapi request");
    return await response.json();
  }

  async getWatchRepos(): Promise<YaGithubBot.IClone[]> {
    const result = await this.getAll(
      `SELECT id,lastdata,lastdate,watcherId FROM ${Defaults.TableName}`
    );
    return result as YaGithubBot.IClone[];
  }
  async setToWatch(id, lastdata, lastdate, watcherId) {
    const result = await this.execQuery(
      `UPSERT INTO ${Defaults.TableName} ( id,lastdata,lastdate,watcherId )  VALUES ('${id}','${JSON.stringify(lastdata)}','${lastdate}','${watcherId}')`
    );
    return result;
  }

  async removeWatch(id) {
    const result = await this.execQuery(
      `DELETE FROM ${Defaults.TableName} WHERE id='${id}'`
    );
    return result;
  }

  async getRepos(): Promise<YaGithubBot.IGithubRepos> {
    const result = this.gitApi(
      `https://api.github.com/search/repositories?q=user:lazywoodpeacker`
    );
    return result;
  }

  async getClones(project: string) {
    const result = this.gitApi(
      `https://api.github.com/repos/lazywoodpeacker/${project}/traffic/clones`
    );
    return result;
  }
  compare(githubClone, clone) {
    const changes = githubClone.clones
      .filter((c) => new Date(c.timestamp) >= new Date(clone.lastdate))
      .reduce(
        (acc, em) => {
          acc.count += em.count;
          acc.uniques += em.uniques;
          acc.lastdate = em.timestamp;
          return acc;
        },
        {
          count: 0 - clone?.count ? clone?.count : 0,
          uniques: 0 - clone?.uniques ? clone?.uniques : 0,
          lastdate: "",
        }
      );
    return [
      JSON.stringify(clone.lastdata) !== JSON.stringify(changes),
      changes,
    ];
  }

  async checkChanges(
    callback: (clones: YaGithubBot.IClone, changes: object) => void
  ) {
    const clones = await this.getWatchRepos();
    if (clones) {
      for (const clone of clones) {
        try {
          const githubClone = await this.getClones(clone.id);
          if (!githubClone) throw new Error("no clones");
          const [haveChanges, changes] = this.compare(githubClone, clone);
          if (haveChanges) {
            await this.setToWatch(
              clone.id,
              changes,
              changes.lastdate,
              clone.watcherId
            );
            callback(clone, changes);
          }
        } catch (e) {
          if (e.message === "githubapi request notfound") {
            await this.removeWatch(clone.id);
          } else {
            throw e;
          }
        }
      }
    }
  }
}
