

var Neighborhood = require('../models/neighborhood.js');
var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: process.env.GOOGLEMAPS_APIKEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

module.exports = {
  load: function() {
      var data = [{'some data goes here'}];
      processJsonGroups(data);
  }
};

function processJsonGroups(data) {
  var i, j, tempAry, chunk = 10;
  for (i = 0; i < data.length; i+=chunk) {
    tempAry = data.slice(i, i+chunk);
    tempAry.forEach(processEntry);
  }
}

function processEntry (entry, idx, ary) {
    setTimeout(function() {
      if (entry.status != "Active") {
        return;
      }
      if (entry.meeting_address == "") {
        return;
      }
      if (entry.name.includes("Neighborhood")) {
        var entryAddress = entry.meeting_address + "," + entry.meeting_city + "," + entry.meeting_postcode;
        geocoder.geocode(entryAddress)
          .then(function(res) {
            var aGoodOne = new Neighborhood({
              id: entry.id,
              name: entry.name,
              address: entryAddress,
              lat: res[0].latitude,
              lng: res[0].longitude
            });
            aGoodOne.save(function(err){});
            console.log(aGoodOne);
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }, 4000*idx);
  }
