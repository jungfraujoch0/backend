

var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var filmDB = {


    //no budget
    getFilms: function (title, category,limit, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("***Connected!");
                console.log('category:', category);
                console.log('title:', title);
                var sql = `SELECT f.title,f.rating,f.release_year,fc.film_id
FROM film_category fc
inner join film f on fc.film_id=f.film_id
inner join category c on fc.category_id=c.category_id
inner join film_actor fa on fa.film_id=fc.film_id
inner join actor a on a.actor_id=fa.actor_id
where f.title LIKE '%${title}%' OR c.name='${category}'
GROUP BY f.film_id LIMIT ${limit};`;


console.log(sql)
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
    },

    //got budget
    getFilmsbyBudget: function (title, category, rentalrate,limit, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("***Connected!");
                console.log('category:', category);
                console.log('title:', title);
                console.log('rate',rentalrate)
                var sql = `SELECT f.title,f.rating,f.release_year,fc.film_id 
                FROM film_category fc 
                inner join film f on fc.film_id=f.film_id 
                inner join category c on fc.category_id=c.category_id 
                inner join film_actor fa on fa.film_id=fc.film_id 
                inner join actor a on a.actor_id=fa.actor_id 
                where (f.title LIKE '%${title}%' OR c.name='${category}') AND f.rental_rate between 0 and ${rentalrate}
                GROUP BY f.film_id LIMIT ${limit};`

                console.log(sql)
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
    },
    //dynamically retrieve the categories
    getCategories: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                // console.log("***Connected!");

                var sql = `SELECT DISTINCT name FROM category`;


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
    },

    getAllFilms: function (limit,callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("***Connected!");
                var sql = `SELECT f.title,f.rating,f.release_year,fc.film_id
FROM film_category fc
inner join film f on fc.film_id=f.film_id
inner join category c on fc.category_id=c.category_id
inner join film_actor fa on fa.film_id=fc.film_id
inner join actor a on a.actor_id=fa.actor_id
GROUP BY f.film_id LIMIT ${limit};`

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
    },


    //get specific film dvd
    getFilm: function (filmid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("***Connected!");
                var sql = `SELECT f.title, c.name as category, f.rating,f.release_year,f.description, GROUP_CONCAT(CONCAT (first_name, ' ',last_name)) Actors
FROM film_category fc
inner join film f on fc.film_id=f.film_id
inner join category c on fc.category_id=c.category_id
inner join film_actor fa on fa.film_id=fc.film_id
inner join actor a on a.actor_id=fa.actor_id
where fc.film_id=?;`

                // console.log(sql)
                conn.query(sql, [filmid], function (err, result) {
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

module.exports = filmDB;
