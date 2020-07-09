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

//HOMEPAGE
const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users, currentUser });
};

//PROFILEPAGE
const handleProfilePage = (req, res) => {
  // Few functions at 1st
  const id = req.params.id;

  const getUserByid = () => {
    const user = users.find((user) => {
      return user._id === id;
    });
    return user;
  };

  //Response
  let user = getUserByid();

  if (user !== undefined) {
    res.status(200).render("./pages/profile", { user, users, currentUser });
  } else {
    console.log("User doesn't exist");
    res.status(404).redirect("/*");
  }
};

//SIGNIN PAGE
const handleSignin = (req, res) => {
  if (currentUser.name === undefined) {
    res.status(200).render("./pages/signin", { currentUser });
  } else {
    let user = currentUser;
    res.status(200).render("./pages/profile", { user, users, currentUser });
  }
};

//SIGNIN POST

const handleName = (req, res) => {
  //Few functions first
  const firstName = req.body.firstName;

  const getUserbyName = () => {
    const user = users.find((user) => {
      return user.name === firstName;
    });
    return user;
  };

  //Response
  let user = getUserbyName();
  currentUser = { ...user };

  if (user !== undefined) {
    res.status(200).render("./pages/profile", { user, users, currentUser });
  } else {
    console.log("User doesn't exist");
    res.status(404).redirect("/signin");
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

  .get("/signin", handleSignin)

  .post("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
