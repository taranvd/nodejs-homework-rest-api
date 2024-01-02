const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const User = require("../models/users");
const { HttpError, ctrlWrap, sendMail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "User already exist");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email);
  const verifyToken = crypto.randomUUID();

  await sendMail({
    to: email,
    subject: "Сonfirm registration",
    html: `to confirm your registration please click on the <a href='${BASE_URL}/api/users/verify/${verifyToken}'>link</a>`,
    text: `to confirm your registration please open the link ${BASE_URL}/api/users/verify/${verifyToken}`,
  });

  const { email: userEmail, subscription } = await User.create({
    email,
    password: passwordHash,
    avatarUrl,
    verifyToken,
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

  // if (user.verify !== true) {
  //   throw HttpError(401, "Your account is not verify");
  // }

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

  res.status(204).send({
    message: "Logout success",
  });
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

async function verify(req, res) {
  const { token } = req.params;
  const user = await User.findOne({ verifyToken: token }).exec();

  if (user === null) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });
  res.send({ message: "Verification successful" });
}

async function verifyEmail(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not foud");
  }

  if (user.verify === true) {
    throw HttpError(400, "Verification has already been passed");
  }

  await sendMail({
    to: email,
    subject: "Сonfirm registration",
    html: `to confirm your registration please click on the <a href='http://localhost:3000/api/users/verify/${user.verifyToken}'>link</a>`,
    text: `to confirm your registration please open the link http://localhost:3000/api/users/verify/${user.verifyToken}`,
  });

  res.status(200).send({
    message: "Verification email sent",
  });
}

module.exports = {
  register: ctrlWrap(register),
  login: ctrlWrap(login),
  getCurrent: ctrlWrap(getCurrent),
  logout: ctrlWrap(logout),
  updateAvatar: ctrlWrap(updateAvatar),
  verify: ctrlWrap(verify),
  verifyEmail: ctrlWrap(verifyEmail),
};
