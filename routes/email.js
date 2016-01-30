var express = require('express');
var router = express.Router();
var sendgridAk = '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'
var sendgrid  = require('sendgrid')(sendgridAk);

router.post('/', function(req, res, next) {
   var sender = req.body.sender;
  var body = req.body.body;
  var subject = req.body.subject;

  sendgrid.send({
    to:       'jeremy.d.miranda@gmail.com',
    from:     sender,
    subject:  subject,
    text:     body
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
});

module.exports = router;
