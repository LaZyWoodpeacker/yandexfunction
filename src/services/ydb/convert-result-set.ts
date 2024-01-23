import { Ydb } from "ydb-sdk";
import { IConfig } from "../../types";

const getTypeId = (column) => column.type?.optionalType?.item?.typeId;

export const ConvertResultSet = (set: Ydb.IResultSet): IConfig[] | undefined =>
  set.rows?.map((row) => {
    const payload: IConfig = {
      id: "",
      chatid: "",
      clones: [],
      hash: "",
      project: "",
    };
    set.columns?.forEach((column, columnIdx) => {
      if (column?.name && row?.items) {
        if (getTypeId(column) === Ydb.Type.PrimitiveTypeId.JSON) {
          payload[column.name] = JSON.parse(
            row.items[columnIdx].textValue || "{}",
          );
        } else if (getTypeId(column) === Ydb.Type.PrimitiveTypeId.UTF8) {
          payload[column.name] = row.items[columnIdx]?.textValue || "";
        } else if (getTypeId(column) === Ydb.Type.PrimitiveTypeId.STRING) {
          payload[column.name] =
            row.items[columnIdx]?.bytesValue?.toString() || "";
        }
      }
    });
    return payload;
  });
