var mongoose = require('mongoose');

var NeighborhoodSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  long: Number
});

module.exports = mongoose.model('Neighborhood', NeighborhoodSchema);
