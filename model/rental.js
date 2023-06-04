

var db = require('./databaseConfig.js');
var config = require('../config.js');

var rental = {
    getPrice: function (duration, filmid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("***Connected!");
                var sql = `SELECT title, TRUNCATE((rental_rate/rental_duration),2) * ${duration} AS price
FROM film 
where film_id=${filmid}`

                // console.log(sql)
                conn.query(sql, function (err, result) {
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

module.exports = rental;
