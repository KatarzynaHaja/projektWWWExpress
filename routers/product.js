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

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        sampleFile = req.files.file;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./image/image1.png', function(err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded!');
        });
    });
}