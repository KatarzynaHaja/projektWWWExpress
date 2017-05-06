var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
module.exports =function(app) {
    app.post('/register', function (req, res) {
        var username = req.body.login;
        var password = req.body.password;
        var password2 = req.body.password2;
        var mail = req.body.mail;
        var ok = false;
        if (password == password2)
        {
            ok = true;
        }
        var insertDocument = function (db, callback) {
            db.collection('users').insertOne({"username": username, "password": password, "email":mail}, function (err, result) {
                assert.equal(err, null);
                callback();
            });
        };

        var searchLogin = function(db,callback)
        {
            console.log(JSON.stringify(db.collection('users').find({"username":username}).count()));
            console.log(db.collection('users').find({"username":username}).count(function (e, count) {
                if(count>0)
                {
                    req.session.error = "Taki login ju istnieje";
                    res.redirect('/register');
                }
                else
                {
                    delete req.session.error;
                    callback();
                }
            })

            );


        }
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            searchLogin(db,function() {
                    insertDocument(db, function () {
                        db.close();
                    })
                    res.redirect('/login');
                    });
            });




    });

    app.get('/register', function (req, res) {
        res.render('register', {error:req.session.error});


    });
}