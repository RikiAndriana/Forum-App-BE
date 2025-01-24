import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncWrapper from "../middleware/asyncWrapper.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSignToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: false,
  };
  res.cookie("jwt", token, cookieOption);
  user.password = undefined;
  res.status(statusCode).json({ data: user });
};

export const RegisterUser = asyncWrapper(async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const createUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role,
  });
  createSignToken(createUser, 201, res);
});

export const LoginUser = asyncWrapper(async (req, res) => {
  //check email & password input
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email & Password must be filled!");
  }
  //verify email
  const user = await User.findOne({ email: req.body.email });
  if (user && (await user.comparePassword(req.body.password))) {
    createSignToken(user, 200, res);
  } else {
    res.status(400);
    throw new Error("Invalid user");
  }
});

export const LogoutUser = (req, res) => {
  res.cookie("jwt", "", {
    expire: new Date(0),
    httpOnly: true,
    security: false,
  });
  res.status(200).json({
    message: "Logout Success",
  });
};

export const GetUser = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select({ password: 0 })
    .populate("listQuestion");
  if (user) {
    return res.status(200).json({ user });
  }
  return res.status(401).json({
    message: "User not found",
  });
});
