exports.up = knex => knex.schema.createTable("plates", table => {
    table.increments('id').primary();
    table.string('img');
    table.string('name');
    table.decimal('price', 10, 2);
    table.text('description');
    table.string('category');
    
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  
  
  exports.down = knex => knex.schema.dropTable("plates");