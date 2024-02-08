import { Driver, getCredentialsFromEnv, Ydb } from "ydb-sdk";

const enum Defaults {
  Timeout = 1000,
}

export class YaBase {
  static instance: YaBase | undefined = undefined;
  readonly driver: Driver;
  constructor(endpoint: string | undefined, database: string | undefined) {
    if (!(endpoint && database))
      throw new Error(`endpoint: ${endpoint} database: ${database}`);
    if (YaBase.instance) return YaBase.instance;
    const authService = getCredentialsFromEnv();
    this.driver = new Driver({
      endpoint,
      database,
      authService,
    });
    YaBase.instance = this;
  }
  async use() {
    const status = await this.driver.ready(Defaults.Timeout);
    if (!status) throw new Error("Base not ready");
    return this.driver;
  }
  getTypeId(column) {
    return column.type?.optionalType?.item?.typeId;
  }
  convertResultSet(set: Ydb.IResultSet) {
    return (
      set &&
      set.rows?.map((row) => {
        const payload = {};
        set.columns?.forEach((column, columnIdx) => {
          if (column?.name && row?.items) {
            if (this.getTypeId(column) === Ydb.Type.PrimitiveTypeId.JSON) {
              payload[column.name] = JSON.parse(
                row.items[columnIdx].textValue || "{}"
              );
            } else if (
              this.getTypeId(column) === Ydb.Type.PrimitiveTypeId.INT32
            ) {
              payload[column.name] = row.items[columnIdx]?.int32Value;
            } else if (
              this.getTypeId(column) === Ydb.Type.PrimitiveTypeId.UTF8
            ) {
              payload[column.name] = row.items[columnIdx]?.textValue || "";
            } else if (
              this.getTypeId(column) === Ydb.Type.PrimitiveTypeId.STRING
            ) {
              payload[column.name] =
                row.items[columnIdx]?.bytesValue?.toString() || "";
            }
          }
        });
        return payload;
      })
    );
  }
  async execQuery(query) {
    const base = await this.use();
    const { resultSets } = await base.tableClient.withSession((ses) =>
      ses.executeQuery(query)
    );
    return this.convertResultSet(resultSets[0]);
  }

  async getOne(query) {
    const result = await this.execQuery(query);
    if (result?.length) return result[0];
    return;
  }

  async getAll(query) {
    const result = await this.execQuery(query);
    if (result?.length) return result;
    return;
  }
}
