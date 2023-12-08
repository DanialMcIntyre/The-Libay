const express = require('express');
const router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db_books');

//GET REQUESTS

//General route
router.get('/', (req, res) => {
	res.redirect('/login')
});

//Login route
router.get('/login', (req, res) => {
	res.render('login', { valid: true });
});
  
//Register route
router.get('/register', (req, res) => {
	res.render('register', { valid: true });
});

//Reset password route
router.get('/reset', (req, res) => {
	res.render('reset', { valid: false });
});

//Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

//Routes any other url to home -> if not auth, will go to login
router.get('*', (req, res) => {
    res.redirect('/home');
});

//POST REQUESTS

//On register
router.post('/register', (req, res) => {

	var {username, password} = req.body;

	//Check if user exists
	db.get("SELECT * from users WHERE username = ?", [username], function(err, response) {
		if (err) {
			console.log(err.message);
		}
		//Returns true if user is in DB
		if (response) {	
			res.render('register', { valid: false });
		} else {
			db.run("INSERT INTO users (username, password, role) VALUES (?, ?, 'Guest')", [username, password], function(err) {
				if (err) {
					console.log(err.message);
				} else {
			        res.render('login', { valid: true });
				}
			})
		}
	});
})

//On login
router.post('/login', (req, res) => {

	var {username, password} = req.body;

	db.get("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
		if(err) {
			console.log(err.message);
		}
		if (rows) {
            //Successful login
			if (rows.password === password) {
				req.session.user = { username: username, password: password, role: rows.role};
				res.redirect('/home');
			//If not, go back to login
			} else {
				res.render('login', { valid: false});
			}
		} else {
			res.render('login', { valid: false });
		}
	})
})

//On reset
router.post('/reset', (req, res) => {

	var {username, password} = req.body;

	db.get("SELECT * from users WHERE username = ?", [username], function(err, response) {
		if (err) {
			console.log(err.message);
		}
		//If username exists, change password
		if (response) {
			db.run("UPDATE users SET password = ? WHERE username = ?", [password, username], function (err) {
				if (err) {
					console.log(err.message);
				} else {
					console.log("Password changed!");
					res.render('reset', { valid: false });
				}
			})
		} else {
			console.log("Username doesn't exist!")
			res.render('reset', { valid: true });
		}
	})
})

module.exports = router;