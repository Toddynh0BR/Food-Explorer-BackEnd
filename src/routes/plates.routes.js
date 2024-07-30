const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const platesRoutes = Router();

const PlatesController = require("../controllers/PlatesControllers");

const platesController = new PlatesController();
const upload = multer(uploadConfig.MULTER);

platesRoutes.post("/", upload.single('file'), platesController.create);
platesRoutes.post("/show", platesController.show);
platesRoutes.delete("/", platesController.delete);
platesRoutes.put("/:id",  upload.single('file'),platesController.update);
platesRoutes.post("/search", platesController.index);

module.exports = platesRoutes;