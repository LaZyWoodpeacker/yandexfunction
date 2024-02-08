/* Yandex dev webhook proxy 
module.exports.handler = async function (event, context) {
  const result = await fetch("<public url>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event, context }),
  });
  const json = await result.json();
  if(json?.statusCode!==200)console.log("json", json);
  return json;
};
*/
require("dotenv").config();
const yaFnk = require("../dist/index");
const express = require("express");

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.post("/", async (req, res) => {
  try {
    const { event: yaEvent, context: yaContext } = req.body;
    const response = await yaFnk.handler(yaEvent, yaContext);
    res.status(200).json(response);
  } catch (e) {
    console.log(e.message);
    res.status(200).json({
      statusCode: 500,
      body: e.message,
    });
  }
});

app.listen(80, "0.0.0.0");
