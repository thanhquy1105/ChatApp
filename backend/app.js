const express = require("express");
const app = express();
const path = require("path");

const auth = require("./routes/auth");
const chat = require("./routes/chat");
const user = require("./routes/user");

app.use("/auth", auth);
app.use("/users", user);
app.use("/chats", chat);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

module.exports = app;
