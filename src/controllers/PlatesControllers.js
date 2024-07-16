const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PlatesController {
  async create(request, response) {
    const { name, price, description, category, ingredients } = request.body;
  
    if (!request.file || !request.file.filename) {
      throw new AppError("Arquivo de imagem não fornecido.");
    }

    //plate
    const [plate_id] = await knex('plates').insert({
      name,
      price,
      description,
      category
    });
  
    //image
    const imgFilename = request.file.filename;
    const diskStorage = new DiskStorage(); 
  
    const filename = await diskStorage.saveFile(imgFilename);
    
    await knex("plates").where({ id: plate_id }).update({ img: filename });
  
    //ingredients
    const ingredientsInsert = ingredients.map(ingredient => ({
      plate_id,
      name: ingredient
    }));
  
    await knex("ingredients").insert(ingredientsInsert);
  
    return response.status(201).json();

  };

  async update(request, response) {
    const { img, name, price, description, category } = request.body;
    const { id } = request.params;

    const plate = await knex('plates').where({ id }).first();

    if (!plate) {
      throw new AppError("Prato não existe.");
    }

    const updatedPlate = {
      img: img ?? plate.img,
      name: name ?? plate.name,
      price: price ?? plate.price,
      description: description ?? plate.description,
      category: category ?? plate.category,
      updated_at: knex.fn.now() 
    };

    await knex('plates')
      .where({ id })
      .update(updatedPlate);

    return response.json();
  };

  async show(request, response) {
    const { id } = request.params;

    const plate = await knex("plates").where({id}).first();
    const ingredients = await knex("ingredients").where({plate_id: id}).orderBy("name");

    if(!plate){
      return response.json("prato não existe")
    }

    return response.json({
      ...plate,
      ingredients
    })
  };

  async delete(request, response) {
    const { id } = request.params;

    await knex("plates").where({id}).delete();

    return response.json()
  };

  async index(request, response) {
    const { name, ingredients } = request.query;

    let plates;

    if (ingredients) {
        const FilterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

        plates = await knex("ingredients")
            .select([
                "plates.name",
                "plates.price",
                "plates.description",
                "plates.category"
            ])
            .innerJoin("plates", "plates.id", "ingredients.plate_id")
            .where(function() {
                if (name) {
                    this.whereLike("plates.name", `%${name}%`);
                }
            })
            .whereIn("ingredients.name", FilterIngredients)
            .groupBy("plates.id");
    } else {
        plates = await knex("plates")
            .whereLike("name", `%${name}%`)
            .orderBy("name");
    }

    return response.json(plates);
}
}

module.exports = PlatesController;
