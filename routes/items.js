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
router.post('/:id', function(req, res, next) {
  req.body.owner_id = req.user.id;
  req.body.list_id = req.params.id;
  knex('items')
  .insert(req.body) //TODO This needs fixed for security
  .returning('list_id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      console.log(data);
      GlobalObj.refreshUserLists().then(function(success){
        GlobalObj.updateUsers('lists', parseInt(data[0]));
        res.json({success: true});
      });
    }
  });
});

router.post('/:list_id/:item_id', function(req, res, next) {
  var item = req.body;
  if(item.changed)
  {
    if(item.changed.searching)
    {
      item.searching = parseInt(req.user.id);
    }
    else if(item.changed.acquired)
    {
      item.acquired = parseInt(req.user.id);
    }
    else if(item.changed.searching === false)
    {
      item.searching = null;
    }
    else if(item.changed.acquired === false)
    {
      item.acquired = null;
    }
  }

  var inData = {
    name:item.name,
    category:item.category,
    price:item.price,
    amount:item.amount,
    searching:item.searching,
    acquired:item.acquired,
    comments:item.comments
  };

  knex('items')
  .update(inData) //TODO This needs fixed for security
  .where({id:req.params.item_id})
  .returning('list_id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      console.log(data);
      GlobalObj.refreshUserLists().then(function(success){
        inData.id = parseInt(req.params.item_id);
        inData.list_id = data[0];
        GlobalObj.updateUsers('lists', parseInt(data[0]), 'item', inData);
        res.json({success: true});
      });
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
