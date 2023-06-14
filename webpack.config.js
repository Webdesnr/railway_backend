const config = require("config");

module.exports = {
  devServer: {
    proxy: {
      "/api": config.get("db"),
    },
  },
};
