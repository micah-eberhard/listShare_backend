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

/*
SELECT * from user_lists
inner join
lists on user_lists.list_id = lists.id
where user_lists.user_id = 1
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  knex('user_lists')
  .innerJoin('lists', 'user_lists.list_id', 'lists.id')
  .where("user_lists.user_id", req.user.id)
  .then(function(data, err){
    if(!checkErr(res, err)){
      res.json({success:true, data: data.data});
    }
  });
});
router.post('/', function(req, res, next) {

  var date = new Date();
  knex('lists')
  .insert({
    dateCreated: date,
    dateModfied: date,
    name: req.body.name,
    owner_id: req.user.id
  })
  .returning('id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      knex('user_lists')
      .insert({
        list_id: data,
        user_id: req.user.id
      })
      .then(function(data2, err2){
        if(!checkErr(res, err2)){
          res.json({success: true});
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
  .then(function(data2, err){
    if(!checkErr(res, err)){
      res.json({success: true});
    }
  });
});

module.exports = router;
