exports.up = knex => knex.schema.createTable("users", table => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
    table.string('password');
    table.boolean('isadmin').defaultTo(false);
    table.string('avatar').nullable();//fiz sem querer e so percebi depois de terminar todo o meu codigo :|

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  exports.down = knex => knex.schema.dropTable("users");