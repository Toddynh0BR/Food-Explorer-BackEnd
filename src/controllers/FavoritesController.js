const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { request, response } = require("express");

class FavoritesController {
    async create(request, response) {
        const user_id = request.user.id;
        const { plate_id } = request.params;

        const plateExists = await knex('plates').where({ id: plate_id }).first();

        if (!plateExists) {
            throw new AppError("Prato não existe.");
        }

        await knex("favorites").insert({
            user_id,
            plate_id
        });

        return response.status(201).json();
    };

    async show(request, response) {
        const user_id = request.user.id;
    
        const favorites = await knex("favorites").where({ user_id });
    
        const favoritePlateIds = favorites.map(favorite => favorite.plate_id);
    
        const plates = await knex("plates").whereIn("id", favoritePlateIds);
    
        return response.json({ plates });
    };

    async delete(request, response) {
        const { id } = request.params;

        const favorite = await knex("favorites").where({ id }).first();

        if (!favorite) {
            throw new AppError("Favorito não encontrado.", 404);
        };

        await knex("favorites").where({ id }).delete();

        return response.status(204).json();
    };
}

module.exports = FavoritesController;
