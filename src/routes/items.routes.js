const { Router } = require("express");

const itemsRoutes = Router();

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const ItemController = require("../controllers/ItemController");

const itemsController = new ItemController();

itemsRoutes.post("/", enssureAuthenticated, itemsController.addOrder);
itemsRoutes.post("/delete", itemsController.removeOrder);

module.exports = itemsRoutes;