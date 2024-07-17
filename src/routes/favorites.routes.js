const { Router } = require("express");

const favoritesRoutes = Router();

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const FavoritesController = require("../controllers/FavoritesController");

const favoritesController = new FavoritesController();

favoritesRoutes.post("/:plate_id", enssureAuthenticated, favoritesController.create);
favoritesRoutes.delete("/:id", enssureAuthenticated, favoritesController.delete);
favoritesRoutes.get("/", enssureAuthenticated, favoritesController.show);

module.exports = favoritesRoutes;