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

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('users').first().where({
    id: req.user.id
  })
  .then(function(data, err){
    if(!checkErr(res, err)){
      delete data.password;
      res.json({success:true, data: data});
    }
  });
});

router.get('/socket', function(req, res, next) {
  var user = req.user;
});

module.exports = router;
