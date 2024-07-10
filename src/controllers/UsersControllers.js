const { hash, compare } = require("bcryptjs");

const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
 async create(request, response){
    const { name, email, password } = request.body;//requiriu do usuario o nome email e senha

    const database = await sqliteConnection()

    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError("este email já está em uso");
    }

    const hashedPassword = await hash(password, 8)

    await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
      [name, email, hashedPassword])

    return response.status(201).json();
 }

 async update(request, response){
   const {name, email, password, old_password } = request.body;
   const { id } = request.params;

   const database = await sqliteConnection()

   const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

   if(!user){
    throw new AppError("usuário não existe.")
   }

   const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

   if(userWithUpdateEmail && userWithUpdateEmail.id != user.id){
    throw new AppError("este email já está em uso.")
   }


   if(password && !old_password){
      throw new AppError("você precisa informar a senha antiga")
   }

   if(password && old_password){
      const checkPassword = await compare(old_password, user.password);

      if(!checkPassword){
         throw new AppError("senha antiga não condiz")
      }

      user.password = await hash(password, 8)
   }

   plate.name = name ?? plate.name;
   plate.email = email ?? plate.email;

   await database.run(`
      UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [plate.name, plate.email, user.password, id]
       
   )

   return response.json()
 }
}

module.exports = UsersController;