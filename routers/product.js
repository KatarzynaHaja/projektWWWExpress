var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';



module.exports =function(app) {
    app.get('/product', function (req, res) {
        res.render('product');
    });

    app.post('/product', function(req, res) {
        var id;
        var string;
        console.log("alo");
        console.log(req.body.description);
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var insertDocument = function (db,callback) {
            console.log("widze id");
            console.log(id);
            db.collection('products').insertOne({"id": id, "description": req.body.description,"path": string}, function (err, result) {
                assert.equal(err, null);
                res.status(500).send("Plik został dodany");
                callback();
            });
        };
        var addFile= function(db,callback) {
            console.log("adfile");
            sampleFile = req.files.file;
                id = Date.now();
                console.log("id"+id);
                string= "".concat("./image/", id.toString(), ".jpg");
                console.log(string);
                sampleFile.mv(string, function (err) {
                    if (err)
                        return res.status(500).send(err);
                    callback();

                });
        };

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            addFile(db,function() {
                insertDocument(db,function(){
                    db.close();
                    res.redirect("panel");
                });

            });
        });

    });


}