var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var crypto = require('crypto');

module.exports =function(app) {
    app.get('/comment/:id', function (req, res) {
        if (req.session.role == undefined)
        {
            res.status(401).render("401");
        }
        else {
            res.render("new_comment", {id: req.params.id})
        };
    });
    app.post('/comment/:id', function(req, res){
        if (req.session.role == undefined)
        {
            res.status(401).render("401");
        }
        else {
            var insertDocument = function (db,callback) {
                var productId = req.params.id;
                db.collection('comments').insertOne({"id": Date.now(), "productId": productId, "comment": req.body.body,
                    "user": req.session.username, "time": new Date()}, function (err, result) {
                    assert.equal(err, null);
                    callback();
                });
            };
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                insertDocument(db,function(){
                    db.close();
                    res.redirect("/showproduct/"+req.params.id);
                });


            });
        };
    })
}
