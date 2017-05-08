var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
var validator = require("email-validator");

module.exports =function(app) {
    app.post('/register', function (req, res) {
        var username = req.body.login;
        var password = req.body.password;
        var password2 = req.body.password2;
        var mail = req.body.mail;
        var ok = false;
        var emailOk = false;
        if (password == password2)
        {
            ok = true;
            hash = crypto.createHash('md5').update(password).digest('hex');
        }
        if(validator.validate(mail)){
            emailOk = true;
        }
        var insertDocument = function (db, callback) {
            db.collection('users').insertOne({"username": username, "password": hash, "email":mail,"role":"user"}, function (err, result) {
                assert.equal(err, null);
                callback();
            });
        };

        var searchLogin = function(db,callback)
        {

            db.collection('users').find({"username":username}).count(function (e, count) {
                if(count>0)
                {
                    req.session.error = "Taki login już istnieje";
                    res.redirect('/register');
                }
                else
                {
                    if(ok && emailOk)
                    {
                        delete req.session.error;
                        callback();
                    }
                    else
                    {
                        if(!ok) {
                            req.session.error = "Hasła nie są takie same";
                        }else{
                            req.session.error = "Wprowadzony e-mail nie jest poprawny";
                        }
                        res.redirect('/register');
                    }

                }
            });

        };
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            searchLogin(db,function() {
                    insertDocument(db, function () {
                        db.close();
                    });
                    res.redirect('/login');
                    });
            });




    });

    app.get('/register', function (req, res) {
        res.render('register', {error:req.session.error});


    });
}