var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';

module.exports =function(app) {
    app.get('/showproduct/:id', function (req, res) {
        if (req.session.role == undefined)
        {
            res.status(401).send("Nie jesteś zalogowany")
        }
        else
        {
            var products = function(db,callback) {
                var id = req.params.id;
                console.log(id);
                db.collection('products').find({"id": parseInt(id, 10)}).toArray(function (err, results) {
                    console.log(results);
                    return callback(results);
                });

            };
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                products(db,function(array) {
                    db.close();
                    console.log(array);
                    res.render("show_product", {product: array[0]});
                });
            });

        }
    });
}
