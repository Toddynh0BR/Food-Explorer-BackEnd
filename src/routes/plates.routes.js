const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const platesRoutes = Router();

const PlatesController = require("../controllers/PlatesControllers");

const platesController = new PlatesController();
const upload = multer(uploadConfig.MULTER);

platesRoutes.get("/", platesController.index);
platesRoutes.post("/", upload.single('file'), platesController.create);
platesRoutes.put("/:id",  platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", platesController.delete);

module.exports = platesRoutes;