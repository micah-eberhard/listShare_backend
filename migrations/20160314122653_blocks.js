'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('blocks', function(table){
   table.increments();
   table.integer('user_id');
   table.integer('block_id');
   table.string('block_email');
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('blocks');
};
