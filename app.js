require('dotenv').load();
GlobalObj = {};
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var jwt = require('express-jwt');
var jsonWebToken = require('jsonwebtoken');
var socketioJwt = require('socketio-jwt');
var http = require('http').Server(express);
var io = require('socket.io')(http);
var cors = require('cors');

var routes = require('./routes/index');
var lists = require('./routes/lists');
var friends = require('./routes/friends');
var blocks = require('./routes/blocks');
var users = require('./routes/users');
var items = require('./routes/items');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var corsOptions = {
  origin: '*'
};
app.use(cors(corsOptions));

var secret = 'sfdfsSDFsdfjoiefhjiu43rfksdjdsaj3r3rnfhfsbjhdfbdhjasd'; // use dotenv.

app.use('/users', jwt({secret:secret}), users);
app.use('/friends', jwt({secret:secret}), friends);
app.use('/blocks', jwt({secret:secret}), blocks);
app.use('/lists', jwt({secret:secret}), lists);
app.use('/items', jwt({secret:secret}), items);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



//var sio = io.listen(http);

io.use(socketioJwt.authorize({
  secret: secret,
  handshake: true
}));

GlobalObj.appClients = [];

io.on('connection', function (socket) {

     console.log(socket.id + ' connected');
     try{

       GlobalObj.appClients.push({id:[socket.id][0], user:socket.decoded_token});
       io.to(GlobalObj.appClients[0].id).emit('test', {test:'thing'});
     }
     catch(e){console.log(e);}

     console.log(GlobalObj.appClients);

     socket
     .on('disconnect', function(){
        for(var i=0; i < GlobalObj.appClients.length; i++)
        {
          if(GlobalObj.appClients[i].id === socket.id)
          {
            GlobalObj.appClients.splice(i,1);
          }
        }
        console.log( socket.id+' disconnected');
      });
      // .on('userID', function(data){
      //   console.log(data);
      // });
  });

GlobalObj.ioServer = io;
GlobalObj.userLists = [];
GlobalObj.refreshUserLists = function(){
  knex('user_lists')
  .then(function(data, err){
    GlobalObj.userLists = data;
  });
};
GlobalObj.updateUsers = function(location, id)
{
  for(var i=0; i < GlobalObj.appClients.length; i++)
  {
    for(var j=0; j < GlobalObj.userLists; j++)
    {
      if(GlobalObj.appClients[i].user.id === GlobalObj.userLists[j].user_id && id === GlobalObj.userLists[j].list_id)
      {
        GlobalObj.ioServer.to(GlobalObj.appClients[i].id).emit('update', {location:location, id:id});
      }
    }
  }
};

http.listen(2500, function(){
  console.log('listening on *:2500');
});

module.exports = app;
