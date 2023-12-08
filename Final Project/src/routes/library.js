const express = require('express');
const router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db_books');
const main = require('./helpers.js')

//Checks if user is authenticated
const isAuthenticated = function (req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login')
    }
};

//GET REQUESTS

//Library route
router.get('/library', isAuthenticated, (req, res) => {
	main.loadLibrary(req, res, true);
});

//Individual shelf route
router.get('/shelf/:name', isAuthenticated, (req, res) => {
	var shelfName = req.params.name;
    db.all(`SELECT * FROM ${shelfName}`, (err, row) => {
        if (err) {
            console.error(err.message);
        } else {
			res.render('shelf', { data: row, shelfName: shelfName });
        }
    });
})

//POST REQUESTS

//On create shelf
router.post('/addShelf', (req, res) => {
	var shelfName = req.body.name;
	//Check for valid name
	if (shelfName.includes(" ") || shelfName === '' || /[^a-zA-Z]/.test(shelfName)) {
		main.loadLibrary(req, res, false);
	} else {
		//Create table for the shelf
		db.run(`CREATE TABLE IF NOT EXISTS ${shelfName} (book_title TEXT PRIMARY KEY, id TEXT)`, function (err) {
			if (err) {
				console.log(err.message);
			}
			//Set shelf owner to user
			var username = req.session.user.username;
			db.run(`INSERT INTO permissions (username, shelf_name) VALUES (?, ?)`, [username, shelfName], function (err) {
				if (err) {
					console.log(err.message);
				}
				main.loadLibrary(req, res, true);
			})
		});
	}
})

//On add to shelf
router.post('/addToShelf', (req, res) => {
	var shelfName = req.body.selectedOption;
	var bookTitle = req.body.bookTitle;
	var bookID = req.body.bookID;
	db.run(`INSERT INTO ${shelfName} (book_title, id) VALUES (?, ?)`, [bookTitle, bookID], function(err) {
		if (err) {
			console.log(err.message);
		} else {
			main.getBookDetails(bookID, req, res, true);
		}
	});
})

//On remove book from shelf
router.post('/removeBook', (req, res) => {
	var id = req.body.bookID;
	var shelfName = req.body.shelfName;
	db.run(`DELETE FROM ${shelfName} WHERE id = ?`, [id], function(err) {
		if (err) {
			return console.log(err.message);
		}
		res.redirect('/shelf/' + shelfName);
	  });
})

//On remove shelf
router.post('/removeShelf', (req, res) => {
	var shelfName = req.body.shelfName;
    //Delete the shelf table from db
	db.run(`DROP TABLE IF EXISTS ${shelfName}`, (err) => {
		if (err) {
		  	console.log(err.message);
		} else {
            //Delete shelf from permission table
			db.run(`DELETE FROM permissions WHERE shelf_name = ?`, [shelfName], function(err) {
				if (err) {
					console.log(err.message);
				}
				res.redirect('library');
			})
		}
	})
})

module.exports = router;