/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
  .createTable("manager", (table) => {
   // table.increments("manager_id").primary();
   table.integer('manager_id').unsigned().notNullable().primary();
    table.string("email").notNullable().unique();
    table.enum("department",["IT","Sales","Marketing","Finance","Accounts","HR","Others","Administrator"]).notNullable();
  })
    .createTable("employee", (table) => {
      table.increments("employee_id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.date("dob").notNullable();
      table.enum("gender", ['male', 'female', 'other']).notNullable();
      table.enum("role", ["employee", "manager", "admin"]).notNullable();
      table.string("email").notNullable().unique();
      table.string("phone").notNullable();
      table.enum("department",["IT","Sales","Marketing","Finance","Accounts","HR","Others","Administrator"]).notNullable();
      table.integer("manager_id").unsigned().nullable();
      table.string("address").notNullable();
      table.date("join_date").notNullable().defaultTo(knex.fn.now());
      table.string("password").notNullable();
      table.integer("salary").notNullable();
      table.specificType('location', 'geometry'); // 4326 srid hai
      // Foreign key reference to manager table
      table.foreign("manager_id").references("manager.manager_id").onDelete('SET NULL');
    }).createTable("log",(table)=>{
      table.jsonb("deleted_user_info");  
      table.specificType("departed_by", "TEXT[]");  
    })
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("employee").dropTableIfExists("manager");
};
