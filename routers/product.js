var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';



module.exports =function(app) {
    app.get('/product', function (req, res) {
        res.render('product');
    });

    app.post('/product', function(req, res) {
        console.log(req.body.description)
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        sampleFile = req.files.file;

        var addFile= function(db,callback) {
            db.collection('products').find().count(function (e, count) {
                var id = count+1;
                sampleFile.mv('./image/image1.png', function(err) {
                    if (err)
                        return res.status(500).send(err);

                    res.send('File uploaded!');
        });

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            searchLogin(db,function() {
                db.close();
            });
        });

    });

}