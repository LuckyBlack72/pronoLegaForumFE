// server.js
const express = require('express');

const app = express();

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  };
};
// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

// Heroku port
app.listen(process.env.PORT || 4200);
