const User = require("../models").User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/app");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email);
  console.log(process.env.NODE_ENV);
  console.log(process.env.PORT);
  console.log(process.env.APP_URL_PRO);

  try {
    console.log("query");

    // find the user
    const user = await User.findOne({
      where: {
        email,
      },
    });

    console.log(user);

    // check if user found
    if (!user) return res.status(404).json({ message: "User not found!" });

    // check if password matches
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: "Incorrect password" });

    // generate auth token
    const userWithToken = generateToken(user.get({ raw: true }));
    userWithToken.user.avatar = user.avatar;

    console.log(userWithToken);

    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);

    const userWithToken = generateToken(user.get({ raw: true }));

    return res.send(userWithToken);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const generateToken = (user) => {
  delete user.password;

  const token = jwt.sign(user, config.appKey, { expiresIn: 86400 });

  return { ...{ user }, ...{ token } };
};
