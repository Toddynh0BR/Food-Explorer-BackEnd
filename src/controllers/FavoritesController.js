const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class FavoritesController {
    async create(request, response) {
        const user_id = request.user.id;
        const { plate_id } = request.body;

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

        const separatePlates = await Promise.all(plates.map(async plate => {
            return {
                id: plate.id,
                img: plate.img,
                name: plate.name
            }
        })); 

        return response.json({ separatePlates });
    };

    async isFavorite(request, response) {
        const { plate_id } = request.body;
        const user_id = request.user.id;
    
        try {
            const favorite = await knex("favorites").where({ plate_id, user_id }).first();
            
            const Exist = !!favorite;
    
            return response.json({ Exist });
        } catch (error) {
             throw new AppError("Erro ao verificar banco de dados.");
        }
    };

    async delete(request, response) {
        const { id } = request.params;

        const favorite = await knex("favorites").where({ plate_id: id }).first();

        if (!favorite) {
            throw new AppError("Favorito não encontrado.", 404);
        };

        await knex("favorites").where({ plate_id: id }).delete();

        return response.status(204).json();
    };
}

module.exports = FavoritesController;
