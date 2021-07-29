// To import express, jsonwebtoken and cors libraries
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
var favicon = require("serve-favicon");
require("dotenv").config();

// To create the express app
const app = express();

// To be able to receive and send data in json format
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "rectn-react/build")));
app.use(
  favicon(path.join(__dirname, "rectn-react/build/assets/imgs/small-icon.png"))
);

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

let users = [];

let accessTokens = [];

// app.get("/", (req, res) => {
//   res.json({
//     status: "running",
//     message: "RECTN app is running successfully.",
//   });
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "rectn-react/build/index.html"));
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // To make sure that there is no user registered with that email
  for (const user of users) {
    if (user.email === email) {
      res.sendStatus(409);
    }
  }

  // To save the new user in the users array
  users.push({
    email,
    password,
    favoriteGenres: new Set(), // will contain ids of favorite genres
    favorites: new Set(), // will contain ids of favorite movies/tv shows
  });

  res.json({ status: "Registered" });
});

app.post("/login", (req, res) => {
  // get email and password from request
  const { email, password } = req.body;

  // loop through the users array
  for (const user of users) {
    // if the provided email and password exist in users array
    if (user.email === email && user.password === password) {
      // create access token
      let accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, {
        expiresIn: "2 days", // not needed so that token does not expire
      });

      // save token, it will be removed only when user requests to log out
      accessTokens.push(accessToken);

      // send token in response
      res.json({ status: "Logged In", accessToken });
    }
  }

  // if the provided email and password does not exist in users array
  res.json({ status: "Invalid Logins" });
});

app.post("/logout", (req, res) => {
  // to remove the access token
  accessTokens = accessTokens.filter((token) => token !== req.body.token);
  res.json({ status: "Logged Out" });
});

// Authentication Middleware
const auth = (req, res, next) => {
  // get token from request
  const token = req.body.accessToken;

  // if token is empty
  if (token == null) return res.sendStatus(401); // Unauthorized

  // verify token
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    // if token is invalid
    if (err) return res.sendStatus(403); // Forbidden

    // if token is valid, save payload in req.user and pass to the next handler
    req.user = user;
    next();
  });
};

// To get the list of favorite genres
app.post("/favorite-genres", auth, (req, res) => {
  for (const user of users) {
    if (user.email === req.user.email) {
      res.json(Array.from(user.favoriteGenres));
    }
  }
});

// In order to heart/unheart a genre
app.post("/favorite-genres/toggle", auth, (req, res) => {
  const genreId = req.body.genreId;
  for (const user of users) {
    if (user.email === req.user.email) {
      if (user.favoriteGenres.has(genreId)) user.favoriteGenres.delete(genreId);
      else user.favoriteGenres.add(genreId);

      res.json(Array.from(user.favoriteGenres));
    }
  }
});

// To get the list of favorite movies/tv shows
app.post("/favorites", auth, (req, res) => {
  for (const user of users) {
    if (user.email === req.user.email) {
      res.json(Array.from(user.favorites));
    }
  }
});

// To check if a movies/tv show is in the list of favorites
app.post("/favorites/check", auth, (req, res) => {
  const mediaId = req.body.mediaId;
  for (const user of users) {
    if (user.email === req.user.email) {
      res.json({ isHearted: user.favorites.has(mediaId) });
    }
  }
});

// In order to heart/unheart a movie/tv show
app.post("/favorites/toggle", auth, (req, res) => {
  const mediaId = req.body.mediaId;
  for (const user of users) {
    if (user.email === req.user.email) {
      if (user.favorites.has(mediaId)) {
        user.favorites.delete(mediaId);
        res.json({ isHearted: false });
      } else {
        user.favorites.add(mediaId);
        res.json({ isHearted: true });
      }
    }
  }
});

app.post("/delete-account", auth, (req, res) => {
  accessTokens = accessTokens.filter((token) => token !== req.body.token);
  users = users.filter((user) => user.email !== req.user.email);

  res.json({ status: "Account Deleted" });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "rectn-react/build/index.html"), (err) => {
    if (err) res.status(500).send(err);
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
