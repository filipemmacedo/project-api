module.exports = (app) => {
  const controller = require("../controller/controller");

  const router = require("express").Router();

  router.get("/news", controller.getApi);

  router.get("/news/:newspaperId", controller.getSpecificApi);

  router.get("/users", controller.usersGet)
  
  router.post("/users", controller.usersPost)
  
  router.post("/users/login", controller.usersLogged)

  app.use("/", router);
};
