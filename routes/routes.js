module.exports = (app) => {
  const controller = require("../controller/controller");

  const router = require("express").Router();

  router.get("/news", controller.getApi);

  router.get("/news/:newspaperId", controller.getSpecificApi);

  router.post("/registar", controller.registar);

  router.post("/login", controller.login);

  // Rota para verificar e ativar o utilizador
  router.get("/auth/confirm/:confirmationCode", controller.verificaUtilizador);

  app.use('/api', router);
};
