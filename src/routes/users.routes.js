const { Router } = require("express");

const usersRoutes = Router();

const UsersController = require("../controllers/UsersControllers");
const enssureAuthenticated = require("../middlewares/enssureAuthenticated");

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", enssureAuthenticated, usersController.update);

module.exports = usersRoutes;