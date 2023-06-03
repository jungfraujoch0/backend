// Name: Soh Swee min
// Class: DAAA / FT / 1B / 01
// Admission number: P2214308

var mysql = require('mysql');

var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "pa$$woRD123",
            database: "bed_dvd_db"
        });
        return conn;
    }
};

module.exports = dbconnect