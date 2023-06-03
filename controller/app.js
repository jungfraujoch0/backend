// Name: Soh Swee min
// Class: DAAA / FT / 1B / 01
// Admission number: P2214308

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = require('../model/user');
var actor = require('../model/actor')
var customers = require('../model/customer')
var films = require('../model/film')
var rental = require('../model/rental')
var verifyToken = require('../auth/verifyToken.js');
var cors = require('cors');

app.options('*', cors());
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.use(bodyParser.json());
app.use(urlencodedParser);

//get that particular filmid
app.get('/film/:filmid', function (req, res) {
	var filmid = req.params.filmid;

	films.getFilm(filmid, function (err, result) {
		if (!err) {
			res.send(result);
		} else {
			res.status(500).send("Some error");
		}
	});
});


app.post('/user/login', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;

	user.loginUser(email, password, function (err, token, result) {
		if (!err) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			delete result[0]['password'];//clear the password in json data, do not send back to client
			console.log(result);
			res.json({ success: true, UserData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
			res.send();
		} else {
			res.status(500);
			res.send(err.statusCode);

		}
	});
});


app.post('/user/logout', function (req, res) {
	console.log("..logging out.");
	//res.clearCookie('session-id'); //clears the cookie in the response
	//res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, status: 'Log out successful!' });

});




//Add actor
app.post('/actor', function (req, res) {

	var firstname = req.body.first_name;
	var lastname = req.body.last_name;


	actor.addActor(firstname, lastname, function (err, result) {
		if (err) {
			//missing body object 
			console.log(err)
			res.status(500)
			res.type('json')
			res.send(`{"error_msg":"Internal server error"}`)

		}
		else {
			if (firstname.length == 0 || lastname.length == 0) {
				res.status(400);
				res.type('json')
				res.send(`{"error_msg":"missing data"}`)
				return
			} else
				//success
			res.status(201);
			res.type("json");
			res.send(`{"actor_id": "${result.insertId}"}`);
		}

	});
});



//search for films
app.get('/films', function (req, res) {
	var title = req.query.title
	var category = req.query.category
	var rentalrate = req.query.rentalrate
	var limit = req.query.limit
	//search with category

	if (!rentalrate && !category && !title) {
		films.getAllFilms(function (err, result) {
			if (!err) {
				res.send(result);

			} else {
				console.log(err)
				res.status(500).send(null);
			}

		});
	}
	else if (!rentalrate) {
		films.getFilms(title, category, limit, function (err, result) {
			if (!err) {
				res.send(result);
			} else {
				console.log(err)
				res.status(500).send(null);
			}

		})
	}

	else {
		films.getFilmsbyBudget(title, category, rentalrate, limit, function (err, result) {
			if (!err) {
				res.send(result);
			} else {
				console.log(err)
				res.status(500).send(null);
			}

		})
	}
})


//get rental rate
app.get('/rental', function (req, res) {
	var filmid = req.query.filmid
	var duration = req.query.duration

	//search with category

	rental.getPrice(duration,filmid,function (err, result) {
			if (!err) {
				res.send(result);

			} else {
				console.log(err)
				res.status(500).send(null);
			}

		});
	
	

		})


//get the categories
app.get('/show-list', function (req, res) {

	films.getCategories(function (err, result) {
		if (!err) {
			res.json({
				msg: 'Request successful',
				category: result,
			})
		} else {
			res.status(500).send("Some error");
		}
	});
});

//get the store ids
app.get('/show-store', function (req, res) {

	customers.getStoreID(function (err, result) {
		if (!err) {
			res.json({
				msg: 'Request successful',
				store: result,
			})
		} else {
			res.status(500).send("Some error");
		}
	});
});


//post customer info
app.post('/customers', function (req, res) {
	var store_id = req.body.store_id
	var first_name = req.body.first_name
	var last_name = req.body.last_name
	var email = req.body.email
	var address_line1 = req.body.address_line1
	var address_line2 = req.body.address_line2
	var district = req.body.district
	var city_id = req.body.city_id
	var postal_code = req.body.postal_code
	var phone = req.body.phone


	customers.insertAddress(address_line1, address_line2, district, city_id, postal_code, phone, function (err, results) {

		if (err) {
			if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
				res.status(400);
				res.type("json");
				res.send(`{"error_msg":"missing data"}`);
			} else if (err.code == 'ER_DUP_ENTRY') {
				res.status(409);
				res.type("json");
				res.send(`{"error_msg":"email already exists"}`);
			}

		} else if (!results.insertId) {
			res.status(500);
			res.type("json");
			res.send(`{"error_msg":"Data not inserted properly"}`);
		} else {
			customers.insertCustomer(store_id, first_name, last_name, email, results.insertId, function (err, results2) {

				if (err) {
					if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
						res.status(400);
						res.type("json");
						res.send(`{"error_msg":"data"}`);
					} else if (err.code == 'ER_DUP_ENTRY') {
						res.status(409);
						res.type("json");
						res.send(`{"error_msg":"email already exists"}`);
					}
					else {
						console.log(err)
						res.status(500)
						res.type('json')
						res.send(`{"Message":"Error occured" }`)
					}
				}
				else {

					res.status(201);
					res.type("json");
					res.send(`{"customer_id": "${results2.insertId}"}`);

				}
			})
		}

	})
})


//add to cart


module.exports = app;