var mongodb = require('mongodb');
var uuid = require('node-uuid');
require('chai').should();

var client = new mongodb.Db('millions', new mongodb.Server("192.168.0.162", 27017, {}), {
  w: 0
});

var devices = 70000;
var packages = 50;
var files = 60;

var insertDevice = function(device, collection, callback) {
    var name = uuid.v4();

    for (var packageNo = 1; packageNo <= packages; packageNo++) {
      for (var file = 1; file <= files; file++) {
        var options;
        var cb;

        if (file === files && packageNo === packages) {
          options = {
            safe: true
          };
          cb = callback;
        } else {
          options = {
            safe: false
          };
          cb = function(err) {
            if (err) throw err;
          }
        }

        collection.insert({
          device: {
            number: device,
            name: name
          },
          package: {
            name: 'package ' + packageNo
          },
          file: {
            name: 'some file' + file,
            version: '1.0.0.0'
          }
        }, options, cb);
      }
    }
  };

var insertEverything = function(err, collection) {
    function doneDevice(err, result) {
      var device = result[0].device.number;
      process.nextTick(function() {
        if (device < devices) {
          insertDevice(++device, collection, doneDevice);
        } else {
          console.log('done at ', Date());
          client.close();
        }
      });
    }

    collection.ensureIndex({'device.name': 1, 'package.name': 1, 'file.name': 1}, function () {
      insertDevice(1, collection, doneDevice);
    });
  };

console.log('started at', Date());

client.open(function(err, p_client) {
  client.collection('sccm_inventory', insertEverything);
});
