import { Driver, getCredentialsFromEnv } from "ydb-sdk";
import {
  addConfigToBase,
  getConfigFromBase,
  removeConfigToBase,
  updateConfigToBase,
} from "./requests";
import { IClones, IConfig } from "../../types";
import { ConvertResultSet } from "./convert-result-set";

const enum Defaults {
  TableName = "config",
  Timeout = 1000,
}

interface IYaBase {
  configs: () => Promise<IConfig[] | undefined>;
  update: (id: string, hash: string, clones: IClones) => Promise<void>;
  remove: (id: string) => Promise<void>;
  add: (id: string, chatid: string, project: string) => Promise<void>;
}

export const ConnectToYaBase = async (): Promise<IYaBase> => {
  const authService = getCredentialsFromEnv();
  const driver = new Driver({
    endpoint: process.env.YDB_ENDPOINT,
    database: process.env.YDB_DATABASE,
    authService,
  });
  const status = await driver.ready(Defaults.Timeout);
  if (!status) throw new Error("Base not ready");

  const configs = async () => {
    return await driver.tableClient.withSession(async (session) => {
      const { resultSets } = await session.executeQuery(
        getConfigFromBase(Defaults.TableName),
      );
      const configs = ConvertResultSet(resultSets[0]);
      return configs;
    });
  };

  const update = async (id, hash, clonesObj) => {
    await driver.tableClient.withSession(async (session) => {
      await session.executeQuery(
        updateConfigToBase(
          Defaults.TableName,
          id,
          hash,
          JSON.stringify(clonesObj),
        ),
      );
      return true;
    });
  };

  const remove = async (id) => {
    await driver.tableClient.withSession(async (session) => {
      await session.executeQuery(removeConfigToBase(Defaults.TableName, id));
      return true;
    });
  };

  const add = async (id, chatid, project) => {
    await driver.tableClient.withSession(async (session) => {
      console.log(addConfigToBase(Defaults.TableName, id, chatid, project));
      await session.executeQuery(
        addConfigToBase(Defaults.TableName, id, chatid, project),
      );
      return true;
    });
  };

  return { configs, update, remove, add };
};
