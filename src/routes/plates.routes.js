const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const platesRoutes = Router();

const PlatesController = require("../controllers/PlatesControllers");

const platesController = new PlatesController();
const upload = multer(uploadConfig.MULTER);

platesRoutes.post("/", upload.single('file'), platesController.create);
platesRoutes.delete("/:id", platesController.delete);
platesRoutes.put("/:id",  platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.get("/", platesController.index);

module.exports = platesRoutes;