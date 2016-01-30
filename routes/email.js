var express = require('express');

var router = express.Router();
//var email = new sendgrid.Email();
var sendgridAk = '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'
var sendgrid  = require('sendgrid')(sendgridAk);
// sendgrid.send({
//   to:       'jeremy.d.miranda@gmail.com',
//   from:     'other@example.com',
//   subject:  'Hello World',
//   text:     'My first email through SendGrid.'
// }, function(err, json) {
//   if (err) { return console.error(err); }
//   console.log(json);
// });

router.post('/', function(req, res, next) {
  var sender = req.param('from');
  var body = req.param('body');
  var subjectVillageName = req.param('subject');
  sendgrid.send({
    to:       'jeremy.d.miranda@gmail.com',
    from:     sender,
    subject:  subjectVillageName,
    text:     body
  }, function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
});

module.exports = router;
