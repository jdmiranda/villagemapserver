var Neighborhood = require('../models/neighborhood.js');
var options = {
  host: 'api.elvanto.com',
  port: 80,
  path: '/v1/groups/getAll.json',
  auth: 'gPUD4UXum3Ui5Nmuuxs0l3F2qkP9PjRW:x'
};


var processGroup = function(group){
  Neighborhood.findById(group.id, function (err, post) {
    if (err) {
      console.log(err);
      return;
    };
    console.log('found: ' + group.name);
  });
};

var callback = function(response) {
  var dataJson='';

  response.on('data', function (chunk) {
    dataJson += chunk;
  });

  response.on('end', function () {
    dataJson = JSON.parse(dataJson);
    dataJson.groups.group.forEach(processGroup);
  });
};


var req = require('http').request(options, callback).end();
