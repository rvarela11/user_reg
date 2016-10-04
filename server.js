'use strict'

var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require("body-parser"),
  env = process.env.NODE_ENV || 'development',
  config = require('./knexfile')[env],
  knex = require('knex')(config),
  bcrypt = require('bcrypt-as-promised');

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/users", function(req, res) {
  knex('users').then(
    function(users) {
      res.render('users', {
        users: users
      });
    }).catch(function(err) {
    console.log(err);
  });
});

app.get("/signup", function(req, res, next) {
  knex('users').then(function(users) {
    res.render('signup', {
      users: users
    });
  }).catch(function(err) {
    next(err);
  });
});


app.post("/signup", function(req, res, next) {
  bcrypt.hash(req.body.password, 12)
    .then(function(hashed_password) {
      return knex('users').insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        hashed_password: hashed_password
      });
    }).then(function(users) {
      res.redirect("/users")
    }).catch(function(err) {
      next(err);
    });
});

// app.post("/signup", function(req, res, next) {
//   bcrypt.hash("ilikebigcats", 12)
//     .then(function(hashed_password) {
//       return knex('users').insert({
//         first_name: "Robert",
//         last_name: "Varela",
//         email: "actiondude@gmail.com",
//         hashed_password: hashed_password
//       }, '*');
//     }).then(function(users) {
//       var user = users[0];
//       delete user.hashed_password;
//       res.send(user);
//     }).catch(function(err) {
//       next(err);
//     });
// });

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log("Server is listening on port 3000");
});

module.exports = app;
