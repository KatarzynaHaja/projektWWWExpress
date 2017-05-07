var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/products';
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
module.exports =function(app) {
    app.post('/login', function (req, res)
    {
        var username = req.body.login;
        console.log(username);
        var password = req.body.password;
        var hash =crypto.createHash('md5').update(password).digest('hex');
        var searchLogin = function(db,callback) {
            db.collection('users').find({"username": username}).count(function (e, count) {
                if (count > 0) {
                    console.log("blee");
                    db.collection('users').find({"username": username}).toArray(function (err, results) {
                        console.log(results[0]['password']);
                        if (results[0]['password'] == hash) {
                            console.log("Dobre hasło")
                            req.session.role = results[0]['role'];
                            req.session.username = results[0]['username'];
                            console.log(req.session.role);
                            delete req.session.error;
                            res.redirect('/user');
                        }
                        else {
                            req.session.error = "Podane hasło jest błędne";
                            res.redirect('/login');

                        }
                    });
                }
                else {
                    req.session.error = "Podany login nie istnieje";
                    res.redirect('/login');
                }

            });

        }
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                searchLogin(db,function() {
                   db.close();
                });
            });


       });


    app.get('/login', function (req, res) {
        res.render('login', {error:req.session.error});

    });
}