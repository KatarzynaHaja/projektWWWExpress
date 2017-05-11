var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';



module.exports =function(app) {
    app.get('/product', function (req, res) {
        console.log(req.session.role)
        if (req.session.role == undefined)
        {
            res.render('401');
        }
        else
        {
            if(req.session.role =='user')
            {
                res.render('403');
            }
            else
            {
                res.render('product');
            }
        }

    });

    app.post('/product', function(req, res) {
        var id;
        var string;
        var string2;
        console.log("alo");
        console.log(req.body.description);
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var insertDocument = function (db,callback) {
            console.log("widze id");
            console.log(string2);
            db.collection('products').insertOne({"id": id, "name": req.body.product_name,
                "description": req.body.description,"path": string2, "marks": 0, "users": 0}, function (err, result) {
                assert.equal(err, null);
                //res.status(500).send("Plik został dodany");
                callback();
            });
        };
        var addFile= function(db,callback) {
            console.log("adfile");
            sampleFile = req.files.file;
                id = Date.now();
                console.log("id"+id);
                string= "".concat("./image/", id.toString(), ".jpg");
                string2= "".concat("/", id.toString(), ".jpg");
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
                    res.redirect("/panel");
                });

            });
        });

    });
    app.get('/deleteproduct', function(req, res){
        if (req.session.role == undefined)
        {
            res.render('401');
        }
        else
        {
            if(req.session.role =='user')
            {
                res.render('403');
            }
            else
            {
                var searchProducts = function(db,callback) {
                    db.collection('products').find().toArray(function (err, results) {
                        return callback(results);
                    });

                };
                MongoClient.connect(url, function (err, db) {
                    assert.equal(null, err);
                    searchProducts(db,function(array) {
                        db.close();
                        res.render("delete_products", {form: array});
                    });
                });

            }
        }

    });
    app.post('/deleteproduct', function(req, res){
        var deleteProducts = function(db,callback) {
            if(req.body.id){
                if(Array.isArray(req.body.id)){
                    for(var i=0; i< req.body.id.length; i++){
                        console.log("usuwam" + req.body.id);
                        db.collection('products').findOneAndDelete({"id": parseInt(req.body.id[i], 10)});
                        db.collection('comments').deleteMany({"productId": req.body.id[i]});
                        db.collection('marks').deleteMany({"productId": req.body.id[i]});
                    }
                }else{
                    db.collection('products').findOneAndDelete({"id": parseInt(req.body.id, 10)});
                    db.collection('comments').deleteMany({"productId": req.body.id});
                    db.collection('marks').deleteMany({"productId": req.body.id});
                }
            }
            res.redirect("/panel");
        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            deleteProducts(db,function() {
                db.close();
            });
        });
    });

}