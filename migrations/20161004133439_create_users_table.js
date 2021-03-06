exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("users", function(table) {
    table.increments().primary();
    table.string("first_name").notNullable().defaultTo("");
    table.string("last_name").notNullable().defaultTo("");
    table.string("email").notNullable().unique();
    table.string("hashed_password", 60).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
