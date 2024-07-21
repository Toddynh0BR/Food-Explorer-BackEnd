const { Router } = require("express");

const favoritesRoutes = require("./favorites.routes");
const sessionsRoutes = require("./sessions.routes");
const platesRoutes = require("./plates.routes");
const ordersRoutes = require("./orders.routes");
const itemsRoutes = require("./items.routes");
const usersRoutes = require("./users.routes");

const routes = Router();

routes.use("/favorites", favoritesRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/plates", platesRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/users", usersRoutes);
routes.use("/items", itemsRoutes);

module.exports = routes