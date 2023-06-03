//Name: Soh Swee min
//Class: DAAA/FT/1B/01
//Admission number: P2214308

var db = require('./databaseConfig');
var customers = {
    
    //endpoint 8
    insertAddress: function (address_line1, address_line2, district, city_id, postal_code, phone, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null); //since error so no result 
            } else { //no err, connection to db sucessful

                var sql = `INSERT INTO address (address, address2, district, city_id, postal_code, phone)
VALUES (?,?,?,?,?,?);`


                dbConn.query(sql, [address_line1, address_line2, district, city_id, postal_code, phone], function (err, results) {

                    dbConn.end();
                    return callback(err, results);
                })
            }
        })
    },
    insertCustomer: function (store_id, first_name, last_name, email, address_id, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {
                return callback(err, null); //since error so no result 
            } else { //no err, connection to db sucessful

                var sql = `INSERT INTO customer(store_id, first_name, last_name, email,address_id)
VALUES (?,?,?,?,?);`

                dbConn.query(sql, [store_id, first_name, last_name, email, address_id], function (err, results2) {

                    dbConn.end();
                    return callback(err, results2);
                })
            }
        })
    },

    getStoreID: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                // console.log("***Connected!");

                var sql = `SELECT DISTINCT store_id FROM store`;


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

    //Additional endpoint 2
    //Update customer address_id using address provided
//     updateAddress: function (address, customer_id, callback) {
//         var dbConn = dbConfig.getConnection();
//         dbConn.connect(function (err) {

//             if (err) {
//                 return callback(err, null); //since error so no result 
//             } else { //no err, connection to db sucessful 

//                 var sql = `UPDATE customer
// SET address_id = (SELECT address_id FROM address WHERE address = ?)
// WHERE customer_id = ?;`;
//                 dbConn.query(sql, [address, customer_id], function (err, results) {
//                     dbConn.end();
//                     return callback(err, results);

//                 })
//             }
//         })
//     }

}
module.exports = customers;