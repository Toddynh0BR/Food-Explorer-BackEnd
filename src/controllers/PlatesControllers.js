const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class PlatesController {
  async create(request, response) {
    const { name, price, description, category, ingredients } = request.body;
  
    if (!request.file || !request.file.filename) {
      throw new AppError("Arquivo de imagem não fornecido.");
    }

    const [plate_id] = await knex('plates').insert({
      name,
      price,
      description,
      category
    });

    const imgFilename = request.file.filename;
    const diskStorage = new DiskStorage(); 
    const filename = await diskStorage.saveFile(imgFilename);
    await knex("plates").where({ id: plate_id }).update({ img: filename });
  

    if (ingredients) {
      let ingredientsArray;

      try {
        ingredientsArray = JSON.parse(ingredients);
        if (!Array.isArray(ingredientsArray)) {
          throw new AppError("Ingredientes devem ser um array.");
        }
      } catch (error) {
        console.error(error);
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
    console.log(id ,name, price, description, category, ingredients, request.file )

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
    if (ingredients && ingredients.length > 0) {
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
    const { id } = request.body;

    if(id){

    const plate = await knex("plates").where({id}).first();
    const ingredients = await knex("ingredients").where({plate_id: id}).orderBy("name");

    if(!plate){
      return response.json("prato não existe")
    }

    return response.json({
      ...plate,
      ingredients
    })
  }

  const plates = await knex("plates")
  return response.json({plates});
  };

  async delete(request, response) {
    const { plate_id, ingredient_id } = request.body;


    if(plate_id){
    const diskStorage = new DiskStorage();
    const plate = await knex('plates').where({ id: plate_id }).first();

    await diskStorage.deleteFile(plate.img);

    await knex("plates").where({id: plate_id}).delete();
    }

    if(ingredient_id) {
      await knex("ingredients")
               .where({ id: ingredient_id })
               .delete()
    }

    return response.json()
  };

  async index(request, response) {
    const { index } = request.body;


    if (!index || index.trim() === ""){
      throw new AppError("Digite algo para poder buscar por pratos ou ingredientes.");
    }
  
    const plates = await knex("plates")
                        .where("name", "like", `%${index}%`);
  

    const ingredients = await knex("ingredients")
                             .where("name", "like", `%${index}%`);
  

    if (!plates.length && !ingredients.length) {
      throw new AppError(`Nenhum resultado encontrado para: ${index}.`);
    }
  
    const plateIds = new Set();
    let result = [];
  
    if (plates.length) {
      plates.forEach(plate => plateIds.add(plate.id));
      result = [...plates];
    }
  
    if (ingredients.length) {
      const FilterIngredients = ingredients.map(ingredient => ingredient.name);

      const platesFind = await knex("plates")
          .select([
              "plates.id",
              "plates.img",
              "plates.name",
              "plates.price",
              "plates.description",
              "plates.category"
          ])
          .innerJoin("ingredients", "plates.id", "ingredients.plate_id")
          .whereIn("ingredients.name", FilterIngredients)
          .groupBy("plates.id");

          
      platesFind.forEach(plate => {
          if (!plateIds.has(plate.id)) {
              plateIds.add(plate.id);
              result.push(plate);
          }
      });
  }
  
    return response.json(result);
  };
  
}

module.exports = PlatesController;
