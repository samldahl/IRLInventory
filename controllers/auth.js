const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");


//GET
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
  
});

//POST
router.post("/sign-up", async (req, res) => {
// User Exist or Not
  const userInDatabase = await User.findOne({ email: req.body.email });
if (userInDatabase) {
  return res.send("Email already taken.");
}



// cant store plain password
const hashedPassword = bcrypt.hashSync(req.body.password, 10)
req.body.password = hashedPassword

//create the user
const user = await User.create(req.body)
  res.render("auth/sign-up-success.ejs", {username: user.username});

});

// GET signin
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});


// POST /auth/signin
router.post("/sign-in", async (req, res) => {
    console.log("Login attempt with email:", req.body.email);
    const userInDatabase = await User.findOne({ email: req.body.email });
    console.log("User found:", userInDatabase ? "Yes" : "No");
if (!userInDatabase) {
  return res.send("Login failed. Please try again.");
}

const validPassword = bcrypt.compareSync(
  req.body.password,
  userInDatabase.password
);
    console.log("Password valid:", validPassword);
if (!validPassword) {
  return res.send("Login failed. Please try again.");
}

req.session.user = {
  username: userInDatabase.username,
_id: userInDatabase._id,
};

res.redirect("/");

});

router.post('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

