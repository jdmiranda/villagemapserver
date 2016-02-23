var mongoose = require('mongoose');

var NeighborhoodSchema = new mongoose.Schema({
  id: String,
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  status: String,
  
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema);
