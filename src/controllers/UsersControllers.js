const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex('users').where({ email }).first();

    if (checkUserExists) {
      throw new AppError("este email já está em uso");
    }

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      name,
      email,
      password: hashedPassword
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const id = request.user.id

    const user = await knex('users').where({ id }).first();

    if (!user) {
      throw new AppError("usuário não existe.");
    }

    const userWithUpdateEmail = await knex('users').where({ email }).first();

    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("este email já está em uso.");
    }

    if (password && !old_password) {
      throw new AppError("você precisa informar a senha antiga");
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);

      if (!checkPassword) {
        throw new AppError("senha antiga não condiz");
      }

      user.password = await hash(password, 8);
    }

    const updatedUser = {
      name: name ?? user.name,
      email: email ?? user.email,
      password: user.password,
      updated_at: knex.fn.now()
    };

    await knex('users')
      .where({ id })
      .update(updatedUser);

    return response.json();
  }
}

module.exports = UsersController;
