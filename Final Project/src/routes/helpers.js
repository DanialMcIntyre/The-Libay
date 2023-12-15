var https = require('https');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/db_books');

require('dotenv').config({path:__dirname + '/./../../.env'});
const key = process.env.API_KEY;

//API call to get book details from book ID
function getBookDetails(bookID, req, res, added) {

	let options = {
		host: 'www.googleapis.com',
		path: '/books/v1/volumes/' + bookID,
		method: 'GET'
	}

	//Run API call to get book details
	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
			bookData += chunk
		})
		apiResponse.on('end', function() {
			var bookDataJSON = JSON.parse(bookData)

			//Get table names from DB
			var username = req.session.user.username;
			//If user is guest
			if (req.session.user.role === "Guest") {
				db.all("SELECT shelf_name FROM permissions WHERE username = ?", [username], function (err, userRows) {
					if (err) {
						console.log(err.message)
					}
					res.render('bookDetails', { data: bookDataJSON, shelfNames: userRows, isAdded: added });
				})
			//If user is admin
			} else {
				db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('users', 'permissions')", function (err, rows) {
					if (err) {
						console.log(err.message);
					}
					rows = rows.map(row => ({ shelf_name: row.name }));
					res.render('bookDetails', { data: bookDataJSON, shelfNames: rows, isAdded: added });
				})
			}
		})
	  }).end()
}

//API call to search book db, returns a list
function searchBooks(searchTerm, req, res) {

	let options = {
		host: 'www.googleapis.com',
		path: '/books/v1/volumes?q=' + searchTerm + '&maxResults=20&key=' + key,
		method: 'GET'
	}

	https.request(options, function(apiResponse) {
		let bookData = ''
		apiResponse.on('data', function(chunk) {
			bookData += chunk
		})
		apiResponse.on('end', function() {
			var bookDataJSON = JSON.parse(bookData);
			res.render('books', { data: bookDataJSON });
		})
	  }).end()
}

//Gets all shelves associated with the user
function loadLibrary(req, res, validity) {

	//If user is guest
	if (req.session.user.role === "Guest") {
		var username = req.session.user.username;
		db.all("SELECT shelf_name FROM permissions WHERE username = ?", [username], function (err, rows) {
			if (err) {
				console.log(err.message)
			}
			res.render('library', { data: rows, valid: validity });
		})
	//If user is admin
	} else {
		db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('users', 'permissions')", function (err, rows) {
			if (err) {
				console.log(err.message);
			}
			rows = rows.map(row => ({ shelf_name: row.name }));
			res.render('library', { data: rows, valid: validity });
		})
	}
}

module.exports = { getBookDetails, searchBooks, loadLibrary }