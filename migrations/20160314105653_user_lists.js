'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('user_lists', function(table){
   table.increments();
   table.integer('user_id');
   table.integer('list_id');
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('user_lists');
};
