var Neighborhood = require('../models/neighborhood');
var options = {
  host: 'api.elvanto.com',
  port: 80,
  path: '/v1/groups/getAll.json',
  auth: 'gPUD4UXum3Ui5Nmuuxs0l3F2qkP9PjRW:x'
};

//console.log(Neighborhood.collection);

// Neighborhood.findOne({'id':function (err, foundGroup){
//   console.log('love me');
//   if(err) return console.log(err);
//   console.log(foundGroup);
// });



var processGroup = function(group){
  //console.log( 'group id:' + group.id);
  console.log(group.id);
  Neighborhood.findOne({'id':group.id}, function (err, foundGroup){
    console.log(foundGroup);
    // if (err) {
    //   console.log(err);
    //   return;
    // };
  //  console.log('found: ' + group.name);
// }, function(found){
// console.log(found)
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
