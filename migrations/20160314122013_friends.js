'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('friends', function(table){
   table.increments();
   table.integer('user_id');
   table.integer('friend_id');
 });
};

exports.down = function(knex, Promise) {
 return knex.schema.dropTable('friends');
};
