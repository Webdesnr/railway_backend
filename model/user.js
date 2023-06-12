const mongoose = require("mongoose");
const Joi = require("Joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: { type: String, min: 4, max: 250 },
  email: { type: String, min: 0, max: 255 },
  password: { type: String, min: 8, max: 250 },
  aadhar_no: { type: Number },
  pan_no: { type: String, min: 0, max: 10 },
  gender: { type: String, max: 8 },
  dob: { type: Date },
});

userSchema.method("generateToken", function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    config.get("jwtPrivateKey")
  );
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(4).max(250).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(250).required(),
    aadhar_no: Joi.number().integer().positive().required(),
    pan_no: Joi.string().alphanum().min(0).max(10).required(),
    gender: Joi.string().max(8),
    dob: Joi.date(),
  });

  return schema.validate(user);
}

module.exports = validateUser;
module.exports = User;
