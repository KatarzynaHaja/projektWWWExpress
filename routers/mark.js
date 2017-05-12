var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';

module.exports =function(app) {
    app.get('/mark/:id', function (req, res) {
        if (req.session.role == undefined)
        {
            res.status(401).render("401");
        }
        else {
            res.render("mark", {id: req.params.id})
        }
    });
    app.post('/mark/:id', function(req, res){
        if (req.session.role == undefined)
        {
            res.status(401).render("401");
        }
        else {
            var insertDocument = function (db,callback) {
                var productId = req.params.id;
                db.collection('marks').insertOne({"id": Date.now(), "productId": productId, "mark": req.body.marks,
                    "user": req.session.username, "time": new Date()}, function (err, result) {
                    assert.equal(err, null);
                    console.log("alo");
                    db.collection('products').update(
                        {"id": parseInt(productId, 10)},
                        { $inc: { "marks": parseInt(req.body.marks, 10), "users": 1 } }, function(err, result){
                            callback();
                        }
                    )

                });


            };
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                insertDocument(db,function(){
                    db.close();
                    res.redirect("/showproduct/"+req.params.id);
                });

            });
        }
    });
};