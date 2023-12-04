const fs = require("node:fs/promises");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const User = require("../models/users");
const { HttpError, ctrlWrap } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
console.log({ avatarsDir });

async function register(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "User already exist");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);

  const { email: userEmail, subscription } = await User.create({
    email,
    password: passwordHash,
    avatarUrl,
    test: 123,
  });

  res.status(201).send({
    user: {
      email: userEmail,
      subscription,
    },
  });
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate();

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "23h",
  });
  await User.findByIdAndUpdate(user._id, { token });

  const responseData = {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };

  res.json(responseData);
}

async function getCurrent(req, res, next) {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
}

async function logout(req, res, next) {
  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(409, "Not authorized");
  }

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).end();
}

async function updateAvatar(req, res) {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);
  const avatarUrl = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({
    avatarUrl,
  });
}

module.exports = {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getCurrent: ctrlWrap(getCurrent),
  logout: ctrlWrap(logout),
  updateAvatar: ctrlWrap(updateAvatar),
};
