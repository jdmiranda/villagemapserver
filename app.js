var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    //users = require('./lib/users'),
    mongoose = require('mongoose');

    port = process.env.PORT || 3000;

    mongoose.connect('mongodb://heroku-app:journeychurch@ds051655.mongolab.com:51655/journeychurch', function(err){
      if(err) {
       console.log('connection error', err);
   } else {
       console.log('connection successful');
   }
});

module.exports = app;


app.use(morgan('dev'));
app.use(bodyParser.json());

//app.use('/', routes);
app.use('/neighborhoods', require('./routes/neighborhoods'));
//app.use('/email', require('.routes/email'));
app.listen(port, function(){});
