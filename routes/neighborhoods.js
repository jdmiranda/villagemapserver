var express = require('express');
var router = express.Router();

//var mongoose = require('mongoose');
var NeighborHood = require('../models/neighborhood.js');

router.get('/', function(req, res, next) {
  NeighborHood.find(function (err, neighborhoods) {
    if (err) return next(err);
    res.json(neighborhoods);
  });
});

router.post('/', function(req, res, next) {
  NeighborHood.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/:id', function(req, res, next) {
  NeighborHood.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', function(req, res, next) {
  NeighborHood.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', function(req, res, next) {
  NeighborHood.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
