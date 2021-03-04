const express = require("express");
const app = express.Router();
module.exports = (function () {
  const apiEventcontroller = require("../controller/eventController");

  app.get("/", apiEventcontroller.getList);
  app.post("/", apiEventcontroller.create);
  app.delete("/delete/:id", apiEventcontroller.delete);

  return app;
})();
