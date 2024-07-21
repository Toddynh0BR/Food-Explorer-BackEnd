const { Router } = require("express");

const ordersRoutes = Router();

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const OrdersController = require("../controllers/OrdersController");

const ordersController = new OrdersController();

ordersRoutes.post("/historic", enssureAuthenticated, ordersController.Historic);
ordersRoutes.post("/show", enssureAuthenticated, ordersController.Show);
ordersRoutes.post("/", enssureAuthenticated, ordersController.Create);
ordersRoutes.put("/", ordersController.Update);

module.exports = ordersRoutes;