//General requires
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('hbs')

//Require db
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/db_books');

//Require routes
const authenticationRoutes = require('./routes/authentication.js');
const generalRoutes = require('./routes/general.js');
const bookRoutes = require('./routes/books.js');
const libraryRoutes = require('./routes/library.js');

//Initialize db
db.serialize(function(){
	var sqlString1 = "CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT, role TEXT)";
	var sqlString2 = "CREATE TABLE IF NOT EXISTS permissions (username TEXT, shelf_name TEXT PRIMARY KEY)";
	db.run(sqlString1);
	db.run(sqlString2);
});

//Create express app
var app = express();
const PORT = process.env.PORT || 3000

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.locals.pretty = true;

//Middleware
app.use(session({secret: 'secretkey', resave: false, saveUninitialized: true}));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, '../public', 'bookicon.ico')));
app.use(logger('dev'));
app.use(express.static("images"));
app.use(express.json());

//Routes

//General
app.use('/', generalRoutes);

//Books
app.use('/', bookRoutes);

//Library
app.use('/', libraryRoutes);

//Authentication
app.use('/', authenticationRoutes);

//Start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`Here's the link to the website:`)
		console.log('http://localhost:3000')
		console.log(`------------------`)
		console.log(`To Login as Admin:`)
		console.log(`Username: Danial, Password: Password`)
		console.log(`To Login as Guest:`)
		console.log(`Username: Bill, Password: pass`)
		console.log(`OR register your own account!`)
	}
})