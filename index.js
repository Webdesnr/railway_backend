const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const users = require("./routes/users");
const login = require("./startup/login");
const prod = require("./startup/prod");
const { createProxyMiddleware } = require("http-proxy-middleware");

if (!config.get("jwtPrivateKey")) {
  console.log("jwtPrivateKey is not defined!");
  process.exit(1);
}

mongoose
  .connect(config.get("db"))
  .then(console.log("Connected to the mongodb"))
  .catch((e) => console.log(e));

app.use(express.json());
app.use("/api/users", users);
app.use("/api/login", login);
prod(app);
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://railway-backend-uj2z.onrender.com",
    changeOrigin: true,
  })
);

const port = config.get("port");

app.listen(port, console.log("listening to the port " + port));
