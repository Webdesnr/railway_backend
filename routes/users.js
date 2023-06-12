const User = require("../model/user");
const validateUser = require("../model/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

// router.get("/me", async (req, res) => {
//   const user = res.user;
//   res.send(user).status(200);
// });

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ aadhar_no: req.body.aadhar_no });
  if (user) return res.send("User already exists").status(409);

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  user = await User.create(req.body);

  const token = user.generateToken();

  res.setHeader("x-auth-token", token);

  user = _.pick(user, ["name", "email", "aadhar_no"]);

  res.send(user).status(200);
});

module.exports = router;
