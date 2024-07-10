const { Router } = require("express");

const platesRoutes = Router();

const PlatesController = require("../controllers/PlatesControllers")

const platesController = new PlatesController();

platesRoutes.post("/", platesController.create);
platesRoutes.put("/:id", platesController.update);

module.exports = platesRoutes;