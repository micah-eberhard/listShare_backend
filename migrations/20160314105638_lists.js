'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('lists', function(table){
   table.increments();
   table.dateTime('dateCreated');
   table.dateTime('dateModified');
   table.string('name', 255);
   table.integer('owner_id');
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('lists');
};
