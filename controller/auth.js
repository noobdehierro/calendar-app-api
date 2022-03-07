const { response } = require("express");
const { request } = require("express");
const User = require("../DB/models/User");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../middlewares/jwt");

const createUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }

    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generarJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "The user does not exist with that email",
      });
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "wrong password",
      });
    }
    const token = await generarJWT(user.id, user.name);

    res.json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
    });
  }
};

const revalidateToken = async (req = request, res = response) => {
  const { uid, name } = req;

  const token = await generarJWT(uid, name);
  res.status(200).json({ ok: true, token, uid, name });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
};
