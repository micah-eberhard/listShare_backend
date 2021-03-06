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
  req.body.list_id = parseInt(req.params.id);
  knex('items')
  .insert(req.body) //TODO This needs fixed for security
  .returning('id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      var inData = req.body;

      inData = {
        name:req.body.name,
        category:req.body.category,
        price:req.body.price,
        amount:req.body.amount,
        searching:null,
        acquired:null,
        comments: ''
      };
      console.log(data);
      inData.id = parseInt(data[0]);
      inData.list_id = parseInt(req.params.id);

      GlobalObj.refreshUserLists().then(function(success){
        console.log('lists, ' + req.params.id + " item " + inData);
        GlobalObj.updateUsers('lists', parseInt(req.params.id), 'item', inData);
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
  .where({id:parseInt(req.params.item_id)})
  .returning('list_id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      console.log(data);
      inData.id = parseInt(req.params.item_id);
      inData.list_id = parseInt(req.params.list_id);
      GlobalObj.refreshUserLists().then(function(success){
        GlobalObj.updateUsers('lists', parseInt(req.params.list_id), 'item', inData);
        res.json({success: true});
      });
    }
  });
});

router.delete('/:id', function(req, res, next) {
  knex('items')
  .where({
    id: parseInt(req.params.id) // Add auth to make sure the requestor has access to that list.
  })
  .del()
  .returning('list_id')
  .then(function(data, err){
    if(!checkErr(res, err)){
      GlobalObj.refreshUserLists().then(function(success){
        GlobalObj.updateUsers('lists', parseInt(data[0]), 'item', {id: parseInt(req.params.id), delete:true});
        res.json({success:true, item_id:parseInt(req.params.id)});
      });

    }
  });
});

module.exports = router;
