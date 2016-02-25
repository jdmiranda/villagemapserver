var ElvantoImport = function(){
  var Neighborhood = require('../models/neighborhood');
  var geocoderProvider = 'google';
  var httpAdapter = 'https';
  var extra = {
    apiKey: process.env.GOOGLEMAPS_APIKEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };
  var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

  var options = {
    host: 'api.elvanto.com',
    port: 80,
    path: '/v1/groups/getAll.json',
    auth: process.env.ELVANTO_APIKEY
  };

  var lookupAddress = function(neighborhood, address){
    geocoder.geocode(address)
    .then(function(res) {
      neighborhood.lat = res[0].latitude,
      neighborhood.lng = res[0].longitude
      console.log('saving')
      neighborhood.save();
    })
    .catch(function(err) {
      console.log(err);
    });
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
      status: group.status,
    });
    newNeighborhood.save();

    lookupAddress(newNeighborhood, address);
    console.log('saved ' + newNeighborhood.name);
  };

  var processGroup = function(group){
    if (group.name.includes("Neighborhood")) {
      var groupAddress = group.meeting_address + "," + group.meeting_city + "," + group.meeting_postcode;
      Neighborhood.findOne({'id':group.id}, function (err, foundGroup){
        if (err) return  console.log(err);
        if (foundGroup){
          var saveGroup = foundGroup;
          if (foundGroup.address != groupAddress || isNaN(foundGroup.lat) || isNaN(foundGroup.lng)){
            lookupAddress(foundGroup, groupAddress);
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

var CronJob = require('cron').CronJob;
  var job = new CronJob('00 00 * * * *', function() {
    console.log('starting elvanto import job');
    var req = require('http').request(options, callback).end();
  }, null, true, 'America/Los_Angeles');
};

var foo = function(){
  console.log('foo');
}

module.exports = {
  ElvantoImport : ElvantoImport
}
