exports.up = knex => knex.schema.createTable("order_item", table => {
    table.increments('id').primary();
    table.integer("user_id").references("id").inTable("users");
    table.integer("orders_id").references("id").inTable("orders").onDelete("CASCADE");
    table.integer("plate_id").references("id").inTable("plates").onDelete("CASCADE");
    table.string("plate_name");
    table.decimal("plate_price", 10, 2);
    table.string('plate_img');
    table.decimal('quantity');  
});

  exports.down = knex => knex.schema.dropTable("order_item");