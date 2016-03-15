var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

// Generic error checking for DB calls etc..
function checkErr(res, err){
  var fail = false;
  if(err){
    fail = true;
    res.json({success:false, error:err});
  }
  return fail;
}


router.get('/', function(req, res, next) {
  knex('friends').where({
    user_id: req.user.id
  })
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true, data: data});
    }
  });
});
router.post('/', function(req, res, next) {
  knex('users')
  .first()
  .where({email: req.body.email})
  .then(function(data, err){
    if(!checkErr(res, err)){
      if(data && data.length !== 0)
      {
        knex('friends')
        .insert({
          user_id: req.user.id,
          friend_id: data.id
        })
        .then(function(data2, err2){
          if(!checkErr(res, err2)){
            res.json({success:true});
          }
        });
      }
      else
      {
        res.json({success:false, reason: "Couldn't find '"+req.body.email+"' in our records."});
      }
    }
  });
});
router.delete('/:id', function(req, res, next) {
  knex('friends').where({
    user_id: req.user.id,
    friend_id : req.params.id
  })
  .del()
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true});
    }
  });
});

module.exports = router;
