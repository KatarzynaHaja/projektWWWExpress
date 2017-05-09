var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';

module.exports =function(app) {
    app.get('/showproduct/:id', function (req, res) {
        var id = req.params.id;
        res.render('showproduct', {id: id});
    });
}