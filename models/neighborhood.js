var mongoose = require ('mongoose');


var Schema = mongoose.Schema;

// create a schema
var neighborhoodSchema = new Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  lat: Number,
  long: Number,
  // meta: {
  //   age: Number,
  //   website: String
  // },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var NeighborHood = mongoose.model('NeighborHood', neighborhoodSchema);

// make this available to our users in our Node applications
module.exports = Neighborhood;
