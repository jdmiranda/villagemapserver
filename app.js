var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    mongoose = require('mongoose');
    var dotenv = require('dotenv').config();

    port = process.env.PORT || 3000;
    var connection = 'mongodb://' + process.env.MONGODB;
    mongoose.connect(connection, function(err){
      if(err) {
       console.log('connection error', err);
   } else {
       console.log('connection successful');
   }
});


module.exports = app;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/neighborhoods', require('./routes/neighborhoods'));
app.use('/email', require('./routes/email'));
app.listen(port, function(){});
console.log('started app');
require('./import/elvanto').ElvantoImport();
