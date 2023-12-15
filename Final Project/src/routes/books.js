const express = require('express');
const router = express.Router();
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

//Search route
router.get('/search', isAuthenticated, (req, res) => {
	res.render('search');
});

//List of books route
router.get('/books', isAuthenticated, (req, res) => {
	res.render('books');
});

//Book details route
router.get('/bookDetails/:id', isAuthenticated, (req, res) => {
    var bookID = req.params.id;
	main.getBookDetails(bookID, req, res, false);
});

//POST REQUESTS

//On search book
router.post('/books', (req, res) => {
	var title = encodeURIComponent(req.body.title);
	main.searchBooks(title, req, res);
})

module.exports = router;