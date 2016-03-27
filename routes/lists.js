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
  knex('user_lists')
  .innerJoin('lists', 'user_lists.list_id', 'lists.id')
  .where("user_lists.user_id", req.user.id)
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true, data: data});
    }
  });
});

router.get('/:id', function(req, res, next) {
  knex('user_lists')
  .innerJoin('lists', 'user_lists.list_id', 'lists.id')
  .where("user_lists.user_id", req.user.id)
  .andWhere("user_lists.list_id", req.params.id)
  .then(function(data, err){
    if(!checkErr(res, err)){

      res.json({success:true, data: data});
    }
  });
});

router.post('/', function(req, res, next) {
  var date = new Date();
  var listObj = {
    dateCreated: date,
    dateModified: date,
    name: req.body.name,
    owner_id: req.user.id
  };

  knex('lists')
  .insert(listObj)
  .returning('id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      knex('user_lists')
      .insert({
        list_id: parseInt(data),
        user_id: parseInt(req.user.id)
      })
      .then(function(data2, err2){
        if(!checkErr(res, err2)){
          listObj.id = parseInt(data);
          listObj.type = 'new';
          listObj.items = [];
          //Emit Update {location: lists, id:data.id}
          GlobalObj.refreshUserLists().then(function(success){
            GlobalObj.updateUsers('lists', parseInt(data), 'list', listObj);
            res.json({success: true});
          });
        }
      });
    }
  });
});
router.delete('/:id', function(req, res, next) {
  knex('lists')
  .innerJoin('lists', 'user_lists.list_id', 'lists.id')
  .where("lists.id", req.params.id)
  .andWhere("lists.owner_id", req.user.id)
  .del()
  .returning('id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      if(data.length > 0) {
        knex('user_lists')
        .where("list_id", parseInt(data))
        .del()
        .then(function(data2, err2){
          if(!checkErr(res, err2)){

            GlobalObj.updateUsers('lists', parseInt(data), 'list');
            GlobalObj.refreshUserLists().then(function(success){
              res.json({success: true});
            });
          }
        });
      }
    }
  });
});

module.exports = router;
