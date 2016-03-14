'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('users', function(table){
   table.increments();
   table.string('email', 255);
   table.string('password', 255);
   table.string('firstName', 255);
   table.string('lastName', 255);
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('users');
};
