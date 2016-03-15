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

/* GET home page. */
router.get('/', function(req, res, next) {
  knex('blocks').where({
    user_id: req.user.id
  })
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true, data: data.data});
    }
  });
});
router.post('/', function(req, res, next) {
  knex('users')
  .first()
  .where({email: req.body.email})
  .then(function(data, err){
    if(!checkErr(res, err)){
      knex('blocks')
      .insert({
        user_id: req.user.id,
        block_id: data.id,
        block_email: data.email
      })
      .then(function(data2, err2){
        if(!checkErr(res, err2)){
          res.json({success:true});
        }
      });
    }
  });
});
router.delete('/:id', function(req, res, next) {
  knex('blocks').where({
    user_id: req.user.id,
    block_id : req.params.id
  })
  .del()
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true});
    }
  });
});

module.exports = router;
