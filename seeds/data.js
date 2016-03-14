'use strict';

exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').del(),
    knex('lists').del(),
    knex('user_lists').del(),
    knex('items').del(),
    knex('friends').del(),
    knex('blocks').del()
  )
  .then(function() {
    return Promise.join(
      knex('users').insert({
        email: 'test@test.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Builder'
      }).returning('id'),
      knex('users').insert({
        email: 'test2@test2.com',
        password: 'password123',
        firstName: 'Billy',
        lastName: 'Thekid'
      }).returning('id')
      .returning('id'),
      knex('users').insert({
        email: 'name@name.com',
        password: 'password123',
        firstName: 'Sly',
        lastName: 'Fox'
      }).returning('id')
    );
  }).then(function() {
    var date = new Date();
    return Promise.join(
      knex('lists').insert({
        name: 'Roommates',
        owner_id: 1,
        dateCreated: date,
        dateModified: date
      }).returning('id'),
      knex('lists').insert({
        name: 'Lake Powell',
        owner_id: 1,
        dateCreated: date,
        dateModified: date
      }).returning('id'),
      knex('lists').insert({
        name: 'Family',
        owner_id: 2,
        dateCreated: date,
        dateModified: date
      }).returning('id'),
      knex('lists').insert({
        name: 'SlyStuff',
        owner_id: 3,
        dateCreated: date,
        dateModified: date
      }).returning('id')
    );
  }).then(function() {
    return Promise.join(
      knex('user_lists').insert({
        user_id: 1,
        list_id: 1
      }),
      knex('user_lists').insert({
        user_id: 1,
        list_id: 2
      }),
      knex('user_lists').insert({
        user_id: 2,
        list_id: 2
      }),
      knex('user_lists').insert({
        user_id: 2,
        list_id: 3
      }),
      knex('user_lists').insert({
        user_id: 3,
        list_id: 4
      })
    );
  })
  .then(function() {
    return Promise.join(
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Steak',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 32.5,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Bacon',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 16,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Eggs',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 12,
        category: 'dairy',
        comments: null
      }),
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Milk',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 128,
        category: 'dairy',
        comments: null
      }),
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Cheese',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 32,
        category: 'dairy',
        comments: null
      }),
      knex('items').insert({
        list_id: 1,
        owner_id: 1,
        name: 'Pops',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 32.5,
        category: 'cereal',
        comments: null
      }),
      knex('items').insert({
        list_id: 2,
        owner_id: 1,
        name: 'Steak',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 82.5,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 2,
        owner_id: 1,
        name: 'Bacon',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 120.5,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 2,
        owner_id: 2,
        name: 'Sausage',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 40.5,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 2,
        owner_id: 2,
        name: 'Chicken',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 80.5,
        category: 'meat',
        comments: null
      }),
      knex('items').insert({
        list_id: 2,
        owner_id: 2,
        name: 'Milk',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 256,
        category: 'dairy',
        comments: null
      }),
      knex('items').insert({
        list_id: 3,
        owner_id: 2,
        name: 'Hand Soap',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 12,
        category: 'kitchen',
        comments: null
      }),
      knex('items').insert({
        list_id: 3,
        owner_id: 2,
        name: 'Pizza',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 5,
        category: 'frozen',
        comments: null
      }),
      knex('items').insert({
        list_id: 4,
        owner_id: 3,
        name: 'Sly Fish',
        searching: null,
        acquired: null,
        price: 0.0,
        amount: 5,
        category: 'frozen',
        comments: null
      })
    );
  })
  .then(function() {
    return Promise.join(
      knex('friends').insert({
        user_id: '1',
        friend_id: '2'
      }).returning('id'),
      knex('friends').insert({
        user_id: '3',
        friend_id: '1'
      }).returning('id')
    );
  })
  .then(function() {
    return Promise.join(
      knex('blocks').insert({
        user_id: '1',
        block_id: '3',
        block_email: 'name@name.com'
      }).returning('id')
    );
  });
};
