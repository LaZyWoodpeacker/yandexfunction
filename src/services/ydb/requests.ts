export const getConfigFromBase = (table) =>
  `SELECT id,clones,hash,chatid,project FROM ${table}`;

export const addConfigToBase = (table, id, chatid, project) =>
  `UPSERT INTO ${table} ( id,chatid,project )  VALUES ('${id}','${chatid}','${project}')`;

export const updateConfigToBase = (table, id, hash, clones) =>
  `UPDATE ${table} SET hash='${hash}',clones='${clones}' WHERE id='${id}'`;

export const removeConfigToBase = (table, id) =>
  `DELETE FROM ${table} WHERE id='${id}'`;
