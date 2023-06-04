


var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');


var actorsDB = {
    addActor: function (firstname,lastname, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {

                console.log("Connected!");
                sqlStr = "Insert into actor(first_name,last_name) values(?,?)";
                conn.query(sqlStr, [firstname,lastname], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });

            }
        });
    }
}

module.exports = actorsDB;
