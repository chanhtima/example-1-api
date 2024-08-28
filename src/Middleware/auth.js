const jwt = require("jsonwebtoken");

const verifToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json("Token missing.");
  }
  const tokenWithoutBearer = token.split(" ")[1];
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json("Token is invalid");
    }
    req.user = payload;
    next();
  });
};

module.exports = verifToken;
