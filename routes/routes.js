//Definição de rotas 
module.exports = (app) => {
  const controller = require("../controller/controller");
  const data = require("../models/nedb");

  const router = require("express").Router();

  router.get("/news", controller.authenticateToken, controller.getApi);

  router.get("/news/:newspaperId", controller.authenticateToken, controller.getSpecificApi);

  router.post("/registar", controller.registar);

  router.post("/login", controller.login);

  router.get("/auth/confirm/:confirmationCode", controller.verificaUtilizador);

  router.get("/users", controller.authenticateToken, controller.geAllUsers);

  router.get("/newspapers", controller.authenticateToken, controller.getAllNewspapers);

  router.get("/imgNewspapers/:name", controller.authenticateToken, controller.getImageFromNewspaper);

  router.post("/users/:email", controller.authenticateToken, controller.postUser);

  router.post("/newspaper/:name", controller.authenticateToken, controller.saveNewspaper);

  router.put("/newspaper/", controller.authenticateToken, controller.createNewspaper);

  app.use('/api', router);

};
