import { createHash } from "crypto";

export const md5 = (data) =>
  createHash("md5")
    .update(JSON.stringify(data || "{}"))
    .digest("hex");
