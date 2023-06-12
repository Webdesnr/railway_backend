const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send("Username or Password is invalid");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(401).send("Username or Password is invalid");

  const token = user.generateToken();

  res.setHeader("x-auth-token", token);

  res.send(_.pick(user, ["_id", "name", "email"])).status(200);
});

function validate(data) {
  const schema = Joi.object({
    email: Joi.string().email().min(0).max(250).required(),
    password: Joi.string()
      // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(0)
      .max(250)
      .required(),
    confirm_password: Joi.ref("password"),
  }).with("password", "confirm_password");
  return schema.validate(data);
}

module.exports = router;
