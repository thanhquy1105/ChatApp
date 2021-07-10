require("dotenv").config({ path: "backend/.env" });

module.exports = {
  appKey: process.env.APP_KEY,
  appUrl: process.env.APP_URL,
  appUrtPro: process.env.APP_URL_PRO,
  appPort: process.env.APP_PORT,
};
