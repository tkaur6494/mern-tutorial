const jwt = require("jsonwebtoken")


const verifyJWT = ((req, resp, next) => {
    const accessToken = req.headers.authorization || req.headers.Authorization
    if(!accessToken){
        return resp.status(401).json({message:"Forbidden"})
    }
    jwt.verify(
        accessToken.split(" ")[1],
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            return resp.status(401).json({ message: "Forbidden" });
          }
          req.user = decoded.UserInfo.username
          req.roles = decoded.UserInfo.roles
          next()
        }
      );
})

module.exports = verifyJWT