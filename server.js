const express = require(`express`);
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
// const ejs = require("ejs")

const app = express();

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name} successfully`);
})

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));

app.use(methodOverride("_method"));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);



const Items = require("./models/items.js");
const authController = require("./controllers/auth.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 
app.use(express.static("public")); 


app.set("view engine", "ejs");

// Mount auth routes
app.use("/auth", authController);

// Middleware to check if user is logged in
function isSignedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/auth/sign-in");
}

//GET ROOT Proejct ./
app.get("/", async (req, res) => {
  if (req.session.user) {
    res.render("index.ejs", {
      user: req.session.user
    });
  } else {
    res.render("auth/sign-in.ejs")
  }
});

// GET /items protected route
app.get("/items", isSignedIn, async (req, res) => {
  const allItems = await Items.find({ userID: req.session.user._id });
  res.render("itemView/index.ejs", { items: allItems });
});

// GET /items/new protected route
app.get("/items/new", isSignedIn, (req, res) => {
  res.render("itemView/create.ejs");
});

// POST /items protected route
app.post("/items", isSignedIn, async (req, res) => {
  req.body.isDailyUse = req.body.isDailyUse === "on";
  req.body.fraglie = req.body.fraglie === "on";
  req.body.userID = req.session.user._id;
  
  const newItem = await Items.create(req.body);
  res.redirect(`/items/${newItem._id}`);
});

// GET /items/:id/edit protected route
app.get("/items/:id/edit", isSignedIn, async (req, res) => {
  const item = await Items.findById(req.params.id);
  res.render("itemView/edit.ejs", { item });
});

// GET /items/:id protected route
app.get("/items/:id", isSignedIn, async (req, res) => {
  const item = await Items.findById(req.params.id);
  res.render("itemView/show.ejs", { item });
});

// PUT /items/:id protected route
app.put("/items/:id", isSignedIn, async (req, res) => {
  // Convert checkbox to boolean
  req.body.isDailyUse = req.body.isDailyUse === "on";
  req.body.fraglie = req.body.fraglie === "on";
    
  await Items.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/items/${req.params.id}`);
});

// DELETE /items/:id protected route
app.delete("/items/:id", isSignedIn, async (req, res) => {
  await Items.findByIdAndDelete(req.params.id);
  res.redirect("/items");
});


app.listen(3333, () => {
  const port = process.env.PORT || 3333;
  console.log("Listening on port 3333");
});

