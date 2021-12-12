module.exports = (app) => {
  const controller = require("../controller/controller");
  const data = require("../models/nedb");

  const router = require("express").Router();

  router.get("/news", controller.authenticateToken, controller.getApi);

  router.get("/news/:newspaperId", controller.authenticateToken, controller.getSpecificApi);

  router.post("/registar", controller.registar);

  router.post("/login", controller.login);

  router.get("/auth/confirm/:confirmationCode", controller.verificaUtilizador);

  app.use('/api', router);

};
