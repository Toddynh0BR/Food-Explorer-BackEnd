const { Router } = require("express");

const favoritesRoutes = Router();

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const FavoritesController = require("../controllers/FavoritesController");

const favoritesController = new FavoritesController();

favoritesRoutes.get("/isfavorite", enssureAuthenticated, favoritesController.isFavorite);
favoritesRoutes.delete("/:id", enssureAuthenticated, favoritesController.delete);
favoritesRoutes.post("/show", enssureAuthenticated, favoritesController.show);
favoritesRoutes.post("/", enssureAuthenticated, favoritesController.create);

module.exports = favoritesRoutes;