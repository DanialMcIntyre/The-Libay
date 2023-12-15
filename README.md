# The Libay

This web application allows users to search Google's Book API for books to view their details.  
Users can also create _bookshelves_ in their library, which can store books they search for, allowing them to easily organize their books.  
There is a also fully functioning authentication system with an admin that can see all users.  
Start by clicking the buttons in the navbar after logging in.

## Installation

In the project directory, install the dependencies with:

```ssh
npm install
```

Then, obtain an [API key](https://developers.google.com/books), and copy the following lines into a .env file in the root directory

`API_KEY = "your-api-key-here"`

## Running

In the src directory, run the following command:

```ssh
node server.js
```

This will start up the app  
Open [http://localhost:3000] to view it in your browser.

Login details:  
To Login as Admin:  
Username: Danial, Password: Password  
To Login as Guest:  
Username: Bill, Password: pass  
OR register your own account!  

## Video demonstration

[![Alt text](https://img.youtube.com/vi/5vNyfQkGudM/0.jpg)](https://www.youtube.com/watch?v=5vNyfQkGudM)
