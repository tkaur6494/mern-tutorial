const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Login
// @route POST /
// @access Public
const loginAuth = asyncHandler(async (req, resp) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return resp.status(400).json({ message: "All fields are required." });
  }
  const user = await User.findOne({ username }).exec();

  if (!user) {
    return resp.status(400).json({ message: "User not found" });
  }

  const passwordVerify = await bcrypt.compare(password, user.password);
  if (!passwordVerify) {
    return resp.status(400).json({ message: "Incorrect password" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15s" }
  );
  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "10m" }
  );

  // Create secure cookie with refresh token
  resp.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    // secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  resp.json({ accessToken });
});

// @desc Refresh token
// @route GET /refresh
// @access Public
const refreshAuth = asyncHandler(async (req, resp) => {
  if (!req.cookies?.jwt) {
    return resp.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(
    req.cookies.jwt,
    process.env.REFRESH_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        return resp.status(401).json({ message: "Forbidden" });
      }
      const user = await User.findOne({ username: decoded.username }).exec();

      if (!user) {
        return resp.status(400).json({ message: "User not found" });
      }
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
      );
      // Send accessToken containing username and roles
      resp.json({ accessToken });
    }
  );
});

// @desc Logout
// @route POST /logout
// @access Public
const logoutAuth = asyncHandler(async (req, resp) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return resp.sendStatus(204) //No content
    resp.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    resp.json({ message: 'Cookie cleared' })
});

module.exports = {
  loginAuth,
  refreshAuth,
  logoutAuth,
};
