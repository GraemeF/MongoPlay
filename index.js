var mongodb = require('mongodb');
require('chai').should();

var client = new mongodb.Db('millions', new mongodb.Server("192.168.0.162", 27017, {}), {
  w: 0
});

var devices = 70000;
var packages = 50;
var files = 60;

var insertDevice = function(device, collection, callback) {
    console.log('inserting device ' + device);
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
          device: 'device ' + device,
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
      //console.log(JSON.stringify(result));
      var device = parseInt(result[0].device.substr(6));
      process.nextTick(function() {
        //console.log('called back ' + device + '/' + devices);
        if (device < devices) {
          insertDevice(++device, collection, doneDevice);
          console.log('device ' + device);
        } else {
          console.log('done');
          client.close();
        }
      });
    };

    insertDevice(1, collection, doneDevice);
  }

client.open(function(err, p_client) {
  client.collection('sccm_inventory', insertEverything);
});
