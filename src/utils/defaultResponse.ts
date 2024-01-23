export const YaBotResponse = (body: any = "", status: number = 200) => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body,
  isBase64Encoded: false,
});
