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

router.get('/:id', function(req, res, next) {
  knex('items').where({
    list_id: req.params.id
  })
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true, data: data});
    }
  });
});
router.post('/', function(req, res, next) {
  req.body.owner_id = req.user.id;
  knex('items')
  .insert(req.body) //TODO This needs fixed for security
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true});
    }
  });
});
router.delete('/:id', function(req, res, next) {
  knex('items')
  .where({
    id: req.params.id // Add auth to make sure the requestor has access to that list.
  })
  .del()
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true});
    }
  });
});

module.exports = router;
