'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('items', function(table){
   table.increments();
   table.integer('list_id');
   table.integer('owner_id');
   table.string('name', 255);
   table.string('category', 255);
   table.float('price');
   table.float('amount');
   table.integer('searching');
   table.integer('acquired');
   table.text('comments');
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('items');
};
