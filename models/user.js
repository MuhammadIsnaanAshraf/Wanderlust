const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  }, //Here the username and password schema will be added by passport-local-momngoose package by default with their hashed and salted value.
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
