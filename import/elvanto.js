var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku-app:journeychurch@ds051655.mongolab.com:51655/journeychurch', function(err){
  if(err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

var Neighborhood = require('../models/neighborhood');
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
  apiKey: 'AIzaSyA5Db5h9EXZQtKdc2puzX1PyoUxpyT3Ulk', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

var options = {
  host: 'api.elvanto.com',
  port: 80,
  path: '/v1/groups/getAll.json',
  auth: 'gPUD4UXum3Ui5Nmuuxs0l3F2qkP9PjRW:x'
};

var lookupAddress = function(neighborhood, address){
  console.log('looking up new address ');
  geocoder.geocode(address)
  .then(function(res) {
    neighborhood.lat = res[0].latitude,
    neighborhood.lng = res[0].longitude
  })
  .catch(function(err) {
    console.log(err);
  });
  return neighborhood;
};

var createNeighborhood = function (group, address){
  console.log( 'creating new neighborhood ' + group.name);
  console.log('group')
  if (typeof address == 'undefined'){
    return;
  };
  var newNeighborhood = new Neighborhood({
    id: group.id,
    name: group.name,
    address: address,
    status: group.status
  });
  var updatedNeighborhood = lookupAddress(newNeighborhood, address);
  newNeighborhood.save();
  console.log('saved ' + newNeighborhood.name);
};

var processGroup = function(group){
  if (group.name.includes("Neighborhood")) {
    var groupAddress = group.meeting_address + "," + group.meeting_city + "," + group.meeting_postcode;
    Neighborhood.findOne({'id':group.id}, function (err, foundGroup){
      if (err) return  console.log(err);
      if (foundGroup){
        var saveGroup = foundGroup;
        if (foundGroup.address != groupAddress){
          console.log('old address: ' + foundGroup.address);
          console.log('new address: ' + groupAddress);
          saveGroup = lookupAddress(foundGroup, groupAddress);
        }

        saveGroup.name = group.name;
        saveGroup.status = group.status;
        saveGroup.address = groupAddress;
        saveGroup.save();
      }
      else{
        if (group.meeting_address == '') return;
        createNeighborhood(group, groupAddress);
      }
    });
  };
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
