const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PlatesController {
  async create(request, response) {
    const { name, price, description, category, ingredients } = request.body;
  
    if (!request.file || !request.file.filename) {
      throw new AppError("Arquivo de imagem não fornecido.");
    }
  
    // Inserir o prato
    const [plate_id] = await knex('plates').insert({
      name,
      price,
      description,
      category
    });
  
    // Salvar a imagem
    const imgFilename = request.file.filename;
    const diskStorage = new DiskStorage(); 
    const filename = await diskStorage.saveFile(imgFilename);
    await knex("plates").where({ id: plate_id }).update({ img: filename });
  
    // Inserir os ingredientes
    if (request.body.ingredients) {
      console.log("Request body ingredients:", request.body.ingredients);
      let ingredientsArray;
      try {
        ingredientsArray = JSON.parse(request.body.ingredients);
        console.log("Parsed ingredients array:", ingredientsArray);
        if (!Array.isArray(ingredientsArray)) {
          throw new AppError("Ingredientes devem ser um array.");
        }
      } catch (error) {
        console.error("Error parsing ingredients:", error);
        throw new AppError("Formato de ingredientes inválido.");
      }
  
      const ingredientsInsert = ingredientsArray.map(ingredient => ({
        plate_id: plate_id,
        name: ingredient
      }));
  
      await knex('ingredients').insert(ingredientsInsert);
    }
  
    return response.status(201).json();
  };

  async update(request, response) {
    const {  name, price, description, category, ingredients } = request.body;
    const { id } = request.params;

    const plate = await knex('plates').where({ id }).first();

    if (!plate) {
      throw new AppError("Prato não existe.");
    };

      //image// 
  let filename;
  if (request.file) {
    const diskStorage = new DiskStorage();
    const imgFilename = request.file.filename;
    filename = await diskStorage.saveFile(imgFilename);

    if (plate.img) {
      await diskStorage.deleteFile(plate.img);
    }
  };

      //plate, image// 
    const updatedPlate = {
      img: filename ?? plate.img,
      name: name ?? plate.name,
      price: price ?? plate.price,
      description: description ?? plate.description,
      category: category ?? plate.category,
      updated_at: knex.fn.now() 
    };

    await knex('plates')
      .where({ id })
      .update(updatedPlate);

      //ingredients//
    if (ingredients) {
    let ingredientsArray;
    try {
      ingredientsArray = JSON.parse(ingredients);
      if (!Array.isArray(ingredientsArray)) {
        throw new AppError("Ingredientes devem ser um array.");
      }
    } catch (error) {
      throw new AppError("Formato de ingredientes inválido.");
    }

    const ingredientsInsert = ingredientsArray.map(ingredient => ({
      plate_id: id,
      name: ingredient
    }));

    await knex('ingredients').insert(ingredientsInsert);
  };

  return response.status(200).json({ message: "Prato atualizado com sucesso." });
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


    const diskStorage = new DiskStorage();
    const plate = await knex('plates').where({ id }).first();

    await diskStorage.deleteFile(plate.img);

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

    if(plates == ""){
      return response.json("nenhum prato encontrado")
    }

    return response.json(plates);
  };
}

module.exports = PlatesController;
