exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments('id').primary();
    table.integer("user_id").references("id").inTable("users");
    table.string('status').defaultTo("criando");
    table.decimal('total', 10, 2).defaultTo(0.00);

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  exports.down = knex => knex.schema.dropTable("orders");