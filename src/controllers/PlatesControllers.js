const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class PlatesController {
 async create(request, response){
    const { img, name, price, description, category } = request.body;

    const database = await sqliteConnection()

    await database.run("INSERT INTO plates (img, name, price, description, category) VALUES (?, ?, ?, ?, ?)", 
      [img, name, price, description, category])

    return response.status(201).json();
 }

 async update(request, response) {
    const { img, name, price, description, category } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();

    const plate = await database.get("SELECT * FROM plates WHERE id = ?", [id]);

    if (!plate) {
        throw new AppError("Prato não existe.");
    }

    plate.img = img ?? plate.img;
    plate.name = name ?? plate.name;
    plate.price = price ?? plate.price;
    plate.description = description ?? plate.description;
    plate.category = category ?? plate.category;


    await database.run(`
        UPDATE plates SET 
        img = ?,
        name = ?,
        price = ?,
        description = ?,
        category = ?
        WHERE id = ?`,
        [plate.img, plate.name, plate.price, plate.description, plate.category, id]
    );

   return response.json()
 }
}

module.exports = PlatesController