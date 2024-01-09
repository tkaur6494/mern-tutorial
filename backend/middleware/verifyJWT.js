const jwt = require("jsonwebtoken");

const verifyJWT = (req, resp, next) => {
  const accessToken = req.cookies?.access;
  if (!accessToken) {
    return resp.status(403).json({ message: "Forbidden" });
  }
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, decoded) {
      if (err) {
        console.log(err);
        return resp.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
};

module.exports = verifyJWT;
