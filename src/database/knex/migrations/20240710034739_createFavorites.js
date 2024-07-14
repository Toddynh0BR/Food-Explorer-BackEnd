exports.up = knex => knex.schema.createTable("favorites", table => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("plate_id").references("id").inTable("plates").onDelete("CASCADE");
  });

  exports.down = knex => knex.schema.dropTable("favorites");