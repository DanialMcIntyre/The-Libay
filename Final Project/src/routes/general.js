const express = require('express');
const router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/db_books');

//Checks if user is authenticated
const isAuthenticated = function (req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login')
    }
};

//Home route
router.get('/home', isAuthenticated, (req, res) => {
	res.render('home');
});

//Users route
router.get('/users', isAuthenticated, (req, res) => {
	//If user if admin
	if (req.session.user.role === "Admin") {
		db.all("SELECT username, password, role FROM users", function(err, rows) {
			res.render('users', { isAdmin: true, users: rows });
		})
	} else {
		res.render('users', { isAdmin: false });
	}
});

module.exports = router;