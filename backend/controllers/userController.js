const User = require("../models").User;
const sequelize = require("sequelize");

exports.update = async (req, res) => {
  console.log("1", req);

  if (req.file) {
    req.body.avatar = req.file.filename;
  }
  console.log("2", req);

  if (typeof req.body.avatar !== "undefined" && req.body.avatar.length === 0)
    delete req.body.avatar;
  console.log("3", req);

  try {
    const [rows, result] = await User.update(req.body, {
      where: {
        id: req.user.id,
      },
      returning: true,
      individualHooks: true,
    });

    console.log("4", result);

    const user = result[0].get({ raw: true });
    user.avatar = result[0].avatar;
    delete user.password;

    console.log("5", user);

    return res.send(user);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
