var express = require('express');
var router = express.Router();
var sendgridAk = process.env.SENDGRID_APIKEY
var sendgrid  = require('sendgrid')(sendgridAk);
router.post('/', function(req, res, next) {
  var sender = req.body.sender;
  var body = req.body.body;
  var subject = req.body.subject;
  sendgrid.send({
    to:       'susanne@journeyfranklin.com',
    cc:       'village@journeyfranklin.com',
    from:     sender,
    subject:  subject,
    text:     body
  }, function(err, json) {
    if (err)
      res.send(err);
    res.json(json);
  });
});
module.exports = router;
