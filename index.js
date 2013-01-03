var mongodb = require('mongodb');
require('chai').should();

var client = new mongodb.Db('millions', new mongodb.Server("192.168.0.162", 27017, {}), {
  w: 0
});

var devices = 70000;
var packages = 50;
var files = 60;

var insertEverything = function(err, collection) {
    for (var device = 0; device < devices; device++) {
      for (var packageNo = 0; packageNo < packages; packageNo++) {
        for (var file = 0; file < files; file++) {
          collection.insert({
            device: 'device ' + device,
            package: {
              name: 'package ' + packageNo
            },
            file: {
              name: 'some file' + file,
              version: '1.0.0.0'
            }
          });
        }
      }
      console.log('device ' + device);
    }
    client.close();
  }

client.open(function(err, p_client) {
  client.collection('sccm_inventory', insertEverything);
});
