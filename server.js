"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

// declare the other handle functions

const handleHomepage = (req, res) => {
  res.status(200).render("./pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  // Few functions at 1st
  const id = req.params.id;

  const getUserByid = () => {
    const user = users.find((user) => {
      return user._id === id;
    });
    return user;
  };

  let user = getUserByid(id);

  if (user !== undefined) {
    res.status(200).render("./pages/profile", { user, users });
  } else {
    console.log("User doesn't exist");
    res.status(404).send("The user you're looking for doesn't exist yet");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints

  .get("/", handleHomepage)

  .get("/users/:id", handleProfilePage)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
