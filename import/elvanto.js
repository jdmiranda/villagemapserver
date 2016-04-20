var ElvantoImport = function() {
    var Neighborhood = require('../models/neighborhood');
    var geocoderProvider = 'google';
    var httpAdapter = 'https';
    var extra = {
      apiKey: process.env.GOOGLEMAPS_APIKEY, // for Mapquest, OpenCage, Google Premier
      formatter: null // 'gpx', 'string', ...
    };
    var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

    var options = {
      host: 'api.elvanto.com',
      port: 80,
      path: '/v1/groups/getAll.json',
      auth: process.env.ELVANTO_APIKEY
    };

    var createNeighborhood = function(group, address) {
      console.log('creating new neighborhood ' + group.name);
      console.log('group')
      if (typeof address == 'undefined') {
        return;
      };
      geocoder.geocode(address)
        .then(function(res) {
            var newNeighborhood = new Neighborhood({
              id: group.id,
              name: group.name,
              address: address,
              status: group.status,
              lat: res[0].latitude,
              lng: res[0].longitude
            });
            newNeighborhood.save();
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    var processGroup = function(group) {
      if (group.name.includes("Neighborhood")) {
        var groupAddress = group.meeting_address + "," + group.meeting_city + "," + group.meeting_postcode;
        Neighborhood.findOne({
            'id': group.id
          }, function(err, foundGroup) {
            if (err) return console.log(err);
            if (foundGroup) {
              var saveGroup = foundGroup;
              if (foundGroup.address != groupAddress
                || isNaN(foundGroup.lat)
                || isNaN(foundGroup.lng)) {
                geocoder.geocode(groupAddress)
                  .then(function(res) {
                        saveGroup.id = saveGroup.id,
                        saveGroup.name = saveGroup.name;
                        saveGroup.status = saveGroup.status;
                        saveGroup.address = groupAddress;
                        saveGroup.lat = res[0].latitude,
                        saveGroup.lng = res[0].longitude
                      saveGroup.save();
                  })
                  .catch(function(err) {
                    console.log(err);
                  });
              }
              } else {
                if (group.meeting_address == '') return;
                createNeighborhood(group, groupAddress);
              }
            });
        };
      };


      var callback = function(response) {
        var dataJson = '';

        response.on('data', function(chunk) {
          dataJson += chunk;
        });

        response.on('end', function() {
          dataJson = JSON.parse(dataJson);
          dataJson.groups.group.forEach(processGroup);
        });

      };

      var CronJob = require('cron').CronJob;
      var job = new CronJob('00 * * * * *', function() {
        console.log('starting elvanto import job');
        var req = require('http').request(options, callback).end();
      }, null, true, 'America/Los_Angeles');
    };

    module.exports = {
      ElvantoImport: ElvantoImport
    }
