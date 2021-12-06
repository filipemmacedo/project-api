module.exports = (app) => {
  const controller = require("../controller/controller");

  const router = require("express").Router();

  router.get("/news", controller.getApi);

  router.get("/news/:newspaperId", controller.getSpecificApi);

  app.use("/", router);
};
