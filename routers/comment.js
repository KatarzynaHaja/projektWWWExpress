var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var crypto = require('crypto');

module.exports =function(app) {
    app.get('/comment/:id', function (req, res) {
        console.log("alo");
        if (req.session.role == undefined)
        {
            res.status(401).send("Nie jesteś zalogowany")
        }
        else {
            res.render("new_comment", {id: req.params.id})
        };
    });
    app.post('/new_comment', function(req, res){
        
    })
}
