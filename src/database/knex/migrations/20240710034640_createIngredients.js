exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    
    table.integer("plate_id").references("id").inTable("plates").onDelete("CASCADE");
  });

  exports.down = knex => knex.schema.dropTable("ingredients");