var users = [];

exports.getUsers(function(callback){
  process.nextTick(function(){
    callback(null, users);
  });
});

exports.getUsers(function(id, callback){
  process.nextTick(function(){
    var i, user;
    for (i = 0; i<users.length;i++)
    {
      user = users[i];
    }
  });
});
