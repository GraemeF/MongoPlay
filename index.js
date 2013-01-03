var mongodb = require('mongodb');
require('chai').should();

var client = new mongodb.Db('millions', new mongodb.Server("127.0.0.1", 27017, {}), {w: 1});
var test = function (err, collection) {
  collection.insert({a: 2}, function (err, docs) {

    collection.count(function (err, count) {
      count.should.equal(1);
    });

    // Locate all the entries using find
    collection.find().toArray(function (err, results) {
      results.length.should.equal(1);
      results[0].a.should.equal(2);

      // Let's close the db
      client.close();
    });
  });
};

client.open(function (err, p_client) {
  client.collection('sccm_inventory', test);
});