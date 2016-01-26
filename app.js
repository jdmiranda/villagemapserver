var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    users = require('./lib/users'),
    mongoose = require('mongoose');

    mongoose.connect('mongodb://heroku-app:journeychurch@ds051655.mongolab.com:51655/journeychurch', function(err){
      if(err) {
       console.log('connection error', err);
   } else {
       console.log('connection successful');
   }
});

var neighborhoods = require('./routes/neighborhoods');

// var data = require('./import/data');
// data.load();

module.exports = app;


app.use(morgan('dev'));
app.use(bodyParser.json());

//app.use('/', routes);
app.use('/neighborhoods', neighborhoods);


app.get('/users', function(req, res) {

  users.getUsers(function(err, result) {
    if (err) {
      // just an example (we don't actually throw any errors in getUsers)
      return res.status(500).json( { success: false, reason: err.message });
    }

    res.send({ success: true, users: result });
  });

});

app.get('/users/:id', function(req, res) {
  var id = req.params.id;

  users.getUser(id, function(err, result) {
    if (err) {
      // just an example (bad request)
      return res.status(400).json( { success: false, reason: err.message });
    }

    if (!result) {
      return res.status(404).json( { success: false, reason: 'user id not found' });
    }

    res.send({ success: true, user: result });
  });

});

app.post('/users', function(req, res) {
  var user = req.body;

  users.addUser(user, function(err, result) {
    if (err) {
      // just an example (bad request) since the only error that we throw is if missing user name
      return res.status(400).json( { success: false, reason: err.message });
    }

    res.send({ success: true, user: result });
  });

});
