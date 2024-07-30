const { Router } = require("express");

const favoritesRoutes = Router();

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const FavoritesController = require("../controllers/FavoritesController");

const favoritesController = new FavoritesController();

favoritesRoutes.post("/isfavorite", enssureAuthenticated, favoritesController.isFavorite);
favoritesRoutes.delete("/:id", enssureAuthenticated, favoritesController.delete);
favoritesRoutes.post("/show", enssureAuthenticated, favoritesController.show);
favoritesRoutes.post("/add", enssureAuthenticated, favoritesController.create);

module.exports = favoritesRoutes;