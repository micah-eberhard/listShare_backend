var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var jsonWebToken = require('jsonwebtoken');
var secret = 'sfdfsSDFsdfjoiefhjiu43rfksdjdsaj3r3rnfhfsbjhdfbdhjasd'; // use dotenv.

// Generic error checking for DB calls etc..
function checkErr(res, err){
  var fail = false;
  if(err){
    fail = true;
    res.json({success:false, error:err});
  }
  return fail;
}

//Bcrypt hashing.
function hashPassword(user, callback, res){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(user.password, salt, function(err, hash){
      user.password = hash;
      callback(user, res);
    });
  });
}

function registerUser(user, res){
  knex('users').first().where({
    email: user.email
  })
  .then(function(data, err){
    if(!data || data.length === 0) {
      knex('users').insert({
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName
      })
      .returning('id')
      .then(function(data2, err2){
        if(!checkErr(res, err2)){
          res.json({success: true});
        }
      });
    } else {
      res.json({success:false, reason:'Username already in use.'});
    }
  });
}

//Signup POST
router.post('/signup', function(req, res, next) {
  var user = req.body;
  hashPassword(user, registerUser, res);
});

//Login POST
router.post('/login', function(req, res, next) {
  knex('users').first().where({
    email: req.body.email
  }).then(function(data, err){
    if(!data || data.length === 0) {
      res.json({success:false,reason:'Failed to authenticate'});
    } else {
      if(!checkErr(res, err)){
        bcrypt.compare(req.body.password, data.password, function(err, match){
          if(match){
            var user = data;
            delete user.password;
            var expires = {
              expiresInMinutes : 518400
            };
            var token = jsonWebToken.sign(user, secret, expires);
            res.json({success:true, token : token});
            // res.end('End');
          } else {
            res.json({success:false,reason:'Failed to authenticate'});
          }
        });
      }
    }
  });
});


module.exports = router;
