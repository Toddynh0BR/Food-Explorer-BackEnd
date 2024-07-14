const { Router } = require("express");

const platesRoutes = Router();

const PlatesController = require("../controllers/PlatesControllers")

const platesController = new PlatesController();

platesRoutes.get("/", platesController.index);
platesRoutes.post("/", platesController.create);
platesRoutes.put("/:id", platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);

module.exports = platesRoutes;