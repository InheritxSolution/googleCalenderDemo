const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db_connect = process.env.DB_CON_STR;
const PORT = process.env.PORT || 3000;
const env = require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

//route
const event = require("./app/route/event");

//define
app.use("/api/event", event);

app.listen(PORT, () => {
  console.log("app listening on port " + PORT);
});
module.exports = app;
