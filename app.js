var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  users = require('./lib/users.js');


  app.get('/', function(req, res){
    res.send('hello, roxanna');
  });

  app.listen(3000, function(){
    console.log('listening on port 3000');
  });

  app.use(morgan('dev'));
  app.use(bodyParser.json());


app.get('/users', function(req, res){
  users.getUsers(function(err, result){
    if (err){
      return res.status(500).json({success:false, reason:err.message});
    }
    res.send({success:true, users: result});
  });
});
