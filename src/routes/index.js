const { Router } = require("express");

const favoritesRoutes = require("./favorites.routes");
const sessionsRoutes = require("./sessions.routes");
const platesRoutes = require("./plates.routes");
const usersRoutes = require("./users.routes");

const routes = Router();

routes.use("/favorites", favoritesRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/plates", platesRoutes);
routes.use("/users", usersRoutes);

module.exports = routes