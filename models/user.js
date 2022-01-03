//gia to passport
const mongoose = require("mongoose"); //npm i passport passport-local passport-local-mongoose
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //npm i passport passport-local passport-local-mongoose

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
