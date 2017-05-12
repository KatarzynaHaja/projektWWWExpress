var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';

module.exports =function(app) {
    app.get('/showproduct/:id', function (req, res) {
        if (req.session.role == undefined)
        {
            res.status(401).render("401");
        }
        else
        {
            var products = function(db,callback) {
                var id = req.params.id;
                console.log(id);
                db.collection('products').find({"id": parseInt(id, 10)}).toArray(function (err, results) {
                    console.log("produkt");
                    console.log(results);
                    return callback(results);
                });

            };
            var findComments = function(db, callback){
                var id = req.params.id;
                db.collection('comments').find({"productId": id}).toArray(function(err, results){
                    console.log("komentarze");
                    console.log(results);
                    return callback(results);
                })
            };
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                products(db,function(array) {
                    findComments(db, function(c){
                        db.close();
                        res.render("show_product", {product: array[0], comments: c});
                    });

                });
            });

        }
    });
}
