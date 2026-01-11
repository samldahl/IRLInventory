const mongoose = require("mongoose");

// note to self; userSchema for username & password are objects that include the string and rquirement attributes

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
    email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;